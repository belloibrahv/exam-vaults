'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Menu,
  X,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Trophy,
  Target,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CloudProviderLogo from '@/components/CloudProviderLogo';

interface LessonViewerProps {
  certification: any;
  currentModule: any;
  currentLesson: any;
  allLessons: any[];
  previousLesson: any;
  nextLesson: any;
  currentIndex: number;
  totalLessons: number;
  userId: string;
}

export default function LessonViewer({
  certification,
  currentModule,
  currentLesson,
  allLessons,
  previousLesson,
  nextLesson,
  currentIndex,
  totalLessons,
  userId
}: LessonViewerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(
    currentLesson.userProgress.length > 0 && currentLesson.userProgress[0].completed
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Mark lesson as completed
  const markAsCompleted = async () => {
    if (isCompleted || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/learning/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          completed: true,
        }),
      });

      if (response.ok) {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Failed to mark lesson as completed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to next lesson
  const goToNextLesson = () => {
    if (nextLesson) {
      router.push(`/learning/${certification.slug}/lessons/${nextLesson.slug}`);
    } else {
      // Completed all lessons, go back to certification overview
      router.push(`/learning/${certification.slug}?tab=progress`);
    }
  };

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [currentLesson.id]);

  // Calculate progress for each module
  const getModuleProgress = (moduleId: string) => {
    const moduleLessons = allLessons.filter(lesson => lesson.moduleId === moduleId);
    const completedCount = moduleLessons.filter(lesson =>
      lesson.userProgress.length > 0 && lesson.userProgress[0].completed
    ).length;
    return moduleLessons.length > 0 ? Math.round((completedCount / moduleLessons.length) * 100) : 0;
  };

  // Group lessons by module
  const lessonsByModule = certification.learningModules.map((module: any) => ({
    ...module,
    lessons: allLessons.filter(lesson => lesson.moduleId === module.id),
    progress: getModuleProgress(module.id),
  }));

  const Sidebar = () => (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CloudProviderLogo provider={certification.provider.slug} size={32} />
            <div>
              <h3 className="font-medium text-gray-900 text-sm">{certification.name}</h3>
              <p className="text-xs text-gray-600">{certification.provider.displayName}</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">
              {Math.round(((currentIndex + (isCompleted ? 1 : 0)) / totalLessons) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-techvaults-red rounded-full h-2"
              initial={{ width: 0 }}
              animate={{ 
                width: `${((currentIndex + (isCompleted ? 1 : 0)) / totalLessons) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-1">
          {lessonsByModule.map((module: any) => (
            <div key={module.id}>
              <div className="flex items-center justify-between py-2 mb-2">
                <h4 className="font-medium text-gray-900 text-sm">{module.title}</h4>
                <span className="text-xs text-gray-500">{module.progress}%</span>
              </div>
              
              <div className="space-y-1 mb-4">
                {module.lessons.map((lesson: any) => {
                  const lessonCompleted = lesson.userProgress.length > 0 && lesson.userProgress[0].completed;
                  const isCurrent = lesson.id === currentLesson.id;
                  
                  return (
                    <Link
                      key={lesson.id}
                      href={`/learning/${certification.slug}/lessons/${lesson.slug}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        isCurrent
                          ? 'bg-techvaults-red text-white'
                          : lessonCompleted
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {lessonCompleted ? (
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        ) : isCurrent ? (
                          <div className="w-4 h-4 rounded-full border-2 border-white flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        )}
                        <span className="flex-1 truncate">{lesson.title}</span>
                        <Clock className="w-3 h-3 flex-shrink-0 opacity-60" />
                        <span className="text-xs opacity-60">{lesson.estimatedTime}m</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link
          href={`/learning/${certification.slug}`}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          <Home className="w-4 h-4 mr-2" />
          Certification Overview
        </Link>
        <Link
          href="/exam/start"
          className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          <Target className="w-4 h-4 mr-2" />
          Take Practice Exam
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : '-100%'
        }}
        className="fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-50 lg:z-0 lg:flex"
      >
        <Sidebar />
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-gray-600"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <Link 
                href="/learning" 
                className="hidden sm:flex items-center text-gray-600 hover:text-techvaults-red"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Learning Center
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-sm text-gray-600">
                Lesson {currentIndex + 1} of {totalLessons}
              </div>
              
              {!isCompleted && (
                <button
                  onClick={markAsCompleted}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Marking...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </>
                  )}
                </button>
              )}
              
              {isCompleted && (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Completed
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <span>{currentModule.title}</span>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-techvaults-red">Lesson {currentIndex + 1}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {currentLesson.title}
              </h1>
              
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>{currentLesson.estimatedTime} minutes</span>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }: any) => <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{children}</h1>,
                  h2: ({ children }: any) => <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{children}</h2>,
                  h3: ({ children }: any) => <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">{children}</h3>,
                  p: ({ children }: any) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
                  ul: ({ children }: any) => <ul className="list-disc list-inside mb-4 text-gray-700">{children}</ul>,
                  ol: ({ children }: any) => <ol className="list-decimal list-inside mb-4 text-gray-700">{children}</ol>,
                  li: ({ children }: any) => <li className="mb-1">{children}</li>,
                  table: ({ children }: any) => <div className="overflow-x-auto mb-4"><table className="min-w-full border border-gray-300">{children}</table></div>,
                  th: ({ children }: any) => <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">{children}</th>,
                  td: ({ children }: any) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
                  code: ({ inline, children, ...props }: any) => 
                    inline 
                      ? <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>
                      : <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code className="font-mono text-sm">{children}</code></pre>,
                  blockquote: ({ children }: any) => <blockquote className="border-l-4 border-techvaults-red pl-4 italic text-gray-700 mb-4">{children}</blockquote>,
                }}
              >
                {currentLesson.content}
              </ReactMarkdown>
            </div>

            {/* Navigation */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between">
                {previousLesson ? (
                  <Link
                    href={`/learning/${certification.slug}/lessons/${previousLesson.slug}`}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous: {previousLesson.title}
                  </Link>
                ) : (
                  <div /> // Empty div for spacing
                )}

                {nextLesson ? (
                  <button
                    onClick={goToNextLesson}
                    className="inline-flex items-center px-4 py-2 bg-techvaults-red text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Next: {nextLesson.title}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <Link
                    href={`/learning/${certification.slug}?tab=progress`}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Course Complete!
                  </Link>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}