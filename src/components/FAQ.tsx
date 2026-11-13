"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck, Download, Clock, RefreshCw, Smartphone } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ReactNode;
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "Como recebo o acesso ao material após o pagamento?",
      answer: "O acesso é compartilhado diretamente no seu e-mail do Gmail cadastrado na finalização do pedido. Você receberá o convite oficial do Google Drive para acessar a pasta completa em até 24 horas (geralmente em poucos minutos após a confirmação do PIX).",
      icon: <Clock className="w-4 h-4 text-emerald-400" />,
    },
    {
      question: "Posso baixar as videoaulas e os PDFs no meu computador ou celular?",
      answer: "Sim! Todas as videoaulas em alta resolução, resumos esquematizados, mapas mentais e PDFs contam com download 100% liberado e irrestrito. Você pode assistir diretamente na nuvem pelo aplicativo do Google Drive ou salvar localmente para estudar offline onde quiser.",
      icon: <Download className="w-4 h-4 text-sky-400" />,
    },
    {
      question: "O acesso expira ou existe alguma mensalidade oculta?",
      answer: "Não! O valor é único, sem nenhuma assinatura ou renovação periódica. Uma vez adquirido, o acesso à pasta compartilhada no seu Google Drive é vitalício.",
      icon: <ShieldCheck className="w-4 h-4 text-amber-400" />,
    },
    {
      question: "Os materiais recebem atualizações pós-edital?",
      answer: "Sim. Nossas pastas recebem sincronizações constantes com novas aulas gravadas, revisões de véspera, simulados e complementações conforme as bancas examinadoras publicam editais e retificações.",
      icon: <RefreshCw className="w-4 h-4 text-emerald-400" />,
    },
    {
      question: "Como posso acessar e gerenciar meus cursos comprados?",
      answer: "Basta entrar na Área do Aluno (/aluno) no menu superior e digitar o seu e-mail do Gmail. Lá você encontra a lista de todos os seus pedidos, status de pagamento e os links diretos para cada pasta do Drive.",
      icon: <Smartphone className="w-4 h-4 text-purple-400" />,
    },
    {
      question: "Quais são as formas de pagamento disponíveis?",
      answer: "Aceitamos pagamento instantâneo via PIX (QR Code e código Copia e Cola) com aprovação rápida e segura, protegida por criptografia de ponta a ponta.",
      icon: <HelpCircle className="w-4 h-4 text-rose-400" />,
    },
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="mt-16 mb-8 scroll-mt-20">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-semibold mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-red-500" />
          <span>Tire suas dúvidas</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Perguntas Frequentes
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Tudo o que você precisa saber sobre as pastas no Google Drive, liberação e downloads.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "bg-neutral-900/80 border-white/20 shadow-xl"
                  : "bg-neutral-900/40 border-white/5 hover:border-white/15"
              } backdrop-blur-md`}
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                className="w-full min-h-[52px] px-5 py-4 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-white/5 shrink-0">
                    {faq.icon}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-red-400" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-neutral-300 leading-relaxed border-t border-white/5">
                  <p className="pl-11">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

