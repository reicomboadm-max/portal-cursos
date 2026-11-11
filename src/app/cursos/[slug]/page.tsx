"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCourseBySlug, SITE_SETTINGS } from "@/lib/data";
import type { Course } from "@/types";

export default function CursoDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const course = getCourseBySlug(params.slug);

  if (!course) notFound();

  const onLogin = () => setUser({ name: "Usuário", email: "usuario@gmail.com", role: "student" });
  const onLogout = () => setUser(null);

  return (
    <div className="min-h-screen bg-surface-100 text-white">
      <Navbar user={user} onLogin={onLogin} onLogout={onLogout} />
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 mb-6"
          >
            ← Voltar aos cursos
          </Link>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="h-64 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 {course.coverGradient} opacity-20" />
                <div className="relative z-10 text-center">
                  <div className="px-3 py-1 rounded-full border border-white/20 bg-white/10 text-white text-xs font-bold mb-3">
                    {course.platform}
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                  <span className="text-gray-400 text-sm">{course.folderSize} • {course.totalFiles}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                <span>Atualizado em:</span>
                <span>{new Date(course.updatedAt).toLocaleDateString("pt-BR")}</span>
              </div>

              <div className="space-y-3">
                {course.features.map((f) => (
                  <div key={f} className="flex items-start gap-3 text-sm text-gray-300">
                    <span className="text-brand-400 mt-0.5">▹</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-surface-200 p-6">
                <h2 className="text-lg font-bold mb-4">Valor do curso</h2>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold text-white">R$ {course.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  {course.originalPrice > course.price && (
                    <span className="text-sm text-gray-500 line-through">
                      R$ {course.originalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-6">
                  Acesso imediato via Google Drive após confirmação do pagamento.
                </p>
                <button
                  onClick={() => {
                    // navigate to checkout
                    window.location.href = `/checkout?course=${course.id}`;
                  }}
                  className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-neon flex items-center justify-center gap-2"
                >
                  Comprar Agora
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-surface-200 p-6">
                <h2 className="text-lg font-bold mb-4">O que está incluído</h2>
                <ul className="space-y-3 text-sm text-gray-300">
                  {course.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-accent-emerald mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
