"use client";

import React from "react";
import { Star, ShieldCheck, CheckCircle2 } from "lucide-react";

export function Testimonials() {
  const reviews = [
    {
      name: "Rodrigo Mendonça",
      cargo: "Aprovado SEFAZ-MG (Auditor Fiscal)",
      comment: "A organização das pastas no Drive é surreal. Aulas renomeadas na ordem certinha, PDFs comentados e Passo Estratégico em pastas separadas. Valeu cada centavo!",
      rating: 5,
      date: "Há 3 dias",
      tag: "Área Fiscal",
    },
    {
      name: "Mariana Alencar",
      cargo: "Estudando para TSE Unificado / TRE",
      comment: "Fiz o PIX, informei meu Gmail e no mesmo dia o convite do Google Drive já estava liberado na minha caixa de entrada. Já baixei as videoaulas pro meu tablet.",
      rating: 5,
      date: "Há 1 semana",
      tag: "Tribunais",
    },
    {
      name: "Guilherme Sampaio",
      cargo: "Aprovado TRF-3 (Analista Judiciário)",
      comment: "Eu não tinha 2 mil reais pra pagar nos cursos das plataformas oficiais. O material aqui é exatamente o mesmo, super atualizado 2026. Ajudou demais na minha aprovação!",
      rating: 5,
      date: "Há 2 semanas",
      tag: "Tribunais",
    },
    {
      name: "Camila Bittencourt",
      cargo: "Concurseira Receita Federal & SEFAZ-SP",
      comment: "Comprei o Super Combo Passaporte Fiscal. Veio com Receita, todas as SEFAZs e ainda suporte pelo Telegram quando precisei tirar dúvida sobre um arquivo. Nota 10!",
      rating: 5,
      date: "Há 5 dias",
      tag: "Combo Fiscal",
    },
  ];

  return (
    <section className="py-16 border-b border-white/5 bg-[#090d16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>AVALIAÇÕES DE ALUNOS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Quem comprou nossos drives recomenda
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Mais de 5.800 alunos estudando diariamente com nosso acervo atualizado no Google Drive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((rev, idx) => (
            <div 
              key={idx} 
              className="glass-card p-5 rounded-2xl flex flex-col justify-between border border-white/5 hover:border-indigo-500/30"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 text-gray-400">
                    {rev.tag}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5">
                <p className="text-xs font-bold text-white">{rev.name}</p>
                <p className="text-[11px] text-indigo-400 font-medium truncate">{rev.cargo}</p>
                <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3 h-3" /> Compra Verificada
                  </span>
                  <span>{rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
