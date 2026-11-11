"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MOCK_STUDENTS, MOCK_ORDERS, SITE_SETTINGS } from "@/lib/data";
import { Mail, Play, Download, CreditCard, ShieldCheck, Clock, ArrowRight } from "lucide-react";

export default function MinhaContaPage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  // Simular login automático para demonstração
  useEffect(() => {
    const saved = localStorage.getItem("pc_user");
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      setUser({ name: "João Silva", email: "joao.silva@gmail.com", role: "student" });
      localStorage.setItem("pc_user", JSON.stringify({ name: "João Silva", email: "joao.silva@gmail.com", role: "student" }));
    }
  }, []);

  if (!user) return null;

  const pedidos = MOCK_ORDERS.filter((o) => o.studentEmail === user.email);
  const student = MOCK_STUDENTS.find((s) => s.email === user.email);
  const comprados = student ? student.purchasedCourseIds : [];

  return (
    <div className="min-h-screen bg-surface-100 text-white">
      <Navbar user={user} onLogin={() => {}} onLogout={() => { localStorage.removeItem("pc_user"); window.location.reload(); }} />
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Minha Conta</h1>
              <p className="text-gray-400 text-sm">Sua área de cliente com produtos adquiridos</p>
            </div>
            <button
              onClick={() => { localStorage.removeItem("pc_user"); window.location.reload(); }}
              className="text-sm text-gray-400 hover:text-white flex items-center gap-2"
            >
              Sair
            </button>
          </div>

          {/* Perfil */}
          <div className="rounded-2xl border border-white/10 bg-surface-200 p-6 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold shadow-neon">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{user.name}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                  <Mail className="w-3 h-3" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl border border-white/5 bg-surface-300/30">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Plano</p>
                <p className="text-white font-medium">Aluno</p>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-surface-300/30">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Cursos adquiridos</p>
                <p className="text-white font-bold text-xl">{comprados.length}</p>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-surface-300/30">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                <span className="text-accent-emerald text-xs font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></span> Ativo
                </span>
              </div>
            </div>
          </div>

          {/* Produtos adquiridos */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Meus cursos</h2>
              <Link href="/cursos" className="text-sm text-brand-400 hover:text-brand-300">Ver catálogo</Link>
            </div>
            {comprados.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border-2 border-dashed border-white/10 bg-surface-200/30">
                <Download className="w-10 h-10 mx-auto mb-3 text-gray-500" />
                <p className="text-gray-400">Você ainda não adquiriu nenhum curso.</p>
                <Link href="/cursos" className="mt-4 inline-block text-brand-400 font-medium hover:underline">Comprar agora</Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {comprados.map((id) => {
                  const course = MOCK_STUDENTS && id === "curso-fiscal-estrategia" ? {
                    id, title: "Curso Fiscal - Estratégia Concursos", platform: "Estratégia Concursos",
                    driveUrl: "https://drive.google.com/drive/folders/SEU_ID_FISCAL", badge: "Ativo"
                  } : {
                    id, title: "Curso Tribunais - Estratégia Concursos", platform: "Estratégia Concursos",
                    driveUrl: "https://drive.google.com/drive/folders/SEU_ID_TRIBUNAIS", badge: "Ativo"
                  };
                  return (
                    <div key={id} className="group rounded-xl border border-white/10 bg-surface-200 p-4 hover:border-brand-500/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2 py-1 rounded text-xs font-bold bg-brand-600/20 text-brand-400 border border-brand-500/30">{course.badge}</span>
                        <span className="text-xs text-gray-500">{course.platform}</span>
                      </div>
                      <h3 className="text-white font-bold text-sm mb-1 group-hover:text-brand-400 transition-colors">{course.title}</h3>
                      <a
                        href={course.driveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-neon"
                      >
                        <Play className="w-3 h-3" /> Acessar Drive
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Histórico de pedidos */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Meus pedidos</h2>
            <div className="rounded-xl border border-white/10 bg-surface-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-surface-300/10">
                    <th className="px-4 py-3 text-gray-400 font-medium">Pedido</th>
                    <th className="px-4 py-3 text-gray-400 font-medium">Curso</th>
                    <th className="px-4 py-3 text-gray-400 font-medium">Valor</th>
                    <th className="px-4 py-3 text-gray-400 font-medium">Status</th>
                    <th className="px-4 py-3 text-gray-400 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400">Nenhum pedido encontrado.</td>
                    </tr>
                  ) : (
                    pedidos.map((p) => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-white font-mono text-xs">{p.id}</td>
                        <td className="px-4 py-3 text-gray-300">{p.courseTitle}</td>
                        <td className="px-4 py-3 text-white">R$ {p.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.status === "PAID" ? "bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30" : "bg-gray-500/20 text-gray-400 border border-gray-500/30"}`}>
                            {p.status === "PAID" ? "Pago" : "Pendente"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{new Date(p.createdAt).toLocaleDateString("pt-BR")}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

