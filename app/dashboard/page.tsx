import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

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
}
