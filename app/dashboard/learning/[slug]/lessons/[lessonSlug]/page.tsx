import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardLayout from '@/components/DashboardLayout';
import LessonViewer from '@/components/learning/LessonViewer';

interface DashboardLessonPageProps {
  params: {
    slug: string;
    lessonSlug: string;
  };
}

export default async function DashboardLessonPage({ params }: DashboardLessonPageProps) {
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

  if (!certification) {
    notFound();
  }

  // Find the current lesson
  let currentLesson = null;
  let currentModule = null;
  let lessonIndex = 0;
  let totalLessons = 0;

  for (const module of certification.learningModules) {
    for (const lesson of module.lessons) {
      totalLessons++;
      if (lesson.slug === params.lessonSlug) {
        currentLesson = lesson;
        currentModule = module;
        break;
      }
      if (!currentLesson) lessonIndex++;
    }
    if (currentLesson) break;
  }

  if (!currentLesson || !currentModule) {
    notFound();
  }

  // Get all lessons in order for navigation
  const allLessons = certification.learningModules.flatMap(module =>
    module.lessons.map(lesson => ({
      ...lesson,
      moduleTitle: module.title,
      moduleId: module.id,
    }))
  );

  // Find previous and next lessons
  const currentIndex = allLessons.findIndex(lesson => lesson.slug === params.lessonSlug);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <DashboardLayout 
      user={session.user} 
      currentPage={`${currentLesson.title} - Learning`}
      fullWidth
    >
      <LessonViewer
        certification={certification}
        currentModule={currentModule}
        currentLesson={currentLesson}
        allLessons={allLessons}
        previousLesson={previousLesson}
        nextLesson={nextLesson}
        currentIndex={currentIndex}
        totalLessons={totalLessons}
        userId={session.user.id}
      />
    </DashboardLayout>
  );
}