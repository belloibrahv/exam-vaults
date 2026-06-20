import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = await req.json();

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }

    // Verify lesson exists
    const lesson = await prisma.learningLesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            certification: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const certificationId = lesson.module.certificationId;

    // Upsert user lesson progress
    const progress = await prisma.userLessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });

    // Recalculate certification progress
    // Fetch all lessons for this certification
    const allLessons = await prisma.learningLesson.findMany({
      where: {
        module: {
          certificationId,
        },
      },
      select: {
        id: true,
      },
    });

    const totalLessons = allLessons.length;

    // Fetch user's completed lessons for this certification
    const completedCount = await prisma.userLessonProgress.count({
      where: {
        userId: session.user.id,
        completed: true,
        lesson: {
          module: {
            certificationId,
          },
        },
      },
    });

    const completionRate = totalLessons > 0 ? completedCount / totalLessons : 0;

    // Upsert UserProgress for this certification to track general progress
    // (If user starts learning, they are in progress)
    await prisma.userProgress.upsert({
      where: {
        userId_certificationId: {
          userId: session.user.id,
          certificationId,
        },
      },
      update: {
        status: completionRate >= 1 ? 'PASSED' : 'IN_PROGRESS',
      },
      create: {
        userId: session.user.id,
        certificationId,
        status: 'IN_PROGRESS',
      },
    });

    return NextResponse.json({
      success: true,
      completed: progress.completed,
      completedCount,
      totalLessons,
      percentComplete: Math.round(completionRate * 100),
    });
  } catch (error) {
    console.error('Error marking lesson complete:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
