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
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
} from 'lucide-react';
import TechvaultsLogo from '@/components/TechvaultsLogo';
import { formatTime, getScoreColor } from '@/lib/utils';
import { format } from 'date-fns';

interface DashboardClientProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  examAttempts: any[];
  stats: {
    totalAttempts: number;
    completedAttempts: number;
    passedAttempts: number;
    averageScore: number;
    totalQuestions: number;
  };
  canTakeExam: boolean;
  retakeMessage: string;
  timeRemaining: string;
}

export default function DashboardClient({
  user,
  examAttempts,
  stats,
  canTakeExam,
  retakeMessage,
  timeRemaining,
}: DashboardClientProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-techvaults-gray-50 via-white to-techvaults-gray-100">
      {/* Header */}
      <header className="border-b border-techvaults-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TechvaultsLogo size={40} />
            <div>
              <h1 className="text-xl font-bold text-techvaults-black">Techvaults</h1>
              <p className="text-xs text-techvaults-gray-600">GCDL Exam System</p>
            </div>
          </div>
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
            Ready to continue your Google Cloud Digital Leader certification preparation?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<BookOpen className="w-6 h-6 text-blue-600" />}
            label="Total Attempts"
            value={stats.totalAttempts}
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
            icon={<Award className="w-6 h-6 text-techvaults-red" />}
            label="Questions Pool"
            value={stats.totalQuestions}
            bgColor="bg-red-50"
          />
        </div>

        {/* Start Exam Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-techvaults-gray-200 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-techvaults-black mb-2">
                Start Practice Exam
              </h3>
              <p className="text-techvaults-gray-600 mb-4">
                Take a full-length practice exam with 50-60 questions in 90 minutes. Make sure
                you're prepared before starting.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-techvaults-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>90 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>50-60 questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>70% to pass</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              {canTakeExam ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="flex items-center gap-2 px-8 py-4 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-all hover:scale-105 shadow-lg"
                >
                  <Play className="w-5 h-5" />
                  Start Exam
                </button>
              ) : (
                <div className="text-center">
                  <div className="flex items-center gap-2 px-6 py-3 bg-techvaults-gray-200 text-techvaults-gray-600 rounded-lg font-semibold cursor-not-allowed">
                    <Clock className="w-5 h-5" />
                    Locked
                  </div>
                  <p className="text-xs text-techvaults-red mt-2 font-semibold">
                    {timeRemaining} remaining
                  </p>
                </div>
              )}
            </div>
          </div>

          {!canTakeExam && (
            <div className="mt-6 flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-800 mb-1">Exam Locked</p>
                <p className="text-sm text-yellow-700">{retakeMessage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Recent Attempts */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-techvaults-gray-200">
          <h3 className="text-2xl font-bold text-techvaults-black mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-techvaults-red" />
            Recent Exam Attempts
          </h3>

          {examAttempts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-techvaults-gray-300 mx-auto mb-4" />
              <p className="text-techvaults-gray-600">No exam attempts yet</p>
              <p className="text-sm text-techvaults-gray-500 mt-2">
                Start your first practice exam to see your progress here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {examAttempts.map((attempt) => (
                <AttemptCard key={attempt.id} attempt={attempt} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-slide-up">
            <h3 className="text-2xl font-bold text-techvaults-black mb-4">
              Ready to Start?
            </h3>
            <p className="text-techvaults-gray-600 mb-6">
              You're about to start a 90-minute practice exam. Make sure you have enough time
              and won't be interrupted. Are you ready?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-6 py-3 border-2 border-techvaults-gray-300 text-techvaults-gray-700 rounded-lg font-semibold hover:border-techvaults-gray-400 transition-all"
              >
                Cancel
              </button>
              <Link
                href="/exam/start"
                className="flex-1 px-6 py-3 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-all text-center"
              >
                Yes, Start
              </Link>
            </div>
          </div>
        </div>
      )}
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
          <p className="font-semibold text-techvaults-black">
            {format(new Date(attempt.startedAt), 'MMM dd, yyyy')}
          </p>
          <p className="text-sm text-techvaults-gray-600">
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
