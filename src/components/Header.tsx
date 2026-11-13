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
  MessageCircle, 
  GraduationCap
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { settings, currentUser, setActiveSegmentFilter } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanWhatsappNumber = settings.whatsappSupport.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20os%20drives%20de%20cursos.`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl animate-fade-slide">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link 
          href="/" 
          onClick={() => setActiveSegmentFilter("todos")}
          className="flex items-center gap-3 group"
        >
          <span className="inline-flex items-center justify-center bg-white/10 w-9 h-9 rounded-full backdrop-blur border-gradient">
            <FolderLock className="w-4 h-4 text-white group-hover:text-red-400 transition" />
          </span>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-neutral-200 transition">
                {settings.siteName || "DriveConcursos"}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                DRIVE 2026
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 hidden sm:block">Central de Estudos • Google Drive</span>
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
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-gradient bg-white/5 backdrop-blur-xl px-4 py-2 text-xs sm:text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">WhatsApp</span>
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
