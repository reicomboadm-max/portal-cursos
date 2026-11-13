"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Como e quando recebo o acesso ao curso após o pagamento via PIX?",
      a: "Após a realização do PIX, nossa equipe adiciona o seu endereço do Gmail diretamente com permissão de leitor na pasta oficial do Google Drive. O prazo para o envio do convite de acesso é de até 24 horas após a confirmação do pagamento.",
    },
    {
      q: "O acesso tem prazo de validade ou expira?",
      a: "Não! O acesso é vitalício. Você poderá acessar e consultar o material sempre que precisar, sem taxas de renovação ou prazos de expiração.",
    },
    {
      q: "Posso baixar as videoaulas e PDFs para assistir offline no computador ou tablet?",
      a: "Sim, com certeza. Você pode tanto assistir online diretamente no player do Google Drive quanto fazer o download de todas as videoaulas (MP4) e livros digitais (PDF) para o seu computador, celular ou tablet.",
    },
    {
      q: "Como funcionam as atualizações se o edital for publicado ou retificado?",
      a: "Nossa equipe acompanha as bancas examinadoras e editais. Sempre que novos materiais ou retificações pós-edital forem lançados pelos cursos de referência, eles são sincronizados diretamente na mesma pasta do Google Drive sem nenhum custo extra.",
    },
    {
      q: "Preciso pagar alguma mensalidade ou taxa extra?",
      a: "Não. O pagamento é único. Você adquire o curso e não possui nenhuma recorrência ou cobrança posterior.",
    },
    {
      q: "Posso alterar o meu e-mail do Gmail após a compra?",
      a: "Sim. Caso queira receber o convite em outro e-mail do Gmail, basta enviar uma mensagem para o nosso suporte no Telegram (@Baldodrive) informando o código do seu pedido.",
    },
  ];

  return (
    <section className="py-16 bg-[#07090e]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>DÚVIDAS FREQUENTES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Perguntas Frequentes sobre os Drives
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Tudo o que você precisa saber sobre o envio em até 24h e o acesso aos materiais.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-white/5 bg-surface-100/50 backdrop-blur-sm overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-white hover:text-indigo-300 transition"
                >
                  <span className="font-semibold text-sm sm:text-base leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-indigo-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
