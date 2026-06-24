import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import HomePageClient from '@/components/HomePageClient';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  let providers: any[] = [];
  let totalCertifications = 0;

  try {
    providers = await prisma.provider.findMany({
      where: { isActive: true },
      include: {
        certifications: {
          where: { isActive: true },
          select: { id: true },
        },
      },
      orderBy: { order: 'asc' },
    });
    totalCertifications = providers.reduce((sum, p) => sum + p.certifications.length, 0);
  } catch (error) {
    console.error('[HomePage] Failed to fetch providers:', error);
  }

  return (
    <HomePageClient 
      session={session}
      providers={providers}
      totalCertifications={totalCertifications}
    />
  );
}
