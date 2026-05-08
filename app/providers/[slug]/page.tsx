import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, FileText, Award } from 'lucide-react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import TechvaultsLogo from '@/components/TechvaultsLogo';

export default async function ProviderPage({ params }: { params: { slug: string } }) {
  const provider = await prisma.provider.findUnique({
    where: { slug: params.slug, isActive: true },
    include: {
      certifications: {
        where: { isActive: true },
        include: {
          level: true,
          _count: {
            select: { questions: true },
          },
        },
        orderBy: [
          { level: { order: 'asc' } },
          { order: 'asc' },
        ],
      },
    },
  });

  if (!provider) {
    notFound();
  }

  // Group certifications by level
  const certsByLevel = provider.certifications.reduce((acc, cert) => {
    const levelName = cert.level.name;
    if (!acc[levelName]) {
      acc[levelName] = {
        displayName: cert.level.displayName,
        color: cert.level.color,
        order: cert.level.order,
        certs: [],
      };
    }
    acc[levelName].certs.push(cert);
    return acc;
  }, {} as Record<string, { displayName: string; color: string; order: number; certs: typeof provider.certifications }>);

  const sortedLevels = Object.entries(certsByLevel).sort(([, a], [, b]) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gradient-to-br from-techvaults-gray-50 via-white to-techvaults-gray-100">
      {/* Header */}
      <header className="border-b border-techvaults-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <TechvaultsLogo size={40} />
            <div>
              <h1 className="text-xl font-bold text-techvaults-black">Techvaults</h1>
              <p className="text-xs text-techvaults-gray-600">Multi-Cloud Certification Prep</p>
            </div>
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
          href="/providers"
          className="inline-flex items-center gap-2 text-techvaults-gray-600 hover:text-techvaults-red transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Providers
        </Link>

        {/* Provider Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-techvaults-gray-200">
          <div className="flex items-center gap-6 mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white"
              style={{ backgroundColor: provider.color }}
            >
              {provider.displayName.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-techvaults-black mb-2">{provider.displayName}</h1>
              <p className="text-lg text-techvaults-gray-600">{provider.certifications.length} certifications available</p>
            </div>
          </div>
          <p className="text-techvaults-gray-700 leading-relaxed">{provider.description}</p>
          <a
            href={provider.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-techvaults-red hover:underline"
          >
            Visit Official Certification Page
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Certifications by Level */}
        <div className="space-y-12">
          {sortedLevels.map(([levelName, levelData]) => (
            <div key={levelName}>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: levelData.color }}
                />
                <h2 className="text-2xl font-bold text-techvaults-black">
                  {levelData.displayName} Level
                </h2>
                <span className="text-sm text-techvaults-gray-500">
                  ({levelData.certs.length} {levelData.certs.length === 1 ? 'certification' : 'certifications'})
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {levelData.certs.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-white rounded-xl shadow-md border border-techvaults-gray-200 hover:border-techvaults-red hover:shadow-xl transition-all p-6 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-techvaults-black group-hover:text-techvaults-red transition-colors mb-1">
                          {cert.name}
                        </h3>
                        <p className="text-sm text-techvaults-gray-500">{cert.code}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: cert.difficulty }).map((_, i) => (
                          <span key={i} className="text-yellow-500">⭐</span>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-techvaults-gray-700 mb-4 line-clamp-3">
                      {cert.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-techvaults-gray-200">
                      <div className="text-center">
                        <FileText className="w-5 h-5 text-techvaults-gray-400 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-techvaults-black">{cert.questionCount}</div>
                        <div className="text-xs text-techvaults-gray-500">Questions</div>
                      </div>
                      <div className="text-center">
                        <Clock className="w-5 h-5 text-techvaults-gray-400 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-techvaults-black">{cert.examDuration} min</div>
                        <div className="text-xs text-techvaults-gray-500">Duration</div>
                      </div>
                      <div className="text-center">
                        <Award className="w-5 h-5 text-techvaults-gray-400 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-techvaults-black">{cert.passingScore}%</div>
                        <div className="text-xs text-techvaults-gray-500">Pass Score</div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-2 mb-4">
                      {cert.recommendedExp && (
                        <div className="text-xs text-techvaults-gray-600">
                          <span className="font-semibold">Experience:</span> {cert.recommendedExp}
                        </div>
                      )}
                      {cert.examCost && (
                        <div className="text-xs text-techvaults-gray-600">
                          <span className="font-semibold">Exam Cost:</span> ${cert.examCost}
                        </div>
                      )}
                      <div className="text-xs text-techvaults-gray-600">
                        <span className="font-semibold">Practice Questions:</span> {cert._count.questions} available
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/auth/signup`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      Start Practicing
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
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
