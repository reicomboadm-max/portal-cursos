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
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Download, 
  ShieldCheck, 
  Star, 
  HardDrive,
  FileText,
  Video,
  ArrowRight,
  Search,
  Check
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

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col">
      <TopBanner />
      <Header />
      <Hero />

      {/* Main Course Catalog Section */}
      <main id="cursos" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Acervo Selecionado 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeSegmentFilter === "fiscal" && "🏛️ Cursos da Área Fiscal (Receita, SEFAZ, ISS)"}
              {activeSegmentFilter === "tribunais" && "⚖️ Cursos para Tribunais (TJ, TRT, TRF, TSE)"}
              {activeSegmentFilter === "combos" && "⭐ Super Combos Passaporte VIP"}
              {activeSegmentFilter === "todos" && "Todos os Cursos Disponíveis para Envio"}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Selecione o seu curso e receba o convite de acesso compartilhado no seu Gmail em até 24 horas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300">
              {filteredCourses.length} {filteredCourses.length === 1 ? "curso encontrado" : "cursos encontrados"}
            </span>
          </div>
        </div>

        {/* Empty state when search returns zero */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded-3xl bg-surface-100/40 p-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nenhum curso encontrado</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
              Não encontramos resultados para &ldquo;{searchQuery}&rdquo;. Tente buscar por outros termos como &ldquo;Receita&rdquo;, &ldquo;SEFAZ&rdquo;, &ldquo;TRF&rdquo; ou &ldquo;Tribunais&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveSegmentFilter("todos");
              }}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
            >
              Ver todos os cursos
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isFiscal = course.segment === "fiscal";
              const isCombo = course.segment === "combos";
              
              return (
                <div
                  key={course.id}
                  className="group relative rounded-3xl border border-white/10 bg-[#0e1424]/80 backdrop-blur-md hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/15 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Glowing top line */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${
                    isCombo 
                      ? "from-amber-400 via-yellow-500 to-amber-600" 
                      : isFiscal 
                        ? "from-indigo-500 via-purple-500 to-indigo-700" 
                        : "from-cyan-400 via-sky-500 to-blue-600"
                  }`} />

                  <div className="p-6">
                    {/* Top tags row */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                        isCombo
                          ? "bg-amber-400/10 text-amber-300 border-amber-400/30"
                          : isFiscal
                            ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/30"
                            : "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                      }`}>
                        {isCombo ? "⭐ COMBO VIP" : isFiscal ? "🏛️ FISCAL" : "⚖️ TRIBUNAIS"}
                      </span>

                      <span className="text-[11px] font-semibold text-gray-400 bg-white/5 px-2.5 py-0.5 rounded-md border border-white/5 truncate max-w-[150px]">
                        {course.platform}
                      </span>
                    </div>

                    {/* Course Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug mb-2">
                      {course.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed mb-4">
                      {course.shortDescription || course.description}
                    </p>

                    {/* Specs Pills: Folder Size & Files */}
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/5 text-[11px] text-gray-300">
                        <HardDrive className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{course.folderSize}</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/5 text-[11px] text-gray-300">
                        <Video className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{course.totalFiles}</span>
                      </div>
                    </div>

                    {/* Included Features Bullet Points */}
                    <div className="space-y-1.5 mb-6 border-t border-white/5 pt-4">
                      {course.features.slice(0, 3).map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery notice tag */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-300 mb-6">
                      <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Convite enviado no seu Gmail em até 24h</span>
                    </div>
                  </div>

                  {/* Card Footer: Pricing and CTA */}
                  <div className="p-6 pt-0 mt-auto">
                    <div className="flex items-baseline justify-between mb-4 border-t border-white/5 pt-4">
                      <div>
                        {course.originalPrice > course.price && (
                          <span className="text-xs text-gray-400 line-through block">
                            {formatCurrency(course.originalPrice)}
                          </span>
                        )}
                        <span className="text-2xl sm:text-3xl font-black text-white">
                          {formatCurrency(course.price)}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-medium">
                          Pagamento único via PIX
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {course.rating || 4.9}
                        </span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          {course.reviewsCount || 120} alunos
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => openCheckout(course)}
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                    >
                      <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                      <span>Comprar Acesso no Drive</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Benefits Section: Por que nossos drives? */}
      <section id="como-funciona" className="py-16 border-t border-white/5 bg-[#090e1b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
              Diferenciais do Nosso Acervo
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Por que estudar com os nossos drives?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-300">
              Economize milhares de reais tendo acesso aos melhores materiais de concurso público do país.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-[#0c1222] border border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20">
                <Clock className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Envio no Gmail em até 24h</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Assim que o PIX é confirmado, adicionamos seu Gmail como participante com permissão total de acesso à pasta do curso.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0c1222] border border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-500/20">
                <Download className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Download 100% Liberado</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Você pode assistir diretamente no Google Drive ou baixar as videoaulas em MP4 e PDFs para assistir offline no celular, tablet ou PC.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0c1222] border border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
                <FolderLock className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Acesso Vitalício & Seguro</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Sem assinaturas mensais ou cobranças surpresa. Pague uma única vez e mantenha o acesso à pasta permanentemente.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0c1222] border border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/20">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Sincronização 2026</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Novas aulas, retificações de edital e simulados inéditos são inseridos automaticamente na pasta sem nenhum custo adicional.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <div id="faq">
        <FaqSection />
      </div>

      {/* Footer */}
      <Footer />

      {/* Checkout Drawer Modal */}
      <CheckoutModal />

    </div>
  );
}
