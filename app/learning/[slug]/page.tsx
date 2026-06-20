import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CertificationOverview from '@/components/learning/CertificationOverview';

interface CertificationPageProps {
  params: {
    slug: string;
  };
}

export default async function CertificationPage({ params }: CertificationPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/signin');
  }

  const certification = await prisma.certification.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      provider: true,
      level: true,
      domains: {
        orderBy: { order: 'asc' },
      },
      learningModules: {
        include: {
          lessons: {
            include: {
              userProgress: {
                where: {
                  userId: session.user.id,
                },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      },
      userProgress: {
        where: {
          userId: session.user.id,
        },
      },
      examAttempts: {
        where: {
          userId: session.user.id,
        },
        orderBy: { startedAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!certification) {
    notFound();
  }

  return <CertificationOverview certification={certification} userId={session.user.id} />;
}