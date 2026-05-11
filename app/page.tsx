import Link from 'next/link';
import { ArrowRight, Cloud, Award, TrendingUp, Users, Zap, Shield, Target } from 'lucide-react';
import Image from 'next/image';
import TechvaultsLogo from '@/components/TechvaultsLogo';
import SmoothScroll from '@/components/SmoothScroll';
import { prisma } from '@/lib/prisma';

// Official cloud provider logos
const PROVIDER_LOGOS = {
  AWS: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
  AZURE: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg',
  GCP: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg',
};

export default async function HomePage() {
  // Fetch providers with certification counts
  const providers = await prisma.provider.findMany({
    where: { isActive: true },
    include: {
      certifications: {
        where: { isActive: true },
        select: { id: true },
      },
    },
    orderBy: { order: 'asc' },
  });

  const totalCertifications = providers.reduce((sum, p) => sum + p.certifications.length, 0);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Header */}
        <header className="border-b border-techvaults-gray-200/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
          <div className="container mx-auto px-3 md:px-4 lg:px-8 py-3 md:py-4 flex items-center justify-between gap-2">
            <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity">
              <div className="rounded-xl border border-techvaults-gray-200 bg-white shadow-sm px-3 py-2">
                <Image
                  src="/images/logo.png"
                  alt="Techvaults"
                  width={165}
                  height={42}
                  priority
                  className="h-8 w-auto md:h-9"
                />
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link href="/providers" className="text-sm font-medium text-techvaults-gray-700 hover:text-techvaults-red transition-colors">
                Certifications
              </Link>
              <Link href="#features" className="text-sm font-medium text-techvaults-gray-700 hover:text-techvaults-red transition-colors">
                Features
              </Link>
              <Link href="#providers" className="text-sm font-medium text-techvaults-gray-700 hover:text-techvaults-red transition-colors">
                Providers
              </Link>
            </nav>
            <div className="flex gap-2 md:gap-3">
              <Link
                href="/auth/signin"
                className="px-3 md:px-5 py-2 md:py-2.5 text-sm font-semibold text-techvaults-gray-700 hover:text-techvaults-red transition-colors"
              >
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Login</span>
              </Link>
              <Link
                href="/auth/signup"
                className="px-3 md:px-5 py-2 md:py-2.5 text-sm font-semibold bg-techvaults-red text-white rounded-xl hover:bg-red-700 transition-all hover:shadow-lg hover:shadow-techvaults-red/20 hover:-translate-y-0.5 active:scale-95"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative container mx-auto px-3 md:px-4 lg:px-8 py-10 md:py-14 lg:py-16">
            <div className="max-w-5xl mx-auto text-center relative z-10">
              <div className="hero-title inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-techvaults-red/10 border border-techvaults-red/20 rounded-full mb-6 md:mb-8 backdrop-blur-sm">
                <Cloud className="w-3 h-3 md:w-4 md:h-4 text-techvaults-red" />
                <span className="text-xs md:text-sm font-semibold text-techvaults-red">
                  AWS • Azure • Google Cloud
                </span>
              </div>
              
              <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-techvaults-black mb-4 md:mb-6 leading-tight tracking-tight">
                Master
                <span className="text-techvaults-red"> Multi-Cloud</span>
                <br />
                Certifications
              </h1>
              
              <p className="hero-subtitle text-base sm:text-lg md:text-xl lg:text-2xl text-techvaults-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
                Prepare for {totalCertifications} cloud certifications with our award-winning,
                exam-realistic practice platform designed for Techvaults engineers.
              </p>

              {/* Provider logos */}
              <div className="mb-6 md:mb-8 flex items-center justify-center gap-6 md:gap-10 opacity-85">
                <div className="relative h-10 w-24 md:h-12 md:w-28">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
                    alt="AWS"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="relative h-10 w-24 md:h-12 md:w-28">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg"
                    alt="Microsoft Azure"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="relative h-10 w-24 md:h-12 md:w-28">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg"
                    alt="Google Cloud"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-12 md:mb-16 px-4">
                <Link
                  href="/auth/signup"
                  className="hero-cta group inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-techvaults-red text-white rounded-xl font-semibold hover:bg-red-700 transition-all hover:shadow-2xl hover:shadow-techvaults-red/30 hover:-translate-y-1 active:scale-95 text-base md:text-lg min-h-[48px]"
                >
                  Start Practicing
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/providers"
                  className="hero-cta inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-techvaults-black border-2 border-techvaults-gray-300 rounded-xl font-semibold hover:border-techvaults-red hover:shadow-xl transition-all active:scale-95 text-base md:text-lg min-h-[48px]"
                >
                  Browse Certifications
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 md:gap-6 lg:gap-8 max-w-3xl mx-auto px-4">
                <div className="hero-stats text-center p-3 md:p-4 lg:p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-techvaults-gray-200/50 hover:border-techvaults-red/30 transition-all">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-techvaults-red mb-1 md:mb-2">{totalCertifications}</div>
                  <div className="text-xs md:text-sm font-medium text-techvaults-gray-600">Certifications</div>
                </div>
                <div className="hero-stats text-center p-3 md:p-4 lg:p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-techvaults-gray-200/50 hover:border-techvaults-red/30 transition-all">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-techvaults-red mb-1 md:mb-2">3</div>
                  <div className="text-xs md:text-sm font-medium text-techvaults-gray-600">Cloud Providers</div>
                </div>
                <div className="hero-stats text-center p-3 md:p-4 lg:p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-techvaults-gray-200/50 hover:border-techvaults-red/30 transition-all">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-techvaults-red mb-1 md:mb-2">10K+</div>
                  <div className="text-xs md:text-sm font-medium text-techvaults-gray-600">Questions</div>
                </div>
              </div>
            </div>
        </section>

        {/* Cloud Providers Section */}
        <section id="providers" className="relative container mx-auto px-4 lg:px-8 py-10 md:py-14 lg:py-16">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-4xl md:text-5xl font-bold text-techvaults-black mb-4">
                Choose Your Cloud Path
              </h2>
              <p className="text-xl text-techvaults-gray-600 max-w-2xl mx-auto">
                Practice for certifications across the big 3 cloud providers
              </p>
            </div>
          
          <div className="grid md:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto relative z-10">
            {providers.map((provider) => (
              <div key={provider.id}>
                <Link
                  href={`/providers/${provider.slug}`}
                  className="group block p-6 md:p-7 rounded-3xl bg-white border-2 border-techvaults-gray-200 hover:border-techvaults-red transition-all duration-200 hover:shadow-lg"
                >
                  <div className="flex items-center justify-center mb-6 h-20">
                    <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={PROVIDER_LOGOS[provider.name as keyof typeof PROVIDER_LOGOS]}
                        alt={provider.displayName}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-techvaults-black mb-3 text-center group-hover:text-techvaults-red transition-colors">
                    {provider.displayName}
                  </h3>
                  <p className="text-sm text-techvaults-gray-600 mb-6 text-center line-clamp-2 leading-relaxed">
                    {provider.description.split('.')[0]}
                  </p>
                  <div className="text-center">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-techvaults-red">
                      {provider.certifications.length} Certifications
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative container mx-auto px-3 md:px-4 lg:px-8 py-10 md:py-14 lg:py-16">
            <div className="text-center mb-8 md:mb-10 px-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-techvaults-black mb-3 md:mb-4">
                Why Choose Techvaults?
              </h2>
              <p className="text-base md:text-xl text-techvaults-gray-600 max-w-2xl mx-auto">
                Award-winning platform designed for serious cloud engineers
              </p>
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
            {[
              {
                icon: <Award className="w-8 h-8 text-techvaults-red" />,
                title: 'Realistic Exams',
                description: 'Practice with questions that mirror actual certification exams across all levels.',
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-techvaults-red" />,
                title: 'Track Progress',
                description: 'Monitor your performance across multiple certifications and identify weak areas.',
              },
              {
                icon: <Cloud className="w-8 h-8 text-techvaults-red" />,
                title: 'Multi-Cloud Coverage',
                description: 'Prepare for AWS, Azure, and GCP certifications all in one platform.',
              },
              {
                icon: <Users className="w-8 h-8 text-techvaults-red" />,
                title: 'Expert Content',
                description: 'Questions based on actual exam content and real-world scenarios.',
              },
              {
                icon: <Zap className="w-8 h-8 text-techvaults-red" />,
                title: 'Instant Feedback',
                description: 'Get immediate results with detailed explanations for every question.',
              },
              {
                icon: <Shield className="w-8 h-8 text-techvaults-red" />,
                title: 'Secure Platform',
                description: 'Enterprise-grade security with encrypted data and secure authentication.',
              },
              {
                icon: <Target className="w-8 h-8 text-techvaults-red" />,
                title: 'Adaptive Learning',
                description: 'Smart algorithms identify your weak areas and recommend focused practice.',
              },
              {
                icon: <Award className="w-8 h-8 text-techvaults-red" />,
                title: 'Certification Paths',
                description: 'Follow guided learning paths from foundational to professional levels.',
              },
            ].map((feature, index) => (
              <div key={index}>
                <div className="p-6 rounded-2xl bg-white border border-techvaults-gray-200 hover:border-techvaults-red transition-all hover:shadow-xl group h-full">
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-techvaults-black mb-2">{feature.title}</h3>
                  <p className="text-sm text-techvaults-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative container mx-auto px-4 lg:px-8 py-10 md:py-14 lg:py-16">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-techvaults-red via-red-600 to-red-700 rounded-3xl p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                  Ready to Get Certified?
                </h2>
                <p className="text-xl mb-8 text-red-50 text-center max-w-2xl mx-auto">
                  Join your fellow Techvaults engineers in preparing for cloud certifications.
                  Start your journey today.
                </p>
                <div className="flex justify-center">
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-techvaults-red rounded-xl font-bold hover:bg-techvaults-gray-50 transition-all hover:scale-105 hover:shadow-2xl text-lg"
                  >
                    Create Your Account
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-techvaults-gray-200 bg-white/80 backdrop-blur-xl relative z-10">
          <div className="container mx-auto px-4 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <TechvaultsLogo size={40} variant="icon" />
                <div>
                  <div className="font-bold text-techvaults-black">Techvaults</div>
                  <div className="text-xs text-techvaults-gray-600">Multi-Cloud Certification Prep</div>
                </div>
              </div>
              <p className="text-sm text-techvaults-gray-600">
                © 2026 Techvaults Limited. All rights reserved. Internal use only.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}
