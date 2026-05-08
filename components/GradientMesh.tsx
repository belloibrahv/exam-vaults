'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function GradientMesh() {
  const meshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!meshRef.current) return;

    const blobs = meshRef.current.querySelectorAll('.blob');

    blobs.forEach((blob, index) => {
      gsap.to(blob, {
        x: `random(-100, 100)`,
        y: `random(-100, 100)`,
        duration: `random(15, 25)`,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.5,
      });
    });
  }, []);

  return (
    <div ref={meshRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-techvaults-gray-50 to-white" />
      
      {/* Animated gradient blobs */}
      <div className="blob absolute top-0 left-0 w-96 h-96 bg-techvaults-red/10 rounded-full blur-3xl" />
      <div className="blob absolute top-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="blob absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="blob absolute bottom-1/4 right-1/4 w-96 h-96 bg-techvaults-red/5 rounded-full blur-3xl" />
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}
