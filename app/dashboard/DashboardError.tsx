import Link from 'next/link';
import { AlertCircle, RefreshCw } from 'lucide-react';
import ExamVaultsLogo from '@/components/ExamVaultsLogo';

export default function DashboardError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-techvaults-gray-50 via-white to-techvaults-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-techvaults-gray-200">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
          </div>

          <ExamVaultsLogo size={40} variant="full" className="justify-center mb-4" />

          <h1 className="text-2xl font-bold text-techvaults-black mb-2">
            Unable to load dashboard
          </h1>

          <p className="text-techvaults-gray-600 mb-6">
            We could not connect to the database. Please try again or contact support if the issue persists.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Link>

            <Link
              href="/auth/signin"
              className="w-full px-6 py-3 bg-white text-techvaults-black border-2 border-techvaults-gray-300 rounded-lg font-semibold hover:border-techvaults-red transition-colors inline-block"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
