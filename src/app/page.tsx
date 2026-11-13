"use client";

import React from "react";
import { TopBanner } from "@/components/TopBanner";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { useStore } from "@/context/StoreContext";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Testimonials } from "@/components/Testimonials";
import { FaqSection } from "@/components/FaqSection";
import Footer from "@/components/Footer";
import {
  FolderLock,
  Clock,
  CheckCircle2,
  Download,
  ShieldCheck,
  Star,
  HardDrive,
  Video,
  Search,
  Check,
  Zap,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  const { 
    courses, 
    activeSegmentFilter, 
    setActiveSegmentFilter, 
    searchQuery, 
    setSearchQuery,
    openCheckout 
  } = useStore();

  // Filter courses by segment and search query
  const filteredCourses = courses.filter((course) => {
    if (!course.active) return false;
    // Exclude any leftover combos
    if (course.segment === ("combos" as any) || course.title.toLowerCase().startsWith("combo")) {
      return false;
    }
    if (activeSegmentFilter !== "todos" && course.segment !== activeSegmentFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const inTitle = course.title.toLowerCase().includes(q);
      const inDesc = course.description.toLowerCase().includes(q);
      const inPlatform = course.platform.toLowerCase().includes(q);
      if (!inTitle && !inDesc && !inPlatform) return false;
    }
    return true;
  });

  const getAreaTitle = () => {
    switch (activeSegmentFilter) {
      case "fiscal":
        return "🏛️ Cursos da Área Fiscal & Tributária (Receita, SEFAZ, ISS)";
      case "policial":
        return "🛡️ Cursos de Carreiras Policiais (PF, PRF, PC, Delegado)";
      case "tribunais":
        return "⚖️ Cursos para Tribunais e Ministério Público (TRF, TRT, TJ, TRE)";
      case "administrativo":
        return "🏢 Cursos da Área Administrativa & Bancária (CNU, BB, Caixa, INSS)";
      case "disciplinas":
        return "📚 Professores Renomados & Disciplinas Isoladas";
      default:
        return "Catálogo Completo de Materiais de Estudo";
    }
  };

  const getBadgeStyle = (segment: string) => {
    switch (segment) {
      case "fiscal":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "policial":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "tribunais":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "administrativo":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "disciplinas":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const getAreaLabel = (segment: string) => {
    switch (segment) {
      case "fiscal":
        return "Área Fiscal";
      case "policial":
        return "Carreira Policial";
      case "tribunais":
        return "Tribunais & MP";
      case "administrativo":
        return "Admin & Bancos";
      case "disciplinas":
        return "Professor VIP";
      default:
        return "Concurso 2026";
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col font-sans">
      <TopBanner />
      <Header />
      <Hero />

      {/* Trust & Guarantee Bar */}
      <section className="py-8 border-b border-slate-800 bg-[#0E1526]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Google Drive Oficial</h4>
                <p className="text-xs text-slate-400">Pastas compartilhadas no Gmail</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Download 100% Liberado</h4>
                <p className="text-xs text-slate-400">Assista online ou baixe aulas e PDFs</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Liberação em até 24h</h4>
                <p className="text-xs text-slate-400">Envio pontual após o PIX</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Acesso Vitalício</h4>
                <p className="text-xs text-slate-400">Sem mensalidades ou renovações</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Course Catalog Section */}
      <main id="cursos" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1.5">
              Acervo Atualizado 2026
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {getAreaTitle()}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Selecione o seu curso e receba o convite de acesso compartilhado diretamente no seu Gmail.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              {filteredCourses.length} {filteredCourses.length === 1 ? "curso disponível" : "cursos disponíveis"}
            </span>
          </div>
        </div>

        {/* Empty state when search returns zero */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20 border border-slate-800 rounded-2xl bg-slate-900/40 p-8">
            <div className="w-14 h-14 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-700">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Nenhum curso encontrado</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Não encontramos resultados para &ldquo;{searchQuery}&rdquo;. Tente buscar por outros termos como &ldquo;Receita&rdquo;, &ldquo;SEFAZ&rdquo;, &ldquo;TRF&rdquo; ou pelo nome do professor.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveSegmentFilter("todos");
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer shadow-md"
            >
              Ver todos os cursos
            </button>
          </div>
        ) : (
          /* Cards Grid - Colunas menores e mais compactas (4 colunas no desktop) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCourses.map((course) => {
              return (
                <div
                  key={course.id}
                  className="group rounded-2xl border border-slate-800 bg-[#111827] hover:border-slate-700 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-4 sm:p-4.5">
                    {/* Top tags row */}
                    <div className="flex items-center justify-between gap-1.5 mb-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getBadgeStyle(course.segment)}`}>
                        {getAreaLabel(course.segment)}
                      </span>

                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 truncate max-w-[140px]">
                        {course.platform}
                      </span>
                    </div>

                    {/* Course Title */}
                    <h3 
                      className="text-sm sm:text-[15px] font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug mb-1.5 line-clamp-2 min-h-[2.6rem]"
                      title={course.title}
                    >
                      {course.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {course.shortDescription || course.description}
                    </p>

                    {/* Specs: Folder Size & Files */}
                    <div className="grid grid-cols-2 gap-1.5 mb-3">
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[10.5px] text-slate-300">
                        <HardDrive className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{course.folderSize}</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[10.5px] text-slate-300">
                        <Video className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{course.totalFiles}</span>
                      </div>
                    </div>

                    {/* Included Features Bullet Points */}
                    <div className="space-y-1 mb-3 border-t border-slate-800/80 pt-2.5">
                      {course.features.slice(0, 2).map((feat, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-tight line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery notice tag */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10.5px] font-medium text-emerald-400 mb-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">Convite no seu Gmail em até 24h</span>
                    </div>
                  </div>

                  {/* Card Footer: Pricing and CTA */}
                  <div className="p-4 sm:p-4.5 pt-0 mt-auto">
                    <div className="flex items-baseline justify-between mb-3 border-t border-slate-800/80 pt-2.5">
                      <div>
                        {course.originalPrice > course.price && (
                          <span className="text-[10px] text-slate-500 line-through block">
                            {formatCurrency(course.originalPrice)}
                          </span>
                        )}
                        <span className="text-xl sm:text-2xl font-black text-white">
                          {formatCurrency(course.price)}
                        </span>
                        <span className="text-[9.5px] text-slate-400 block font-medium">
                          Pagamento único via PIX
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                          <Star className="w-2.5 h-2.5 fill-amber-400" />
                          {course.rating || 4.9}
                        </span>
                        <span className="text-[9.5px] text-slate-400 block mt-0.5">
                          {course.reviewsCount || 120} alunos
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => openCheckout(course)}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide shadow-md shadow-emerald-900/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                    >
                      <Zap className="w-3.5 h-3.5 fill-white" />
                      <span>Comprar Acesso</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Benefits Section: Por que estudar com nossos drives? */}
      <section id="como-funciona" className="py-14 border-t border-slate-800 bg-[#0E1526]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              Diferenciais do Nosso Acervo
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3">
              Por que estudar com os nossos drives?
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Economize milhares de reais tendo acesso aos melhores materiais de concurso público do país.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
                <Clock className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Envio no Gmail em até 24h</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Assim que o PIX é confirmado, adicionamos seu Gmail como participante com permissão total de acesso à pasta do curso.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20">
                <Download className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Download 100% Liberado</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Você pode assistir diretamente no Google Drive ou baixar as videoaulas em MP4 e PDFs para assistir offline no celular, tablet ou PC.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 border border-sky-500/20">
                <HardDrive className="w-5 h-5 text-sky-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Organização Profissional</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Todas as disciplinas são estruturadas em pastas numeradas, com cronogramas, teoria completa, resumos esquematizados e questões comentadas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Pagamento Seguro via PIX</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cobrança oficial processada pela VeloraPay com confirmação bancária imediata e emissão automática do registro do pedido.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FaqSection />

      {/* Footer */}
      <Footer />

      {/* Interactive Checkout Modal */}
      <CheckoutModal />
    </div>
  );
}
