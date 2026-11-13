"use client";

import React, { useEffect } from "react";
import Script from "next/script";

export function FluxoraBackground() {
  useEffect(() => {
    const handleInit = () => {
      if (typeof window !== "undefined" && (window as any).UnicornStudio) {
        try {
          (window as any).UnicornStudio.init();
        } catch (e) {
          console.error("UnicornStudio init error:", e);
        }
      }
    };

    if (typeof window !== "undefined" && (window as any).UnicornStudio) {
      handleInit();
    }
  }, []);

  return (
    <>
      {/* Background (component) added by Aura / Fluxora */}
      <div 
        className="aura-background-component top-0 w-full h-screen z-0 absolute brightness-50 saturate-50 pointer-events-none" 
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

      {/* Background Grid from Fluxora */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
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

      {/* Unicorn Scene scripts from Fluxora */}
      <Script 
        src="/unicorn-scene.js" 
        strategy="afterInteractive" 
      />
      <Script 
        src="/unicornStudio.umd.js" 
        strategy="afterInteractive"
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
  );
}
