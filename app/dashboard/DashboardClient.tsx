'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
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
} from 'lucide-react';
import TechvaultsLogo from '@/components/TechvaultsLogo';
import CloudProviderLogo from '@/components/CloudProviderLogo';
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
}

export default function DashboardClient({
  user,
  providers,
  userProgress,
  examAttempts,
  stats,
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <TechvaultsLogo size={40} />
            <div>
              <h1 className="text-xl font-bold text-techvaults-black">Techvaults</h1>
              <p className="text-xs text-techvaults-gray-600">Multi-Cloud Certification Prep</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-techvaults-black">{user.name}</p>
              <p className="text-xs text-techvaults-gray-600">{user.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="p-2 text-techvaults-gray-600 hover:text-techvaults-red transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-techvaults-black mb-2">
            Welcome back, {user.name.split(' ')[0]}!
          </h2>
          <p className="text-techvaults-gray-600">
            Choose a certification to start your exam preparation journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedProvider(null)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
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
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                selectedProvider === provider.id
                  ? 'bg-techvaults-red text-white'
                  : 'bg-white text-techvaults-gray-700 border border-techvaults-gray-300 hover:border-techvaults-red'
              }`}
            >
              <CloudProviderLogo provider={provider.slug} size={20} />
              {provider.name}
            </button>
          ))}
        </div>

        {/* Certifications by Provider */}
        {displayedProviders.map((provider) => (
          <div key={provider.id} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CloudProviderLogo provider={provider.slug} size={32} />
              <h3 className="text-2xl font-bold text-techvaults-black">{provider.name}</h3>
              <span className="text-sm text-techvaults-gray-600">
                ({provider.certifications.length} certifications)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Recent Attempts */}
        {examAttempts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-techvaults-gray-200 mt-8">
            <h3 className="text-2xl font-bold text-techvaults-black mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-techvaults-red" />
              Recent Exam Attempts
            </h3>

            <div className="space-y-4">
              {examAttempts.map((attempt) => (
                <AttemptCard key={attempt.id} attempt={attempt} />
              ))}
            </div>
          </div>
        )}
      </div>
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
    <div className="bg-white rounded-xl p-6 border border-techvaults-gray-200 hover:shadow-lg transition-all">
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-techvaults-gray-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-techvaults-black">{value}</p>
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
}: {
  certification: any;
  provider: any;
  progress: any;
  attempts: number;
  passed: boolean;
  questionsCount: number;
}) {
  const levelColors: Record<string, string> = {
    Foundational: 'bg-green-100 text-green-700 border-green-300',
    Associate: 'bg-blue-100 text-blue-700 border-blue-300',
    Professional: 'bg-purple-100 text-purple-700 border-purple-300',
    Expert: 'bg-red-100 text-red-700 border-red-300',
  };

  const levelColor = levelColors[certification.level.name] || 'bg-gray-100 text-gray-700 border-gray-300';

  return (
    <div className="bg-white rounded-xl border-2 border-techvaults-gray-200 hover:border-techvaults-red transition-all overflow-hidden group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${levelColor}`}>
              <Target className="w-3 h-3" />
              {certification.level.name}
            </div>
            <h4 className="text-lg font-bold text-techvaults-black mb-2 group-hover:text-techvaults-red transition-colors">
              {certification.name}
            </h4>
            <p className="text-sm text-techvaults-gray-600 line-clamp-2">
              {certification.description}
            </p>
          </div>
          {passed && (
            <div className="flex-shrink-0 ml-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-techvaults-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{questionsCount} questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            <span>{attempts} attempts</span>
          </div>
        </div>

        {/* Progress Bar */}
        {progress && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-techvaults-gray-600 mb-1">
              <span>Progress</span>
              <span>{progress.questionsAttempted} / {questionsCount}</span>
            </div>
            <div className="w-full bg-techvaults-gray-200 rounded-full h-2">
              <div
                className="bg-techvaults-red rounded-full h-2 transition-all"
                style={{
                  width: `${Math.min(100, (progress.questionsAttempted / questionsCount) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link
          href={`/exam/start?certificationId=${certification.id}`}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-all group-hover:scale-105"
        >
          <Play className="w-4 h-4" />
          {questionsCount > 0 ? 'Start Practice' : 'Coming Soon'}
        </Link>
      </div>
    </div>
  );
}

function AttemptCard({ attempt }: { attempt: any }) {
  const isCompleted = !!attempt.completedAt;
  const score = attempt.score || 0;
  const passed = attempt.passed;

  return (
    <div className="flex items-center justify-between p-4 border border-techvaults-gray-200 rounded-lg hover:border-techvaults-red transition-all">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            passed
              ? 'bg-green-50 text-green-600'
              : isCompleted
              ? 'bg-red-50 text-red-600'
              : 'bg-gray-50 text-gray-600'
          }`}
        >
          {passed ? (
            <CheckCircle className="w-6 h-6" />
          ) : isCompleted ? (
            <XCircle className="w-6 h-6" />
          ) : (
            <Clock className="w-6 h-6" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            {attempt.certification && (
              <>
                <CloudProviderLogo provider={attempt.certification.provider.slug} size={16} />
                <span className="text-xs text-techvaults-gray-500">
                  {attempt.certification.provider.name}
                </span>
              </>
            )}
          </div>
          <p className="font-semibold text-techvaults-black">
            {attempt.certification?.name || 'Unknown Certification'}
          </p>
          <p className="text-sm text-techvaults-gray-600">
            {format(new Date(attempt.startedAt), 'MMM dd, yyyy')} •{' '}
            {isCompleted
              ? `${attempt.correctAnswers}/${attempt.totalQuestions} correct`
              : 'In progress'}
          </p>
        </div>
      </div>
      <div className="text-right">
        {isCompleted && (
          <>
            <p className={`text-2xl font-bold ${getScoreColor(score)}`}>{Math.round(score)}%</p>
            <p className="text-xs text-techvaults-gray-600">
              {formatTime(attempt.timeSpent || 0)}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
