import React from "react";

interface SpekLogoProps {
  className?: string;
}

export const SpekLogoTransparent: React.FC<SpekLogoProps> = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 600 220"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g fill="white">
        {/* Marco exterior */}
        <path d="M100 30 L430 30 L430 50 L520 50 L520 150 L430 150 L430 170 L100 170 Z" />
        
        {/* S */}
        <path d="M125 50 H185 V95 H140 V125 H185 V170 H125 V125 H170 V95 H125 Z" />
        
        {/* P */}
        <path d="M200 50 H260 V95 H215 V170 H200 Z" />
        <path d="M215 65 V80 H245 V65 Z" />
        
        {/* E */}
        <path d="M275 50 H335 V65 H290 V95 H325 V110 H290 V155 H335 V170 H275 Z" />
        
        {/* K */}
        <path d="M350 50 H365 V102 L407 50 H428 L385 110 L428 170 H407 L365 118 V170 H350 Z" />
        
        {/* INDUSTRIAL */}
        <text x="310" y="195" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" textAnchor="middle">INDUSTRIAL</text>
      </g>
    </svg>
  );
};

export default SpekLogoTransparent;