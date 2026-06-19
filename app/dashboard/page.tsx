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

  let dashboardData = {
    providers: [],
    userProgress: [],
    examAttempts: [],
    completedLessons: [],
    totalQuestions: 0,
    hasErrors: false,
    errorDetails: null as string | null,
  };

  try {
    // Test database connection first
    await prisma.$queryRaw`SELECT 1`;

    // Fetch data with individual error handling for graceful degradation
    const [providersResult, userProgressResult, examAttemptsResult, completedLessonsResult, totalQuestionsResult] = await Promise.allSettled([
      // Fetch all providers with their certifications
      prisma.provider.findMany({
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
      }),

      // Fetch user's progress for all certifications
      prisma.userProgress.findMany({
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
      }),

      // Fetch user's recent exam attempts across all certifications
      prisma.examAttempt.findMany({
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
      }),

      // Fetch user's completed lessons across all certifications
      prisma.userLessonProgress.findMany({
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
      }),

      // Get total questions count across all certifications
      prisma.question.count(),
    ]);

    // Process results with graceful degradation
    const providers = providersResult.status === 'fulfilled' ? providersResult.value : [];
    const userProgress = userProgressResult.status === 'fulfilled' ? userProgressResult.value : [];
    const examAttempts = examAttemptsResult.status === 'fulfilled' ? examAttemptsResult.value : [];
    const completedLessons = completedLessonsResult.status === 'fulfilled' ? completedLessonsResult.value : [];
    const totalQuestions = totalQuestionsResult.status === 'fulfilled' ? totalQuestionsResult.value : 0;

    // Check if any critical queries failed
    const failedResults = [providersResult, userProgressResult, examAttemptsResult, completedLessonsResult, totalQuestionsResult]
      .filter(result => result.status === 'rejected');

    if (failedResults.length > 0) {
      dashboardData.hasErrors = true;
      dashboardData.errorDetails = `${failedResults.length} data source(s) unavailable`;
      console.warn('[Dashboard] Partial loading errors:', failedResults.map(r => r.status === 'rejected' ? r.reason : null));
    }

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
        hasErrors={dashboardData.hasErrors}
        errorDetails={dashboardData.errorDetails}
      />
    );
  } catch (error) {
    console.error('[Dashboard] Failed to fetch data:', error);
    
    // More specific error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    if (errorMessage.includes('connect') || errorMessage.includes('timeout') || errorMessage.includes('ENOTFOUND')) {
      return <DashboardError type="connection" />;
    } else if (errorMessage.includes('permission') || errorMessage.includes('auth') || errorMessage.includes('unauthorized')) {
      return <DashboardError type="permission" />;
    } else if (errorMessage.includes('relation') || errorMessage.includes('column') || errorMessage.includes('table')) {
      return <DashboardError type="schema" />;
    } else {
      return <DashboardError type="general" errorDetails={errorMessage} />;
    }
  }
}

