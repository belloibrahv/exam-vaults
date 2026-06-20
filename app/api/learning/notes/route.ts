import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createNoteSchema = z.object({
  lessonId: z.string(),
  content: z.string().min(1),
  highlight: z.string().optional(),
  position: z.number().optional(),
  color: z.string().default('yellow'),
});

const updateNoteSchema = z.object({
  content: z.string().min(1),
  color: z.string().optional(),
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

    const notes = await prisma.userNote.findMany({
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
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
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
    const { lessonId, content, highlight, position, color } = createNoteSchema.parse(body);

    // Verify lesson exists
    const lesson = await prisma.learningLesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const note = await prisma.userNote.create({
      data: {
        userId: session.user.id,
        lessonId,
        content,
        highlight,
        position,
        color,
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

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get('id');

    if (!noteId) {
      return NextResponse.json({ error: 'Note ID required' }, { status: 400 });
    }

    const body = await request.json();
    const { content, color } = updateNoteSchema.parse(body);

    const note = await prisma.userNote.updateMany({
      where: {
        id: noteId,
        userId: session.user.id, // Ensure user owns the note
      },
      data: {
        content,
        color,
      },
    });

    if (note.count === 0) {
      return NextResponse.json({ error: 'Note not found or unauthorized' }, { status: 404 });
    }

    const updatedNote = await prisma.userNote.findUnique({
      where: { id: noteId },
      include: {
        lesson: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    
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
    const noteId = searchParams.get('id');

    if (!noteId) {
      return NextResponse.json({ error: 'Note ID required' }, { status: 400 });
    }

    const result = await prisma.userNote.deleteMany({
      where: {
        id: noteId,
        userId: session.user.id, // Ensure user owns the note
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Note not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}