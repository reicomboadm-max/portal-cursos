"use client";

import React, { useState } from "react";
import { MessageCircle, Send, X, HelpCircle, ShieldCheck } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function FloatingSupportWidget() {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const cleanWhatsapp = (settings.whatsappSupport || "5511999999999").replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    "Olá! Estou no site e gostaria de tirar dúvidas sobre o acesso aos Drives de Concursos 2026."
  )}`;
  const telegramUrl = settings.telegramSupport || "https://t.me";

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Expanded Support Card */}
      {isOpen && (
        <div className="w-80 bg-[#0c101d] border border-white/10 rounded-2xl p-4 shadow-2xl animate-fadeIn space-y-3.5 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Central de Atendimento</h4>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Atendimento Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            Dúvidas sobre o conteúdo dos cursos, liberação da pasta no Google Drive ou envio em até 24 horas? Fale agora com nossa equipe:
          </p>

          <div className="space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition group"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                <span>Suporte via WhatsApp</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                Mais Rápido
              </span>
            </a>

            {telegramUrl && (
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition group"
              >
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                  <span>Comunidade Telegram</span>
                </div>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">
                  Canal VIP
                </span>
              </a>
            )}
          </div>

          <div className="pt-1 flex items-center justify-center gap-1.5 text-[10px] text-gray-400 border-t border-white/5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Garantia de Entrega e Suporte Humano</span>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 py-3 px-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 cursor-pointer border border-emerald-300/40"
        aria-label="Abrir suporte WhatsApp"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 fill-black" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full" />
        </div>
        <span className="hidden sm:inline">Dúvidas? Fale no WhatsApp</span>
        <span className="sm:hidden">Dúvidas</span>
      </button>
    </div>
  );
}

