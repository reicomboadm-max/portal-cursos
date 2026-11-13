"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { SegmentType } from "@/types";
import { 
  FolderLock, 
  Menu, 
  X, 
  User, 
  ShieldCheck, 
  Send, 
  GraduationCap
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { settings, currentUser, setActiveSegmentFilter } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const telegramSupportUrl = settings.telegramSupport || "https://t.me/Baldodrive";
  const telegramChannelUrl = settings.telegramChannel || "https://t.me/comboreiboss";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl animate-fade-slide">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link 
          href="/" 
          onClick={() => setActiveSegmentFilter("todos")}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <BrandLogo size={46} />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-xl font-black tracking-tight text-white group-hover:text-red-400 transition">
                CENTRAL DO <span className="text-red-500">APROVADO</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300">
                DRIVE 2026
              </span>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 hidden sm:block">
              Cursos & Drives Oficiais
            </span>
          </div>
        </Link>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          {/* Live Status Pill */}
          <div className="hidden md:flex items-center gap-2 rounded-full border-gradient bg-white/5 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-neutral-300 font-medium">Envios em até 24h</span>
          </div>

          <Link
            href="/aluno"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border-gradient bg-white/5 backdrop-blur-xl px-4 py-2 text-xs sm:text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition"
          >
            <GraduationCap className="w-3.5 h-3.5 text-neutral-400" />
            <span>{currentUser ? currentUser.name.split(" ")[0] : "Área do Aluno"}</span>
          </Link>

          <a
            href={telegramChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full border-gradient bg-white/5 backdrop-blur-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 transition"
            title="Canal Telegram"
          >
            <Send className="w-3.5 h-3.5 text-sky-400" />
            <span>Canal Telegram</span>
          </a>

          <a
            href={telegramSupportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-gradient bg-sky-500/15 border border-sky-500/30 backdrop-blur-xl px-4 py-2 text-xs sm:text-sm font-semibold text-sky-300 hover:text-white hover:bg-sky-500/25 transition shadow-lg shadow-sky-500/15"
            title="Suporte no Telegram @Baldodrive"
          >
            <Send className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Suporte @Baldodrive</span>
            <span className="sm:hidden">Telegram</span>
          </a>

          <Link
            href="/admin"
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition"
            title="Painel Admin"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
