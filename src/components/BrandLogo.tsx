import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function BrandLogo({ className = "", size = 36, showText = false }: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* High-tech Geometric Shield & Victory 'A' Peak Icon */}
      <div 
        className="relative flex items-center justify-center shrink-0 rounded-xl bg-neutral-900/90 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.25)] backdrop-blur-md overflow-hidden group"
        style={{ width: size, height: size }}
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-red-500/10 pointer-events-none" />

        <svg 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-3/5 h-3/5 drop-shadow-[0_2px_8px_rgba(239,68,68,0.5)] transition-transform duration-300 group-hover:scale-110"
        >
          <defs>
            <linearGradient id="brand-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="60%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <linearGradient id="brand-grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#fca5a5" />
            </linearGradient>
          </defs>

          {/* Hex Shield / Diamond Contour */}
          <path 
            d="M20 3.5L34.5 11.5V23.5C34.5 30.8 28.3 36.6 20 39C11.7 36.6 5.5 30.8 5.5 23.5V11.5L20 3.5Z" 
            stroke="url(#brand-grad-primary)" 
            strokeWidth="2.2" 
            strokeLinejoin="round"
          />

          {/* Ascending Victory Peak (A) */}
          <path 
            d="M20 9.5L28 25H23.5L20 17.5L16.5 25H12L20 9.5Z" 
            fill="url(#brand-grad-primary)" 
          />

          {/* Clean Approval Check / Golden Notch */}
          <path 
            d="M16 26.5L19 29.5L25.5 23" 
            stroke="url(#brand-grad-gold)" 
            strokeWidth="2.4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white leading-tight">
              Central do <span className="text-red-500 font-extrabold">Aprovado</span>
            </span>
            <span className="text-[9px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-300">
              OFICIAL
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 tracking-wide">
            Cursos Completos • Google Drive
          </span>
        </div>
      )}
    </div>
  );
}

export default BrandLogo;

