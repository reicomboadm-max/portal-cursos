"use client";

import React from "react";
import Link from "next/link";
import { FolderLock, ShieldCheck, MessageCircle, Send } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { BrandLogo } from "@/components/BrandLogo";

export default function Footer() {
  const { settings, setActiveSegmentFilter } = useStore();
  const cleanWhatsappNumber = settings.whatsappSupport.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20os%20drives%20de%20cursos.`;

  return (
    <footer className="border-t border-white/10 bg-neutral-950 text-neutral-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <BrandLogo size={40} />
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-white tracking-tight">
                  Central do <span className="text-red-500">Aprovado</span>
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">centraldoaprovado.com.br</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              O maior acervo de pastas e materiais de concursos públicos do Brasil no Google Drive. Videoaulas, PDFs e resumos com download 100% liberado.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Envio em até 24h no Gmail</span>
            </div>
          </div>

          {/* Column 2: Cursos & Segmentos */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Áreas de Concurso
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveSegmentFilter("fiscal")}
                  className="hover:text-emerald-400 transition"
                >
                  🏛️ Área Fiscal & Tributária
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSegmentFilter("policial")}
                  className="hover:text-sky-400 transition"
                >
                  🛡️ Carreiras Policiais
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSegmentFilter("tribunais")}
                  className="hover:text-amber-400 transition"
                >
                  ⚖️ Tribunais & Ministério Público
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSegmentFilter("administrativo")}
                  className="hover:text-purple-400 transition"
                >
                  🏢 Administrativo & Bancos
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSegmentFilter("disciplinas")}
                  className="hover:text-indigo-400 transition"
                >
                  📚 Professores & Isoladas
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSegmentFilter("todos")}
                  className="hover:text-white transition font-semibold"
                >
                  Ver Todos os Cursos
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Aluno & Admin */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/aluno" className="hover:text-indigo-400 transition">
                  🎓 Área do Aluno (Meus Drives)
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-indigo-400 transition flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Painel Administrativo</span>
                </Link>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-white transition">
                  ❓ Como Funciona a Liberação
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition">
                  💬 Perguntas Frequentes
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Atendimento & Suporte */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Suporte & Atendimento
            </h4>
            <p className="text-xs text-gray-400">
              Dúvidas sobre o envio, liberação do Drive ou comprovante de PIX? Fale com a equipe:
            </p>
            <div className="space-y-2 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Atendimento WhatsApp</span>
              </a>
              {settings.telegramSupport && (
                <a
                  href={settings.telegramSupport.startsWith("http") ? settings.telegramSupport : `https://t.me/${settings.telegramSupport.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition"
                >
                  <Send className="w-4 h-4 text-sky-400" />
                  <span>Canal no Telegram</span>
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} {settings.siteName}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>⚡ Pagamento Instantâneo via PIX</span>
            <span>•</span>
            <span>📂 Google Drive Vitalício</span>
            <span>•</span>
            <span>🔒 Transações Criptografadas</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
