import React from 'react';

interface SpekLogoProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const SpekIndustrialLogo: React.FC<SpekLogoProps> = ({ 
  className = "", 
  width = "200", 
  height = "80" 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 600 200" 
      width={width} 
      height={height}
      className={className}
    >
      {/* Main logo shape */}
      <g>
        <path 
          d="M100,40h400v40H140v120h-40V40z" 
          fill="#FFFFFF" 
        />
        <rect x="180" y="100" width="60" height="60" fill="#000000" />
        <path 
          d="M240,100h60v60h-60V100z M240,100v-60h60v60H240z M300,100h60v60h-60V100z M360,100h60v-60h-60V100z M420,100h60v60h-60V100z M480,40v60h-60" 
          fill="#000000" 
        />
        <text x="450" y="180" fontSize="30" fontFamily="Arial, sans-serif" fontWeight="bold" fill="#FFFFFF">INDUSTRIAL</text>
      </g>
    </svg>
  );
};