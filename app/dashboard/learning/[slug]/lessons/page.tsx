import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface DashboardLessonsPageProps {
  params: {
    slug: string;
  };
}

export default async function DashboardLessonsPage({ params }: DashboardLessonsPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/signin');
  }

  const certification = await prisma.certification.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
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
    },
  });

  if (!certification || certification.learningModules.length === 0) {
    notFound();
  }

  // Find the first uncompleted lesson, or default to the first lesson
  let firstLessonSlug = certification.learningModules[0].lessons[0]?.slug;
  
  for (const module of certification.learningModules) {
    for (const lesson of module.lessons) {
      const isCompleted = lesson.userProgress.length > 0 && lesson.userProgress[0].completed;
      if (!isCompleted) {
        firstLessonSlug = lesson.slug;
        break;
      }
    }
    if (firstLessonSlug) break;
  }

  if (!firstLessonSlug) {
    notFound();
  }

  redirect(`/dashboard/learning/${params.slug}/lessons/${firstLessonSlug}`);
}