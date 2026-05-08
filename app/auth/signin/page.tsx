'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { gsap } from 'gsap';
import TechvaultsLogo from '@/components/TechvaultsLogo';
import FloatingParticles from '@/components/FloatingParticles';
import GradientMesh from '@/components/GradientMesh';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Logo animation
      if (logoRef.current) {
        gsap.from(logoRef.current, {
          scale: 0,
          rotation: -180,
          opacity: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
        });
      }

      // Header text animation
      if (headerRef.current) {
        gsap.from(Array.from(headerRef.current.children), {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.3,
          ease: 'power3.out',
        });
      }

      // Form animation
      if (formRef.current) {
        gsap.from(formRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: 0.5,
          ease: 'power3.out',
        });

        // Form fields stagger
        const formFields = formRef.current.querySelectorAll('.form-field');
        if (formFields.length > 0) {
          gsap.from(Array.from(formFields), {
            x: -30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.8,
            ease: 'power2.out',
          });
        }

        // Button animation - ensure it animates
        const submitButton = formRef.current.querySelector('.submit-button');
        if (submitButton) {
          gsap.fromTo(submitButton, 
            {
              scale: 0.8,
              opacity: 0,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              delay: 1.0,
              ease: 'back.out(1.7)',
            }
          );
        }
      }

      // Footer animation
      if (footerRef.current) {
        gsap.from(footerRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          delay: 1.2,
          ease: 'power2.out',
        });
      }

      // Floating animation for container
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          y: -10,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.5,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        // Shake animation on error
        if (formRef.current) {
          gsap.timeline()
            .to(formRef.current, { x: -10, duration: 0.1 })
            .to(formRef.current, { x: 10, duration: 0.1 })
            .to(formRef.current, { x: -10, duration: 0.1 })
            .to(formRef.current, { x: 10, duration: 0.1 })
            .to(formRef.current, { x: 0, duration: 0.1 });
        }
      } else {
        // Success - redirect immediately without fade animation
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Effects */}
      <GradientMesh />
      <FloatingParticles />

      <div ref={containerRef} className="w-full max-w-md relative z-10 my-8">
        {/* Logo */}
        <div ref={logoRef} className="flex justify-center mb-4">
          <TechvaultsLogo size={60} variant="full" />
        </div>

        {/* Header */}
        <div ref={headerRef} className="text-center mb-6">
          <h1 className="text-3xl font-bold text-techvaults-black mb-1">Welcome Back</h1>
          <p className="text-base text-techvaults-gray-600">Sign in to continue your exam preparation</p>
        </div>

        {/* Sign In Form */}
        <div ref={formRef} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-techvaults-gray-200/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="form-field">
              <label htmlFor="email" className="block text-sm font-semibold text-techvaults-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-techvaults-gray-400 group-focus-within:text-techvaults-red transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-techvaults-gray-300 rounded-xl focus:ring-2 focus:ring-techvaults-red/20 focus:border-techvaults-red outline-none transition-all bg-white text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="submit-button w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#BC0004] to-[#dc2626] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] text-base"
                style={{ backgroundColor: loading ? undefined : '#BC0004' }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-techvaults-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-techvaults-red font-bold hover:underline transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div ref={footerRef} className="mt-5 text-center">
          <Link href="/" className="text-sm text-techvaults-gray-600 hover:text-techvaults-red transition-colors font-medium">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
