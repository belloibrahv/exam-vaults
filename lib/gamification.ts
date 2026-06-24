import { prisma } from '@/lib/prisma';
import { AchievementCategory, AchievementRarity, GoalType } from '@prisma/client';

// XP Values for different actions
export const XP_VALUES = {
  LESSON_COMPLETED: 50,
  QUIZ_CORRECT_ANSWER: 10,
  QUIZ_PERFECT_SCORE: 25,
  NOTE_CREATED: 5,
  BOOKMARK_CREATED: 2,
  DAILY_GOAL_COMPLETED: 100,
  STREAK_MILESTONE: 50,
  EXAM_PASSED: 500,
};

// Level thresholds (XP required for each level)
export const LEVEL_THRESHOLDS = [
  0,     // Level 1
  100,   // Level 2
  300,   // Level 3
  600,   // Level 4
  1000,  // Level 5
  1500,  // Level 6
  2200,  // Level 7
  3000,  // Level 8
  4000,  // Level 9
  5200,  // Level 10
];

export class GamificationService {
  static async awardXP(userId: string, points: number, reason: string) {
    // Update user's total XP
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        totalXP: {
          increment: points,
        },
      },
    });

    // Check if user leveled up
    const newLevel = this.calculateLevel(user.totalXP);
    if (newLevel > user.level) {
      await prisma.user.update({
        where: { id: userId },
        data: { level: newLevel },
      });
      
      // Award level-up achievement
      await this.checkAchievements(userId);
    }

    return { xpAwarded: points, newLevel, totalXP: user.totalXP };
  }

  static calculateLevel(totalXP: number): number {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (totalXP >= LEVEL_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  static getXPForNextLevel(currentLevel: number, currentXP: number): number {
    if (currentLevel >= LEVEL_THRESHOLDS.length) {
      return 0; // Max level reached
    }
    return LEVEL_THRESHOLDS[currentLevel] - currentXP;
  }

  static async updateStreak(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = 1;
    let isNewStreak = true;

    if (user.lastActiveDate) {
      const lastActive = new Date(user.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);

      if (lastActive.getTime() === today.getTime()) {
        // Already active today, no change needed
        return { currentStreak: user.currentStreak, isNewStreak: false };
      } else if (lastActive.getTime() === yesterday.getTime()) {
        // Active yesterday, continue streak
        newStreak = user.currentStreak + 1;
      } else {
        // Streak broken, start over
        newStreak = 1;
      }
    }

    const longestStreak = Math.max(user.longestStreak, newStreak);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        longestStreak,
        lastActiveDate: new Date(),
      },
    });

    // Award streak achievements
    await this.checkStreakAchievements(userId, newStreak);

    return { 
      currentStreak: newStreak, 
      longestStreak, 
      isNewStreak,
      streakIncreased: newStreak > user.currentStreak 
    };
  }

  static async checkStreakAchievements(userId: string, streak: number) {
    const streakMilestones = [3, 7, 14, 30, 60, 100];
    
    for (const milestone of streakMilestones) {
      if (streak === milestone) {
        await this.awardAchievement(userId, `streak_${milestone}_days`);
        await this.awardXP(userId, XP_VALUES.STREAK_MILESTONE, `${milestone} day streak`);
      }
    }
  }

  static async awardAchievement(userId: string, achievementName: string) {
    try {
      const achievement = await prisma.achievement.findUnique({
        where: { name: achievementName },
      });

      if (!achievement) return null;

      // Check if user already has this achievement
      const existing = await prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id,
          },
        },
      });

      if (existing) return null;

      // Award the achievement
      const userAchievement = await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
        },
        include: { achievement: true },
      });

      // Award XP for the achievement
      if (achievement.xpReward > 0) {
        await this.awardXP(userId, achievement.xpReward, `Achievement: ${achievement.name}`);
      }

      return userAchievement;
    } catch (error) {
      console.error('Error awarding achievement:', error);
      return null;
    }
  }

  static async checkAchievements(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        lessonProgress: { where: { completed: true } },
        achievements: { include: { achievement: true } },
        knowledgeCheckAnswers: { where: { isCorrect: true } },
        notes: true,
        examAttempts: { where: { passed: true } },
      },
    });

    if (!user) return;

    const achievements = [
      // Level achievements
      { name: 'level_5', condition: user.level >= 5 },
      { name: 'level_10', condition: user.level >= 10 },
      
      // Learning achievements
      { name: 'first_lesson', condition: user.lessonProgress.length >= 1 },
      { name: 'lessons_10', condition: user.lessonProgress.length >= 10 },
      { name: 'lessons_50', condition: user.lessonProgress.length >= 50 },
      
      // Quiz achievements
      { name: 'quiz_master', condition: user.knowledgeCheckAnswers.length >= 50 },
      { name: 'perfect_quiz', condition: user.knowledgeCheckAnswers.length >= 10 },
      
      // Note taking achievements
      { name: 'note_taker', condition: user.notes.length >= 10 },
      { name: 'knowledge_keeper', condition: user.notes.length >= 50 },
      
      // Exam achievements
      { name: 'first_certification', condition: user.examAttempts.length >= 1 },
      { name: 'certification_expert', condition: user.examAttempts.length >= 3 },
    ];

    for (const { name, condition } of achievements) {
      if (condition) {
        await this.awardAchievement(userId, name);
      }
    }
  }

  static async updateDailyGoals(userId: string, goalType: GoalType, increment = 1) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const goal = await prisma.dailyGoal.findUnique({
      where: {
        userId_date_goalType: {
          userId,
          date: today,
          goalType,
        },
      },
    });

    if (goal && !goal.completed) {
      const newCurrentValue = goal.currentValue + increment;
      const isCompleted = newCurrentValue >= goal.targetValue;
      
      const updatedGoal = await prisma.dailyGoal.update({
        where: { id: goal.id },
        data: {
          currentValue: newCurrentValue,
          completed: isCompleted,
          xpEarned: isCompleted ? XP_VALUES.DAILY_GOAL_COMPLETED : 0,
        },
      });

      if (isCompleted && goal.xpEarned === 0) {
        await this.awardXP(userId, XP_VALUES.DAILY_GOAL_COMPLETED, 'Daily goal completed');
      }

      return updatedGoal;
    }

    return null;
  }

  static async createDailyGoals(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingGoals = await prisma.dailyGoal.findMany({
      where: {
        userId,
        date: today,
      },
    });

    if (existingGoals.length > 0) {
      return existingGoals;
    }

    // Create default daily goals
    const defaultGoals = [
      { goalType: GoalType.LESSONS_COMPLETED, targetValue: 3 },
      { goalType: GoalType.STUDY_TIME_MINUTES, targetValue: 30 },
      { goalType: GoalType.QUIZZES_COMPLETED, targetValue: 5 },
    ];

    const goals = await Promise.all(
      defaultGoals.map((goalData) =>
        prisma.dailyGoal.create({
          data: {
            userId,
            date: today,
            ...goalData,
          },
        })
      )
    );

    return goals;
  }

  static async startStudySession(userId: string) {
    const session = await prisma.studySession.create({
      data: {
        userId,
        startTime: new Date(),
      },
    });

    return session;
  }

  static async endStudySession(sessionId: string, metrics: {
    lessonsCompleted?: number;
    quizzesCompleted?: number;
    notesCreated?: number;
    averageQuizScore?: number;
  }) {
    const session = await prisma.studySession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.endTime) return null;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000);
    
    // Calculate XP based on session performance
    let xpEarned = 0;
    xpEarned += (metrics.lessonsCompleted || 0) * XP_VALUES.LESSON_COMPLETED;
    xpEarned += (metrics.quizzesCompleted || 0) * XP_VALUES.QUIZ_CORRECT_ANSWER;
    xpEarned += (metrics.notesCreated || 0) * XP_VALUES.NOTE_CREATED;

    const updatedSession = await prisma.studySession.update({
      where: { id: sessionId },
      data: {
        endTime,
        duration,
        xpEarned,
        ...metrics,
      },
    });

    // Award session XP
    if (xpEarned > 0) {
      await this.awardXP(session.userId, xpEarned, 'Study session completed');
    }

    // Update daily goals
    if (metrics.lessonsCompleted) {
      await this.updateDailyGoals(session.userId, GoalType.LESSONS_COMPLETED, metrics.lessonsCompleted);
    }
    
    if (metrics.quizzesCompleted) {
      await this.updateDailyGoals(session.userId, GoalType.QUIZZES_COMPLETED, metrics.quizzesCompleted);
    }

    if (metrics.notesCreated) {
      await this.updateDailyGoals(session.userId, GoalType.NOTES_CREATED, metrics.notesCreated);
    }

    const studyTimeMinutes = Math.floor(duration / 60);
    if (studyTimeMinutes > 0) {
      await this.updateDailyGoals(session.userId, GoalType.STUDY_TIME_MINUTES, studyTimeMinutes);
    }

    return updatedSession;
  }

  static async getLeaderboard(limit = 10, period: 'week' | 'month' | 'all' = 'month') {
    let dateFilter = {};
    
    if (period !== 'all') {
      const date = new Date();
      if (period === 'week') {
        date.setDate(date.getDate() - 7);
      } else if (period === 'month') {
        date.setDate(date.getDate() - 30);
      }
      dateFilter = { gte: date };
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        totalXP: true,
        level: true,
        currentStreak: true,
        lessonProgress: {
          where: {
            completed: true,
            ...(period !== 'all' && { completedAt: dateFilter }),
          },
          select: { id: true },
        },
        achievements: {
          include: { achievement: true },
        },
      },
      where: {
        role: 'STUDENT',
        ...(period !== 'all' && {
          lastActiveDate: dateFilter,
        }),
      },
      orderBy: [
        { totalXP: 'desc' },
        { currentStreak: 'desc' },
        { name: 'asc' },
      ],
      take: limit,
    });

    return users.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      name: user.name,
      totalXP: user.totalXP,
      level: user.level,
      currentStreak: user.currentStreak,
      completedLessons: user.lessonProgress.length,
      achievementCount: user.achievements.length,
    }));
  }
}