import React from 'react';

interface ExamVaultsLogoProps {
  size?: number;
  variant?: 'full' | 'icon';
  className?: string;
}

export default function ExamVaultsLogo({
  size = 40,
  variant = 'full',
  className = '',
}: ExamVaultsLogoProps) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`} style={{ height: size }}>
      {/* Professional Exam Certification Logo */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          {/* Primary gradient */}
          <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BC0004" />
            <stop offset="100%" stopColor="#8B0003" />
          </linearGradient>
          {/* Secondary accent gradient */}
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1F2937" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
          {/* Certificate seal gradient */}
          <radialGradient id="sealGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F9FAFB" />
            <stop offset="100%" stopColor="#E5E7EB" />
          </radialGradient>
        </defs>

        {/* Main circular badge background */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="url(#primaryGradient)"
          stroke="#374151"
          strokeWidth="2"
        />

        {/* Inner certificate seal */}
        <circle
          cx="50"
          cy="50"
          r="36"
          fill="url(#sealGradient)"
          stroke="#BC0004"
          strokeWidth="1.5"
        />

        {/* Decorative outer ring */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="0.5"
          opacity="0.6"
        />

        {/* Academic cap symbol - modernized */}
        <path
          d="M50 22 L72 30 L50 38 L28 30 Z"
          fill="#BC0004"
          stroke="#374151"
          strokeWidth="1"
        />
        
        {/* Cap mortar board detail */}
        <path
          d="M32 34 V38 C32 40 42 42 50 42 C58 42 68 40 68 38 V34"
          fill="none"
          stroke="#BC0004"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Tassel */}
        <path
          d="M72 30 L76 36 L76 40"
          stroke="#374151"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Certificate document below */}
        <rect
          x="30"
          y="48"
          width="40"
          height="28"
          rx="2"
          fill="#FFFFFF"
          stroke="#BC0004"
          strokeWidth="1.5"
        />

        {/* Certificate content lines */}
        <line x1="34" y1="54" x2="66" y2="54" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="34" y1="58" x2="62" y2="58" stroke="#D1D5DB" strokeWidth="1" strokeLinecap="round" />
        <line x1="34" y1="62" x2="58" y2="62" stroke="#D1D5DB" strokeWidth="1" strokeLinecap="round" />

        {/* Certificate seal/ribbon */}
        <circle
          cx="62"
          cy="70"
          r="4"
          fill="#BC0004"
        />
        
        {/* Ribbon tails */}
        <path
          d="M60 74 L62 78 L64 74"
          fill="#BC0004"
        />

        {/* Success checkmark in seal */}
        <path
          d="M60 68 L61.5 70 L65 66"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Professional border accents */}
        <circle
          cx="20"
          cy="30"
          r="1.5"
          fill="#FFFFFF"
          opacity="0.7"
        />
        <circle
          cx="80"
          cy="30"
          r="1.5"
          fill="#FFFFFF"
          opacity="0.7"
        />
        <circle
          cx="20"
          cy="70"
          r="1.5"
          fill="#FFFFFF"
          opacity="0.7"
        />
        <circle
          cx="80"
          cy="70"
          r="1.5"
          fill="#FFFFFF"
          opacity="0.7"
        />
      </svg>

      {variant === 'full' && (
        <span className="tracking-tight flex items-center" style={{ fontSize: size * 0.52 }}>
          <span className="font-semibold text-techvaults-black">Exam</span>
          <span className="font-black text-techvaults-red">Vaults</span>
        </span>
      )}
    </div>
  );
}
