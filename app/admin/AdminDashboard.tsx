'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import {
  Users,
  FileQuestion,
  ClipboardList,
  Award,
  TrendingUp,
  Activity,
  Settings,
  LogOut,
  Shield,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';

interface AdminDashboardProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  stats: {
    totalUsers: number;
    totalQuestions: number;
    totalExamAttempts: number;
    totalCertifications: number;
    passRate: number;
    avgScore: number;
    completedExams: number;
    activeUsers: number;
  };
  recentUsers: any[];
  recentExamAttempts: any[];
  questionsByProvider: any[];
  usersByRole: any[];
}

export default function AdminDashboard({
  user,
  stats,
  recentUsers,
  recentExamAttempts,
  questionsByProvider,
  usersByRole,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'exams' | 'questions'>('overview');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" />, href: '/admin/users' },
    { id: 'exams', label: 'Exams', icon: <ClipboardList className="w-5 h-5" />, href: '/admin/exams' },
    { id: 'questions', label: 'Questions', icon: <FileQuestion className="w-5 h-5" />, href: '/admin/questions' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-techvaults-gray-50 via-white to-techvaults-gray-100">
      {/* Header */}
      <header className="border-b border-techvaults-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4 flex items-center justify-between gap-2">
          <Link href="/admin" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
            <Shield className="w-8 h-8 text-techvaults-red" />
            <div>
              <h1 className="text-lg md:text-xl font-bold text-techvaults-black">Admin Panel</h1>
              <p className="text-xs text-techvaults-gray-600">System Management</p>
            </div>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-techvaults-black">{user.name}</p>
              <p className="text-xs text-techvaults-red font-semibold">Administrator</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="p-2 text-techvaults-gray-600 hover:text-techvaults-red transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* Navigation Tabs */}
        <div className="mb-6 md:mb-8 flex flex-wrap gap-2 md:gap-3 bg-white rounded-xl p-2 shadow-sm border border-techvaults-gray-200">
          {navItems.map((item) => (
            item.href ? (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-techvaults-gray-700 hover:bg-techvaults-gray-100 transition-all"
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ) : (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === item.id
                    ? 'bg-techvaults-red text-white'
                    : 'text-techvaults-gray-700 hover:bg-techvaults-gray-100'
                }`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            )
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <StatCard
            icon={<Users className="w-6 h-6 text-blue-600" />}
            label="Total Users"
            value={stats.totalUsers}
            bgColor="bg-blue-50"
            trend="+12%"
          />
          <StatCard
            icon={<FileQuestion className="w-6 h-6 text-purple-600" />}
            label="Questions"
            value={stats.totalQuestions}
            bgColor="bg-purple-50"
          />
          <StatCard
            icon={<ClipboardList className="w-6 h-6 text-green-600" />}
            label="Exam Attempts"
            value={stats.totalExamAttempts}
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<Award className="w-6 h-6 text-techvaults-red" />}
            label="Certifications"
            value={stats.totalCertifications}
            bgColor="bg-red-50"
          />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <MetricCard
            icon={<TrendingUp className="w-5 h-5 text-green-600" />}
            label="Pass Rate"
            value={`${stats.passRate}%`}
            color="text-green-600"
          />
          <MetricCard
            icon={<Activity className="w-5 h-5 text-blue-600" />}
            label="Avg Score"
            value={`${stats.avgScore}%`}
            color="text-blue-600"
          />
          <MetricCard
            icon={<CheckCircle className="w-5 h-5 text-purple-600" />}
            label="Completed"
            value={stats.completedExams}
            color="text-purple-600"
          />
          <MetricCard
            icon={<Users className="w-5 h-5 text-orange-600" />}
            label="Active Users"
            value={stats.activeUsers}
            color="text-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-techvaults-gray-200">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold text-techvaults-black flex items-center gap-2">
                <Users className="w-5 h-5 text-techvaults-red" />
                Recent Users
              </h3>
              <Link
                href="/admin/users"
                className="text-sm font-semibold text-techvaults-red hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentUsers.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border border-techvaults-gray-200 rounded-lg hover:border-techvaults-red transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-techvaults-black truncate">{user.name}</p>
                    <p className="text-xs text-techvaults-gray-600 truncate">{user.email}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        user.role === 'ADMIN'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {user.role}
                    </span>
                    <p className="text-xs text-techvaults-gray-500 mt-1">
                      {user._count.examAttempts} attempts
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Exam Attempts */}
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-techvaults-gray-200">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold text-techvaults-black flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-techvaults-red" />
                Recent Exams
              </h3>
              <Link
                href="/admin/exams"
                className="text-sm font-semibold text-techvaults-red hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentExamAttempts.slice(0, 5).map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between p-3 border border-techvaults-gray-200 rounded-lg hover:border-techvaults-red transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-techvaults-black truncate">
                      {attempt.user.name}
                    </p>
                    <p className="text-xs text-techvaults-gray-600 truncate">
                      {attempt.certification.name}
                    </p>
                    <p className="text-xs text-techvaults-gray-500">
                      {format(new Date(attempt.startedAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    {attempt.completedAt ? (
                      <>
                        <p
                          className={`text-lg font-bold ${
                            attempt.passed ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {Math.round(attempt.score || 0)}%
                        </p>
                        {attempt.passed ? (
                          <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600 mx-auto" />
                        )}
                      </>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Questions by Provider */}
        <div className="mt-6 md:mt-8 bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-techvaults-gray-200">
          <h3 className="text-lg md:text-xl font-bold text-techvaults-black mb-4 md:mb-6 flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-techvaults-red" />
            Questions by Provider
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {questionsByProvider.map((provider) => {
              const totalQuestions = provider.certifications.reduce(
                (sum: number, cert: any) => sum + cert._count.questions,
                0
              );
              return (
                <div
                  key={provider.id}
                  className="p-4 border-2 border-techvaults-gray-200 rounded-xl hover:border-techvaults-red transition-all"
                >
                  <h4 className="text-lg font-bold text-techvaults-black mb-2">{provider.name}</h4>
                  <p className="text-3xl font-bold text-techvaults-red mb-2">{totalQuestions}</p>
                  <p className="text-sm text-techvaults-gray-600">
                    {provider.certifications.length} certifications
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Link
            href="/admin/users"
            className="p-4 md:p-6 bg-white border-2 border-techvaults-gray-200 rounded-xl hover:border-techvaults-red hover:shadow-lg transition-all text-center group"
          >
            <Users className="w-8 h-8 md:w-10 md:h-10 text-techvaults-red mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm md:text-base font-semibold text-techvaults-black">Manage Users</p>
          </Link>
          <Link
            href="/admin/questions"
            className="p-4 md:p-6 bg-white border-2 border-techvaults-gray-200 rounded-xl hover:border-techvaults-red hover:shadow-lg transition-all text-center group"
          >
            <FileQuestion className="w-8 h-8 md:w-10 md:h-10 text-techvaults-red mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm md:text-base font-semibold text-techvaults-black">Manage Questions</p>
          </Link>
          <Link
            href="/admin/exams"
            className="p-4 md:p-6 bg-white border-2 border-techvaults-gray-200 rounded-xl hover:border-techvaults-red hover:shadow-lg transition-all text-center group"
          >
            <ClipboardList className="w-8 h-8 md:w-10 md:h-10 text-techvaults-red mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm md:text-base font-semibold text-techvaults-black">View Exams</p>
          </Link>
          <Link
            href="/admin/settings"
            className="p-4 md:p-6 bg-white border-2 border-techvaults-gray-200 rounded-xl hover:border-techvaults-red hover:shadow-lg transition-all text-center group"
          >
            <Settings className="w-8 h-8 md:w-10 md:h-10 text-techvaults-red mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm md:text-base font-semibold text-techvaults-black">Settings</p>
          </Link>
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

function StatCard({
  icon,
  label,
  value,
  bgColor,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  bgColor: string;
  trend?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 md:p-6 border border-techvaults-gray-200 hover:shadow-lg transition-all">
      <div className={`w-10 h-10 md:w-12 md:h-12 ${bgColor} rounded-lg flex items-center justify-center mb-3 md:mb-4`}>
        {icon}
      </div>
      <p className="text-xs md:text-sm text-techvaults-gray-600 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl md:text-3xl font-bold text-techvaults-black">{value}</p>
        {trend && (
          <span className="text-xs font-semibold text-green-600">{trend}</span>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 border border-techvaults-gray-200 hover:shadow-lg transition-all">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-xs md:text-sm text-techvaults-gray-600">{label}</p>
      </div>
      <p className={`text-xl md:text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
