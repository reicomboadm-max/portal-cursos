"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { 
  Search, 
  HardDrive, 
  Clock, 
  FolderOpen, 
  CheckCircle2, 
  MailCheck, 
  Download,
  ShieldCheck
} from "lucide-react";
import { SegmentType } from "@/types";
import MaskedHeading from "./reactbits/MaskedHeading";

export function Hero() {
  const { 
    activeSegmentFilter, 
    setActiveSegmentFilter, 
    searchQuery, 
    setSearchQuery, 
    courses 
  } = useStore();

  const fiscalCount = courses.filter((c) => c.segment === "fiscal").length;
  const policialCount = courses.filter((c) => c.segment === "policial").length;
  const tribunaisCount = courses.filter((c) => c.segment === "tribunais").length;
  const adminCount = courses.filter((c) => c.segment === "administrativo").length;
  const disciplinasCount = courses.filter((c) => c.segment === "disciplinas").length;

  const filters: { id: SegmentType | "todos"; label: string; icon: string; count: number }[] = [
    { id: "todos", label: "Todos os Cursos", icon: "📚", count: courses.length },
    { id: "fiscal", label: "Fiscal & Tributário", icon: "🏛️", count: fiscalCount },
    { id: "policial", label: "Carreiras Policiais", icon: "🛡️", count: policialCount },
    { id: "tribunais", label: "Tribunais & MP", icon: "⚖️", count: tribunaisCount },
    { id: "administrativo", label: "Admin & Bancos", icon: "🏢", count: adminCount },
    { id: "disciplinas", label: "Professores & Isoladas", icon: "⭐", count: disciplinasCount },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-12 border-b border-slate-800 bg-[#0B0F19]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-emerald-400 mb-6 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>PASTAS ATUALIZADAS NO GOOGLE DRIVE • ANO 2026</span>
        </div>

        {/* Hero Main Headline with MaskedHeading */}
        <div className="max-w-4xl mx-auto my-3">
          <MaskedHeading
            text="Cursos no Google Drive"
            tag="h1"
            mediaType="image"
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1400&auto=format&fit=crop"
            fillScale={1.3}
            parallax={24}
            reveal="scale"
            trigger="view"
            spotlight={true}
            spotlightRadius={160}
            outline={true}
            outlineColor="rgba(16, 185, 129, 0.45)"
            outlineWidth={1}
            weight={900}
            textScale={0.075}
            className="tracking-tight text-white drop-shadow"
          />
          <h2 className="text-xl sm:text-2xl font-black text-emerald-400 mt-2 tracking-tight">
            Acervo Completo & Atualizado 2026
          </h2>
        </div>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Tenha acesso direto aos melhores materiais de estudo com videoaulas e PDFs organizados por matéria. Convite enviado ao seu <strong className="text-white">Gmail em até 24 horas</strong> após a confirmação do PIX.
        </p>

        {/* Fast Value Props */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Acesso Vitalício sem Mensalidades</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Pastas Organizadas por Disciplina</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Envio no Gmail em até 24h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Downloads 100% Liberados</span>
          </div>
        </div>

        {/* Interactive Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquise por cargo, professor ou matéria (ex: Receita Federal, TRF, Adriana Figueiredo, SEFAZ)..."
              className="w-full pl-12 pr-20 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm sm:text-base shadow-lg transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 transition cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Segment Filter Switcher */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {filters.map((tab) => {
            const isActive = activeSegmentFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSegmentFilter(tab.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30 border border-emerald-500"
                    : "bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded font-mono ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
              <HardDrive className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white">+2.500 GB</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Conteúdo em Alta Resolução</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-center gap-2 text-indigo-400 mb-1">
              <FolderOpen className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white">+18.000</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Videoaulas e Livros Digitais</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white">Até 24 Horas</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Envio no Gmail após o PIX</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-center gap-2 text-amber-400 mb-1">
              <MailCheck className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white">Vitalício</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Acesso Permanente sem Mensalidade</p>
          </div>
        </div>

      </div>
    </section>
  );
}
