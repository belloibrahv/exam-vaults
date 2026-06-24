import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GamificationService, LEVEL_THRESHOLDS } from '@/lib/gamification';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        achievements: {
          include: { achievement: true },
          orderBy: { unlockedAt: 'desc' },
        },
        dailyGoals: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        },
        lessonProgress: {
          where: { completed: true },
          orderBy: { completedAt: 'desc' },
          take: 10,
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
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create daily goals if they don't exist
    if (user.dailyGoals.length === 0) {
      await GamificationService.createDailyGoals(user.id);
    }

    // Get updated daily goals
    const dailyGoals = await prisma.dailyGoal.findMany({
      where: {
        userId: user.id,
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    // Calculate level progress
    const currentLevel = user.level;
    const xpForNextLevel = GamificationService.getXPForNextLevel(currentLevel, user.totalXP);
    const levelProgress = currentLevel < 10 
      ? ((user.totalXP - (currentLevel > 1 ? LEVEL_THRESHOLDS[currentLevel - 1] : 0)) / 
         (LEVEL_THRESHOLDS[currentLevel] - (currentLevel > 1 ? LEVEL_THRESHOLDS[currentLevel - 1] : 0))) * 100
      : 100;

    // Get recent achievements (last 5)
    const recentAchievements = user.achievements.slice(0, 5);

    // Calculate weekly stats
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyLessons = await prisma.userLessonProgress.count({
      where: {
        userId: user.id,
        completed: true,
        completedAt: { gte: weekAgo },
      },
    });

    const weeklyQuizzes = await prisma.userKnowledgeCheckAnswer.count({
      where: {
        userId: user.id,
        createdAt: { gte: weekAgo },
      },
    });

    const weeklyStudyTime = await prisma.studySession.aggregate({
      where: {
        userId: user.id,
        startTime: { gte: weekAgo },
        endTime: { not: null },
      },
      _sum: { duration: true },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        level: user.level,
        totalXP: user.totalXP,
        xpForNextLevel,
        levelProgress: Math.round(levelProgress),
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
      },
      dailyGoals,
      recentAchievements: recentAchievements.map(ua => ({
        id: ua.achievement.id,
        name: ua.achievement.name,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
        rarity: ua.achievement.rarity,
        xpReward: ua.achievement.xpReward,
        unlockedAt: ua.unlockedAt,
      })),
      weeklyStats: {
        lessonsCompleted: weeklyLessons,
        quizzesCompleted: weeklyQuizzes,
        studyTimeMinutes: Math.floor((weeklyStudyTime._sum.duration || 0) / 60),
      },
      recentActivity: user.lessonProgress.map(lp => ({
        type: 'lesson_completed',
        title: lp.lesson.title,
        certification: lp.lesson.module.certification.name,
        provider: lp.lesson.module.certification.provider.name,
        completedAt: lp.completedAt,
        xpEarned: 50,
      })),
    });
  } catch (error) {
    console.error('Error fetching gamification stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}