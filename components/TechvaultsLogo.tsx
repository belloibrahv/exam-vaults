import Image from 'next/image';

interface TechvaultsLogoProps {
  size?: number;
  variant?: 'full' | 'icon';
  className?: string;
}

export default function TechvaultsLogo({ 
  size = 40, 
  variant = 'full',
  className = '' 
}: TechvaultsLogoProps) {
  if (variant === 'icon') {
    return (
      <Image
        src="/images/logo-icon.png"
        alt="Techvaults"
        width={size}
        height={size}
        className={`object-contain ${className}`}
        priority
      />
    );
  }

  return (
    <Image
      src="/images/logo.png"
      alt="Techvaults"
      width={size * 3}
      height={size}
      className={`object-contain ${className}`}
      priority
    />
  );
}
