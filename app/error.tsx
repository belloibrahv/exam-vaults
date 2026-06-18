'use client';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('[ErrorBoundary]', error.message, error.digest || '');
  return (
    <div className="min-h-screen bg-gradient-to-br from-techvaults-gray-50 via-white to-techvaults-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-techvaults-gray-200">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-techvaults-red" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-techvaults-black mb-2">
            Something went wrong
          </h1>
          
          <p className="text-techvaults-gray-600 mb-6">
            We encountered an error while processing your request.
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={reset}
              className="w-full px-6 py-3 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            
            <Link
              href="/"
              className="w-full px-6 py-3 bg-white text-techvaults-black border-2 border-techvaults-gray-300 rounded-lg font-semibold hover:border-techvaults-red transition-colors inline-block"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
