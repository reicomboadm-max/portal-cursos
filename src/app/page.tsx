import Link from "next/link";
import { ArrowRight, Play, ShieldCheck, Users, CreditCard, Globe, Target, Download } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { COURSES, SEGMENTS, SITE_SETTINGS } from "@/lib/data";

export const metadata = {
  title: SITE_SETTINGS.siteName,
  description: SITE_SETTINGS.tagline,
};

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-100 text-white">
      <main>
        {/* Hero */}
        <section className="relative px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%_,rgba(99,102,241,0.25),transparent_70%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-xs font-bold mb-6">
              {SITE_SETTINGS.bannerNotice}
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Prepare-se para<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-accent-cyan to-brand-400">
                concursos públicos
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Cursos completos com acesso imediato via Google Drive. Segmentos Fiscal e Tribunais
              com conteúdo atualizado e suporte dedicado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cursos"
                className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-lg transition-colors shadow-neon flex items-center justify-center gap-2"
              >
                Ver Cursos <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#como-funciona"
                className="px-8 py-4 border border-white/20 hover:bg-white/10 text-white rounded-xl font-semibold text-lg transition-colors"
              >
                Como Funciona <Play className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Segments */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Escolha seu segmento</h2>
              <p className="text-gray-400">Dois segmentos focados para sua aprovação</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {SEGMENTS.map((seg) => (
                <Link
                  key={seg.key}
                  href={`/cursos?segmento=${seg.key}`}
                  className="group relative rounded-2xl border border-white/10 bg-surface-200/50 p-8 hover:border-white/30 hover:bg-surface-200 transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${seg.color === "text-brand-500 border-brand-500/30" ? "bg-brand-500/20 text-brand-400 border-brand-500/30" : "bg-accent-cyan/20 text-accent-cyan/400 border-accent-cyan/30"}`}>
                    {seg.key === "fiscal" ? <Target className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-white transition-colors">{seg.label}</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    {seg.key === "fiscal"
                      ? "Cargos fiscais federais, estaduais e municipais"
                      : "Tribunais de justiça e federais"}
                  </p>
                  <div className="mt-6 flex items-center text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
                    Ver cursos <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-surface-200/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Destaques</h2>
              <Link href="/cursos" className="text-sm font-medium text-brand-400 hover:text-brand-300">
                Ver todos os cursos
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {COURSES.slice(0, 4).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="como-funciona" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Como funciona</h2>
              <p className="text-gray-400">Do pagamento ao acesso no Drive em poucos minutos</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <CreditCard className="w-8 h-8 text-brand-400" />,
                  title: "Escolha o curso",
                  desc: "Selecione o curso do segmento Fiscal ou Tribunais que deseja adquirir.",
                },
                {
                  icon: <ShieldCheck className="w-8 h-8 text-accent-emerald" />,
                  title: "Pagamento PIX",
                  desc: "Gere o PIX e pague pelo app do seu banco. Confirmação automática.",
                },
                {
                  icon: <Download className="w-8 h-8 text-accent-cyan" />,
                  title: "Acesso no Drive",
                  desc: "Receba o link do Google Drive por e-mail e acesse todo o conteúdo.",
                },
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-4 bg-surface-200/50">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-surface-200 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-500 text-center">
            {SITE_SETTINGS.siteName} - Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
