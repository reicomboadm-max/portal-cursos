"use client";

import React, { useState } from "react";
import { Send, X, ShieldCheck } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function FloatingSupportWidget() {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const telegramSupportUrl = settings.telegramSupport || "https://t.me/Baldodrive";
  const telegramChannelUrl = settings.telegramChannel || "https://t.me/comboreiboss";

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Expanded Support Card */}
      {isOpen && (
        <div className="w-80 bg-[#0c101d] border border-white/10 rounded-2xl p-4 shadow-2xl animate-fadeIn space-y-3.5 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Central de Atendimento</h4>
                <p className="text-[10px] text-sky-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" /> Telegram Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Fechar suporte"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            Dúvidas sobre o conteúdo dos cursos, liberação da pasta no Google Drive ou envio em até 24 horas? Fale agora pelo Telegram:
          </p>

          <div className="space-y-2">
            <a
              href={telegramSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 font-bold text-xs transition group"
            >
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-400 group-hover:scale-110 transition" />
                <span>Suporte: @Baldodrive</span>
              </div>
              <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full">
                Atendimento
              </span>
            </a>

            <a
              href={telegramChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 font-bold text-xs transition group"
            >
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400 group-hover:scale-110 transition" />
                <span>Suporte: Combo Rei</span>
              </div>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                Atendimento
              </span>
            </a>
          </div>

          <div className="pt-1 flex items-center justify-center gap-1.5 text-[10px] text-gray-400 border-t border-white/5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Garantia de Entrega no Gmail em até 24h</span>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 py-3 px-4 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs shadow-xl shadow-sky-500/30 transition-all hover:scale-105 cursor-pointer border border-sky-300/40"
        aria-label="Abrir suporte Telegram"
      >
        <div className="relative">
          <Send className="w-5 h-5 fill-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sky-300 rounded-full" />
        </div>
        <span className="hidden sm:inline">Dúvidas? Suporte no Telegram</span>
        <span className="sm:hidden">Telegram</span>
      </button>
    </div>
  );
}
