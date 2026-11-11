"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { 
  Search, 
  Sparkles, 
  HardDrive, 
  Clock, 
  FolderOpen,
  CheckCircle2,
  MailCheck,
  Download
} from "lucide-react";
import { SegmentType } from "@/types";

export function Hero() {
  const { 
    activeSegmentFilter, 
    setActiveSegmentFilter, 
    searchQuery, 
    setSearchQuery,
    courses 
  } = useStore();

  const fiscalCount = courses.filter((c) => c.segment === "fiscal").length;
  const tribunaisCount = courses.filter((c) => c.segment === "tribunais").length;
  const combosCount = courses.filter((c) => c.segment === "combos").length;

  const filters: { id: SegmentType | "todos"; label: string; icon: string; count: number }[] = [
    { id: "todos", label: "Todos os Cursos", icon: "🔥", count: courses.length },
    { id: "fiscal", label: "Área Fiscal", icon: "🏛️", count: fiscalCount },
    { id: "tribunais", label: "Tribunais", icon: "⚖️", count: tribunaisCount },
    { id: "combos", label: "Combos Passaporte", icon: "⭐", count: combosCount },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-14 border-b border-white/5">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-500/20 text-xs sm:text-sm font-semibold text-indigo-300 mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>PASTAS 100% ATUALIZADAS NO GOOGLE DRIVE • ANO 2026</span>
        </div>

        {/* Hero Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Os Melhores Cursos de Concurso{" "}
          <span className="text-gradient">no seu Google Drive</span>{" "}
          com Acesso Vitalício
        </h1>

        {/* Subtitle with 24 hours */}
        <p className="mt-5 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Tenha acesso direto aos materiais mais completos de <strong className="text-white">Fiscal</strong> e <strong className="text-white">Tribunais</strong> (Estratégia, Gran e Direção) com downloads liberados e convite enviado ao seu <strong className="text-white">Gmail em até 24 horas</strong> após o pagamento via PIX.
        </p>

        {/* Fast Value Props (No 7-day guarantee) */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-gray-300">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Sem Mensalidades</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Pastas Organizadas por Matéria</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Envio no Gmail em até 24h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Downloads 100% Liberados</span>
          </div>
        </div>

        {/* Interactive Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquise por cargo, órgão ou matéria (ex: Receita Federal, TRF, SEFAZ, Direito Tributário)..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-100/90 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm sm:text-base shadow-xl backdrop-blur-md transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-white/10 transition"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Segment Filter Switcher */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {filters.map((tab) => {
            const isActive = activeSegmentFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSegmentFilter(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30 scale-105 border border-indigo-400/30"
                    : "bg-surface-100/70 text-gray-300 hover:text-white hover:bg-surface-200/80 border border-white/5"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-mono ${
                  isActive ? "bg-white/20 text-white" : "bg-white/5 text-gray-400"
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Stats Ticker (Changed 2 minutes to 24h) */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-surface-100/60 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-indigo-400 mb-1">
              <HardDrive className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white">+2.500 GB</span>
            </div>
            <p className="text-xs text-gray-400 font-medium">De Conteúdo em Alta Resolução</p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-100/60 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-cyan-400 mb-1">
              <FolderOpen className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white">+18.000</span>
            </div>
            <p className="text-xs text-gray-400 font-medium">Videoaulas e PDFs Completos</p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-100/60 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white">Até 24h</span>
            </div>
            <p className="text-xs text-gray-400 font-medium">Envio no Gmail após o PIX</p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-100/60 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-amber-400 mb-1">
              <MailCheck className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white">Vitalício</span>
            </div>
            <p className="text-xs text-gray-400 font-medium">Acesso Permanente sem Mensalidade</p>
          </div>
        </div>

      </div>
    </section>
  );
}
