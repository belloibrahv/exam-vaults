'use client';

import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import ExamVaultsLogo from '@/components/ExamVaultsLogo';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDatabaseError = error.message.includes('database') || 
                         error.message.includes('Prisma') ||
                         error.message.includes('connection') ||
                         error.digest?.includes('PRISMA');

  const isAuthError = error.message.includes('auth') || 
                     error.message.includes('session') ||
                     error.message.includes('unauthorized');

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-techvaults-gray-50 via-white to-techvaults-gray-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-techvaults-gray-200">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>

              <ExamVaultsLogo size={40} variant="full" className="justify-center mb-4" />

              <h1 className="text-2xl font-bold text-techvaults-black mb-2">
                {isDatabaseError ? 'Service Temporarily Unavailable' :
                 isAuthError ? 'Authentication Required' : 
                 'Something Went Wrong'}
              </h1>

              <p className="text-techvaults-gray-600 mb-6">
                {isDatabaseError ? 
                  'Our services are temporarily unavailable. We are working to resolve this issue.' :
                 isAuthError ?
                  'Your session has expired or you need to sign in to continue.' :
                  'An unexpected error occurred. Please try refreshing the page or contact support if the issue persists.'}
              </p>

              {process.env.NODE_ENV === 'development' && (
                <div className="mb-6 p-3 bg-techvaults-gray-100 rounded-lg text-left">
                  <p className="text-xs text-techvaults-gray-700 font-mono break-words">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-techvaults-gray-500 font-mono mt-1">
                      Digest: {error.digest}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={reset}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>

                <Link
                  href={isAuthError ? '/auth/signin' : '/'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-techvaults-gray-300 text-techvaults-gray-700 rounded-lg font-medium hover:bg-techvaults-gray-50 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  {isAuthError ? 'Sign In' : 'Go Home'}
                </Link>

                <Link
                  href="mailto:support@techvaults.com"
                  className="text-sm text-techvaults-gray-500 hover:text-techvaults-red transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}