import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import QuestionsManagement from './QuestionsManagement';

export default async function AdminQuestionsPage() {
  await requireAdmin();

  const [questions, certifications, providers] = await Promise.all([
    prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        certification: {
          include: {
            provider: true,
            level: true,
          },
        },
        domain: true,
      },
      take: 100, // Limit for performance
    }),
    prisma.certification.findMany({
      include: {
        provider: true,
        level: true,
        _count: {
          select: {
            questions: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.provider.findMany({
      include: {
        _count: {
          select: {
            certifications: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    }),
  ]);

  return (
    <QuestionsManagement
      questions={questions}
      certifications={certifications}
      providers={providers}
    />
  );
}
