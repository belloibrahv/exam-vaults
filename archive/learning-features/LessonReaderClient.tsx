'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock, Home, Award } from 'lucide-react';
import CloudProviderLogo from '@/components/CloudProviderLogo';

interface LessonReaderClientProps {
  certification: {
    id: string;
    name: string;
    slug: string;
    provider: {
      name: string;
      slug: string;
    };
  };
  modules: Array<{
    id: string;
    title: string;
    lessons: Array<{
      id: string;
      title: string;
      slug: string;
      estimatedTime: number;
    }>;
  }>;
  currentLesson: {
    id: string;
    title: string;
    slug: string;
    estimatedTime: number;
    moduleId: string;
  };
  initialCompletedLessonIds: string[];
  previousLessonUrl: string | null;
  nextLessonUrl: string | null;
  parsedContentHtml: string;
}

export default function LessonReaderClient({
  certification,
  modules,
  currentLesson,
  initialCompletedLessonIds,
  previousLessonUrl,
  nextLessonUrl,
  parsedContentHtml,
}: LessonReaderClientProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set(initialCompletedLessonIds));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCurrentCompleted = completedIds.has(currentLesson.id);

  // Total lessons count
  const allLessons = modules.flatMap((m) => m.lessons);
  const totalLessons = allLessons.length;
  const completedCount = completedIds.size;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  async function handleMarkComplete() {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/learning/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonId: currentLesson.id }),
      });

      if (!res.ok) {
        throw new Error('Failed to mark lesson complete');
      }

      // Add to local state
      const updated = new Set(completedIds);
      updated.add(currentLesson.id);
      setCompletedIds(updated);

      router.refresh();

      // Navigate to next lesson if available, or back to syllabus
      if (nextLessonUrl) {
        router.push(nextLessonUrl);
      } else {
        router.push(`/learning/${certification.slug}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error saving your progress. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row relative">
      {/* Mobile Header */}
      <header className="md:hidden border-b border-techvaults-gray-200 bg-white sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-techvaults-gray-700 hover:text-techvaults-red active:scale-95 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="flex items-center gap-2">
          <CloudProviderLogo provider={certification.provider.slug as 'aws' | 'azure' | 'gcp'} size={18} />
          <span className="font-bold text-xs truncate max-w-[180px]">{certification.name}</span>
        </div>
        <Link
          href={`/learning/${certification.slug}`}
          className="p-2 text-techvaults-gray-600 hover:text-techvaults-red min-w-[44px] min-h-[44px] flex items-center justify-center"
          title="Back to Syllabus"
        >
          <Home className="w-5 h-5" />
        </Link>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 md:z-30 w-72 md:w-80 border-r border-techvaults-gray-200 bg-techvaults-gray-50 flex flex-col transform transition-transform duration-300 md:translate-x-0 md:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-techvaults-gray-200 bg-white flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Link
              href={`/learning/${certification.slug}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-techvaults-red hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Syllabus Outline
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 text-techvaults-gray-500 hover:text-techvaults-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <CloudProviderLogo provider={certification.provider.slug as 'aws' | 'azure' | 'gcp'} size={24} />
            <h2 className="font-extrabold text-techvaults-black text-base line-clamp-1">
              {certification.name}
            </h2>
          </div>

          {/* Progress Widget */}
          <div>
            <div className="flex items-center justify-between text-xs text-techvaults-gray-600 mb-1">
              <span>Overall Progress</span>
              <span className="font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-techvaults-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-techvaults-red h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Modules List */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-4">
          {modules.map((mod) => (
            <div key={mod.id} className="space-y-1">
              <h3 className="text-xs font-bold text-techvaults-gray-500 uppercase tracking-wider px-2 py-1">
                {mod.title}
              </h3>
              <div className="space-y-0.5">
                {mod.lessons.map((lesson) => {
                  const isActive = lesson.slug === currentLesson.slug;
                  const isCompleted = completedIds.has(lesson.id);

                  return (
                    <Link
                      key={lesson.id}
                      href={`/learning/${certification.slug}/${lesson.slug}`}
                      onClick={() => setSidebarOpen(false)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                        isActive
                          ? 'bg-techvaults-red text-white font-bold shadow-sm'
                          : 'text-techvaults-gray-700 hover:bg-techvaults-gray-200/50 hover:text-techvaults-black'
                      }`}
                    >
                      <span className="truncate pr-2">{lesson.title}</span>
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-white' : 'text-green-600'}`} />
                        ) : (
                          <Circle className={`w-4 h-4 ${isActive ? 'text-white/40' : 'text-techvaults-gray-400'}`} />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Overlay for Mobile Sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
        />
      )}

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto md:max-h-screen">
        {/* Top desktop header */}
        <div className="hidden md:flex border-b border-techvaults-gray-200 bg-white/80 backdrop-blur-sm px-8 py-4 items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs text-techvaults-gray-500">{certification.provider.name}</span>
            <span className="text-xs text-techvaults-gray-400">/</span>
            <span className="text-xs text-techvaults-gray-500 font-semibold">{certification.name}</span>
          </div>
          <Link
            href={`/learning/${certification.slug}`}
            className="flex items-center gap-2 text-sm font-semibold text-techvaults-gray-600 hover:text-techvaults-red transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Syllabus
          </Link>
        </div>

        {/* Content Body */}
        <div className="flex-1 px-4 py-8 md:px-12 md:py-10 max-w-4xl mx-auto w-full">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-techvaults-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{currentLesson.estimatedTime} mins read</span>
            </div>
            {isCurrentCompleted && (
              <div className="flex items-center gap-1 text-green-600 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-techvaults-black mb-8 leading-tight">
            {currentLesson.title}
          </h1>

          {/* Parsed Markdown Output */}
          <article
            className="prose prose-red max-w-none text-techvaults-gray-700 mt-6"
            dangerouslySetInnerHTML={{ __html: parsedContentHtml }}
          />

          {/* Navigation Bottom Bar */}
          <div className="border-t border-techvaults-gray-200 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              {previousLessonUrl ? (
                <Link
                  href={previousLessonUrl}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-techvaults-gray-300 rounded-lg text-sm font-semibold text-techvaults-gray-700 hover:border-techvaults-red hover:text-techvaults-red transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous Lesson
                </Link>
              ) : (
                <Link
                  href={`/learning/${certification.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-techvaults-gray-300 rounded-lg text-sm font-semibold text-techvaults-gray-700 hover:border-techvaults-red hover:text-techvaults-red transition-all"
                >
                  <Home className="w-4 h-4" />
                  Syllabus Home
                </Link>
              )}
            </div>

            <div>
              {isCurrentCompleted ? (
                nextLessonUrl ? (
                  <Link
                    href={nextLessonUrl}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-techvaults-black text-white rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-all"
                  >
                    Next Lesson
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    href={`/learning/${certification.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-all"
                  >
                    Complete Certification
                    <Award className="w-4 h-4" />
                  </Link>
                )
              ) : (
                <button
                  onClick={handleMarkComplete}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-techvaults-red text-white rounded-lg text-sm font-bold hover:bg-red-700 active:scale-95 transition-all shadow-md min-h-[44px] disabled:opacity-55"
                >
                  {isSubmitting ? (
                    'Saving Progress...'
                  ) : nextLessonUrl ? (
                    <>
                      Mark Completed & Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Complete & Unlock Exam!
                      <Award className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
