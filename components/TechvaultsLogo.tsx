export default function TechvaultsLogo({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      {/* Vault door outer circle */}
      <circle cx="50" cy="50" r="45" fill="#BC0004" />
      <circle cx="50" cy="50" r="40" fill="#000000" />
      
      {/* Vault door inner circle */}
      <circle cx="50" cy="50" r="30" fill="#BC0004" />
      <circle cx="50" cy="50" r="25" fill="#000000" />
      
      {/* Center lock mechanism */}
      <circle cx="50" cy="50" r="15" fill="#BC0004" />
      
      {/* Lock spokes */}
      <line x1="50" y1="35" x2="50" y2="42" stroke="white" strokeWidth="2" />
      <line x1="50" y1="58" x2="50" y2="65" stroke="white" strokeWidth="2" />
      <line x1="35" y1="50" x2="42" y2="50" stroke="white" strokeWidth="2" />
      <line x1="58" y1="50" x2="65" y2="50" stroke="white" strokeWidth="2" />
      
      {/* Diagonal spokes */}
      <line x1="39.6" y1="39.6" x2="44.3" y2="44.3" stroke="white" strokeWidth="2" />
      <line x1="55.7" y1="55.7" x2="60.4" y2="60.4" stroke="white" strokeWidth="2" />
      <line x1="60.4" y1="39.6" x2="55.7" y2="44.3" stroke="white" strokeWidth="2" />
      <line x1="44.3" y1="55.7" x2="39.6" y2="60.4" stroke="white" strokeWidth="2" />
      
      {/* Center dot */}
      <circle cx="50" cy="50" r="4" fill="white" />
      
      {/* Tech element - circuit lines */}
      <path
        d="M 20 20 L 30 20 L 30 30"
        stroke="#BC0004"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M 80 80 L 70 80 L 70 70"
        stroke="#BC0004"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
