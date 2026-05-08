'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import TechvaultsLogo from './TechvaultsLogo';

export default function AnimatedLogoBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    const logos = bannerRef.current.querySelectorAll('.logo-item');

    // Create infinite rotation animation
    const tl = gsap.timeline({ repeat: -1 });

    logos.forEach((logo, index) => {
      tl.to(logo, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      }, index * 2)
      .to(logo, {
        opacity: 0.3,
        scale: 0.9,
        duration: 0.5,
        delay: 1,
        ease: 'power2.in',
      });
    });

    // Floating animation for the container
    gsap.to(bannerRef.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={bannerRef} className="flex items-center justify-center gap-8 py-8">
      {/* Techvaults Logo */}
      <div className="logo-item opacity-30">
        <TechvaultsLogo size={50} variant="icon" />
      </div>

      {/* AWS Logo */}
      <div className="logo-item opacity-30 relative w-32 h-16">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
          alt="AWS"
          fill
          className="object-contain"
        />
      </div>

      {/* Azure Logo */}
      <div className="logo-item opacity-30 relative w-32 h-16">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg"
          alt="Microsoft Azure"
          fill
          className="object-contain"
        />
      </div>

      {/* GCP Logo */}
      <div className="logo-item opacity-30 relative w-32 h-16">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg"
          alt="Google Cloud"
          fill
          className="object-contain"
        />
      </div>

      {/* Techvaults Logo (repeat for symmetry) */}
      <div className="logo-item opacity-30">
        <TechvaultsLogo size={50} variant="icon" />
      </div>
    </div>
  );
}
