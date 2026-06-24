'use client';

import { useState, ReactNode } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  LogOut,
  Trophy,
  Shield,
  Home,
  ChevronRight
} from 'lucide-react';
import ExamVaultsLogo from '@/components/ExamVaultsLogo';
import MiniGamificationStatus from '@/components/gamification/MiniGamificationStatus';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';

interface DashboardLayoutProps {
  children: ReactNode;
  user: {
    name: string;
    email: string;
    role: string;
  };
  currentPage?: string;
  fullWidth?: boolean;
}

export default function DashboardLayout({ 
  children, 
  user, 
  currentPage,
  fullWidth = false 
}: DashboardLayoutProps) {
  const [showGamification, setShowGamification] = useState(false);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-techvaults-gray-50 via-white to-techvaults-gray-100 ${fullWidth ? '' : 'max-w-none'}`}>
      {/* Header */}
      <header className="border-b border-techvaults-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center hover:opacity-95 transition-opacity">
              <ExamVaultsLogo size={36} variant="full" />
            </Link>
            
            {/* Breadcrumb */}
            {currentPage && (
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <Home className="w-4 h-4" />
                <Link href="/dashboard" className="hover:text-techvaults-red transition-colors">
                  Dashboard
                </Link>
                {currentPage !== 'Dashboard' && (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-techvaults-red font-medium">{currentPage}</span>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Mini Gamification Status */}
          <div className="hidden lg:block">
            <MiniGamificationStatus />
          </div>

          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <Link
              href="/dashboard/learning"
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
              title="Learning Center"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Learning</span>
            </Link>
            
            <button
              onClick={() => setShowGamification(true)}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-all flex items-center gap-2"
              title="Progress & Achievements"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Progress</span>
            </button>
            
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

      {/* Main Content */}
      <main className={fullWidth ? '' : 'container mx-auto'}>
        {children}
      </main>

      {/* Footer */}
      {!fullWidth && (
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
      )}
      
      {/* Gamification Dashboard */}
      <GamificationDashboard 
        isOpen={showGamification}
        onClose={() => setShowGamification(false)}
      />
    </div>
  );
}