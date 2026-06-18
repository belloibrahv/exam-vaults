import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardClient from './DashboardClient';
import DashboardError from './DashboardError';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  if (session.user.role === 'ADMIN') {
    redirect('/admin');
  }

  try {
    // Fetch all providers with their certifications
    const providers = await prisma.provider.findMany({
      include: {
        certifications: {
          include: {
            level: true,
            _count: {
              select: {
                questions: true,
              },
            },
            learningModules: {
              include: {
                _count: {
                  select: {
                    lessons: true,
                  },
                },
              },
            },
          },
          orderBy: {
            level: {
              order: 'asc',
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Fetch user's progress for all certifications
    const userProgress = await prisma.userProgress.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        certification: {
          include: {
            level: true,
            provider: true,
          },
        },
      },
    });

    // Fetch user's recent exam attempts across all certifications
    const examAttempts = await prisma.examAttempt.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        certification: {
          include: {
            level: true,
            provider: true,
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
      take: 10,
    });

    // Fetch user's completed lessons across all certifications
    const completedLessons = await prisma.userLessonProgress.findMany({
      where: {
        userId: session.user.id,
        completed: true,
      },
      include: {
        lesson: {
          include: {
            module: true,
          },
        },
      },
    });

    const completedLessonsCountMap: Record<string, number> = {};
    for (const progress of completedLessons) {
      const certId = progress.lesson.module.certificationId;
      completedLessonsCountMap[certId] = (completedLessonsCountMap[certId] || 0) + 1;
    }

    // Calculate overall statistics
    const completedAttempts = examAttempts.filter((a) => a.completedAt);
    const passedAttempts = completedAttempts.filter((a) => a.passed);
    const averageScore =
      completedAttempts.length > 0
        ? completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / completedAttempts.length
        : 0;

    // Get total questions count across all certifications
    const totalQuestions = await prisma.question.count();

    return (
      <DashboardClient
        user={session.user}
        providers={providers}
        userProgress={userProgress}
        examAttempts={examAttempts}
        completedLessonsCountMap={completedLessonsCountMap}
        stats={{
          totalAttempts: examAttempts.length,
          completedAttempts: completedAttempts.length,
          passedAttempts: passedAttempts.length,
          averageScore: Math.round(averageScore),
          totalQuestions,
          totalCertifications: providers.reduce((sum, p) => sum + p.certifications.length, 0),
        }}
      />
    );
  } catch (error) {
    console.error('[Dashboard] Failed to fetch data:', error);
    return <DashboardError />;
  }
}

