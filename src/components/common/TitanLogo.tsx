import React from 'react';

interface TitanLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const TitanLogo: React.FC<TitanLogoProps> = ({
  className = '',
  size = 32,
  showText = false,
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Cybernetic High-Tech Hexagonal Crest */}
      <div
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center group"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]"
        >
          <defs>
            <linearGradient id="titanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="titanAccent" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Outer Hex Shield */}
          <polygon
            points="50,4 92,26 92,74 50,96 8,74 8,26"
            fill="#090d16"
            stroke="url(#titanGrad)"
            strokeWidth="4"
            className="transition-all duration-300 group-hover:stroke-cyan-300"
          />

          {/* Inner Accent Ring */}
          <polygon
            points="50,14 82,32 82,68 50,86 18,68 18,32"
            fill="none"
            stroke="#1e293b"
            strokeWidth="2"
            strokeDasharray="4 2"
          />

          {/* Stylized 'T' Monogram */}
          {/* Top Bar */}
          <path
            d="M 28 32 L 72 32 L 68 40 L 56 40 L 56 74 L 44 74 L 44 40 L 32 40 Z"
            fill="url(#titanGrad)"
            className="drop-shadow-[0_0_6px_#06b6d4]"
          />

          {/* Glowing Center Core */}
          <circle cx="50" cy="50" r="3" fill="#38bdf8" className="animate-ping opacity-75" />
          <circle cx="50" cy="50" r="2.5" fill="#ffffff" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-tech text-sm font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 uppercase">
            TITAN_OS
          </span>
          <span className="text-[8px] font-mono text-cyan-500/80 tracking-tighter uppercase leading-none">
            ENGINEERING WORKSTATION
          </span>
        </div>
      )}
    </div>
  );
};
