import React from "react";

interface SpekLogoProps {
  className?: string;
}

export const SpekLogoExact: React.FC<SpekLogoProps> = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 600 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="subtle" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0.98" />
          <stop offset="50%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0.98" />
        </linearGradient>
      </defs>
      
      {/* Logo SPEK basado exactamente en la imagen del cliente */}
      <g fill="url(#subtle)">
        {/* Marco exterior */}
        <path d="M100 30 L430 30 L430 50 L520 50 L520 150 L430 150 L430 170 L100 170 Z" fill="white" />
        
        {/* Letras SPEK */}
        <g transform="translate(125, 50)">
          {/* S */}
          <path d="M0 0 H60 V45 H15 V75 H60 V105 H0 V60 H45 V30 H0 Z" fill="black" />
          
          {/* P */}
          <path d="M75 0 H135 V45 H90 V105 H75 Z M90 15 V30 H120 V15 Z" fill="black" />
          
          {/* E */}
          <path d="M150 0 H210 V15 H165 V45 H195 V60 H165 V90 H210 V105 H150 Z" fill="black" />
          
          {/* K */}
          <path d="M225 0 H240 V45 L285 0 H305 L260 50 L305 105 H285 L245 55 L240 60 V105 H225 Z" fill="black" />
        </g>
        
        {/* INDUSTRIAL */}
        <text x="350" y="190" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="white" textAnchor="middle">INDUSTRIAL</text>
      </g>
    </svg>
  );
};

export default SpekLogoExact;