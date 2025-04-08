import React from "react";

interface SpekLogoProps {
  className?: string;
}

export const SpekLogo: React.FC<SpekLogoProps> = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 600 220"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.1">
            <animate 
              attributeName="stop-opacity" 
              values="0.1;0.5;0.1" 
              dur="3s" 
              repeatCount="indefinite" 
            />
          </stop>
          <stop offset="100%" stopColor="#fff" stopOpacity="0.6">
            <animate 
              attributeName="stop-opacity" 
              values="0.6;1;0.6" 
              dur="3s" 
              repeatCount="indefinite" 
            />
          </stop>
        </linearGradient>
      </defs>
      
      {/* Marco exterior */}
      <rect 
        x="65" 
        y="30" 
        width="360" 
        height="120" 
        stroke="white" 
        strokeWidth="12"
        fill="none"
      />
      
      {/* S */}
      <path 
        d="M95 50 H175 V85 H95 V115 H175" 
        stroke="white" 
        strokeWidth="12" 
        fill="none"
      />
      
      {/* P */}
      <path 
        d="M195 50 H275 V85 H195 V140" 
        stroke="white" 
        strokeWidth="12" 
        fill="none"
      />
      
      {/* E */}
      <path 
        d="M295 50 H375 M295 85 H355 M295 120 H375" 
        stroke="white" 
        strokeWidth="12" 
        fill="none"
      />
      
      {/* K */}
      <path 
        d="M395 50 V120 M395 85 L425 50 M395 85 L425 120" 
        stroke="white" 
        strokeWidth="12" 
        fill="none"
      />
      
      {/* INDUSTRIAL */}
      <text 
        x="450" 
        y="95" 
        fontFamily="Arial, sans-serif" 
        fontSize="22" 
        fontWeight="bold"
        fill="white"
      >
        INDUSTRIAL
      </text>
      
      {/* Efecto de luz */}
      <g filter="url(#glow)">
        <rect 
          x="65" 
          y="30" 
          width="360" 
          height="120" 
          stroke="url(#gradient)" 
          strokeWidth="2" 
          fill="none"
          opacity="0.7"
        >
          <animate 
            attributeName="opacity"
            values="0.5;0.8;0.5"
            dur="4s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
    </svg>
  );
};

export default SpekLogo;