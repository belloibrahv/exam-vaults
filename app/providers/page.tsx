import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import TechvaultsLogo from '@/components/TechvaultsLogo';
import { getCatalogProviders } from '@/lib/provider-catalog';

export default async function ProvidersPage() {
  const providers = await getCatalogProviders();

  return (
    <div className="min-h-screen bg-gradient-to-br from-techvaults-gray-50 via-white to-techvaults-gray-100">
      {/* Header */}
      <header className="border-b border-techvaults-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <TechvaultsLogo size={45} variant="full" />
          </Link>
          <div className="flex gap-3">
            <Link
              href="/auth/signin"
              className="px-4 py-2 text-sm font-medium text-techvaults-gray-700 hover:text-techvaults-red transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 text-sm font-medium bg-techvaults-red text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-techvaults-gray-600 hover:text-techvaults-red transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-techvaults-black mb-4">
          Cloud Certification Providers
        </h1>
        <p className="text-lg text-techvaults-gray-600 mb-12 max-w-3xl">
          Choose a cloud provider to explore available certifications and start your preparation journey.
        </p>

        {providers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-techvaults-gray-200">
            <h2 className="text-2xl font-bold text-techvaults-black mb-3">
              Certification Catalog Unavailable
            </h2>
            <p className="text-techvaults-gray-600 mb-6">
              The multi-cloud provider catalog is not ready in this environment yet. Apply the Prisma schema changes,
              regenerate the Prisma client, and seed the provider data before using this section.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Return Home
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
          {providers.map((provider) => (
            <div key={provider.id} className="bg-white rounded-2xl shadow-lg p-8 border border-techvaults-gray-200">
              {/* Provider Header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-techvaults-gray-200">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: provider.color }}
                >
                  {provider.displayName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-techvaults-black">{provider.displayName}</h2>
                  <p className="text-sm text-techvaults-gray-600 mt-1">
                    {provider.certifications.length} certifications available
                  </p>
                </div>
                <Link
                  href={`/providers/${provider.slug}`}
                  className="px-6 py-3 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors inline-flex items-center gap-2"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Certifications by Level */}
              <div className="space-y-6">
                {Object.entries(
                  provider.certifications.reduce((acc, cert) => {
                    const levelName = cert.level.displayName;
                    if (!acc[levelName]) acc[levelName] = [];
                    acc[levelName].push(cert);
                    return acc;
                  }, {} as Record<string, typeof provider.certifications>)
                ).map(([levelName, certs]) => (
                  <div key={levelName}>
                    <h3 className="text-sm font-semibold text-techvaults-gray-500 uppercase tracking-wide mb-3">
                      {levelName}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {certs.slice(0, 4).map((cert) => (
                        <Link
                          key={cert.id}
                          href={`/providers/${provider.slug}/${cert.slug}`}
                          className="p-4 border border-techvaults-gray-200 rounded-lg hover:border-techvaults-red hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-techvaults-black group-hover:text-techvaults-red transition-colors">
                              {cert.name}
                            </h4>
                            <span className="text-xs text-techvaults-gray-500">
                              {'⭐'.repeat(cert.difficulty)}
                            </span>
                          </div>
                          <p className="text-sm text-techvaults-gray-600 line-clamp-2 mb-2">
                            {cert.description.split('.')[0]}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-techvaults-gray-500">
                            <span>{cert.questionCount} questions</span>
                            <span>•</span>
                            <span>{cert.examDuration} min</span>
                            <span>•</span>
                            <span>{cert.passingScore}% to pass</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-techvaults-gray-200 bg-white mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-techvaults-gray-600">
          <p className="text-sm">
            © 2026 Techvaults Limited. All rights reserved. Internal use only.
          </p>
        </div>
      </footer>
    </div>
  );
}
