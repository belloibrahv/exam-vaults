'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import {
  ClipboardList,
  Search,
  Filter,
  ArrowLeft,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
} from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface ExamAttempt {
  id: string;
  startedAt: Date;
  completedAt: Date | null;
  timeSpent: number | null;
  score: number | null;
  totalQuestions: number;
  correctAnswers: number | null;
  passed: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
  certification: {
    name: string;
    code: string;
    provider: {
      name: string;
    };
    level: {
      name: string;
    };
  };
  answers: Array<{
    id: string;
    isCorrect: boolean;
  }>;
}

interface ExamsManagementProps {
  examAttempts: ExamAttempt[];
}

export default function ExamsManagement({ examAttempts }: ExamsManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS' | 'PASSED' | 'FAILED'>('ALL');

  const filteredExams = examAttempts.filter((exam) => {
    const matchesSearch =
      exam.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.certification.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'COMPLETED' && exam.completedAt) ||
      (statusFilter === 'IN_PROGRESS' && !exam.completedAt) ||
      (statusFilter === 'PASSED' && exam.passed) ||
      (statusFilter === 'FAILED' && exam.completedAt && !exam.passed);

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: examAttempts.length,
    completed: examAttempts.filter((e) => e.completedAt).length,
    inProgress: examAttempts.filter((e) => !e.completedAt).length,
    passed: examAttempts.filter((e) => e.passed).length,
    failed: examAttempts.filter((e) => e.completedAt && !e.passed).length,
  };

  const handleDeleteExam = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam attempt?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/exams/${examId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to delete exam');
      }
    } catch (error) {
      alert('Error deleting exam');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-techvaults-gray-50 via-white to-techvaults-gray-100">
      {/* Header */}
      <header className="border-b border-techvaults-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="p-2 hover:bg-techvaults-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-techvaults-gray-700" />
              </Link>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-techvaults-black flex items-center gap-2">
                  <ClipboardList className="w-6 h-6 text-techvaults-red" />
                  Exam Attempts
                </h1>
                <p className="text-xs text-techvaults-gray-600">
                  {filteredExams.length} of {examAttempts.length} attempts
                </p>
              </div>
            </div>
            <button className="px-4 py-2 border-2 border-techvaults-gray-300 rounded-lg font-semibold hover:border-techvaults-red transition-all flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-techvaults-gray-200">
            <p className="text-xs text-techvaults-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-techvaults-black">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-techvaults-gray-200">
            <p className="text-xs text-techvaults-gray-600 mb-1">Completed</p>
            <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-techvaults-gray-200">
            <p className="text-xs text-techvaults-gray-600 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-techvaults-gray-200">
            <p className="text-xs text-techvaults-gray-600 mb-1">Passed</p>
            <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-techvaults-gray-200">
            <p className="text-xs text-techvaults-gray-600 mb-1">Failed</p>
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-techvaults-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-techvaults-gray-400" />
              <input
                type="text"
                placeholder="Search by user or certification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-techvaults-gray-300 rounded-lg focus:ring-2 focus:ring-techvaults-red/20 focus:border-techvaults-red outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {(['ALL', 'COMPLETED', 'IN_PROGRESS', 'PASSED', 'FAILED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                    statusFilter === status
                      ? 'bg-techvaults-red text-white'
                      : 'bg-techvaults-gray-100 text-techvaults-gray-700 hover:bg-techvaults-gray-200'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Exams Table */}
        <div className="bg-white rounded-xl shadow-xl border border-techvaults-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-techvaults-gray-50 border-b border-techvaults-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-techvaults-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-techvaults-gray-700 uppercase tracking-wider hidden md:table-cell">
                    Certification
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-techvaults-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    Started
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-techvaults-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-techvaults-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-techvaults-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-techvaults-gray-200">
                {filteredExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-techvaults-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-semibold text-techvaults-black">{exam.user.name}</p>
                        <p className="text-xs text-techvaults-gray-600 truncate max-w-[200px]">
                          {exam.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div>
                        <p className="text-sm font-semibold text-techvaults-black">
                          {exam.certification.code}
                        </p>
                        <p className="text-xs text-techvaults-gray-600">
                          {exam.certification.provider.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-techvaults-gray-600 hidden lg:table-cell">
                      {format(new Date(exam.startedAt), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td className="px-4 py-4">
                      {exam.completedAt ? (
                        <div className="flex items-center gap-2">
                          {exam.passed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span
                            className={`text-sm font-semibold ${
                              exam.passed ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {exam.passed ? 'Passed' : 'Failed'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-yellow-600" />
                          <span className="text-sm font-semibold text-yellow-600">In Progress</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      {exam.completedAt ? (
                        <div>
                          <p className="text-lg font-bold text-techvaults-black">
                            {Math.round(exam.score || 0)}%
                          </p>
                          <p className="text-xs text-techvaults-gray-600">
                            {exam.correctAnswers}/{exam.totalQuestions}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-techvaults-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/exam/results/${exam.id}`}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </Link>
                        <button
                          onClick={() => handleDeleteExam(exam.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete exam"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredExams.length === 0 && (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-techvaults-gray-400 mx-auto mb-3" />
              <p className="text-techvaults-gray-600">No exam attempts found</p>
            </div>
          )}
        </div>
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
