import { PrismaClient } from '@prisma/client';
import { GamificationService } from '../lib/gamification';
import { GoalType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎮 Setting up test gamification data...');

  // Find test users
  const testUsers = await prisma.user.findMany({
    where: {
      role: 'STUDENT',
    },
  });

  if (testUsers.length === 0) {
    console.log('❌ No student users found to set up gamification');
    return;
  }

  for (const user of testUsers.slice(0, 3)) { // Just first 3 users
    console.log(`🎯 Setting up gamification for ${user.name}...`);

    // Award some initial XP
    const baseXP = 150 + Math.floor(Math.random() * 300); // Random XP between 150-450
    await GamificationService.awardXP(user.id, baseXP, 'Welcome bonus');

    // Set up a streak (random 1-5 days)
    const streakDays = 1 + Math.floor(Math.random() * 5);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        currentStreak: streakDays,
        longestStreak: streakDays + Math.floor(Math.random() * 3),
        lastActiveDate: new Date(),
      },
    });

    // Create today's daily goals
    await GamificationService.createDailyGoals(user.id);

    // Simulate some progress on daily goals
    await GamificationService.updateDailyGoals(user.id, GoalType.LESSONS_COMPLETED, Math.floor(Math.random() * 3));
    await GamificationService.updateDailyGoals(user.id, GoalType.QUIZZES_COMPLETED, Math.floor(Math.random() * 4));
    await GamificationService.updateDailyGoals(user.id, GoalType.STUDY_TIME_MINUTES, Math.floor(Math.random() * 25));

    // Award some achievements
    await GamificationService.awardAchievement(user.id, 'first_lesson');
    if (Math.random() > 0.5) {
      await GamificationService.awardAchievement(user.id, 'lessons_10');
    }
    if (streakDays >= 3) {
      await GamificationService.awardAchievement(user.id, 'streak_3_days');
    }

    console.log(`✅ Setup complete for ${user.name}: Level ${GamificationService.calculateLevel(baseXP)}, ${streakDays} day streak`);
  }

  console.log('🎉 Test gamification data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });