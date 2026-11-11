"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TopBanner } from "@/components/TopBanner";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { useStore } from "@/context/StoreContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  FolderLock, 
  ExternalLink, 
  GraduationCap, 
  Mail, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  HardDrive, 
  Copy, 
  LogOut, 
  MessageCircle,
  Sparkles,
  ArrowRight,
  BookOpen
} from "lucide-react";

export default function AlunoPage() {
  const { currentUser, orders, courses, settings, loginAsStudent, logout } = useStore();
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const cleanWhatsappNumber = settings.whatsappSupport.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=Ol%C3%A1!%20Sou%20aluno%20e%20gostaria%20de%20ajuda%20com%20meu%20drive.`;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    loginAsStudent(emailInput.trim(), nameInput.trim() || undefined);
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // If user is not logged in, show student login form
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex flex-col">
        <TopBanner />
        <Header />

        <main className="flex-1 max-w-md mx-auto px-4 py-16 w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
              <GraduationCap className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-black text-white">Área do Aluno</h1>
            <p className="text-sm text-gray-400 mt-1">
              Informe seu e-mail do Gmail para visualizar os drives adquiridos e links liberados.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0e1424] p-6 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Seu E-mail (Gmail)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="exemplo@gmail.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#080c16] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Seu Nome (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Nome do Aluno"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-[#080c16] border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <span>Acessar Meus Drives</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <p className="text-xs text-gray-400 mb-3">Quer testar com uma conta exemplo?</p>
              <button
                type="button"
                onClick={() => loginAsStudent("joao.silva@gmail.com", "João Silva")}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl transition"
              >
                Entrar com Aluno Demonstração (João Silva)
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Find student orders
  const studentOrders = orders.filter(
    (o) => o.studentEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  // Find purchased courses
  const studentCourses = courses.filter((c) =>
    currentUser.purchasedCourseIds.includes(c.id) ||
    studentOrders.some((o) => o.courseId === c.id && o.status === "PAID")
  );

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col">
      <TopBanner />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Welcome Banner */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-950/70 via-[#0e1424] to-purple-950/60 p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/40">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Olá, {currentUser.name}!
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  Aluno Verificado
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>{currentUser.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Suporte WhatsApp</span>
            </a>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Section: Unlocked Google Drives */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FolderLock className="w-5 h-5 text-indigo-400" />
                <span>Meus Cursos & Pastas no Google Drive</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Pastas sincronizadas e compartilhadas com o seu Gmail. Clique para abrir ou baixar.
              </p>
            </div>

            <Link
              href="/#cursos"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Adquirir mais cursos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {studentCourses.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-surface-100/30 p-10 text-center">
              <FolderLock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Nenhum drive liberado ainda</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mb-5">
                Você ainda não tem cursos aprovados neste e-mail. Se já fez o PIX, o convite será liberado em até 24h.
              </p>
              <Link
                href="/#cursos"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
              >
                <span>Ver Catálogo de Cursos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-3xl border border-indigo-500/30 bg-[#0e1424] p-6 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Acesso Vitalício Ativo</span>
                      </span>

                      <span className="text-[10px] text-gray-400 font-semibold bg-white/5 px-2 py-0.5 rounded">
                        {course.folderSize}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 leading-snug">
                      {course.title}
                    </h3>

                    <p className="text-xs text-gray-300 mb-4 line-clamp-2">
                      {course.shortDescription || course.description}
                    </p>

                    <div className="space-y-1 text-[11px] text-gray-400 mb-6 border-t border-white/5 pt-3">
                      <div className="flex items-center justify-between">
                        <span>Plataforma original:</span>
                        <span className="text-gray-300 font-medium">{course.platform}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Aulas e arquivos:</span>
                        <span className="text-gray-300 font-medium">{course.totalFiles}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Última atualização:</span>
                        <span className="text-emerald-400 font-medium">{course.updatedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <a
                      href={course.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Abrir no Google Drive</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(course.driveUrl, course.id)}
                      className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs flex items-center justify-center gap-2 border border-white/10 transition"
                    >
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                      <span>{copiedId === course.id ? "Link Copiado!" : "Copiar Link do Drive"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Orders History */}
        <div className="rounded-3xl border border-white/10 bg-[#0e1424] p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>Histórico de Pedidos & Pagamentos PIX</span>
          </h2>

          {studentOrders.length === 0 ? (
            <p className="text-xs text-gray-400">
              Nenhum pedido registrado no histórico para este e-mail.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="pb-3 font-semibold">Código</th>
                    <th className="pb-3 font-semibold">Curso / Drive</th>
                    <th className="pb-3 font-semibold">Valor</th>
                    <th className="pb-3 font-semibold">Forma</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {studentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition">
                      <td className="py-3 font-mono text-gray-400">{order.id}</td>
                      <td className="py-3 text-white font-medium">{order.courseTitle}</td>
                      <td className="py-3 text-white font-bold">{formatCurrency(order.amount)}</td>
                      <td className="py-3 text-gray-300">{order.paymentMethod}</td>
                      <td className="py-3">
                        {order.status === "PAID" && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            Pago • Liberado
                          </span>
                        )}
                        {order.status === "PENDING" && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                            Aguardando PIX
                          </span>
                        )}
                        {order.status === "CANCELED" && (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold">
                            Cancelado
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-gray-400">{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
