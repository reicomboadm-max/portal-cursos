"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { SEGMENTS } from "@/lib/data";
import { useStore } from "@/context/StoreContext";
import type { Course } from "@/types";

export default function CursosPage() {
  const { courses, settings, currentUser, loginAsStudent, logout } = useStore();
  const [segmento, setSegmento] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = courses.filter((c) => {
    if (segmento && c.segment !== segmento) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return c.active;
  });

  const onLogin = () => loginAsStudent("usuario@gmail.com", "Usuário");
  const onLogout = () => logout();

  return (
    <div className="min-h-screen bg-surface-100 text-white">
      <Navbar user={currentUser} onLogin={onLogin} onLogout={onLogout} />
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Catálogo de Cursos</h1>
              <p className="text-gray-400">{settings.tagline}</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="text"
                placeholder="Buscar curso ou plataforma..."
                className="flex-1 min-w-[200px] px-4 py-2.5 rounded-lg border border-white/10 bg-surface-200/50 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={() => setSearch("")}
                className="px-3 py-2.5 rounded-lg border border-white/10 bg-surface-200/50 text-white text-sm hover:bg-white/10 transition-colors"
                title="Limpar busca"
              >
                Limpar
              </button>
            </div>
          </div>

          {/* Segment filters */}
          <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar mb-6 border-b border-white/10">
            <button
              onClick={() => setSegmento(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${!segmento ? "bg-brand-600 text-white shadow-neon" : "bg-white/5 text-gray-400 hover:bg-white/10 border-white/10"}`}
            >
              Todos
            </button>
            {SEGMENTS.map((seg) => (
              <button
                key={seg.key}
                onClick={() => setSegmento(seg.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border ${segmento === seg.key ? "bg-brand-600 text-white shadow-neon border-brand-500" : "bg-white/5 text-gray-400 hover:bg-white/10 border-white/10"}`}
              >
                {seg.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">Nenhum curso encontrado</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
