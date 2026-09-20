import React, { useEffect, useState } from 'react';
import { StorageService } from '../../services/storage';

interface WelcomeSplashProps {
  onEnter: () => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onEnter }) => {
  const [userName, setUserName] = useState<string>('USER');

  useEffect(() => {
    try {
      const profile = StorageService.getUserProfile();
      if (profile && profile.name && !profile.name.toLowerCase().includes('karan')) {
        setUserName(profile.name.toUpperCase());
      } else {
        setUserName('USER');
      }
    } catch {
      setUserName('USER');
    }
  }, []);

  // Listen for Enter key globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEnter]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0c0717] flex items-center justify-center select-none font-sans">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(236,72,153,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(168,85,247,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Organic Botanical & Abstract Geometric Elements (Inspired by Reference Image 4) */}
      <svg
        className="absolute left-0 bottom-0 w-80 h-96 md:w-[420px] md:h-[500px] pointer-events-none opacity-40 md:opacity-60"
        viewBox="0 0 400 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-50 500 C 50 350, 120 280, 200 320 C 280 360, 220 480, 320 500 Z"
          fill="url(#paint-purple-1)"
        />
        <path
          d="M-80 420 C 40 280, 160 200, 140 120 C 120 40, 20 180, -80 300 Z"
          fill="url(#paint-pink-1)"
          opacity="0.8"
        />
        <path
          d="M0 500 C 80 380, 200 320, 260 220 C 320 120, 240 80, 180 160 C 120 240, 60 420, 0 500 Z"
          fill="url(#paint-violet-1)"
          opacity="0.6"
        />
        <circle cx="150" cy="220" r="4" fill="#ec4899" />
        <circle cx="210" cy="180" r="3" fill="#c084fc" />
        <circle cx="90" cy="140" r="5" fill="#f43f5e" />
        <defs>
          <linearGradient id="paint-purple-1" x1="0" y1="300" x2="300" y2="500" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6b21a8" />
            <stop offset="1" stopColor="#1e1035" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="paint-pink-1" x1="0" y1="100" x2="200" y2="400" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ec4899" />
            <stop offset="1" stopColor="#831843" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="paint-violet-1" x1="100" y1="100" x2="300" y2="400" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a855f7" />
            <stop offset="1" stopColor="#3b0764" />
          </linearGradient>
        </defs>
      </svg>

      {/* Right Top Foliage SVG */}
      <svg
        className="absolute right-0 top-0 w-64 h-80 md:w-96 md:h-[400px] pointer-events-none opacity-30 md:opacity-45"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M450 -50 C 350 80, 260 120, 200 80 C 140 40, 220 -80, 100 -50 Z"
          fill="url(#paint-pink-2)"
        />
        <path
          d="M400 50 C 300 160, 220 220, 260 280 C 300 340, 380 220, 420 180 Z"
          fill="url(#paint-purple-2)"
          opacity="0.7"
        />
        <defs>
          <linearGradient id="paint-pink-2" x1="400" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f43f5e" />
            <stop offset="1" stopColor="#4c0519" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="paint-purple-2" x1="400" y1="100" x2="200" y2="300" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9333ea" />
            <stop offset="1" stopColor="#1e1035" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center Welcome Card */}
      <div className="relative z-10 max-w-2xl w-full mx-4 p-8 md:p-12 rounded-3xl bg-[#160d29]/80 backdrop-blur-xl border border-pink-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(236,72,153,0.15)] text-center flex flex-col items-center">
        {/* Brand Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold tracking-widest uppercase mb-6">
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
          WORKSTATION BOOT ENGINE
        </div>

        {/* Big TITAN_OS Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-2 font-sans">
          TITAN<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">_OS</span>
        </h1>

        {/* Personalized Welcome */}
        <h2 className="text-xl md:text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-pink-200 mt-2 mb-4">
          WELCOME, {userName}
        </h2>

        {/* Divider accent */}
        <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-8" />

        {/* Action Button */}
        <button
          onClick={onEnter}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-bold text-sm md:text-base tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] active:scale-95 cursor-pointer"
        >
          <span>LAUNCH WORKSTATION</span>
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};
