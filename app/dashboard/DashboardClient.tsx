'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  LogOut,
  Play,
  CheckCircle,
  XCircle,
  BarChart3,
  Cloud,
  Target,
  Zap,
  Shield,
  Lock,
} from 'lucide-react';
import CloudProviderLogo from '@/components/CloudProviderLogo';
import ExamVaultsLogo from '@/components/ExamVaultsLogo';
import { formatTime, getScoreColor } from '@/lib/utils';
import { format } from 'date-fns';

interface DashboardClientProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  providers: any[];
  userProgress: any[];
  examAttempts: any[];
  stats: {
    totalAttempts: number;
    completedAttempts: number;
    passedAttempts: number;
    averageScore: number;
    totalQuestions: number;
    totalCertifications: number;
  };
  completedLessonsCountMap: Record<string, number>;
  hasErrors?: boolean;
  errorDetails?: string | null;
}

export default function DashboardClient({
  user,
  providers,
  userProgress,
  examAttempts,
  stats,
  completedLessonsCountMap,
  hasErrors = false,
  errorDetails,
}: DashboardClientProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  // Filter certifications by selected provider
  const displayedProviders = selectedProvider
    ? providers.filter((p) => p.id === selectedProvider)
    : providers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-techvaults-gray-50 via-white to-techvaults-gray-100">
      {/* Header */}
      <header className="border-b border-techvaults-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center hover:opacity-95 transition-opacity">
            <ExamVaultsLogo size={36} variant="full" />
          </Link>
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <Link
              href="/learning"
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
              title="Learning Center"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Learning</span>
            </Link>
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-techvaults-black truncate max-w-[200px]">{user.name}</p>
              <p className="text-xs text-techvaults-gray-600 truncate max-w-[200px]">{user.email}</p>
            </div>
            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="px-3 py-2 bg-techvaults-red text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all flex items-center gap-2"
                title="Admin Panel"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="p-2 text-techvaults-gray-600 hover:text-techvaults-red active:scale-95 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* Error Notification */}
        {hasErrors && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-amber-600 mt-0.5">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-amber-800">
                  Some data may be incomplete
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  {errorDetails || 'We encountered issues loading some information. The dashboard may not show all data.'}
                </p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="flex-shrink-0 text-sm font-medium text-amber-800 hover:text-amber-900 underline"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-techvaults-black mb-2">
            Welcome back, {user.name.split(' ')[0]}!
          </h2>
          <p className="text-sm md:text-base text-techvaults-gray-600">
            Choose a certification to start your exam preparation journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <StatCard
            icon={<Cloud className="w-6 h-6 text-blue-600" />}
            label="Certifications"
            value={stats.totalCertifications}
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6 text-green-600" />}
            label="Passed Exams"
            value={stats.passedAttempts}
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
            label="Average Score"
            value={`${stats.averageScore}%`}
            bgColor="bg-purple-50"
          />
          <StatCard
            icon={<BookOpen className="w-6 h-6 text-techvaults-red" />}
            label="Questions Pool"
            value={stats.totalQuestions}
            bgColor="bg-red-50"
          />
        </div>

        {/* Provider Filter */}
        <div className="mb-4 md:mb-6 flex flex-wrap gap-2 md:gap-3">
          <button
            onClick={() => setSelectedProvider(null)}
            className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-semibold transition-all active:scale-95 ${
              selectedProvider === null
                ? 'bg-techvaults-red text-white'
                : 'bg-white text-techvaults-gray-700 border border-techvaults-gray-300 hover:border-techvaults-red'
            }`}
          >
            All Providers
          </button>
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setSelectedProvider(provider.id)}
              className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-semibold transition-all flex items-center gap-2 active:scale-95 ${
                selectedProvider === provider.id
                  ? 'bg-techvaults-red text-white'
                  : 'bg-white text-techvaults-gray-700 border border-techvaults-gray-300 hover:border-techvaults-red'
              }`}
            >
              <CloudProviderLogo provider={provider.slug} size={16} className="md:w-5 md:h-5" />
              <span className="hidden sm:inline">{provider.name}</span>
            </button>
          ))}
        </div>

        {/* Certifications by Provider */}
        {displayedProviders.map((provider) => (
          <div key={provider.id} className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="bg-white/90 p-2.5 rounded-xl border border-techvaults-gray-200 shadow-sm flex items-center justify-center">
                <CloudProviderLogo provider={provider.slug} size={36} className="w-9 h-9" />
              </div>
              <span className="text-xs md:text-sm text-techvaults-gray-600 font-bold bg-white/85 px-3.5 py-1.5 rounded-full border border-techvaults-gray-200/60 shadow-sm">
                {provider.certifications.length} {provider.certifications.length === 1 ? 'Certification' : 'Certifications'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {provider.certifications.map((cert: any) => {
                const progress = userProgress.find((p) => p.certificationId === cert.id);
                const attempts = examAttempts.filter((a) => a.certificationId === cert.id);
                const passed = attempts.some((a) => a.passed);
                const questionsCount = cert._count.questions;

                return (
                  <CertificationCard
                    key={cert.id}
                    certification={cert}
                    provider={provider}
                    progress={progress}
                    attempts={attempts.length}
                    passed={passed}
                    questionsCount={questionsCount}
                    completedLessonsCountMap={completedLessonsCountMap}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Recent Attempts */}
        {examAttempts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 lg:p-8 border border-techvaults-gray-200 mt-6 md:mt-8">
            <h3 className="text-xl md:text-2xl font-bold text-techvaults-black mb-4 md:mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-techvaults-red" />
              Recent Exam Attempts
            </h3>

            <div className="space-y-3 md:space-y-4">
              {examAttempts.map((attempt) => (
                <AttemptCard key={attempt.id} attempt={attempt} />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <footer className="border-t border-techvaults-gray-200 bg-white mt-16 py-8">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-techvaults-gray-600">
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

function StatCard({
  icon,
  label,
  value,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 md:p-6 border border-techvaults-gray-200 hover:shadow-lg transition-all">
      <div className={`w-10 h-10 md:w-12 md:h-12 ${bgColor} rounded-lg flex items-center justify-center mb-3 md:mb-4`}>
        {icon}
      </div>
      <p className="text-xs md:text-sm text-techvaults-gray-600 mb-1">{label}</p>
      <p className="text-2xl md:text-3xl font-bold text-techvaults-black">{value}</p>
    </div>
  );
}

function CertificationCard({
  certification,
  provider,
  progress,
  attempts,
  passed,
  questionsCount,
  completedLessonsCountMap,
}: {
  certification: any;
  provider: any;
  progress: any;
  attempts: number;
  passed: boolean;
  questionsCount: number;
  completedLessonsCountMap: Record<string, number>;
}) {
  const levelColors: Record<string, string> = {
    Foundational: 'bg-green-100 text-green-700 border-green-300',
    Associate: 'bg-blue-100 text-blue-700 border-blue-300',
    Professional: 'bg-purple-100 text-purple-700 border-purple-300',
    Expert: 'bg-red-100 text-red-700 border-red-300',
  };

  const levelColor = levelColors[certification.level.name] || 'bg-gray-100 text-gray-700 border-gray-300';

  const totalLessons = certification.learningModules?.reduce((sum: number, m: any) => sum + (m._count?.lessons || 0), 0) || 0;
  const completedLessons = completedLessonsCountMap[certification.id] || 0;
  const learningPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const isLocked = totalLessons > 0 && completedLessons < totalLessons;

  return (
    <div className="bg-white rounded-xl border-2 border-techvaults-gray-200 hover:border-techvaults-red transition-all overflow-hidden group">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 md:mb-4 gap-2">
          <div className="flex-1 min-w-0">
            <div className={`inline-flex items-center gap-1 px-2 md:px-3 py-1 rounded-full text-xs font-semibold border mb-2 md:mb-3 ${levelColor}`}>
              <Target className="w-3 h-3" />
              {certification.level.name}
            </div>
            <h4 className="text-base md:text-lg font-bold text-techvaults-black mb-2 group-hover:text-techvaults-red transition-colors line-clamp-2">
              {certification.name}
            </h4>
            <p className="text-xs md:text-sm text-techvaults-gray-600 line-clamp-2">
              {certification.description}
            </p>
          </div>
          {passed && (
            <div className="flex-shrink-0 ml-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-techvaults-gray-600 mb-3 md:mb-4">
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
            <span>{questionsCount} questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 md:w-4 md:h-4" />
            <span>{attempts} attempts</span>
          </div>
        </div>

        {/* Learning Progress Bar */}
        {totalLessons > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-techvaults-gray-600 mb-1">
              <span className="font-semibold flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-techvaults-red" />
                Learning Progress
              </span>
              <span className="font-bold text-techvaults-black">
                {completedLessons}/{totalLessons} ({learningPercent}%)
              </span>
            </div>
            <div className="w-full bg-techvaults-gray-200 rounded-full h-2">
              <div
                className={`rounded-full h-2 transition-all duration-300 ${
                  learningPercent === 100 ? 'bg-green-600' : 'bg-techvaults-red'
                }`}
                style={{
                  width: `${learningPercent}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        {isLocked ? (
          <div className="flex flex-col gap-2">
            <button
              disabled
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-techvaults-gray-100 text-techvaults-gray-400 rounded-lg text-sm font-semibold border border-techvaults-gray-200 cursor-not-allowed min-h-[44px]"
            >
              <Lock className="w-4 h-4 text-techvaults-gray-400" />
              Practice Exam Locked
            </button>
            <Link
              href={`/learning/${certification.slug}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-techvaults-red text-white rounded-lg text-sm font-semibold hover:bg-red-700 active:scale-95 transition-all min-h-[44px]"
            >
              <BookOpen className="w-4 h-4" />
              {completedLessons > 0 ? 'Resume Course' : 'Start Course'}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              href={`/exam/start?certificationId=${certification.id}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-techvaults-red text-white rounded-lg text-sm md:text-base font-semibold hover:bg-red-700 transition-all group-hover:scale-105 active:scale-95 min-h-[44px]"
            >
              <Play className="w-4 h-4" />
              {questionsCount > 0 ? 'Start Practice' : 'Coming Soon'}
            </Link>
            {totalLessons > 0 && (
              <Link
                href={`/learning/${certification.slug}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-1.5 border border-techvaults-gray-300 text-techvaults-gray-600 rounded-lg text-xs font-semibold hover:border-techvaults-red hover:text-techvaults-red transition-all min-h-[32px]"
              >
                Review Course Materials
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AttemptCard({ attempt }: { attempt: any }) {
  const isCompleted = !!attempt.completedAt;
  const score = attempt.score || 0;
  const passed = attempt.passed;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 border border-techvaults-gray-200 rounded-lg hover:border-techvaults-red transition-all gap-3">
      <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
        <div
          className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
            passed
              ? 'bg-green-50 text-green-600'
              : isCompleted
              ? 'bg-red-50 text-red-600'
              : 'bg-gray-50 text-gray-600'
          }`}
        >
          {passed ? (
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
          ) : isCompleted ? (
            <XCircle className="w-5 h-5 md:w-6 md:h-6" />
          ) : (
            <Clock className="w-5 h-5 md:w-6 md:h-6" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            {attempt.certification && (
              <>
                <CloudProviderLogo provider={attempt.certification.provider.slug} size={14} className="md:w-4 md:h-4 flex-shrink-0" />
                <span className="text-xs text-techvaults-gray-500 truncate">
                  {attempt.certification.provider.name}
                </span>
              </>
            )}
          </div>
          <p className="text-sm md:text-base font-semibold text-techvaults-black truncate">
            {attempt.certification?.name || 'Unknown Certification'}
          </p>
          <p className="text-xs md:text-sm text-techvaults-gray-600">
            {format(new Date(attempt.startedAt), 'MMM dd, yyyy')} •{' '}
            {isCompleted
              ? `${attempt.correctAnswers}/${attempt.totalQuestions} correct`
              : 'In progress'}
          </p>
        </div>
      </div>
      <div className="text-right flex-shrink-0 self-end sm:self-auto">
        {isCompleted && (
          <>
            <p className={`text-xl md:text-2xl font-bold ${getScoreColor(score)}`}>{Math.round(score)}%</p>
            <p className="text-xs text-techvaults-gray-600">
              {formatTime(attempt.timeSpent || 0)}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
