import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import ExamsManagement from './ExamsManagement';

export default async function AdminExamsPage() {
  await requireAdmin();

  const examAttempts = await prisma.examAttempt.findMany({
    orderBy: { startedAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      certification: {
        include: {
          provider: true,
          level: true,
        },
      },
      answers: {
        select: {
          id: true,
          isCorrect: true,
        },
      },
    },
    take: 200, // Limit for performance
  });

  return <ExamsManagement examAttempts={examAttempts} />;
}
