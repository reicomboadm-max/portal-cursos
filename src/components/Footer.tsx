"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, Send, ShieldCheck, MailCheck, HardDrive } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { BrandLogo } from "@/components/BrandLogo";

export default function Footer() {
  const { settings } = useStore();
  const cleanWhatsappNumber = settings.whatsappSupport.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20os%20drives%20de%20cursos.`;

  return (
    <footer className="border-t border-white/10 bg-neutral-950/80 backdrop-blur-md text-neutral-400 text-xs mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Main Clean Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          
          {/* Brand Info */}
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <BrandLogo size={42} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-white tracking-tight">
                  CENTRAL DO <span className="text-red-500">APROVADO</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  DRIVE 2026
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Pastas oficiais organizadas no Google Drive com download 100% liberado.
              </p>
            </div>
          </div>

          {/* Quick Action Links & Support */}
          <div className="flex items-center flex-wrap justify-center gap-3">
            <Link
              href="/aluno"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-semibold transition border border-white/10 hover:text-white"
            >
              Área do Aluno (Meus Drives)
            </Link>

            <a
              href="#faq"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-semibold transition border border-white/10 hover:text-white"
            >
              Dúvidas Frequentes
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold transition border border-emerald-500/30"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Suporte WhatsApp</span>
            </a>

            {settings.telegramSupport && (
              <a
                href={settings.telegramSupport.startsWith("http") ? settings.telegramSupport : `https://t.me/${settings.telegramSupport.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-semibold transition border border-sky-500/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </a>
            )}
          </div>

        </div>

        {/* Minimal Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <p>
            © {new Date().getFullYear()} Central do Aprovado. Acesso vitalício para estudo pessoal.
          </p>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
              <MailCheck className="w-3 h-3" /> Envio no Gmail em até 24h
            </span>
            <span>•</span>
            <span className="text-neutral-400">Download 100% Liberado</span>
            <span>•</span>
            <span className="text-neutral-400">PIX Instantâneo</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
