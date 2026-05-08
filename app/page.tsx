import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Award, Shield } from 'lucide-react';
import TechvaultsLogo from '@/components/TechvaultsLogo';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-techvaults-gray-50 via-white to-techvaults-gray-100">
      {/* Header */}
      <header className="border-b border-techvaults-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TechvaultsLogo size={40} />
            <div>
              <h1 className="text-xl font-bold text-techvaults-black">Techvaults</h1>
              <p className="text-xs text-techvaults-gray-600">Exam Preparation System</p>
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
            <Award className="w-4 h-4 text-techvaults-red" />
            <span className="text-sm font-medium text-techvaults-red">
              Google Cloud Digital Leader Certification
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-techvaults-black mb-6 leading-tight">
            Master Your
            <span className="text-techvaults-red"> GCDL Exam</span>
            <br />
            With Confidence
          </h1>
          
          <p className="text-xl text-techvaults-gray-600 mb-8 max-w-2xl mx-auto">
            Prepare for your Google Cloud Digital Leader certification with our comprehensive,
            exam-realistic practice system designed exclusively for Techvaults engineers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-all hover:scale-105 shadow-lg"
            >
              Start Practicing
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-techvaults-black border-2 border-techvaults-gray-300 rounded-lg font-semibold hover:border-techvaults-red transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<BookOpen className="w-8 h-8 text-techvaults-red" />}
            title="Realistic Exam Format"
            description="Practice with 50-60 questions that mirror the actual GCDL certification exam format."
          />
          <FeatureCard
            icon={<Clock className="w-8 h-8 text-techvaults-red" />}
            title="90-Minute Sessions"
            description="Experience real exam conditions with timed 90-minute practice sessions."
          />
          <FeatureCard
            icon={<Award className="w-8 h-8 text-techvaults-red" />}
            title="Instant Scoring"
            description="Get immediate feedback with detailed explanations for every question."
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-techvaults-red" />}
            title="Smart Restrictions"
            description="2-hour cooldown after failed attempts ensures proper preparation time."
          />
        </div>
      </section>

      {/* Exam Topics */}
      <section className="container mx-auto px-4 py-20 bg-white rounded-2xl shadow-xl my-12">
        <h2 className="text-3xl font-bold text-center text-techvaults-black mb-12">
          Comprehensive Coverage
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <TopicCard
            title="Digital Transformation"
            description="Cloud concepts, business value, and transformation strategies"
            percentage="25%"
          />
          <TopicCard
            title="Data & AI/ML"
            description="Data management, analytics, and machine learning solutions"
            percentage="25%"
          />
          <TopicCard
            title="Infrastructure Modernization"
            description="Compute, storage, networking, and application deployment"
            percentage="25%"
          />
          <TopicCard
            title="Security & Operations"
            description="IAM, compliance, monitoring, and operational excellence"
            percentage="25%"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-techvaults-red to-red-700 rounded-2xl p-12 text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Certified?</h2>
          <p className="text-lg mb-8 text-red-50">
            Join your fellow Techvaults engineers in preparing for the GCDL certification.
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

function TopicCard({
  title,
  description,
  percentage,
}: {
  title: string;
  description: string;
  percentage: string;
}) {
  return (
    <div className="p-6 border-l-4 border-techvaults-red bg-techvaults-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-techvaults-black">{title}</h3>
        <span className="text-sm font-bold text-techvaults-red">{percentage}</span>
      </div>
      <p className="text-sm text-techvaults-gray-600">{description}</p>
    </div>
  );
}
