"use client";

import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function BrandLogo({ 
  className = "", 
  size = 46, 
  showText = false
}: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3.5 ${className}`}>
      {/* 3D Glowing CA Victory Emblem from Variation 1 */}
      <div 
        className="relative flex items-center justify-center shrink-0 rounded-2xl bg-[#08090e] border border-red-500/40 shadow-[0_0_24px_rgba(239,68,68,0.35)] backdrop-blur-md overflow-hidden group transition-all duration-300 hover:border-red-500/80 hover:shadow-[0_0_36px_rgba(239,68,68,0.55)]"
        style={{ width: size, height: size }}
      >
        <Image 
          src="/logo-oficial-square.png" 
          alt="Central do Aprovado" 
          width={size * 2} 
          height={size * 2} 
          className="w-full h-full object-contain p-0.5 transition-transform duration-300 group-hover:scale-105"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-xl font-black tracking-tight text-white leading-tight">
              CENTRAL DO <span className="text-red-500">APROVADO</span>
            </span>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
            Cursos & Drives
          </span>
        </div>
      )}
    </div>
  );
}

export default BrandLogo;
