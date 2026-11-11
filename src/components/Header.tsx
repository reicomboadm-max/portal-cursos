"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
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

  const handleSegmentClick = (segment: "fiscal" | "tribunais" | "combos") => {
    setActiveSegmentFilter(segment);
    if (pathname !== "/") {
      router.push("/");
    }
    setMobileMenuOpen(false);
  };

  const cleanWhatsappNumber = settings.whatsappSupport.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20os%20drives%20de%20cursos.`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#07090e]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link 
          href="/" 
          onClick={() => setActiveSegmentFilter("todos")}
          className="flex items-center gap-3 group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-[1.5px] shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition">
            <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
              <FolderLock className="w-6 h-6 text-indigo-400 group-hover:text-cyan-400 transition" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-indigo-300 transition">
                {settings.siteName.split(" ")[0]}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                DRIVE 2026
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">Acesso Vitalício & Downloads Liberados</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            href="/"
            onClick={() => setActiveSegmentFilter("todos")}
            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition"
          >
            Início
          </Link>
          <button
            onClick={() => handleSegmentClick("fiscal")}
            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-indigo-400 hover:bg-white/5 transition flex items-center gap-1.5"
          >
            <span>🏛️</span> Área Fiscal
          </button>
          <button
            onClick={() => handleSegmentClick("tribunais")}
            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-cyan-400 hover:bg-white/5 transition flex items-center gap-1.5"
          >
            <span>⚖️</span> Tribunais
          </button>
          <button
            onClick={() => handleSegmentClick("combos")}
            className="px-3 py-2 rounded-lg text-sm font-medium text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 transition flex items-center gap-1.5 font-semibold"
          >
            <span>⭐</span> Combos VIP
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/aluno"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>{currentUser ? currentUser.name.split(" ")[0] : "Área do Aluno"}</span>
          </Link>

          <Link
            href="/admin"
            className="p-2 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-white/5 transition border border-transparent hover:border-white/10"
            title="Painel Administrativo"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Suporte WhatsApp</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/aluno"
            className="p-2 rounded-lg text-gray-300 bg-white/5 border border-white/10"
            title="Área do Aluno"
          >
            <User className="w-5 h-5 text-indigo-400" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-300 hover:text-white bg-white/5 border border-white/10"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0c101d] px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => {
              setActiveSegmentFilter("todos");
              router.push("/");
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5"
          >
            🏠 Início
          </button>
          <button
            onClick={() => handleSegmentClick("fiscal")}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5"
          >
            🏛️ Área Fiscal (Receita, SEFAZ, ISS)
          </button>
          <button
            onClick={() => handleSegmentClick("tribunais")}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5"
          >
            ⚖️ Tribunais (TRF, TRT, TJ, TSE)
          </button>
          <button
            onClick={() => handleSegmentClick("combos")}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-amber-400 hover:bg-amber-400/10"
          >
            ⭐ Super Combos Passaporte Total
          </button>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <Link
              href="/aluno"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{currentUser ? `Área do Aluno (${currentUser.name})` : "Área do Aluno (Acessar Drives)"}</span>
            </Link>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-200"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Painel Admin / Vendas</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
