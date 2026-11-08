import React from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';

export default function StoreIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-end pt-8 pb-4">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Floating 5-Star Rating Bubble */}
      <div className="absolute top-0 right-4 sm:right-8 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl shadow-blue-500/10 border border-blue-100 flex items-center gap-1.5 z-20 animate-float-slow">
        <div className="flex text-amber-400 gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-amber-400 stroke-amber-400" />
          ))}
        </div>
        <div className="absolute -bottom-2 right-6 w-3 h-3 bg-white border-r border-b border-blue-100 rotate-45"></div>
      </div>

      {/* Floating Thumbs Up Badge */}
      <div className="absolute top-20 right-2 sm:right-6 bg-gradient-to-tr from-blue-600 to-blue-500 text-white p-3 rounded-2xl shadow-lg shadow-blue-500/30 z-20 animate-float-reverse">
        <ThumbsUp className="w-5 h-5" />
      </div>

      {/* Floating User Feedback Profile Pill */}
      <div className="absolute top-36 right-0 sm:right-4 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg shadow-blue-500/10 border border-blue-100 flex items-center gap-2.5 z-20 animate-float-slow" style={{ animationDelay: '1.5s' }}>
        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
          <User className="w-4 h-4" />
        </div>
        <div className="flex flex-col gap-1 pr-1">
          <div className="w-12 h-2 bg-blue-200 rounded-full"></div>
          <div className="w-8 h-1.5 bg-slate-200 rounded-full"></div>
        </div>
      </div>

      {/* 3D Store Illustration Container */}
      <div className="relative z-10 w-full max-w-[360px] select-none">
        <svg
          viewBox="0 0 400 340"
          className="w-full h-auto drop-shadow-2xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f1f5f9" />
            </linearGradient>
            <linearGradient id="roofBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="roofLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="doorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <filter id="storeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#1e3a8a" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Ground Platform */}
          <rect x="30" y="300" width="340" height="20" rx="10" fill="url(#groundGrad)" opacity="0.3" />
          <rect x="50" y="295" width="300" height="15" rx="7" fill="#64748b" opacity="0.4" />

          {/* Left Plant Pot */}
          <g transform="translate(42, 240)">
            <ellipse cx="20" cy="55" rx="18" ry="6" fill="#1e293b" opacity="0.2" />
            <path d="M5 40 L35 40 L30 65 L10 65 Z" fill="#2563eb" rx="4" />
            <ellipse cx="20" cy="40" rx="15" ry="4" fill="#3b82f6" />
            {/* Green Leaves */}
            <path d="M20 38 Q5 20 2 0 Q18 10 20 38" fill="#22c55e" />
            <path d="M20 38 Q35 20 38 2 Q22 10 20 38" fill="#16a34a" />
            <path d="M20 38 Q20 15 18 -10 Q28 10 20 38" fill="#4ade80" />
          </g>

          {/* Right Plant Pot */}
          <g transform="translate(325, 245)">
            <ellipse cx="18" cy="50" rx="16" ry="5" fill="#1e293b" opacity="0.2" />
            <path d="M5 35 L31 35 L27 58 L9 58 Z" fill="#2563eb" />
            <ellipse cx="18" cy="35" rx="13" ry="3.5" fill="#3b82f6" />
            {/* Leaves */}
            <path d="M18 33 Q8 18 5 2 Q18 10 18 33" fill="#22c55e" />
            <path d="M18 33 Q28 18 31 2 Q18 10 18 33" fill="#16a34a" />
          </g>

          {/* Main Building Base / Wall */}
          <g filter="url(#storeShadow)">
            <rect x="75" y="145" width="250" height="155" rx="8" fill="url(#wallGrad)" stroke="#e2e8f0" strokeWidth="2" />
          </g>

          {/* Store Window (Left) with orange accents */}
          <g transform="translate(100, 175)">
            <rect x="0" y="0" width="85" height="95" rx="6" fill="#1e40af" stroke="#93c5fd" strokeWidth="3" />
            {/* Window Glass reflection */}
            <path d="M5 5 L80 5 L80 90 L5 90 Z" fill="#3b82f6" opacity="0.85" />
            <path d="M5 5 L50 5 L20 90 L5 90 Z" fill="#60a5fa" opacity="0.6" />
            <line x1="42.5" y1="0" x2="42.5" y2="95" stroke="#93c5fd" strokeWidth="2" />
            <line x1="0" y1="47.5" x2="85" y2="47.5" stroke="#93c5fd" strokeWidth="2" />

            {/* Window Sill with yellow/orange fruits */}
            <rect x="-4" y="92" width="93" height="12" rx="3" fill="#2563eb" />
            <circle cx="15" cy="88" r="6" fill="#f59e0b" />
            <circle cx="28" cy="87" r="7" fill="#f97316" />
            <circle cx="42" cy="88" r="6" fill="#eab308" />
          </g>

          {/* Store Door (Right) */}
          <g transform="translate(225, 185)">
            <rect x="0" y="0" width="65" height="115" rx="6" fill="url(#doorGrad)" />
            {/* Door Window */}
            <rect x="12" y="15" width="41" height="40" rx="4" fill="#93c5fd" opacity="0.8" />
            <path d="M12 15 L32 15 L22 55 L12 55 Z" fill="#ffffff" opacity="0.4" />
            {/* Door Handle */}
            <circle cx="50" cy="70" r="4.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
            {/* Door Base Line */}
            <rect x="-4" y="112" width="73" height="4" rx="2" fill="#1e3a8a" />
          </g>

          {/* Store Striped Awning Roof */}
          <g transform="translate(60, 100)">
            {/* Slanted Roof Top Shadow */}
            <path d="M15 0 L265 0 L280 45 L0 45 Z" fill="#1e3a8a" opacity="0.2" />

            {/* Striped Canopy Sections */}
            {/* Stripe 1 (Blue) */}
            <path d="M0 5 L40 5 L35 48 L0 48 Z" fill="url(#roofBlue)" />
            <circle cx="17.5" cy="48" r="17.5" fill="url(#roofBlue)" />

            {/* Stripe 2 (White) */}
            <path d="M40 5 L80 5 L75 48 L35 48 Z" fill="url(#roofLight)" />
            <circle cx="55" cy="48" r="17.5" fill="url(#roofLight)" />

            {/* Stripe 3 (Blue) */}
            <path d="M80 5 L120 5 L115 48 L75 48 Z" fill="url(#roofBlue)" />
            <circle cx="95" cy="48" r="17.5" fill="url(#roofBlue)" />

            {/* Stripe 4 (White) */}
            <path d="M120 5 L160 5 L155 48 L115 48 Z" fill="url(#roofLight)" />
            <circle cx="135" cy="48" r="17.5" fill="url(#roofLight)" />

            {/* Stripe 5 (Blue) */}
            <path d="M160 5 L200 5 L195 48 L155 48 Z" fill="url(#roofBlue)" />
            <circle cx="175" cy="48" r="17.5" fill="url(#roofBlue)" />

            {/* Stripe 6 (White) */}
            <path d="M200 5 L240 5 L235 48 L195 48 Z" fill="url(#roofLight)" />
            <circle cx="215" cy="48" r="17.5" fill="url(#roofLight)" />

            {/* Stripe 7 (Blue) */}
            <path d="M240 5 L280 5 L275 48 L235 48 Z" fill="url(#roofBlue)" />
            <circle cx="255" cy="48" r="17.5" fill="url(#roofBlue)" />

            {/* Top Roof Edge Cap */}
            <path d="M5 2 L275 2 L277 8 L3 8 Z" fill="#1d4ed8" />
          </g>
        </svg>
      </div>
    </div>
  );
}

