import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  const session = await requireAdmin();

  // Fetch dashboard statistics
  const [
    totalUsers,
    totalQuestions,
    totalExamAttempts,
    totalCertifications,
    recentUsers,
    recentExamAttempts,
    questionsByProvider,
    usersByRole,
  ] = await Promise.all([
    // Total counts
    prisma.user.count(),
    prisma.question.count(),
    prisma.examAttempt.count(),
    prisma.certification.count(),

    // Recent users (last 10)
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            examAttempts: true,
          },
        },
      },
    }),

    // Recent exam attempts (last 10)
    prisma.examAttempt.findMany({
      take: 10,
      orderBy: { startedAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        certification: {
          select: {
            name: true,
            code: true,
            provider: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    }),

    // Questions by provider
    prisma.provider.findMany({
      include: {
        certifications: {
          include: {
            _count: {
              select: {
                questions: true,
              },
            },
          },
        },
      },
    }),

    // Users by role
    prisma.user.groupBy({
      by: ['role'],
      _count: true,
    }),
  ]);

  // Calculate pass rate
  const completedExams = await prisma.examAttempt.count({
    where: { completedAt: { not: null } },
  });
  const passedExams = await prisma.examAttempt.count({
    where: { passed: true },
  });
  const passRate = completedExams > 0 ? (passedExams / completedExams) * 100 : 0;

  // Calculate average score
  const avgScoreResult = await prisma.examAttempt.aggregate({
    _avg: {
      score: true,
    },
    where: {
      score: { not: null },
    },
  });
  const avgScore = avgScoreResult._avg.score || 0;

  const stats = {
    totalUsers,
    totalQuestions,
    totalExamAttempts,
    totalCertifications,
    passRate: Math.round(passRate),
    avgScore: Math.round(avgScore),
    completedExams,
    activeUsers: totalUsers, // Can be refined with last login tracking
  };

  return (
    <AdminDashboard
      user={session.user}
      stats={stats}
      recentUsers={recentUsers}
      recentExamAttempts={recentExamAttempts}
      questionsByProvider={questionsByProvider}
      usersByRole={usersByRole}
    />
  );
}
