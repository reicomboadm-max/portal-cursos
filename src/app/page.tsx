"use client";

import React, { useMemo } from "react";
import { Header } from "@/components/Header";
import { useStore } from "@/context/StoreContext";
import { CheckoutModal } from "@/components/CheckoutModal";
import { FluxoraBackground } from "@/components/FluxoraBackground";
import StarBorder from "@/components/reactbits/StarBorder";
import GooeyNav from "@/components/reactbits/GooeyNav";
import Footer from "@/components/Footer";
import { 
  Search, 
  X, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HardDrive
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { SegmentType } from "@/types";

export default function HomePage() {
  const { 
    courses, 
    activeSegmentFilter, 
    setActiveSegmentFilter, 
    searchQuery, 
    setSearchQuery,
    openCheckout 
  } = useStore();

  // Counts per segment
  const counts = useMemo(() => {
    const map: Record<string, number> = { todos: 0 };
    courses.forEach((c) => {
      if (!c.active) return;
      map.todos = (map.todos || 0) + 1;
      map[c.segment] = (map[c.segment] || 0) + 1;
    });
    return map;
  }, [courses]);

  // Filter courses by segment and search query
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      if (!course.active) return false;
      if (activeSegmentFilter !== "todos" && course.segment !== activeSegmentFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = course.title.toLowerCase().includes(q);
        const inDesc = course.description?.toLowerCase().includes(q);
        const inPlatform = course.platform?.toLowerCase().includes(q);
        if (!inTitle && !inDesc && !inPlatform) return false;
      }
      return true;
    });
  }, [courses, activeSegmentFilter, searchQuery]);

  const categories: { id: SegmentType | "todos"; label: string; icon: string }[] = useMemo(() => [
    { id: "todos", label: "Todos", icon: "📚" },
    { id: "fiscal", label: "Fiscal & Tributário", icon: "🏛️" },
    { id: "policial", label: "Carreiras Policiais", icon: "🛡️" },
    { id: "tribunais", label: "Tribunais & MP", icon: "⚖️" },
    { id: "administrativo", label: "Admin & Bancos", icon: "🏢" },
    { id: "disciplinas", label: "Professores & Isoladas", icon: "⭐" },
  ], []);

  const gooeyItems = useMemo(() => {
    return categories.map((cat) => ({
      id: cat.id,
      label: (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 font-mono font-bold">
            {counts[cat.id] || 0}
          </span>
        </span>
      ),
    }));
  }, [categories, counts]);

  const activeCategoryIndex = useMemo(() => {
    const idx = categories.findIndex((c) => c.id === activeSegmentFilter);
    return idx >= 0 ? idx : 0;
  }, [categories, activeSegmentFilter]);

  const getSectionTitle = () => {
    switch (activeSegmentFilter) {
      case "fiscal":
        return "CURSOS • ÁREA FISCAL & TRIBUTÁRIA";
      case "policial":
        return "CURSOS • CARREIRAS POLICIAIS";
      case "tribunais":
        return "CURSOS • TRIBUNAIS E MINISTÉRIO PÚBLICO";
      case "administrativo":
        return "CURSOS • ÁREA ADMINISTRATIVA E BANCÁRIA";
      case "disciplinas":
        return "CURSOS • PROFESSORES E MATÉRIAS ISOLADAS";
      default:
        return "CURSOS";
    }
  };

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white flex flex-col font-sans selection:bg-red-600 selection:text-white antialiased">
      
      {/* Background Completo do Fluxora (Unicorn Studio WebGL Scene + Grid Pattern) */}
      <FluxoraBackground />

      {/* Top Navbar */}
      <Header />

      {/* Main Showcase Section */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        
        {/* Sleek Pill Announcement (Fluxora Style) */}
        <div className="w-fit mx-auto mb-6 [animation:fadeSlideIn_0.8s_ease-out_0.1s_both]">
          <div className="inline-flex items-center gap-2 rounded-full border-gradient bg-white/5 px-3.5 py-1.5 text-xs text-neutral-300 backdrop-blur-md">
            <span className="inline-flex items-center justify-center rounded-full bg-blue-400/20 text-blue-300 px-2 py-0.5 text-[11px] font-semibold">
              Drive 2026
            </span>
            <span className="font-medium">Pastas Oficiais no Google Drive • Acesso Vitalício no seu Gmail</span>
          </div>
        </div>

        {/* Clean Hero Search Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 [animation:fadeSlideIn_0.8s_ease-out_0.2s_both]">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Central de Estudos
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400">
            Encontre o seu curso, realize o pagamento via PIX e receba o convite de acesso compartilhado diretamente no seu Gmail.
          </p>

          {/* Clean Modern Search Bar */}
          <div className="relative mt-6 max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por concurso, cargo ou professor (ex: SEFAZ, PF, Adriana)..."
              className="w-full pl-11 pr-10 py-3 rounded-full bg-neutral-900/80 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white/30 focus:bg-neutral-900 transition-all shadow-lg backdrop-blur-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 rounded-full transition cursor-pointer"
                aria-label="Limpar pesquisa"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Categories Filter (GooeyNav React Bits) */}
          <div className="mt-6 flex justify-center max-w-full overflow-x-auto py-2">
            <GooeyNav
              items={gooeyItems}
              activeIndex={activeCategoryIndex}
              onChange={(index) => {
                if (categories[index]) {
                  setActiveSegmentFilter(categories[index].id);
                }
              }}
              theme="dark"
              size="sm"
              color="#ffffff"
              activeTextColor="#000000"
              colors={["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#a855f7"]}
              frame={true}
              particleCount={15}
              spread={48}
              animationTime={600}
              timeVariance={300}
              gooeyness={0.5}
              wobble={0.5}
              hoverEffect={true}
            />
          </div>
        </div>

        {/* Courses Section (Xinyu List Layout) */}
        <div className="mt-8 [animation:fadeSlideIn_0.8s_ease-out_0.3s_both]">
          
          {/* Section Bar */}
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              {getSectionTitle()}
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              {filteredCourses.length} {filteredCourses.length === 1 ? "curso encontrado" : "cursos encontrados"}
            </span>
          </div>

          {/* Empty State */}
          {filteredCourses.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-md">
              <Search className="w-8 h-8 text-neutral-500 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white mb-1">Nenhum curso encontrado</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-5">
                Não encontramos nenhum material correspondente à sua busca &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveSegmentFilter("todos");
                }}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition cursor-pointer shadow-md shadow-red-600/30"
              >
                Limpar filtros e ver todos
              </button>
            </div>
          ) : (
            /* Clean Table / List of Courses (Xinyu Style) */
            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl divide-y divide-white/5 backdrop-blur-md overflow-hidden shadow-2xl">
              {filteredCourses.map((course) => {
                const isCombo = course.title.toLowerCase().includes("combo");

                return (
                  <div
                    key={course.id}
                    className="flex items-center justify-between gap-3 sm:gap-4 p-4 hover:bg-white/[0.03] transition-colors group"
                  >
                    {/* Course Info */}
                    <div 
                      className="min-w-0 flex-1 cursor-pointer"
                      onClick={() => openCheckout(course)}
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-[15px] font-medium text-white group-hover:text-red-400 transition-colors truncate">
                          {course.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-2.5 mt-1">
                        <span className="text-xs sm:text-sm font-semibold text-neutral-200">
                          {formatCurrency(course.price)}
                        </span>
                        {course.originalPrice > course.price && (
                          <span className="text-[11px] text-neutral-500 line-through">
                            {formatCurrency(course.originalPrice)}
                          </span>
                        )}
                        <span className="text-[11px] text-neutral-500 hidden sm:inline">
                          • Google Drive Vitalício
                        </span>
                      </div>
                    </div>

                    {/* Action Side */}
                    <div className="shrink-0 flex items-center gap-2.5">
                      {isCombo && (
                        <span className="text-[11px] font-semibold text-neutral-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                          Combo
                        </span>
                      )}

                      <StarBorder
                        onClick={() => openCheckout(course)}
                        color="#ffffff"
                        trailColor="#ef4444"
                        duration={3.5}
                        direction="clockwise"
                        stars={1}
                        trailLength={0.35}
                        thickness={1.5}
                        radius={9999}
                        glow={0.7}
                        hover="lap"
                        sparkle={true}
                        clickPulse={true}
                        backgroundColor="#dc2626"
                        textColor="#ffffff"
                        className="text-xs sm:text-sm font-semibold px-5 py-2 shadow-md shadow-red-600/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                      >
                        Adquirir
                      </StarBorder>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </main>

      {/* Sleek Minimal Footer */}
      <Footer />

      {/* Checkout Modal */}
      <CheckoutModal />
    </div>
  );
}
