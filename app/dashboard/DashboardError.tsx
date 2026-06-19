import Link from 'next/link';
import { AlertCircle, RefreshCw, Database, Lock, Settings } from 'lucide-react';
import ExamVaultsLogo from '@/components/ExamVaultsLogo';

interface DashboardErrorProps {
  type?: 'connection' | 'permission' | 'schema' | 'general';
  errorDetails?: string;
}

export default function DashboardError({ type = 'general', errorDetails }: DashboardErrorProps) {
  const getErrorConfig = () => {
    switch (type) {
      case 'connection':
        return {
          icon: Database,
          title: 'Connection Issue',
          message: 'We are experiencing connectivity issues. Please check your internet connection and try again.',
          iconColor: 'text-red-600',
          bgColor: 'bg-red-100',
          showRetry: true,
        };
      case 'permission':
        return {
          icon: Lock,
          title: 'Access Denied',
          message: 'You do not have permission to access this resource. Please contact your administrator.',
          iconColor: 'text-orange-600',
          bgColor: 'bg-orange-100',
          showRetry: false,
        };
      case 'schema':
        return {
          icon: Settings,
          title: 'System Update in Progress',
          message: 'Our system is currently being updated. Please try again in a few minutes.',
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-100',
          showRetry: true,
        };
      default:
        return {
          icon: AlertCircle,
          title: 'Unable to Load Dashboard',
          message: 'We encountered an unexpected issue. Please try again or contact support if the problem persists.',
          iconColor: 'text-amber-600',
          bgColor: 'bg-amber-100',
          showRetry: true,
        };
    }
  };

  const config = getErrorConfig();
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-techvaults-gray-50 via-white to-techvaults-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-techvaults-gray-200">
          <div className="flex justify-center mb-6">
            <div className={`w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center`}>
              <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
            </div>
          </div>

          <ExamVaultsLogo size={40} variant="full" className="justify-center mb-4" />

          <h1 className="text-2xl font-bold text-techvaults-black mb-2">
            {config.title}
          </h1>

          <p className="text-techvaults-gray-600 mb-6">
            {config.message}
          </p>

          {process.env.NODE_ENV === 'development' && errorDetails && (
            <div className="mb-6 p-3 bg-techvaults-gray-100 rounded-lg">
              <p className="text-xs text-techvaults-gray-700 font-mono">
                {errorDetails}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {config.showRetry && (
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            )}

            <Link
              href="/auth/signin"
              className="w-full px-6 py-3 bg-white text-techvaults-black border-2 border-techvaults-gray-300 rounded-lg font-semibold hover:border-techvaults-red transition-colors inline-block"
            >
              Back to Sign In
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
  );
}
