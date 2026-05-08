import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import TechvaultsLogo from '@/components/TechvaultsLogo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-techvaults-gray-50 via-white to-techvaults-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-techvaults-gray-200">
          <div className="flex justify-center mb-6">
            <TechvaultsLogo size={60} variant="icon" />
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-techvaults-gray-100 rounded-full flex items-center justify-center">
              <FileQuestion className="w-8 h-8 text-techvaults-gray-600" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-techvaults-red mb-2">404</h1>
          
          <h2 className="text-2xl font-bold text-techvaults-black mb-2">
            Page Not Found
          </h2>
          
          <p className="text-techvaults-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
