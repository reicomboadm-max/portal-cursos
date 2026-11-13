"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { BrandLogo } from "@/components/BrandLogo";
import { formatCurrency, formatDate, parsePrice, formatPriceNumber } from "@/lib/utils";
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
  X,
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
  Sparkles,
  RefreshCw
} from "lucide-react";

export default function AdminDashboardPage() {
  const { 
    orders, 
    courses, 
    settings, 
    updateOrderStatus, 
    deleteOrder,
    clearTestOrders,
    updateCourse,
    addCourse,
    deleteCourse,
    resetCatalogToDefault,
    updateSettings,
    getUniqueStudents,
    deleteStudent,
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState("");
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState<"sales" | "courses" | "settings" | "clientes">("sales");
  const [orderFilter, setOrderFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [orderSearch, setOrderSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Course editing state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [courseSearch, setCourseSearch] = useState("");
  const [courseSegmentFilter, setCourseSegmentFilter] = useState<SegmentType | "todos">("todos");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Course edit form state
  const [editForm, setEditForm] = useState<{
    title: string;
    slug: string;
    segment: SegmentType;
    platform: string;
    description: string;
    shortDescription: string;
    badge: string;
    originalPrice: string;
    price: string;
    driveUrl: string;
    features: string;
    folderSize: string;
    totalFiles: string;
    coverGradient: string;
    active: boolean;
  } | null>(null);

  // Settings editing state
  const [localSettings, setLocalSettings] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [adminEmail, setAdminEmail] = useState("reicomboadm@gmail.com");

  // Check saved admin session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("admin_authenticated_email");
      if (saved) {
        setIsAuthenticated(true);
        setAdminEmail(saved);
      }
    }
  }, []);

  // Handle password / email gate
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = adminPassInput.trim();
    const isAuthorized =
      cleanPass === "Central255*" ||
      cleanPass.toLowerCase() === "reicomboadm@gmail.com" ||
      cleanPass.toLowerCase() === "gptdoscriasstpg@gmail.com" ||
      cleanPass.toLowerCase() === "reicomboadm" ||
      cleanPass.toLowerCase() === "gptdoscriasstpg" ||
      settings.adminEmails.some(em => em.toLowerCase() === cleanPass.toLowerCase());

    if (isAuthorized) {
      setIsAuthenticated(true);
      setAuthError(false);
      const emailToSave = cleanPass.toLowerCase().includes("@")
        ? cleanPass.toLowerCase()
        : "reicomboadm@gmail.com";
      setAdminEmail(emailToSave);
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_authenticated_email", emailToSave);
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

  // Course edit form handlers
  const openEditCourse = (course: Course) => {
    setEditForm({
      title: course.title,
      slug: course.slug,
      segment: course.segment,
      platform: course.platform,
      description: course.description,
      shortDescription: course.shortDescription || "",
      badge: course.badge || "",
      originalPrice: course.originalPrice > 0 ? formatPriceNumber(course.originalPrice) : "",
      price: course.price > 0 ? formatPriceNumber(course.price) : "",
      driveUrl: course.driveUrl,
      features: course.features.join("\n"),
      folderSize: course.folderSize,
      totalFiles: course.totalFiles,
      coverGradient: course.coverGradient,
      active: course.active,
    });
    setEditingCourse(course);
    setIsCreatingCourse(false);
  };

  const handleEditChange = (key: string, value: any) => {
    setEditForm((prev) => {
      if (!prev) return { [key]: value } as any;
      const updated = { ...prev, [key]: value };
      // Se estiver criando e digitando o título, sugerir slug automaticamente
      if (key === "title" && isCreatingCourse) {
        const autoSlug = String(value)
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        updated.slug = autoSlug;
      }
      return updated;
    });
  };

  const handleEditFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      features: e.target.value,
    });
  };

  const handleSaveEditCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    const featuresArray = editForm.features
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const parsedPrice = parsePrice(editForm.price);
    const parsedOriginalPrice = parsePrice(editForm.originalPrice);

    const cleanTitle = editForm.title.trim() || "Novo Curso";
    const generatedSlug = editForm.slug.trim() || cleanTitle
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const courseData = {
      title: cleanTitle,
      slug: generatedSlug,
      segment: editForm.segment as SegmentType,
      platform: editForm.platform.trim() || "Material Completo 2026",
      description: editForm.description.trim() || `Material completo e organizado para ${cleanTitle}. Videoaulas Full HD, PDFs e resumos com download 100% liberado.`,
      shortDescription: editForm.shortDescription?.trim() || undefined,
      badge: editForm.badge?.trim() || undefined,
      originalPrice: parsedOriginalPrice,
      price: parsedPrice,
      driveUrl: editForm.driveUrl.trim() || "https://drive.google.com",
      features: featuresArray.length > 0 ? featuresArray : [
        "Acesso vitalício compartilhado no seu Gmail em até 24h",
        "Videoaulas em alta resolução com download 100% liberado",
        "PDFs completos, grifados, mapas mentais e resumos esquematizados"
      ],
      folderSize: editForm.folderSize.trim() || "120 GB",
      totalFiles: editForm.totalFiles.trim() || "+1.200 Aulas & PDFs",
      coverGradient: editForm.coverGradient || "from-red-600 to-amber-600",
      active: Boolean(editForm.active),
      updatedAt: new Date().toISOString(),
    } as Partial<Course> & { segment: SegmentType };

    if (editingCourse) {
      const updated: Course = {
        ...editingCourse,
        ...courseData,
        id: editingCourse.id,
      };
      updateCourse(updated);
      showToast(`Curso "${updated.title}" atualizado com sucesso por ${formatCurrency(updated.price)}!`);
    } else {
      const newCourse: Course = {
        ...courseData,
        id: `course-${Date.now()}`,
        stockStatus: "in_stock",
      } as Course;
      addCourse(newCourse);
      showToast(`Novo curso "${newCourse.title}" adicionado por ${formatCurrency(newCourse.price)}!`);
    }

    setEditForm(null);
    setEditingCourse(null);
    setIsCreatingCourse(false);
  };

  const closeEditCourse = () => {
    setEditForm(null);
    setEditingCourse(null);
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
          <div className="flex justify-center mb-4">
            <BrandLogo size={56} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Painel Administrativo</span>
          </div>
          <h1 className="text-2xl font-black text-white">Central do Aprovado</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Gestão de Pedidos, Liberação de Drives & Catálogo
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl border border-white/10 shadow-2xl bg-[#0b0e17]/90 backdrop-blur-xl">
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                E-mail de Administrador ou Senha
              </label>
              <input
                type="password"
                required
                value={adminPassInput}
                onChange={(e) => {
                  setAdminPassInput(e.target.value);
                  setAuthError(false);
                }}
                placeholder="E-mail de administrador ou senha"
                className="w-full px-4 py-3 rounded-xl bg-[#121724] border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              />
              {authError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 mt-2">
                  <p className="text-xs text-rose-300 font-medium">
                    Acesso restrito. Digite <strong className="text-white">reicomboadm@gmail.com</strong>, <strong className="text-white">gptdoscriasstpg@gmail.com</strong> ou a senha administrativa.
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Acessar Painel de Admin</span>
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-white/5 text-center">
            <Link href="/" className="text-xs text-neutral-400 hover:text-white transition">
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
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              ADMINISTRADOR PRINCIPAL
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#0e1322] text-white border border-white/10">
              {adminEmail}
            </span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Acesso Liberado
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
            Gestão de Vendas & Liberação de Drives
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition"
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

      {/* KPI Stats Cards (Minimal Tech) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-[#0c101a]/90 border border-white/[0.08] hover:border-white/20 transition-all shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Faturamento Total</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
            {formatCurrency(totalRevenue)}
          </span>
          <p className="text-[11px] text-emerald-400 font-medium mt-1">
            Total recebido via PIX
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c101a]/90 border border-white/[0.08] hover:border-white/20 transition-all shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-red-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Vendas Pagas</span>
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
            {paidOrders.length}
          </span>
          <p className="text-[11px] text-neutral-400 font-medium mt-1">
            Drives liberados
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c101a]/90 border border-white/[0.08] hover:border-white/20 transition-all shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">PIX Pendentes</span>
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
            {pendingOrders.length}
          </span>
          <p className="text-[11px] text-amber-400 font-medium mt-1">
            Aguardando pagamento
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c101a]/90 border border-white/[0.08] hover:border-white/20 transition-all shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-neutral-300 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Ticket Médio</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
            {formatCurrency(averageTicket)}
          </span>
          <p className="text-[11px] text-neutral-400 font-medium mt-1">
            Por aluno aprovado
          </p>
        </div>
      </div>

      {/* Navigation Tabs (Minimal Tech) */}
      <div className="flex border-b border-white/10 gap-3 mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("sales")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === "sales"
              ? "border-red-500 text-white shadow-[0_1px_10px_rgba(239,68,68,0.4)]"
              : "border-transparent text-neutral-400 hover:text-white"
          }`}
        >
          <ShoppingBag className={`w-4 h-4 ${activeTab === "sales" ? "text-red-400" : "text-neutral-400"}`} />
          <span>Vendas & Pedidos ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === "courses"
              ? "border-red-500 text-white shadow-[0_1px_10px_rgba(239,68,68,0.4)]"
              : "border-transparent text-neutral-400 hover:text-white"
          }`}
        >
          <HardDrive className={`w-4 h-4 ${activeTab === "courses" ? "text-red-400" : "text-neutral-400"}`} />
          <span>Gerenciar Cursos & Drives ({courses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === "settings"
              ? "border-red-500 text-white shadow-[0_1px_10px_rgba(239,68,68,0.4)]"
              : "border-transparent text-neutral-400 hover:text-white"
          }`}
        >
          <Settings className={`w-4 h-4 ${activeTab === "settings" ? "text-red-400" : "text-neutral-400"}`} />
          <span>Configurações & Chave PIX</span>
        </button>

        <button
          onClick={() => setActiveTab("clientes")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === "clientes"
              ? "border-red-500 text-white shadow-[0_1px_10px_rgba(239,68,68,0.4)]"
              : "border-transparent text-neutral-400 hover:text-white"
          }`}
        >
          <Users className={`w-4 h-4 ${activeTab === "clientes" ? "text-red-400" : "text-neutral-400"}`} />
          <span>Clientes & Alunos</span>
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  orderFilter === "ALL" ? "bg-red-600 text-white shadow-md shadow-red-600/30" : "bg-white/5 text-gray-300 hover:bg-white/10"
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

                            {/* Remover pedido / cliente */}
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Remover o pedido ${ord.id} do aluno ${ord.studentName}? Esta ação não pode ser desfeita.`
                                  )
                                ) {
                                  deleteOrder(ord.id);
                                }
                              }}
                              className="p-1 rounded text-rose-400 hover:bg-rose-500/10 transition"
                              title="Excluir pedido e remover cliente"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white">Catálogo de Cursos & Links de Pastas ({courses.length})</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  if (confirm("Deseja restaurar/sincronizar os 99 cursos organizados por área do catálogo oficial?")) {
                    resetCatalogToDefault();
                    alert("Catálogo sincronizado com sucesso com todos os 99 cursos!");
                  }
                }}
                className="py-2 px-3.5 rounded-xl font-bold text-xs bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition cursor-pointer"
                title="Sincronizar os 99 cursos"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sincronizar 99 Cursos</span>
              </button>
              <button
                onClick={() => {
                  setEditingCourse(null);
                  setIsCreatingCourse(true);
                  setEditForm({
                    title: "",
                    slug: "",
                    segment: "fiscal",
                    platform: "Material Completo 2026",
                    description: "",
                    shortDescription: "",
                    badge: "Drive 2026",
                    originalPrice: "120,00",
                    price: "59,90",
                    driveUrl: "https://drive.google.com/drive/folders/...",
                    features: "Acesso vitalício compartilhado no seu Gmail em até 24h\nVideoaulas em alta resolução com download 100% liberado\nPDFs completos, grifados, mapas mentais e resumos esquematizados",
                    folderSize: "120 GB",
                    totalFiles: "+1.200 Aulas & PDFs",
                    coverGradient: "from-red-600 to-amber-600",
                    active: true,
                  });
                }}
                className="py-2.5 px-4 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white flex items-center gap-2 transition cursor-pointer shadow-lg shadow-red-600/20 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Novo Curso</span>
              </button>
            </div>
          </div>

          {/* Search & Area Filter Bar (UI/UX Pro Max) */}
          <div className="p-4 rounded-2xl bg-surface-100/60 border border-white/10 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder="Buscar curso por nome, professor ou área (ex: INSS, PF, Adriana, SEFAZ)..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500 placeholder-gray-500"
              />
              {courseSearch && (
                <button
                  onClick={() => setCourseSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Segment Pills */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              {[
                { id: "todos", label: "Todos", count: courses.length },
                { id: "fiscal", label: "🏛️ Fiscal", count: courses.filter(c => c.segment === "fiscal").length },
                { id: "policial", label: "🛡️ Policial", count: courses.filter(c => c.segment === "policial").length },
                { id: "tribunais", label: "⚖️ Tribunais & MP", count: courses.filter(c => c.segment === "tribunais").length },
                { id: "administrativo", label: "🏢 Admin & Bancos", count: courses.filter(c => c.segment === "administrativo").length },
                { id: "disciplinas", label: "⭐ Professores", count: courses.filter(c => c.segment === "disciplinas").length },
              ].map((seg) => {
                const isActive = courseSegmentFilter === seg.id;
                return (
                  <button
                    key={seg.id}
                    onClick={() => setCourseSegmentFilter(seg.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                        : "bg-surface-200 text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span>{seg.label}</span>
                    <span className="text-[10px] opacity-75 font-mono">({seg.count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Courses Grid */}
          {(() => {
            const filteredAdminCourses = courses.filter((c) => {
              if (courseSegmentFilter !== "todos" && c.segment !== courseSegmentFilter) return false;
              if (courseSearch.trim()) {
                const q = courseSearch.toLowerCase().trim();
                const inTitle = c.title.toLowerCase().includes(q);
                const inSlug = c.slug.toLowerCase().includes(q);
                const inPlatform = (c.platform || "").toLowerCase().includes(q);
                const inDrive = (c.driveUrl || "").toLowerCase().includes(q);
                if (!inTitle && !inSlug && !inPlatform && !inDrive) return false;
              }
              return true;
            });

            if (filteredAdminCourses.length === 0) {
              return (
                <div className="p-12 text-center rounded-2xl bg-surface-100/40 border border-white/5 space-y-3">
                  <Search className="w-8 h-8 text-gray-500 mx-auto" />
                  <p className="text-sm font-semibold text-white">Nenhum curso encontrado</p>
                  <p className="text-xs text-gray-400">
                    Não encontramos nenhum material com o termo &ldquo;{courseSearch}&rdquo;.
                  </p>
                  <button
                    onClick={() => {
                      setCourseSearch("");
                      setCourseSegmentFilter("todos");
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  >
                    Limpar Filtros
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAdminCourses.map((c) => (
                  <div key={c.id} className="p-5 rounded-2xl bg-surface-100/50 border border-white/5 hover:border-white/15 transition-all space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 uppercase">
                            {c.segment}
                          </span>
                          {c.badge && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-500/20 text-red-300">
                              {c.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-white text-base mt-1.5 truncate" title={c.title}>
                          {c.title}
                        </h4>
                        <p className="text-xs text-gray-400">{c.platform}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-emerald-400 block">
                          {formatCurrency(c.price)}
                        </span>
                        {c.originalPrice > c.price && (
                          <span className="text-[11px] text-gray-500 line-through">
                            {formatCurrency(c.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-surface-200/60 border border-white/5 text-xs text-gray-300 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-[11px]">Link do Google Drive:</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              handleCopy(c.driveUrl, c.id);
                              showToast(`Link do curso "${c.title}" copiado!`);
                            }}
                            className="text-gray-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedId === c.id ? "Copiado!" : "Copiar"}</span>
                          </button>
                          <a
                            href={c.driveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px] font-mono"
                          >
                            <span>Abrir</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                      <p className="font-mono text-[11px] text-gray-400 truncate">{c.driveUrl}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => {
                          const updated = { ...c, active: !c.active };
                          updateCourse(updated);
                          showToast(`Curso "${c.title}" agora está ${updated.active ? "visível" : "oculto"} no site.`);
                        }}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                          c.active ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${c.active ? "bg-emerald-400" : "bg-rose-400"}`} />
                        <span>{c.active ? "Ativo no Site" : "Oculto"}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditCourse(c)}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-indigo-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer border border-white/5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remover "${c.title}" do catálogo?`)) {
                              deleteCourse(c.id);
                              showToast(`Curso "${c.title}" removido com sucesso.`);
                            }
                          }}
                          className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                          title="Excluir curso"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* Course Edit / Create Modal */}
      {(editingCourse || isCreatingCourse) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0c101d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {isCreatingCourse ? "Novo Curso" : "Editar Curso"}
              </h3>
              <button
                onClick={closeEditCourse}
                className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCourse} className="p-5 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Nome do Curso
                  </label>
                  <input
                    type="text"
                    value={editForm?.title || ""}
                    onChange={(e) => handleEditChange("title", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Slug (URL amigável)
                  </label>
                  <input
                    type="text"
                    value={editForm?.slug || ""}
                    onChange={(e) => handleEditChange("slug", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Segmento
                  </label>
                  <select
                    value={editForm?.segment || "fiscal"}
                    onChange={(e) => handleEditChange("segment", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="fiscal">Área Fiscal & Tributária</option>
                    <option value="policial">Carreiras Policiais</option>
                    <option value="tribunais">Tribunais & MP</option>
                    <option value="administrativo">Administrativo & Bancos</option>
                    <option value="disciplinas">Professores & Isoladas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Professor / Formato (ex: Prof. Igor Cintra, Material Completo 2026)
                  </label>
                  <input
                    type="text"
                    value={editForm?.platform || ""}
                    onChange={(e) => handleEditChange("platform", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Descrição
                </label>
                <textarea
                  value={editForm?.description || ""}
                  onChange={(e) => handleEditChange("description", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Descrição Curta
                </label>
                <input
                  type="text"
                  value={editForm?.shortDescription || ""}
                  onChange={(e) => handleEditChange("shortDescription", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Selo (ex: Mais Vendido, Edital 2026)
                  </label>
                  <input
                    type="text"
                    value={editForm?.badge || ""}
                    onChange={(e) => handleEditChange("badge", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Gradiente da Capa (ex: from-indigo-600 to-purple-600)
                  </label>
                  <input
                    type="text"
                    value={editForm?.coverGradient || ""}
                    onChange={(e) => handleEditChange("coverGradient", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Preços e Valores com Suporte a Decimais e Vírgula (UI/UX Pro Max) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-white/10">
                <div>
                  <label className="block text-xs font-semibold text-gray-200 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">●</span>
                      <span>Preço Promocional (R$) *</span>
                    </span>
                    {editForm?.price && parsePrice(editForm.price) > 0 && (
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        = {formatCurrency(parsePrice(editForm.price))}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs pointer-events-none">
                      R$
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      required
                      placeholder="Ex: 59,90"
                      value={editForm?.price || ""}
                      onChange={(e) => handleEditChange("price", e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-sm font-bold focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Aceita vírgula ou ponto (ex: 59,90 ou 59.90)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-200 mb-1.5 flex items-center justify-between">
                    <span>Preço Original / De (R$)</span>
                    {editForm?.originalPrice && parsePrice(editForm.originalPrice) > 0 && (
                      <span className="text-xs font-medium text-gray-400 font-mono line-through">
                        = {formatCurrency(parsePrice(editForm.originalPrice))}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs pointer-events-none">
                      R$
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Ex: 120,00"
                      value={editForm?.originalPrice || ""}
                      onChange={(e) => handleEditChange("originalPrice", e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-sm font-semibold focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Valor cheio de referência tachado (ex: 120,00)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Total de Arquivos & Aulas (ex: +1.400 Aulas & PDFs)
                </label>
                <input
                  type="text"
                  value={editForm?.totalFiles || ""}
                  onChange={(e) => handleEditChange("totalFiles", e.target.value)}
                  placeholder="Ex: +1.400 Aulas & PDFs"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Link do Google Drive
                </label>
                <input
                  type="text"
                  value={editForm?.driveUrl || ""}
                  onChange={(e) => handleEditChange("driveUrl", e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Funcionalidades (uma por linha)
                </label>
                <textarea
                  value={editForm?.features || ""}
                  onChange={handleEditFeaturesChange}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm?.active !== false}
                    onChange={(e) =>
                      handleEditChange("active", e.target.checked ? "true" : "false")
                    }
                    className="rounded border-white/20 bg-surface-200 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-xs font-semibold text-gray-300">Ativo no Site</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEditCourse}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-gray-300 bg-white/5 hover:bg-white/10 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition"
                >
                  {isCreatingCourse ? "Criar Curso" : "Salvar Alterações"}
                </button>
              </div>
            </form>
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
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Administrador Principal do Site
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
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
              <label className="block text-xs font-semibold text-gray-300 mb-1">Telegram de Suporte (@Baldodrive)</label>
              <input
                type="text"
                value={localSettings.telegramSupport}
                onChange={(e) => setLocalSettings({ ...localSettings, telegramSupport: e.target.value })}
                placeholder="https://t.me/Baldodrive"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Telegram de Suporte 2 (Combo Rei)</label>
              <input
                type="text"
                value={localSettings.telegramChannel || "https://t.me/comboreiboss"}
                onChange={(e) => setLocalSettings({ ...localSettings, telegramChannel: e.target.value })}
                placeholder="https://t.me/comboreiboss"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs font-mono"
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
                  https://www.centraldoaprovado.com.br/api/webhooks/velorapay
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("https://www.centraldoaprovado.com.br/api/webhooks/velorapay");
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

          {/* Rastreamento, Visibilidade & Tráfego (Google Analytics e Meta Pixel) */}
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white">Rastreamento, SEO & Alcance de Tráfego</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Google & Meta
              </span>
            </div>

            <p className="text-xs text-gray-300">
              Conecte suas tags de mensuração para rastrear visitas, visualizações de cursos e conversões de compras automaticamente.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  ID do Google Analytics 4 (GA4)
                </label>
                <input
                  type="text"
                  value={localSettings.googleAnalyticsId || ""}
                  onChange={(e) => setLocalSettings({ ...localSettings, googleAnalyticsId: e.target.value })}
                  placeholder="Ex: G-XXXXXXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs font-mono"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Insira o código de medição do Google Analytics</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  ID do Meta (Facebook) Pixel
                </label>
                <input
                  type="text"
                  value={localSettings.facebookPixelId || ""}
                  onChange={(e) => setLocalSettings({ ...localSettings, facebookPixelId: e.target.value })}
                  placeholder="Ex: 123456789012345"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs font-mono"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Insira o ID do seu Pixel para anúncios no Instagram/Facebook</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Todas as Configurações</span>
          </button>
        </form>
      )}

      {/* TAB 4: CLIENTES & ALUNOS */}
      {activeTab === "clientes" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Clientes & Alunos Cadastrados</h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {getUniqueStudents().length} alunos únicos
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface-100/60 shadow-xl">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-white/5 text-gray-400 uppercase text-[10px] font-bold border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Aluno</th>
                  <th className="py-3 px-4">E-mail (Gmail Drive)</th>
                  <th className="py-3 px-4 text-center">WhatsApp</th>
                  <th className="py-3 px-4 text-center">Pedidos</th>
                  <th className="py-3 px-4 text-center">Total Gasto</th>
                  <th className="py-3 px-4 text-center">Último Pedido</th>
                  <th className="py-3 px-4 text-center">Status Último</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {getUniqueStudents().length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-400">
                      Nenhum aluno cadastrado.
                    </td>
                  </tr>
                ) : (
                  getUniqueStudents().map((s) => (
                    <tr key={s.email} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 px-4">
                        <strong className="text-white block font-medium">{s.name}</strong>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-indigo-400 font-mono select-all text-[11px] block">{s.email}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {s.whatsapp ? (
                          <a
                            href={`https://wa.me/55${s.whatsapp.replace(/\D/g, "")}?text=Ol%C3%A1%20${encodeURIComponent(s.name)}!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:text-emerald-300 text-xs font-medium"
                          >
                            {s.whatsapp}
                          </a>
                        ) : (
                          <span className="text-gray-500 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-1 rounded bg-white/5 text-[10px] font-bold">{s.totalOrders}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-[10px] font-bold text-white">R$ {s.totalSpent.toFixed(2)}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono text-[10px] text-gray-400">{s.lastOrderId}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            s.lastOrderStatus === "PAID"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : s.lastOrderStatus === "PENDING"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          }`}
                        >
                          {s.lastOrderStatus === "PAID" ? "Pago" : s.lastOrderStatus === "PENDING" ? "Pendente" : "Entregue"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            if (confirm(`Remover aluno "${s.name}" (${s.email}) e todos os seus pedidos? Esta ação não pode ser desfeita.`)) {
                              deleteStudent(s.email);
                            }
                          }}
                          className="p-1.5 rounded text-rose-400 hover:bg-rose-500/10 transition"
                          title="Excluir aluno e todos os pedidos"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-2xl bg-surface-100/40 border border-white/5 text-xs text-gray-400">
            <p className="mb-1"><span className="font-bold text-white">Como funciona:</span> A lista é gerada automaticamente a partir dos pedidos feitos no site.</p>
            <p>Ao remover um aluno, todos os pedidos vinculados ao seu e-mail são excluídos juntamente com o cadastro.</p>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-neutral-900/95 backdrop-blur-md border border-emerald-500/40 text-white shadow-2xl shadow-emerald-500/20 animate-fade-slide">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-gray-400 hover:text-white p-1 rounded-lg transition"
            aria-label="Fechar notificação"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
