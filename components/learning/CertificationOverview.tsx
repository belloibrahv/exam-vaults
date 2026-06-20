'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  BookOpen, 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  Trophy,
  Star,
  Target,
  Calendar,
  Award,
  TrendingUp,
  Users,
  ExternalLink,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import CloudProviderLogo from '@/components/CloudProviderLogo';

interface CertificationOverviewProps {
  certification: any;
  userId: string;
}

export default function CertificationOverview({ certification, userId }: CertificationOverviewProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate overall progress
  const totalLessons = certification.learningModules.reduce((acc: number, module: any) => 
    acc + module.lessons.length, 0
  );
  
  const completedLessons = certification.learningModules.reduce((acc: number, module: any) =>
    acc + module.lessons.filter((lesson: any) => 
      lesson.userProgress.length > 0 && lesson.userProgress[0].completed
    ).length, 0
  );
  
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Calculate estimated time
  const totalTime = certification.learningModules.reduce((acc: number, module: any) => 
    acc + module.lessons.reduce((lessonAcc: number, lesson: any) => 
      lessonAcc + lesson.estimatedTime, 0
    ), 0
  );

  // Get user's best score
  const bestScore = certification.examAttempts.length > 0 
    ? Math.max(...certification.examAttempts.map((attempt: any) => attempt.score || 0))
    : null;

  // Check if user has passed
  const hasPassed = certification.examAttempts.some((attempt: any) => attempt.passed);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'curriculum', label: 'Learning Path', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Description */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Certification</h3>
          <p className="text-gray-600 leading-relaxed">{certification.description}</p>
        </div>

        {/* Exam Domains */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Domains</h3>
          <div className="space-y-3">
            {certification.domains.map((domain: any) => (
              <div key={domain.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{domain.name}</h4>
                  <p className="text-sm text-gray-600">{domain.description}</p>
                </div>
                <div className="text-sm font-medium text-techvaults-red">
                  {domain.weight}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prerequisites */}
        {certification.prerequisites && Array.isArray(certification.prerequisites) && certification.prerequisites.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prerequisites</h3>
            <ul className="space-y-2">
              {certification.prerequisites.map((prereq: string, index: number) => (
                <li key={index} className="flex items-center text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  {prereq}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Difficulty</span>
              <div className="flex items-center">
                {Array.from({ length: certification.difficulty }, (_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium">{certification.examDuration} min</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Questions</span>
              <span className="font-medium">{certification.questionCount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Passing Score</span>
              <span className="font-medium">{certification.passingScore}%</span>
            </div>
            
            {certification.examCost && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Exam Cost</span>
                <span className="font-medium">${certification.examCost}</span>
              </div>
            )}
          </div>
        </div>

        {/* Learning Progress */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-medium text-gray-900">{overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className="bg-techvaults-red rounded-full h-3"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{completedLessons}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">{totalLessons - completedLessons}</div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
            </div>

            {bestScore !== null && (
              <div className="pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{Math.round(bestScore)}%</div>
                  <div className="text-sm text-gray-600">Best Score</div>
                  {hasPassed && (
                    <div className="flex items-center justify-center mt-2">
                      <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-green-600 font-medium">Passed!</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href={`/learning/${certification.slug}/lessons`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-techvaults-red text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
            >
              {overallProgress === 0 ? (
                <>
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Start Learning
                </>
              ) : overallProgress === 100 ? (
                <>
                  <Trophy className="w-5 h-5 mr-2" />
                  Review Content
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5 mr-2" />
                  Continue Learning
                </>
              )}
            </motion.button>
          </Link>
          
          <Link href="/exam/start">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <Target className="w-5 h-5 mr-2" />
              Take Practice Exam
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );

  const renderCurriculum = () => (
    <div className="space-y-6">
      {certification.learningModules.map((module: any, moduleIndex: number) => {
        const moduleCompleted = module.lessons.filter((lesson: any) => 
          lesson.userProgress.length > 0 && lesson.userProgress[0].completed
        ).length;
        const moduleProgress = module.lessons.length > 0 
          ? Math.round((moduleCompleted / module.lessons.length) * 100) 
          : 0;

        return (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: moduleIndex * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-gray-600">{module.description}</p>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm text-gray-500 mb-1">{moduleProgress}% complete</div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-techvaults-red rounded-full h-2 transition-all duration-300"
                      style={{ width: `${moduleProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {module.lessons.map((lesson: any, lessonIndex: number) => {
                  const isCompleted = lesson.userProgress.length > 0 && lesson.userProgress[0].completed;
                  
                  return (
                    <Link
                      key={lesson.id}
                      href={`/learning/${certification.slug}/lessons/${lesson.slug}`}
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                          )}
                          <div>
                            <h4 className={`font-medium ${isCompleted ? 'text-green-700' : 'text-gray-900'}`}>
                              {lesson.title}
                            </h4>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Clock className="w-3 h-3 mr-1" />
                              {lesson.estimatedTime} min
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const renderProgress = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Progress Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-techvaults-red mb-2">{overallProgress}%</div>
            <p className="text-gray-600">Overall Completion</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completedLessons}</div>
              <div className="text-sm text-green-700">Lessons Completed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{Math.round(totalTime / 60)}h {totalTime % 60}m</div>
              <div className="text-sm text-blue-700">Total Content</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Exam Attempts</h3>
        {certification.examAttempts.length > 0 ? (
          <div className="space-y-3">
            {certification.examAttempts.slice(0, 5).map((attempt: any) => (
              <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">
                    {attempt.passed ? 'Passed' : 'Practice'} Exam
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(attempt.startedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${attempt.passed ? 'text-green-600' : 'text-gray-900'}`}>
                    {Math.round(attempt.score || 0)}%
                  </div>
                  {attempt.passed && (
                    <Trophy className="w-4 h-4 text-yellow-500 inline-block ml-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">No exam attempts yet</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/learning" className="inline-flex items-center text-techvaults-red hover:text-red-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Center
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <CloudProviderLogo 
                provider={certification.provider.slug}
                size={60}
                className="flex-shrink-0"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {certification.fullName}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  {certification.provider.displayName} • {certification.level.displayName}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {certification.code}
                  </span>
                  {hasPassed && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <Trophy className="w-4 h-4 mr-1" />
                      Certified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-techvaults-red text-techvaults-red'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'curriculum' && renderCurriculum()}
          {activeTab === 'progress' && renderProgress()}
        </motion.div>
      </div>
    </div>
  );
}