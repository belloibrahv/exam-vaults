import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardLayout from '@/components/DashboardLayout';
import LearningCatalog from '@/components/learning/LearningCatalog';

export default async function DashboardLearningPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/signin');
  }

  // Fetch all certifications with learning modules and user progress
  const certifications = await prisma.certification.findMany({
    where: {
      isActive: true,
    },
    include: {
      provider: true,
      level: true,
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
          },
        },
      },
      userProgress: {
        where: {
          userId: session.user.id,
        },
      },
    },
    orderBy: [
      { provider: { order: 'asc' } },
      { level: { order: 'asc' } },
      { order: 'asc' },
    ],
  });

  return (
    <DashboardLayout user={session.user} currentPage="Learning Center" fullWidth>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Learning Center
            </h1>
            <p className="text-lg text-gray-600">
              Master cloud certifications with interactive learning paths designed for TechVaults engineers.
            </p>
          </div>

          <LearningCatalog certifications={certifications} />
        </div>
      </div>
    </DashboardLayout>
  );
}