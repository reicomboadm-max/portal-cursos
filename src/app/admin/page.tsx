"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Course, OrderStatus, SegmentType } from "@/types";
import { 
  ShieldCheck, 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  Users, 
  Settings, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  ExternalLink, 
  MessageCircle, 
  HardDrive, 
  TrendingUp, 
  Edit3, 
  Trash2, 
  Save, 
  Lock,
  ArrowLeft,
  Sparkles
} from "lucide-react";

export default function AdminDashboardPage() {
  const { 
    orders, 
    courses, 
    settings, 
    updateOrderStatus, 
    updateCourse, 
    addCourse, 
    deleteCourse, 
    updateSettings 
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState("");
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState<"sales" | "courses" | "settings">("sales");
  const [orderFilter, setOrderFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [orderSearch, setOrderSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Course editing state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  // Settings editing state
  const [localSettings, setLocalSettings] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Check saved admin session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("admin_authenticated_email");
      if (saved) {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Handle password / email gate
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = adminPassInput.trim();
    const isAuthorized =
      cleanPass.toLowerCase() === "reicomboadm@gmail.com" ||
      cleanPass === "admin123" ||
      cleanPass === "thiago" ||
      cleanPass === "reicomboadm" ||
      settings.adminEmails.some(em => em.toLowerCase() === cleanPass.toLowerCase());

    if (isAuthorized) {
      setIsAuthenticated(true);
      setAuthError(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_authenticated_email", "reicomboadm@gmail.com");
      }
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_authenticated_email");
    }
  };

  // KPIs
  const paidOrders = orders.filter((o) => o.status === "PAID");
  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const totalRevenue = paidOrders.reduce((acc, curr) => acc + curr.amount, 0);
  const averageTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter !== "ALL" && o.status !== orderFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim();
      const inId = o.id.toLowerCase().includes(q);
      const inName = o.studentName.toLowerCase().includes(q);
      const inEmail = o.studentEmail.toLowerCase().includes(q);
      const inCourse = o.courseTitle.toLowerCase().includes(q);
      if (!inId && !inName && !inEmail && !inCourse) return false;
    }
    return true;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(localSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="py-20 px-4 max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-3 border border-purple-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Área Exclusiva para Administrador</span>
          </div>
          <h1 className="text-2xl font-black text-white">Painel Administrativo</h1>
          <p className="text-xs text-gray-400 mt-1">
            Administrador Principal: <span className="text-purple-300 font-semibold">reicomboadm@gmail.com</span>
          </p>
        </div>

        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 shadow-2xl bg-[#0b0f19]/80 backdrop-blur-xl">
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Identificação do Administrador ou Senha
              </label>
              <input
                type="password"
                required
                value={adminPassInput}
                onChange={(e) => {
                  setAdminPassInput(e.target.value);
                  setAuthError(false);
                }}
                placeholder="reicomboadm@gmail.com ou senha"
                className="w-full px-4 py-3 rounded-xl bg-surface-100 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition"
              />
              {authError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 mt-2">
                  <p className="text-xs text-rose-300 font-medium">
                    Acesso restrito. Digite <strong className="text-white">reicomboadm@gmail.com</strong> ou a senha administrativa.
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Acessar Painel de Admin</span>
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-white/5 text-center">
            <Link href="/" className="text-xs text-gray-400 hover:text-white transition">
              ← Voltar para o Site Principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD
  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              ADMINISTRADOR PRINCIPAL
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#0e1322] text-white border border-white/10">
              reicomboadm@gmail.com
            </span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Acesso Liberado
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
            Gestão de Vendas & Liberação de Drives
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ver Loja</span>
          </Link>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition cursor-pointer"
          >
            Sair do Admin
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-surface-100/70 border border-white/5">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Faturamento Total</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {formatCurrency(totalRevenue)}
          </span>
          <p className="text-[11px] text-emerald-400 font-medium mt-1">
            Total recebido via PIX
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-100/70 border border-white/5">
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Vendas Pagas</span>
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {paidOrders.length}
          </span>
          <p className="text-[11px] text-indigo-400 font-medium mt-1">
            Drives liberados
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-100/70 border border-white/5">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">PIX Pendentes</span>
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {pendingOrders.length}
          </span>
          <p className="text-[11px] text-amber-400 font-medium mt-1">
            Aguardando pagamento
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-100/70 border border-white/5">
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Ticket Médio</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {formatCurrency(averageTicket)}
          </span>
          <p className="text-[11px] text-cyan-400 font-medium mt-1">
            Por aluno aprovado
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-3 mb-6">
        <button
          onClick={() => setActiveTab("sales")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === "sales"
              ? "border-purple-500 text-white"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-purple-400" />
          <span>Vendas & Pedidos ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === "courses"
              ? "border-purple-500 text-white"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <HardDrive className="w-4 h-4 text-indigo-400" />
          <span>Gerenciar Cursos & Drives ({courses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === "settings"
              ? "border-purple-500 text-white"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <Settings className="w-4 h-4 text-emerald-400" />
          <span>Configurações & Chave PIX</span>
        </button>
      </div>

      {/* TAB 1: SALES & ORDERS */}
      {activeTab === "sales" && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-surface-100/50 border border-white/5">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Buscar por aluno, email, curso ou ID..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-200 border border-white/10 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setOrderFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  orderFilter === "ALL" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                Todos ({orders.length})
              </button>
              <button
                onClick={() => setOrderFilter("PAID")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  orderFilter === "PAID" ? "bg-emerald-600 text-white" : "bg-white/5 text-emerald-300 hover:bg-white/10"
                }`}
              >
                Pagos ({paidOrders.length})
              </button>
              <button
                onClick={() => setOrderFilter("PENDING")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  orderFilter === "PENDING" ? "bg-amber-600 text-white" : "bg-white/5 text-amber-300 hover:bg-white/10"
                }`}
              >
                Pendentes ({pendingOrders.length})
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface-100/60 shadow-xl">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-white/5 text-gray-400 uppercase text-[10px] font-bold border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Pedido / Data</th>
                  <th className="py-3 px-4">Aluno & Gmail (Drive)</th>
                  <th className="py-3 px-4">Curso Comprado</th>
                  <th className="py-3 px-4">Valor</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Ações Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">
                      Nenhum pedido encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => {
                    const studentCleanWhatsapp = ord.studentWhatsapp?.replace(/\D/g, "");
                    const isCopied = copiedId === ord.id;

                    return (
                      <tr key={ord.id} className="hover:bg-white/[0.02]">
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-white block">{ord.id}</span>
                          <span className="text-[11px] text-gray-400">{formatDate(ord.createdAt)}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <strong className="text-white block font-medium">{ord.studentName}</strong>
                          <span className="text-indigo-400 font-mono select-all text-[11px]">
                            {ord.studentEmail}
                          </span>
                          {ord.studentWhatsapp && (
                            <span className="block text-[11px] text-gray-400">
                              Whats: {ord.studentWhatsapp}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-gray-200 font-semibold block line-clamp-1">{ord.courseTitle}</span>
                          <span className="text-[10px] text-gray-400 uppercase font-mono">{ord.courseSegment}</span>
                        </td>

                        <td className="py-3.5 px-4 font-black text-white whitespace-nowrap">
                          {formatCurrency(ord.amount)}
                        </td>

                        <td className="py-3.5 px-4">
                          {ord.status === "PAID" ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                              ✓ PAGO
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                              ⏳ PENDENTE
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            {/* Approve Button */}
                            {ord.status !== "PAID" && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, "PAID")}
                                className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition"
                                title="Aprovar Pagamento Manualmente"
                              >
                                Aprovar
                              </button>
                            )}

                            {/* Copy drive link */}
                            <button
                              onClick={() => handleCopy(ord.driveUrl, ord.id)}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
                              title="Copiar Link do Google Drive"
                            >
                              {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                            {/* Open Drive */}
                            <a
                              href={ord.driveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded bg-white/5 hover:bg-white/10 text-indigo-400 hover:text-indigo-300 transition"
                              title="Abrir Pasta no Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            {/* WhatsApp student */}
                            {studentCleanWhatsapp && (
                              <a
                                href={`https://wa.me/55${studentCleanWhatsapp}?text=Ol%C3%A1%20${encodeURIComponent(ord.studentName)}!%20Recebemos%20seu%20pedido%20do%20${encodeURIComponent(ord.courseTitle)}.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition"
                                title="Enviar mensagem ao aluno no WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: COURSE MANAGEMENT */}
      {activeTab === "courses" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Catálogo de Cursos & Links de Pastas</h3>
            <button
              onClick={() => {
                setEditingCourse(null);
                setIsCreatingCourse(true);
              }}
              className="py-2 px-3.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Novo Curso</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl bg-surface-100/50 border border-white/5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 uppercase">
                      {c.segment}
                    </span>
                    <h4 className="font-bold text-white text-base mt-1.5">{c.title}</h4>
                    <p className="text-xs text-gray-400">{c.folderSize} • {c.platform}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-emerald-400 block">{formatCurrency(c.price)}</span>
                    <span className="text-[11px] text-gray-500 line-through">{formatCurrency(c.originalPrice)}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-surface-200/60 border border-white/5 text-xs text-gray-300 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-[11px]">Link do Google Drive:</span>
                    <a
                      href={c.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:underline flex items-center gap-1 text-[11px] font-mono"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="font-mono text-[11px] text-gray-400 truncate">{c.driveUrl}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      updateCourse({ ...c, active: !c.active });
                    }}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition ${
                      c.active ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                    }`}
                  >
                    {c.active ? "Ativo no Site" : "Oculto"}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const newDrive = prompt("Atualizar Link do Google Drive:", c.driveUrl);
                        if (newDrive !== null) {
                          updateCourse({ ...c, driveUrl: newDrive });
                        }
                      }}
                      className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white transition"
                    >
                      Alterar Drive
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remover "${c.title}" do catálogo?`)) {
                          deleteCourse(c.id);
                        }
                      }}
                      className="p-1.5 rounded text-rose-400 hover:bg-rose-500/10 transition"
                      title="Excluir curso"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SETTINGS & PIX ACCOUNTS */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 rounded-3xl bg-surface-100/50 border border-white/10 max-w-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Configurações Gerais & Recebimento PIX</h3>
              <p className="text-xs text-gray-400">Altere a conta onde os pagamentos dos alunos cairão.</p>
            </div>
            {settingsSaved && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Salvo com Sucesso!
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Nome do Site</label>
            <input
              type="text"
              value={localSettings.siteName}
              onChange={(e) => setLocalSettings({ ...localSettings, siteName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs"
            />
          </div>

          {/* Administrador Principal */}
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Administrador Principal do Site
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Acesso Total / Super Admin
              </span>
            </div>
            <div>
              <input
                type="email"
                value={localSettings.adminEmails?.[0] || "reicomboadm@gmail.com"}
                onChange={(e) => {
                  const newEmails = [...(localSettings.adminEmails || ["reicomboadm@gmail.com"])];
                  newEmails[0] = e.target.value.trim().toLowerCase();
                  setLocalSettings({ ...localSettings, adminEmails: newEmails });
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs font-semibold"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                E-mail com permissão irrestrita para gerenciar vendas, cursos, credenciais VeloraPay e liberação de acessos ao Drive.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Chave PIX de Recebimento</label>
              <input
                type="text"
                value={localSettings.pixKey}
                onChange={(e) => setLocalSettings({ ...localSettings, pixKey: e.target.value })}
                placeholder="pix@seuemail.com ou CPF/CNPJ"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Tipo da Chave</label>
              <input
                type="text"
                value={localSettings.pixKeyType}
                onChange={(e) => setLocalSettings({ ...localSettings, pixKeyType: e.target.value })}
                placeholder="E-mail / CPF / CNPJ / Aleatória"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Nome do Titular da Conta (PIX)</label>
              <input
                type="text"
                value={localSettings.beneficiaryName}
                onChange={(e) => setLocalSettings({ ...localSettings, beneficiaryName: e.target.value })}
                placeholder="NOME COMPLETO OU RAZÃO SOCIAL"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Cidade da Conta</label>
              <input
                type="text"
                value={localSettings.beneficiaryCity}
                onChange={(e) => setLocalSettings({ ...localSettings, beneficiaryCity: e.target.value })}
                placeholder="SAO PAULO"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">WhatsApp de Suporte (com DDD)</label>
              <input
                type="text"
                value={localSettings.whatsappSupport}
                onChange={(e) => setLocalSettings({ ...localSettings, whatsappSupport: e.target.value })}
                placeholder="5511999999999"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Link do Telegram</label>
              <input
                type="text"
                value={localSettings.telegramSupport}
                onChange={(e) => setLocalSettings({ ...localSettings, telegramSupport: e.target.value })}
                placeholder="https://t.me/seucanal"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Banner Promocional Superior</label>
            <input
              type="text"
              value={localSettings.bannerNotice}
              onChange={(e) => setLocalSettings({ ...localSettings, bannerNotice: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs"
            />
          </div>

          {/* Integração VeloraPay */}
          <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">Integração VeloraPay</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  PIX Instantâneo
                </span>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.veloraEnabled ?? true}
                  onChange={(e) => setLocalSettings({ ...localSettings, veloraEnabled: e.target.checked })}
                  className="rounded border-white/20 bg-surface-200 text-indigo-600 focus:ring-0"
                />
                <span>Ativar VeloraPay</span>
              </label>
            </div>

            <p className="text-xs text-gray-300">
              Receba os pagamentos via PIX diretamente na sua conta da VeloraPay (velorapay.com.br).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Chave da API (API Key / Token)</label>
                <input
                  type="password"
                  value={localSettings.veloraApiKey || ""}
                  onChange={(e) => setLocalSettings({ ...localSettings, veloraApiKey: e.target.value })}
                  placeholder="vel_pk_... ou Token da API"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">API Secret / Secret Key (Opcional)</label>
                <input
                  type="password"
                  value={localSettings.veloraApiSecret || ""}
                  onChange={(e) => setLocalSettings({ ...localSettings, veloraApiSecret: e.target.value })}
                  placeholder="vel_sk_... (se fornecido pela Velora)"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs font-mono"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#090d16] border border-white/5 space-y-1.5">
              <span className="text-[11px] font-bold text-gray-300 block">URL do Webhook para retorno automático:</span>
              <div className="flex items-center justify-between gap-2">
                <code className="text-[11px] text-indigo-300 font-mono break-all select-all">
                  https://portal-cursos.vercel.app/api/webhooks/velorapay
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("https://portal-cursos.vercel.app/api/webhooks/velorapay");
                    alert("URL do Webhook copiada!");
                  }}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold shrink-0 transition"
                >
                  Copiar
                </button>
              </div>
              <p className="text-[10px] text-gray-400">
                Cole essa URL no campo de Webhooks dentro do seu painel da VeloraPay para aprovação automática.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Todas as Configurações</span>
          </button>
        </form>
      )}

    </div>
  );
}
