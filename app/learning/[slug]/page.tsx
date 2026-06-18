import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, BookOpen, Clock, CheckCircle2, Lock, Play, Award, ChevronRight } from 'lucide-react';
import CloudProviderLogo from '@/components/CloudProviderLogo';
import ExamVaultsLogo from '@/components/ExamVaultsLogo';

interface SyllabusPageProps {
  params: {
    slug: string;
  };
}

export default async function SyllabusPage({ params }: SyllabusPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  if (session.user.role === 'ADMIN') {
    redirect('/admin');
  }

  // Fetch certification with its modules, lessons, and provider
  const certification = await prisma.certification.findUnique({
    where: { slug: params.slug },
    include: {
      provider: true,
      level: true,
      learningModules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  if (!certification) {
    notFound();
  }

  // Get all lesson IDs for this certification to count progress
  const allLessons = certification.learningModules.flatMap((m) => m.lessons);
  const totalLessons = allLessons.length;

  // Get user's completed lessons for this certification
  const completedProgress = await prisma.userLessonProgress.findMany({
    where: {
      userId: session.user.id,
      completed: true,
      lesson: {
        module: {
          certificationId: certification.id,
        },
      },
    },
    select: {
      lessonId: true,
    },
  });

  const completedLessonIds = new Set(completedProgress.map((p) => p.lessonId));
  const completedCount = completedLessonIds.size;
  const isMastered = totalLessons > 0 && completedCount === totalLessons;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Find the next uncompleted lesson to suggest
  const nextLesson = allLessons.find((l) => !completedLessonIds.has(l.id)) || allLessons[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-techvaults-gray-50 via-white to-techvaults-gray-100">
      {/* Header */}
      <header className="border-b border-techvaults-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center hover:opacity-95 transition-opacity">
            <ExamVaultsLogo size={36} variant="full" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-techvaults-gray-600 hover:text-techvaults-red transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-techvaults-black text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-techvaults-red via-black to-black"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 flex items-center justify-center backdrop-blur-sm shadow-inner">
                  <CloudProviderLogo provider={certification.provider.slug as 'aws' | 'azure' | 'gcp'} size={40} className="w-10 h-10" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold border border-white/20 bg-white/10 uppercase tracking-wider">
                  {certification.level.displayName}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                {certification.name}
              </h1>
              <p className="text-white/70 max-w-2xl text-sm md:text-base leading-relaxed">
                {certification.description}
              </p>
            </div>

            {/* Quick Stats Widget */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 min-w-[280px]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-white/60">Learning Progress</span>
                <span className="text-lg font-bold text-techvaults-red">{progressPercent}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5 mb-4 overflow-hidden">
                <div
                  className="bg-techvaults-red h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/50">
                <span>{completedCount} of {totalLessons} lessons completed</span>
                <span>{totalLessons * 10} mins total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Knowledge Mastery Status Bar */}
        <div className={`mb-8 p-6 rounded-2xl border-2 transition-all flex flex-col md:flex-row items-center justify-between gap-4 shadow-md ${
          isMastered
            ? 'bg-green-50 border-green-300 text-green-800'
            : 'bg-red-50/50 border-techvaults-red/30 text-techvaults-black'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isMastered ? 'bg-green-100 text-green-700' : 'bg-red-100 text-techvaults-red animate-pulse'
            }`}>
              {isMastered ? <CheckCircle2 className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {isMastered ? 'Knowledge Mastery Achieved!' : 'Mastery Path Locked'}
              </h3>
              <p className={`text-sm ${isMastered ? 'text-green-700' : 'text-techvaults-gray-600'}`}>
                {isMastered
                  ? 'Excellent job! You have finished all learning documentation. The prep exam is now unlocked.'
                  : `Complete all ${totalLessons} learning lessons to unlock the practice prep exam (Current: ${completedCount}/${totalLessons}).`}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto">
            {isMastered ? (
              <Link
                href={`/exam/start?certificationId=${certification.id}`}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 active:scale-95 transition-all shadow-md"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Practice Exam
              </Link>
            ) : nextLesson ? (
              <Link
                href={`/learning/${certification.slug}/${nextLesson.slug}`}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-techvaults-red text-white rounded-xl font-bold hover:bg-red-700 active:scale-95 transition-all shadow-md"
              >
                <BookOpen className="w-4 h-4" />
                {completedCount > 0 ? 'Resume Learning' : 'Start Learning'}
              </Link>
            ) : null}
          </div>
        </div>

        {/* Curriculum Modules List */}
        <h2 className="text-xl md:text-2xl font-bold text-techvaults-black mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-techvaults-red" />
          Certification Curriculum
        </h2>

        {certification.learningModules.length === 0 ? (
          <div className="bg-white rounded-2xl border border-techvaults-gray-200 p-8 text-center shadow-sm">
            <BookOpen className="w-12 h-12 text-techvaults-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-techvaults-black mb-1">No Learning Content Yet</h3>
            <p className="text-sm text-techvaults-gray-500">
              Learning modules and lessons for this certification are being added shortly. Please check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {certification.learningModules.map((module, index) => {
              const moduleLessonsCount = module.lessons.length;
              const moduleCompletedCount = module.lessons.filter((l) => completedLessonIds.has(l.id)).length;
              const isModuleCompleted = moduleLessonsCount > 0 && moduleCompletedCount === moduleLessonsCount;

              return (
                <div
                  key={module.id}
                  className="bg-white rounded-2xl border border-techvaults-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Module Header */}
                  <div className="p-5 border-b border-techvaults-gray-100 bg-techvaults-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-techvaults-black">
                        {module.title}
                      </h3>
                      <p className="text-xs md:text-sm text-techvaults-gray-600 mt-1">
                        {module.description}
                      </p>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      isModuleCompleted
                        ? 'bg-green-100 text-green-700'
                        : 'bg-techvaults-gray-200 text-techvaults-gray-600'
                    }`}>
                      {isModuleCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                      <span>
                        {moduleCompletedCount} / {moduleLessonsCount} Lessons
                      </span>
                    </div>
                  </div>

                  {/* Lessons List */}
                  <div className="divide-y divide-techvaults-gray-100">
                    {module.lessons.map((lesson) => {
                      const isCompleted = completedLessonIds.has(lesson.id);

                      return (
                        <Link
                          key={lesson.id}
                          href={`/learning/${certification.slug}/${lesson.slug}`}
                          className="flex items-center justify-between p-4 hover:bg-techvaults-gray-50/50 active:bg-techvaults-gray-50 transition-colors group"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isCompleted ? 'text-green-600 bg-green-50' : 'text-techvaults-gray-400 bg-techvaults-gray-100'
                            }`}>
                              <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'fill-current text-green-600' : 'text-techvaults-gray-300'}`} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm md:text-base font-semibold text-techvaults-black group-hover:text-techvaults-red transition-colors truncate">
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3.5 h-3.5 text-techvaults-gray-500" />
                                <span className="text-xs text-techvaults-gray-600">
                                  {lesson.estimatedTime} mins read
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-techvaults-gray-600 group-hover:text-techvaults-red transition-colors flex-shrink-0 ml-2">
                            <span className="text-xs font-bold hidden sm:inline">Read Lesson</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="border-t border-techvaults-gray-200 bg-white mt-16 py-8">
        <div className="container mx-auto px-4 max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-techvaults-gray-600">
          <p className="text-xs">
            © 2026 ExamVaults. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs">Built by</span>
            <Image
              src="/images/logo.png"
              alt="Techvaults"
              width={90}
              height={24}
              className="h-5 w-auto opacity-75 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
