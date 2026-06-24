import { PrismaClient } from '@prisma/client';
import { AchievementCategory, AchievementRarity } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏆 Creating achievement system...');

  const achievements = [
    // Streak Achievements
    {
      name: 'streak_3_days',
      description: 'Maintained a 3-day learning streak',
      icon: '🔥',
      category: AchievementCategory.STREAK,
      rarity: AchievementRarity.COMMON,
      condition: { type: 'streak', value: 3 },
      xpReward: 50,
    },
    {
      name: 'streak_7_days',
      description: 'Maintained a 7-day learning streak',
      icon: '🔥',
      category: AchievementCategory.STREAK,
      rarity: AchievementRarity.RARE,
      condition: { type: 'streak', value: 7 },
      xpReward: 100,
    },
    {
      name: 'streak_30_days',
      description: 'Maintained a 30-day learning streak',
      icon: '🔥',
      category: AchievementCategory.STREAK,
      rarity: AchievementRarity.EPIC,
      condition: { type: 'streak', value: 30 },
      xpReward: 300,
    },
    {
      name: 'streak_100_days',
      description: 'Maintained a 100-day learning streak',
      icon: '🔥',
      category: AchievementCategory.STREAK,
      rarity: AchievementRarity.LEGENDARY,
      condition: { type: 'streak', value: 100 },
      xpReward: 1000,
    },

    // Learning Achievements
    {
      name: 'first_lesson',
      description: 'Completed your first lesson',
      icon: '📚',
      category: AchievementCategory.LEARNING,
      rarity: AchievementRarity.COMMON,
      condition: { type: 'lessons_completed', value: 1 },
      xpReward: 25,
    },
    {
      name: 'lessons_10',
      description: 'Completed 10 lessons',
      icon: '📖',
      category: AchievementCategory.LEARNING,
      rarity: AchievementRarity.COMMON,
      condition: { type: 'lessons_completed', value: 10 },
      xpReward: 100,
    },
    {
      name: 'lessons_50',
      description: 'Completed 50 lessons',
      icon: '🎓',
      category: AchievementCategory.LEARNING,
      rarity: AchievementRarity.RARE,
      condition: { type: 'lessons_completed', value: 50 },
      xpReward: 250,
    },
    {
      name: 'lessons_100',
      description: 'Completed 100 lessons',
      icon: '🏆',
      category: AchievementCategory.LEARNING,
      rarity: AchievementRarity.EPIC,
      condition: { type: 'lessons_completed', value: 100 },
      xpReward: 500,
    },

    // Quiz Achievements
    {
      name: 'quiz_master',
      description: 'Answered 50 quiz questions correctly',
      icon: '🧠',
      category: AchievementCategory.QUIZ,
      rarity: AchievementRarity.RARE,
      condition: { type: 'correct_answers', value: 50 },
      xpReward: 150,
    },
    {
      name: 'perfect_quiz',
      description: 'Got 100% on a knowledge check',
      icon: '💯',
      category: AchievementCategory.QUIZ,
      rarity: AchievementRarity.RARE,
      condition: { type: 'perfect_score', value: 1 },
      xpReward: 75,
    },
    {
      name: 'quiz_streak_10',
      description: 'Answered 10 questions correctly in a row',
      icon: '⚡',
      category: AchievementCategory.QUIZ,
      rarity: AchievementRarity.EPIC,
      condition: { type: 'correct_streak', value: 10 },
      xpReward: 200,
    },

    // Milestone Achievements
    {
      name: 'level_5',
      description: 'Reached level 5',
      icon: '⭐',
      category: AchievementCategory.MILESTONE,
      rarity: AchievementRarity.COMMON,
      condition: { type: 'level', value: 5 },
      xpReward: 100,
    },
    {
      name: 'level_10',
      description: 'Reached level 10',
      icon: '🌟',
      category: AchievementCategory.MILESTONE,
      rarity: AchievementRarity.RARE,
      condition: { type: 'level', value: 10 },
      xpReward: 250,
    },
    {
      name: 'first_certification',
      description: 'Passed your first certification exam',
      icon: '🏅',
      category: AchievementCategory.MILESTONE,
      rarity: AchievementRarity.EPIC,
      condition: { type: 'certifications_passed', value: 1 },
      xpReward: 500,
    },
    {
      name: 'certification_expert',
      description: 'Passed 3 certification exams',
      icon: '👑',
      category: AchievementCategory.MILESTONE,
      rarity: AchievementRarity.LEGENDARY,
      condition: { type: 'certifications_passed', value: 3 },
      xpReward: 1000,
    },

    // Special Achievements
    {
      name: 'note_taker',
      description: 'Created 10 study notes',
      icon: '📝',
      category: AchievementCategory.SPECIAL,
      rarity: AchievementRarity.COMMON,
      condition: { type: 'notes_created', value: 10 },
      xpReward: 50,
    },
    {
      name: 'knowledge_keeper',
      description: 'Created 50 study notes',
      icon: '🗂️',
      category: AchievementCategory.SPECIAL,
      rarity: AchievementRarity.RARE,
      condition: { type: 'notes_created', value: 50 },
      xpReward: 150,
    },
    {
      name: 'early_bird',
      description: 'Studied for 7 days in a row before 9 AM',
      icon: '🌅',
      category: AchievementCategory.SPECIAL,
      rarity: AchievementRarity.EPIC,
      condition: { type: 'early_bird_streak', value: 7 },
      xpReward: 200,
    },
    {
      name: 'night_owl',
      description: 'Studied for 7 days in a row after 9 PM',
      icon: '🦉',
      category: AchievementCategory.SPECIAL,
      rarity: AchievementRarity.EPIC,
      condition: { type: 'night_owl_streak', value: 7 },
      xpReward: 200,
    },
    {
      name: 'weekend_warrior',
      description: 'Studied on 10 consecutive weekends',
      icon: '⚔️',
      category: AchievementCategory.SPECIAL,
      rarity: AchievementRarity.LEGENDARY,
      condition: { type: 'weekend_streak', value: 10 },
      xpReward: 300,
    },
  ];

  for (const achievementData of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievementData.name },
      update: achievementData,
      create: achievementData,
    });
    console.log(`✅ Created achievement: ${achievementData.name}`);
  }

  console.log('🎯 Achievement system created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });