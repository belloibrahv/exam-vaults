import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createBookmarkSchema = z.object({
  lessonId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
});

const updateBookmarkSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    const where: any = { userId: session.user.id };
    if (lessonId) {
      where.lessonId = lessonId;
    }

    const bookmarks = await prisma.userBookmark.findMany({
      where,
      include: {
        lesson: {
          include: {
            module: {
              include: {
                certification: {
                  select: {
                    name: true,
                    slug: true,
                    provider: {
                      select: {
                        name: true,
                        slug: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId, title, description } = createBookmarkSchema.parse(body);

    // Verify lesson exists
    const lesson = await prisma.learningLesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const bookmark = await prisma.userBookmark.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: {
        title,
        description,
      },
      create: {
        userId: session.user.id,
        lessonId,
        title,
        description,
      },
      include: {
        lesson: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error('Error creating bookmark:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 });
    }

    const result = await prisma.userBookmark.deleteMany({
      where: {
        lessonId,
        userId: session.user.id,
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}