'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Award,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Home,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import ExamVaultsLogo from '@/components/ExamVaultsLogo';
import { formatTime, getScoreColor, getScoreBgColor } from '@/lib/utils';
import { format } from 'date-fns';

interface ResultsClientProps {
  examAttempt: {
    id: string;
    score: number;
    passed: boolean;
    correctAnswers: number;
    totalQuestions: number;
    timeSpent: number;
    completedAt: string;
  };
  answers: Array<{
    id: string;
    isCorrect: boolean;
    selectedAnswers: string[];
    question: {
      id: string;
      question: string;
      options: Array<{ id: string; text: string }>;
      correctAnswers: string[];
      explanation: string;
      category: string;
    };
  }>;
  categoryStats: Record<string, { correct: number; total: number }>;
  userRole?: string;
}

export default function ResultsClient({
  examAttempt,
  answers,
  categoryStats,
  userRole,
}: ResultsClientProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const score = Math.round(examAttempt.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-techvaults-gray-50 via-white to-techvaults-gray-100">
      {/* Header */}
      <header className="border-b border-techvaults-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={userRole === 'ADMIN' ? '/admin' : '/dashboard'} className="flex items-center hover:opacity-95 transition-opacity">
              <ExamVaultsLogo size={36} variant="full" />
            </Link>
            <div className="hidden sm:block border-l border-techvaults-gray-200 pl-4">
              <h1 className="text-lg font-bold text-techvaults-black">Exam Results</h1>
              <p className="text-xs text-techvaults-gray-600">
                {format(new Date(examAttempt.completedAt), 'MMM dd, yyyy • h:mm a')}
              </p>
            </div>
          </div>
          <Link
            href={userRole === 'ADMIN' ? '/admin' : '/dashboard'}
            className="flex items-center gap-2 px-4 py-2 text-techvaults-gray-700 hover:text-techvaults-red transition-colors"
          >
            <Home className="w-5 h-5" />
            {userRole === 'ADMIN' ? 'Admin Panel' : 'Dashboard'}
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Score Card */}
        <div
          className={`rounded-2xl shadow-2xl p-12 mb-8 text-center ${
            examAttempt.passed
              ? 'bg-gradient-to-br from-green-500 to-green-600'
              : 'bg-gradient-to-br from-red-500 to-red-600'
          }`}
        >
          <div className="max-w-2xl mx-auto">
            {examAttempt.passed ? (
              <CheckCircle className="w-20 h-20 text-white mx-auto mb-4" />
            ) : (
              <XCircle className="w-20 h-20 text-white mx-auto mb-4" />
            )}
            <h2 className="text-4xl font-bold text-white mb-2">
              {examAttempt.passed ? 'Congratulations!' : 'Keep Practicing'}
            </h2>
            <p className="text-xl text-white/90 mb-6">
              {examAttempt.passed
                ? 'You passed the practice exam!'
                : 'You need 70% to pass. Review the explanations below and try again.'}
            </p>
            <div className="text-7xl font-bold text-white mb-4">{score}%</div>
            <p className="text-lg text-white/90">
              {examAttempt.correctAnswers} out of {examAttempt.totalQuestions} questions correct
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Award className="w-6 h-6 text-techvaults-red" />}
            label="Score"
            value={`${score}%`}
            bgColor="bg-red-50"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6 text-green-600" />}
            label="Correct Answers"
            value={`${examAttempt.correctAnswers}/${examAttempt.totalQuestions}`}
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<Clock className="w-6 h-6 text-blue-600" />}
            label="Time Spent"
            value={formatTime(examAttempt.timeSpent)}
            bgColor="bg-blue-50"
          />
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-techvaults-gray-200 mb-8">
          <h3 className="text-2xl font-bold text-techvaults-black mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-techvaults-red" />
            Performance by Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(categoryStats).map(([category, stats]) => {
              const percentage = Math.round((stats.correct / stats.total) * 100);
              return (
                <div key={category} className="p-4 border border-techvaults-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-techvaults-black">
                      {category.replace(/_/g, ' ')}
                    </h4>
                    <span className={`font-bold ${getScoreColor(percentage)}`}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-techvaults-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${
                        percentage >= 70 ? 'bg-green-500' : 'bg-techvaults-red'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-techvaults-gray-600">
                    {stats.correct} of {stats.total} correct
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-techvaults-gray-200">
          <h3 className="text-2xl font-bold text-techvaults-black mb-6">
            Question Review
          </h3>
          <div className="space-y-4">
            {answers.map((answer, index) => {
              const isExpanded = expandedQuestions.has(answer.question.id);
              return (
                <div
                  key={answer.id}
                  className={`border-2 rounded-lg overflow-hidden transition-all ${
                    answer.isCorrect
                      ? 'border-green-200 bg-green-50/30'
                      : 'border-red-200 bg-red-50/30'
                  }`}
                >
                  <button
                    onClick={() => toggleQuestion(answer.question.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-white/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {answer.isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                      )}
                      <div className="text-left">
                        <span className="font-semibold text-techvaults-gray-700 mr-2">
                          Question {index + 1}
                        </span>
                        <span className="text-techvaults-gray-900">
                          {answer.question.question}
                        </span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-techvaults-gray-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-techvaults-gray-600 flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-techvaults-gray-200 bg-white">
                      <div className="space-y-3 mb-4">
                        {answer.question.options.map((option) => {
                          const isSelected = answer.selectedAnswers.includes(option.id);
                          const isCorrect = answer.question.correctAnswers.includes(option.id);

                          return (
                            <div
                              key={option.id}
                              className={`p-3 rounded-lg border-2 ${
                                isCorrect
                                  ? 'border-green-500 bg-green-50'
                                  : isSelected
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-techvaults-gray-200 bg-white'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                {isCorrect && (
                                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                )}
                                {isSelected && !isCorrect && (
                                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <span className="font-semibold text-techvaults-gray-700 mr-2">
                                    {option.id.toUpperCase()}.
                                  </span>
                                  <span className="text-techvaults-gray-900">{option.text}</span>
                                  {isCorrect && (
                                    <span className="ml-2 text-xs font-semibold text-green-600">
                                      (Correct Answer)
                                    </span>
                                  )}
                                  {isSelected && !isCorrect && (
                                    <span className="ml-2 text-xs font-semibold text-red-600">
                                      (Your Answer)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-semibold text-blue-900 mb-2">Explanation:</p>
                        <p className="text-sm text-blue-800">{answer.question.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={userRole === 'ADMIN' ? '/admin' : '/dashboard'}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-techvaults-black border-2 border-techvaults-gray-300 rounded-lg font-semibold hover:border-techvaults-red transition-all"
          >
            <Home className="w-5 h-5" />
            {userRole === 'ADMIN' ? 'Back to Admin Panel' : 'Back to Dashboard'}
          </Link>
          {userRole !== 'ADMIN' && !examAttempt.passed && (
            <Link
              href="/exam/start"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
            >
              Try Again
            </Link>
          )}
        </div>
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

function StatCard({
  icon,
  label,
  value,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 border border-techvaults-gray-200 shadow-lg">
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-techvaults-gray-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-techvaults-black">{value}</p>
    </div>
  );
}
