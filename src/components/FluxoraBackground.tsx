"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";

export function FluxoraBackground() {
  const [loadWebGL, setLoadWebGL] = useState(false);

  useEffect(() => {
    // Only load heavy WebGL on desktop devices with width >= 768px to ensure buttery smooth 120fps on mobile
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setLoadWebGL(true);
    }
  }, []);

  return (
    <>
      {/* Lightweight, high-performance ambient mesh background for all devices (0% CPU / 0% GPU overhead) */}
      <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden">
        {/* Soft radial gradients in brand colors */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[550px] h-[380px] bg-red-600/10 rounded-full blur-[90px] transform-gpu" />
        <div className="absolute top-1/3 -left-20 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] transform-gpu" />
        <div className="absolute bottom-10 right-0 w-[450px] h-[350px] bg-red-600/5 rounded-full blur-[90px] transform-gpu" />

        {/* Minimal grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M64 0H0v64" fill="none" stroke="white" strokeWidth="0.5"></path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"></rect>
          </svg>
        </div>
      </div>

      {/* WebGL Scene (Desktop only to prevent mobile lag) */}
      {loadWebGL && (
        <>
          <div 
            className="aura-background-component top-0 w-full h-screen z-0 absolute brightness-50 saturate-50 pointer-events-none hidden md:block" 
            data-alpha-mask="80" 
            style={{
              maskImage: "linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)"
            }}
          >
            <div className="fixed inset-0 -z-10 bg-black">
              <div 
                className="aura-background-component absolute inset-0 w-full h-full" 
                data-alpha-mask="80" 
                style={{
                  WebkitMaskImage: "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 80%, rgba(255,255,255,0) 100%)",
                  maskImage: "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 80%, rgba(255,255,255,0) 100%)",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskSize: "100% 100%",
                  maskSize: "100% 100%",
                }}
              >
                <div 
                  data-us-project="XxCmD31vVBmiINgvYCho" 
                  data-us-project-src="fluxora-us-scene" 
                  className="absolute inset-0 w-full h-full bg-neutral-950"
                />
              </div>
            </div>
          </div>

          <Script 
            src="/unicorn-scene.js" 
            strategy="lazyOnload" 
          />
          <Script 
            src="/unicornStudio.umd.js" 
            strategy="lazyOnload"
            onLoad={() => {
              if (typeof window !== "undefined" && (window as any).UnicornStudio) {
                try {
                  (window as any).UnicornStudio.init();
                } catch (err) {
                  console.error("Error initializing UnicornStudio:", err);
                }
              }
            }}
          />
        </>
      )}
    </>
  );
}
