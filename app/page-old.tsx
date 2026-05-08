import Link from 'next/link';
import { ArrowRight, Cloud, Award, TrendingUp, Users } from 'lucide-react';
import TechvaultsLogo from '@/components/TechvaultsLogo';
import { getHomeProviders } from '@/lib/provider-catalog';

export default async function HomePage() {
  const providers = await getHomeProviders();
  const hasProviderCatalog = providers.length > 0;
  const totalCertifications = providers.reduce((sum, p) => sum + p.certifications.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-techvaults-gray-50 via-white to-techvaults-gray-100">
      {/* Header */}
      <header className="border-b border-techvaults-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TechvaultsLogo size={40} />
            <div>
              <h1 className="text-xl font-bold text-techvaults-black">Techvaults</h1>
              <p className="text-xs text-techvaults-gray-600">Multi-Cloud Certification Prep</p>
            </div>
          </div>
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-techvaults-red/10 border border-techvaults-red/20 rounded-full mb-6">
            <Cloud className="w-4 h-4 text-techvaults-red" />
            <span className="text-sm font-medium text-techvaults-red">
              {hasProviderCatalog ? 'AWS • Azure • Google Cloud' : 'Google Cloud Digital Leader'}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-techvaults-black mb-6 leading-tight">
            Master
            <span className="text-techvaults-red">
              {hasProviderCatalog ? ' Multi-Cloud' : ' Your GCDL'}
            </span>
            <br />
            {hasProviderCatalog ? 'Certifications' : ' Exam'}
          </h1>
          
          <p className="text-xl text-techvaults-gray-600 mb-8 max-w-2xl mx-auto">
            {hasProviderCatalog
              ? `Prepare for ${totalCertifications} cloud certifications across AWS, Azure, and GCP with our comprehensive, exam-realistic practice system designed for Techvaults engineers.`
              : 'Prepare for your Google Cloud Digital Leader certification with our comprehensive, exam-realistic practice system designed for Techvaults engineers.'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-all hover:scale-105 shadow-lg"
            >
              Start Practicing
              <ArrowRight className="w-5 h-5" />
            </Link>
            {hasProviderCatalog ? (
              <Link
                href="/providers"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-techvaults-black border-2 border-techvaults-gray-300 rounded-lg font-semibold hover:border-techvaults-red transition-all"
              >
                Browse Certifications
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-techvaults-black border-2 border-techvaults-gray-300 rounded-lg font-semibold hover:border-techvaults-red transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <StatCard
              number={hasProviderCatalog ? totalCertifications.toString() : '56'}
              label={hasProviderCatalog ? 'Certifications' : 'Practice Questions'}
            />
            <StatCard number={hasProviderCatalog ? '3' : '4'} label={hasProviderCatalog ? 'Cloud Providers' : 'Exam Domains'} />
            <StatCard number="500+" label="Practice Questions" />
          </div>
        </div>
      </section>

      {/* Cloud Providers */}
      {hasProviderCatalog && (
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center text-techvaults-black mb-4">
            Choose Your Cloud Path
          </h2>
          <p className="text-center text-techvaults-gray-600 mb-12 max-w-2xl mx-auto">
            Practice for certifications across the big 3 cloud providers
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {providers.map((provider) => (
              <ProviderCard
                key={provider.id}
                name={provider.displayName}
                slug={provider.slug}
                certCount={provider.certifications.length}
                color={provider.color}
                description={provider.description.split('.')[0]}
              />
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="container mx-auto px-4 py-20 bg-white rounded-2xl shadow-xl my-12">
        <h2 className="text-3xl font-bold text-center text-techvaults-black mb-12">
          Why Choose Techvaults Exam Prep?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Award className="w-8 h-8 text-techvaults-red" />}
            title="Realistic Exams"
            description="Practice with questions that mirror actual certification exams across all levels."
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8 text-techvaults-red" />}
            title="Track Progress"
            description="Monitor your performance across multiple certifications and identify weak areas."
          />
          <FeatureCard
            icon={<Cloud className="w-8 h-8 text-techvaults-red" />}
            title={hasProviderCatalog ? 'Multi-Cloud Coverage' : 'Focused Preparation'}
            description={
              hasProviderCatalog
                ? 'Prepare for AWS, Azure, and GCP certifications all in one platform.'
                : 'Train specifically for the Google Cloud Digital Leader exam with realistic practice.'
            }
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-techvaults-red" />}
            title="Expert Content"
            description="Questions based on actual exam content and real-world scenarios."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-techvaults-red to-red-700 rounded-2xl p-12 text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Certified?</h2>
          <p className="text-lg mb-8 text-red-50">
            Join your fellow Techvaults engineers in preparing for cloud certifications.
            Start your journey today.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-techvaults-red rounded-lg font-semibold hover:bg-techvaults-gray-50 transition-all hover:scale-105"
          >
            Create Your Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

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

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-techvaults-red mb-1">{number}</div>
      <div className="text-sm text-techvaults-gray-600">{label}</div>
    </div>
  );
}

function ProviderCard({
  name,
  slug,
  certCount,
  color,
  description,
}: {
  name: string;
  slug: string;
  certCount: number;
  color: string;
  description: string;
}) {
  return (
    <Link
      href={`/providers/${slug}`}
      className="group bg-white p-8 rounded-xl border-2 border-techvaults-gray-200 hover:border-techvaults-red transition-all hover:shadow-xl"
    >
      <div className="flex items-center justify-center mb-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {name.charAt(0)}
        </div>
      </div>
      <h3 className="text-xl font-bold text-techvaults-black mb-2 text-center group-hover:text-techvaults-red transition-colors">
        {name}
      </h3>
      <p className="text-sm text-techvaults-gray-600 mb-4 text-center line-clamp-2">
        {description}
      </p>
      <div className="text-center">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-techvaults-red">
          {certCount} Certifications
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-techvaults-gray-200 hover:border-techvaults-red transition-all hover:shadow-lg group">
      <div className="mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-lg font-semibold text-techvaults-black mb-2">{title}</h3>
      <p className="text-sm text-techvaults-gray-600">{description}</p>
    </div>
  );
}
