"use client";

import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textVariant?: "inline" | "stacked";
}

export function BrandLogo({ 
  className = "", 
  size = 38, 
  showText = false,
  textVariant = "inline"
}: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Variation 1: Monograma CA Vértice da Vitória + Check */}
      <div 
        className="relative flex items-center justify-center shrink-0 rounded-xl bg-[#0a0c14] border border-red-500/30 shadow-[0_0_24px_rgba(239,68,68,0.22)] backdrop-blur-md overflow-hidden group transition-all duration-300 hover:border-red-500/60 hover:shadow-[0_0_30px_rgba(239,68,68,0.35)]"
        style={{ width: size, height: size }}
      >
        {/* Subtle radial glow inside badge */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-600/25 via-transparent to-transparent pointer-events-none" />

        <svg 
          viewBox="0 0 64 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-[72%] h-[72%] drop-shadow-[0_2px_10px_rgba(239,68,68,0.45)] transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="v1-main-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4d4d" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <linearGradient id="v1-facet-grad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="60%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
            <linearGradient id="v1-check-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#fecaca" />
            </linearGradient>
          </defs>

          {/* 'C' Left Wing & Facet */}
          <path 
            d="M32 10 L16 20 L16 44 L32 54 L32 46 L22 39.5 L22 24.5 L32 18 Z" 
            fill="url(#v1-facet-grad)" 
          />

          {/* 'A' Right Wing & Facet */}
          <path 
            d="M32 10 L48 20 L48 44 L32 54 L32 46 L42 39.5 L42 24.5 L32 18 Z" 
            fill="url(#v1-main-grad)" 
          />

          {/* Central Victory Apex Blade (A) */}
          <path 
            d="M32 8 L44 32 H37 L32 21 L27 32 H20 L32 8 Z" 
            fill="url(#v1-main-grad)" 
          />

          {/* Sharp Approval Checkmark (Vértice de Aprovação) */}
          <path 
            d="M24 38 L30 44 L44 28" 
            stroke="url(#v1-check-grad)" 
            strokeWidth="4.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
              Central do <span className="text-red-500 font-extrabold">Aprovado</span>
            </span>
            <span className="text-[9px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-300 font-mono">
              2026
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 tracking-wide">
            Cursos & Drives Oficiais
          </span>
        </div>
      )}
    </div>
  );
}

export default BrandLogo;
