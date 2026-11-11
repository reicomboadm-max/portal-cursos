"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Sparkles, X } from "lucide-react";

export function TopBanner() {
  const { settings } = useStore();
  const [isVisible, setIsVisible] = useState(true);

  if (!settings.bannerNotice || !isVisible) return null;

  return (
    <aside aria-label="Aviso promocional" className="relative z-50 bg-gradient-to-r from-indigo-900 via-indigo-600 to-purple-800 text-white text-xs md:text-sm font-medium py-2 px-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 mx-auto text-center truncate">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
          <span className="truncate">{settings.bannerNotice}</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 shrink-0 transition"
          aria-label="Fechar aviso"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
