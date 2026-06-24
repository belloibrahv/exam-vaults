import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { GamificationService, XP_VALUES } from '@/lib/gamification';
import { GoalType } from '@prisma/client';

const progressSchema = z.object({
  lessonId: z.string(),
  completed: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId, completed } = progressSchema.parse(body);

    // Verify the lesson exists
    const lesson = await prisma.learningLesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Upsert user lesson progress
    const progress = await prisma.userLessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: lessonId,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        lessonId: lessonId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    // Gamification updates if lesson is being completed for the first time
    if (completed && !progress.completed) {
      // Award XP for lesson completion
      await GamificationService.awardXP(
        session.user.id,
        XP_VALUES.LESSON_COMPLETED,
        `Completed lesson: ${lesson.title}`
      );

      // Update daily goals
      await GamificationService.updateDailyGoals(session.user.id, GoalType.LESSONS_COMPLETED, 1);

      // Update streak
      await GamificationService.updateStreak(session.user.id);

      // Check for achievements
      await GamificationService.checkAchievements(session.user.id);
    }

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}