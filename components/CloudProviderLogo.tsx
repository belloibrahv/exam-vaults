import Image from 'next/image';

interface CloudProviderLogoProps {
  provider: 'aws' | 'azure' | 'gcp';
  size?: number;
  className?: string;
}

// Official cloud provider logo URLs
const PROVIDER_LOGOS = {
  aws: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
  azure: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg',
  gcp: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg',
};

const PROVIDER_NAMES = {
  aws: 'Amazon Web Services',
  azure: 'Microsoft Azure',
  gcp: 'Google Cloud Platform',
};

export default function CloudProviderLogo({ 
  provider, 
  size = 120, 
  className = '' 
}: CloudProviderLogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size * 0.4 }}>
      <Image
        src={PROVIDER_LOGOS[provider]}
        alt={PROVIDER_NAMES[provider]}
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
