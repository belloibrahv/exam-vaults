'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { gsap } from 'gsap';
import ExamVaultsLogo from '@/components/ExamVaultsLogo';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      // Shake animation on error
      if (formRef.current) {
        gsap.timeline()
          .to(formRef.current, { x: -10, duration: 0.1 })
          .to(formRef.current, { x: 10, duration: 0.1 })
          .to(formRef.current, { x: -10, duration: 0.1 })
          .to(formRef.current, { x: 10, duration: 0.1 })
          .to(formRef.current, { x: 0, duration: 0.1 });
      }
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
        // Shake animation on error
        if (formRef.current) {
          gsap.timeline()
            .to(formRef.current, { x: -10, duration: 0.1 })
            .to(formRef.current, { x: 10, duration: 0.1 })
            .to(formRef.current, { x: -10, duration: 0.1 })
            .to(formRef.current, { x: 10, duration: 0.1 })
            .to(formRef.current, { x: 0, duration: 0.1 });
        }
        return;
      }

      // Success - redirect immediately without fade animation
      router.push('/auth/signin?registered=true');
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-techvaults-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10 my-8">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <ExamVaultsLogo size={50} variant="full" />
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-techvaults-black mb-1">Create Account</h1>
          <p className="text-base text-techvaults-gray-600">Join Techvaults exam preparation system</p>
        </div>

        {/* Sign Up Form */}
        <div ref={formRef} className="bg-white rounded-3xl shadow-lg p-6 border border-techvaults-gray-200">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="form-field">
              <label htmlFor="name" className="block text-sm font-semibold text-techvaults-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-techvaults-gray-400 group-focus-within:text-techvaults-red transition-colors" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-techvaults-gray-300 rounded-xl focus:ring-2 focus:ring-techvaults-red/20 focus:border-techvaults-red outline-none transition-all bg-white text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="email" className="block text-sm font-semibold text-techvaults-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-techvaults-gray-400 group-focus-within:text-techvaults-red transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-techvaults-gray-300 rounded-xl focus:ring-2 focus:ring-techvaults-red/20 focus:border-techvaults-red outline-none transition-all bg-white text-sm"
                  placeholder="you@techvaults.com"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="password" className="block text-sm font-semibold text-techvaults-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-techvaults-gray-400 group-focus-within:text-techvaults-red transition-colors" />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 border-2 border-techvaults-gray-300 rounded-xl focus:ring-2 focus:ring-techvaults-red/20 focus:border-techvaults-red outline-none transition-all bg-white text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-techvaults-gray-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-techvaults-gray-400 group-focus-within:text-techvaults-red transition-colors" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-techvaults-gray-300 rounded-xl focus:ring-2 focus:ring-techvaults-red/20 focus:border-techvaults-red outline-none transition-all bg-white text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="mt-5">
              <button
                type="submit"
                disabled={loading}
                className="submit-button w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#BC0004] to-[#dc2626] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] text-base"
                style={{ backgroundColor: loading ? undefined : '#BC0004' }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-techvaults-gray-600">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-techvaults-red font-bold hover:underline transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-5 text-center">
          <Link href="/" className="text-sm text-techvaults-gray-600 hover:text-techvaults-red transition-colors font-medium">
            ← Back to home
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-techvaults-gray-500">
          <span className="text-xs">Built by</span>
          <Image
            src="/images/logo.png"
            alt="Techvaults"
            width={75}
            height={20}
            className="h-4 w-auto opacity-60"
          />
        </div>
      </div>
    </div>
  );
}
