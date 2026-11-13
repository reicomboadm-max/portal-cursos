"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Eye, 
  Layers, 
  ArrowUpRight, 
  Calendar, 
  RefreshCw, 
  ExternalLink, 
  Search,
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Globe, 
  ShieldCheck, 
  Zap,
  Filter
} from "lucide-react";
import { Order, Course, AnalyticsStats } from "@/types";
import { formatCurrency, getStateFullName } from "@/lib/utils";
import { BrazilMap } from "@/components/BrazilMap";

interface AdminAnalyticsDashboardProps {
  orders: Order[];
  courses: Course[];
  onRefresh?: () => void;
}

type PeriodFilter = "today" | "7d" | "30d" | "all";
type ChartTab = "revenue" | "sales" | "visits";
type GeoTab = "revenue" | "sales";

export function AdminAnalyticsDashboard({ orders, courses, onRefresh }: AdminAnalyticsDashboardProps) {
  const [period, setPeriod] = useState<PeriodFilter>("today");
  const [activeChartTab, setActiveChartTab] = useState<ChartTab>("revenue");
  const [geoTab, setGeoTab] = useState<GeoTab>("revenue");
  const [productSearch, setProductSearch] = useState("");
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Fetch real telemetry visits from /api/analytics/stats
  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      const res = await fetch("/api/analytics/stats");
      if (res.ok) {
        const data: AnalyticsStats = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Erro ao carregar telemetria:", err);
    } finally {
      setIsLoadingStats(false);
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 20000); // Auto-refresh a cada 20s
    return () => clearInterval(interval);
  }, []);

  // Filter orders strictly by period
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    return orders.filter((o) => {
      if (period === "all") return true;
      const orderDate = new Date(o.createdAt);
      if (period === "today") {
        return o.createdAt.startsWith(todayStr);
      }
      if (period === "7d") {
        const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
        return diffDays <= 7;
      }
      if (period === "30d") {
        const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
        return diffDays <= 30;
      }
      return true;
    });
  }, [orders, period]);

  // 100% Real metrics derived strictly from actual orders and real visit telemetry
  const metrics = useMemo(() => {
    const paid = filteredOrders.filter((o) => o.status === "PAID" || o.status === "DELIVERED");
    const pending = filteredOrders.filter((o) => o.status === "PENDING");
    const revenue = paid.reduce((sum, o) => sum + o.amount, 0);
    const salesCount = paid.length;
    const ticket = salesCount > 0 ? revenue / salesCount : 0;
    const visits = stats ? (period === "today" ? stats.todayVisits : stats.totalVisits) : 0;
    const conversionRate = visits > 0 ? (salesCount / visits) * 100 : 0;

    return {
      revenue,
      salesCount,
      ticket,
      visits,
      conversionRate,
      itemsCount: salesCount,
      paidCount: salesCount,
      pendingCount: pending.length,
      canceledCount: filteredOrders.filter((o) => o.status === "CANCELED").length,
      totalOrders: filteredOrders.length,
    };
  }, [filteredOrders, stats, period]);

  // Real geographic distribution by Brazilian state
  const salesByState = useMemo(() => {
    const map: Record<string, { count: number; revenue: number; percentage: number }> = {};
    const paid = filteredOrders.filter((o) => o.status === "PAID" || o.status === "DELIVERED");

    if (paid.length > 0) {
      paid.forEach((o) => {
        const uf = (o.studentState || "").toUpperCase().trim();
        if (uf) {
          if (!map[uf]) map[uf] = { count: 0, revenue: 0, percentage: 0 };
          map[uf].count += 1;
          map[uf].revenue += o.amount;
        }
      });

      const totalRev = paid.reduce((s, o) => s + o.amount, 0);
      Object.keys(map).forEach((uf) => {
        map[uf].percentage = totalRev > 0 ? Math.round((map[uf].revenue / totalRev) * 100) : 0;
      });
    }

    return map;
  }, [filteredOrders]);

  const stateRankings = useMemo(() => {
    return Object.entries(salesByState)
      .map(([uf, data]) => ({
        uf,
        name: getStateFullName(uf),
        count: data.count,
        revenue: data.revenue,
        percentage: data.percentage,
      }))
      .sort((a, b) => (geoTab === "revenue" ? b.revenue - a.revenue : b.count - a.count));
  }, [salesByState, geoTab]);

  // Real product sales breakdown table
  const productSales = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      units: number;
      fullPrice: number;
      discount: number;
      revenue: number;
    }> = [];

    const paid = filteredOrders.filter((o) => o.status === "PAID" || o.status === "DELIVERED");

    if (paid.length > 0) {
      const map: Record<string, { title: string; units: number; revenue: number; fullPrice: number }> = {};
      paid.forEach((o) => {
        const c = courses.find((crs) => crs.id === o.courseId);
        const originalPrice = c?.originalPrice || (o.amount * 1.3);
        if (!map[o.courseId]) {
          map[o.courseId] = {
            title: o.courseTitle,
            units: 0,
            revenue: 0,
            fullPrice: originalPrice,
          };
        }
        map[o.courseId].units += 1;
        map[o.courseId].revenue += o.amount;
      });

      Object.entries(map).forEach(([id, item]) => {
        list.push({
          id,
          title: item.title,
          units: item.units,
          fullPrice: item.fullPrice,
          discount: Math.max(0, item.fullPrice - (item.revenue / item.units)),
          revenue: item.revenue,
        });
      });
    }

    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return list.filter((p) => p.title.toLowerCase().includes(q));
    }
    return list;
  }, [filteredOrders, courses, productSearch]);

  // Real hourly curve calculation
  const hourlyData = useMemo(() => {
    const hours = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
    const paid = filteredOrders.filter((o) => o.status === "PAID" || o.status === "DELIVERED");

    const points = hours.map((hourLabel) => {
      const hInt = parseInt(hourLabel.split(":")[0], 10);
      const ordersInBucket = paid.filter((o) => {
        const d = new Date(o.createdAt);
        const orderHour = d.getHours();
        return orderHour >= hInt && orderHour < hInt + 3;
      });
      const rev = ordersInBucket.reduce((sum, o) => sum + o.amount, 0);
      const visitsCount = stats?.visitsByHour?.[hourLabel.split(":")[0]] || 0;

      return {
        hour: hourLabel,
        revenue: rev,
        sales: ordersInBucket.length,
        items: ordersInBucket.length,
        visits: visitsCount,
      };
    });

    const values = points.map((p) => {
      if (activeChartTab === "revenue") return p.revenue;
      if (activeChartTab === "sales") return p.sales;
      return p.visits;
    });

    const maxValue = Math.max(...values, 0);

    return {
      points: points.map((p) => {
        const val = activeChartTab === "revenue" ? p.revenue : activeChartTab === "sales" ? p.sales : p.visits;
        return {
          ...p,
          value: val,
          isPeak: maxValue > 0 && val === maxValue,
        };
      }),
      maxValue,
    };
  }, [filteredOrders, stats, activeChartTab]);

  const { points: hourlyPoints, maxValue: hourlyMax } = hourlyData;
  const peakPoint = hourlyPoints.find((p) => p.isPeak && p.value > 0);

  // SVG coordinates dynamic calculation
  const svgCoords = useMemo(() => {
    return hourlyPoints.map((p, idx) => {
      const x = 30 + idx * ((500 - 60) / (hourlyPoints.length - 1));
      const y = hourlyMax > 0 ? 145 - ((p.value / hourlyMax) * 115) : 145;
      return { x, y, ...p };
    });
  }, [hourlyPoints, hourlyMax]);

  const linePath = useMemo(() => {
    return svgCoords.reduce((acc, pt, i) => {
      return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, "");
  }, [svgCoords]);

  const areaPath = useMemo(() => {
    if (svgCoords.length === 0) return "";
    return `${linePath} L ${svgCoords[svgCoords.length - 1].x} 145 L ${svgCoords[0].x} 145 Z`;
  }, [linePath, svgCoords]);

  // Real UTM orders breakdown
  const ordersByUtm = useMemo(() => {
    const map: Record<string, { count: number; revenue: number }> = {};
    const paid = filteredOrders.filter((o) => o.status === "PAID" || o.status === "DELIVERED");

    paid.forEach((o) => {
      const utm = o.utmSource || "Direto / Sem UTM";
      if (!map[utm]) map[utm] = { count: 0, revenue: 0 };
      map[utm].count += 1;
      map[utm].revenue += o.amount;
    });

    return Object.entries(map).map(([name, data]) => ({
      name,
      count: data.count,
      revenue: data.revenue,
    }));
  }, [filteredOrders]);

  const visitsByUtmList = useMemo(() => {
    if (!stats?.visitsByUtm) return [];
    return Object.entries(stats.visitsByUtm)
      .map(([name, visits]) => ({ name, visits }))
      .sort((a, b) => b.visits - a.visits);
  }, [stats]);

  const visitsByStateList = useMemo(() => {
    if (!stats?.visitsByState) return [];
    return Object.entries(stats.visitsByState)
      .map(([uf, visits]) => ({ uf, name: getStateFullName(uf), visits }))
      .sort((a, b) => b.visits - a.visits);
  }, [stats]);

  return (
    <div className="space-y-6 pb-12 animate-fade-slide">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Dashboard
            </h2>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Tempo Real
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            {period === "today" ? "Hoje" : period === "7d" ? "Últimos 7 dias" : period === "30d" ? "Este Mês" : "Todo o Período"} • atualizado às {lastUpdated || "agora"}
          </p>
        </div>

        {/* Date Filter & Quick Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="inline-flex rounded-xl bg-[#0c101a] border border-white/10 p-1">
            <button
              onClick={() => setPeriod("today")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                period === "today"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setPeriod("7d")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                period === "7d"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              7 dias
            </button>
            <button
              onClick={() => setPeriod("30d")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                period === "30d"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Este Mês
            </button>
            <button
              onClick={() => setPeriod("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                period === "all"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Tudo
            </button>
          </div>

          <button
            onClick={() => {
              fetchStats();
              if (onRefresh) onRefresh();
            }}
            disabled={isLoadingStats}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition cursor-pointer"
            title="Atualizar telemetria"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingStats ? "animate-spin text-red-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Section 1: Métricas de Vendas (6 KPIs Reais) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="font-bold uppercase tracking-wider text-neutral-300">
            Métricas de vendas <span className="text-neutral-500 font-normal">({period === "today" ? "Hoje" : period})</span>
          </span>
          <span className="text-[11px] text-neutral-500">Dados reais consolidados</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* 1. Faturamento */}
          <div className="p-4 rounded-2xl bg-[#0c101a] border border-white/[0.08] hover:border-white/20 transition-all">
            <span className="text-[11px] font-semibold text-neutral-400 block mb-1">Faturamento</span>
            <span className="text-xl font-black font-mono text-white block">
              {formatCurrency(metrics.revenue)}
            </span>
            <div className="flex items-center gap-1 text-[10px] mt-1">
              {metrics.revenue > 0 ? (
                <span className="text-emerald-400 font-medium">+{formatCurrency(metrics.revenue)}</span>
              ) : (
                <span className="text-neutral-500">Sem vendas no período</span>
              )}
            </div>
          </div>

          {/* 2. Vendas */}
          <div className="p-4 rounded-2xl bg-[#0c101a] border border-white/[0.08] hover:border-white/20 transition-all">
            <span className="text-[11px] font-semibold text-neutral-400 block mb-1">Vendas</span>
            <span className="text-xl font-black font-mono text-white block">
              {metrics.salesCount}
            </span>
            <div className="flex items-center gap-1 text-[10px] mt-1">
              {metrics.salesCount > 0 ? (
                <span className="text-emerald-400 font-medium">+{metrics.salesCount} pedidos pagos</span>
              ) : (
                <span className="text-neutral-500">Nenhum pedido pago</span>
              )}
            </div>
          </div>

          {/* 3. Valor por Pedido (Ticket Médio) */}
          <div className="p-4 rounded-2xl bg-[#0c101a] border border-white/[0.08] hover:border-white/20 transition-all">
            <span className="text-[11px] font-semibold text-neutral-400 block mb-1">Valor por pedido</span>
            <span className="text-xl font-black font-mono text-white block">
              {formatCurrency(metrics.ticket)}
            </span>
            <div className="flex items-center gap-1 text-[10px] mt-1">
              {metrics.ticket > 0 ? (
                <span className="text-emerald-400 font-medium">Média por aluno</span>
              ) : (
                <span className="text-neutral-500">Aguardando pedidos</span>
              )}
            </div>
          </div>

          {/* 4. Visitas */}
          <div className="p-4 rounded-2xl bg-[#0c101a] border border-white/[0.08] hover:border-white/20 transition-all">
            <span className="text-[11px] font-semibold text-neutral-400 block mb-1">Visitas</span>
            <span className="text-xl font-black font-mono text-white block">
              {metrics.visits}
            </span>
            <div className="flex items-center gap-1 text-[10px] mt-1">
              {metrics.visits > 0 ? (
                <span className="text-emerald-400 font-medium">Acessos reais rastreados</span>
              ) : (
                <span className="text-neutral-500">Aguardando visitantes</span>
              )}
            </div>
          </div>

          {/* 5. Compras por Visita (Conversão) */}
          <div className="p-4 rounded-2xl bg-[#0c101a] border border-white/[0.08] hover:border-white/20 transition-all">
            <span className="text-[11px] font-semibold text-neutral-400 block mb-1">Compras por visita</span>
            <span className="text-xl font-black font-mono text-white block">
              {metrics.conversionRate.toFixed(1)}%
            </span>
            <div className="flex items-center gap-1 text-[10px] mt-1">
              {metrics.conversionRate > 0 ? (
                <span className="text-emerald-400 font-medium">Taxa de conversão</span>
              ) : (
                <span className="text-neutral-500">0% conversão</span>
              )}
            </div>
          </div>

          {/* 6. Itens Vendidos */}
          <div className="p-4 rounded-2xl bg-[#0c101a] border border-white/[0.08] hover:border-white/20 transition-all">
            <span className="text-[11px] font-semibold text-neutral-400 block mb-1">Itens vendidos</span>
            <span className="text-xl font-black font-mono text-white block">
              {metrics.itemsCount}
            </span>
            <div className="flex items-center gap-1 text-[10px] mt-1">
              {metrics.itemsCount > 0 ? (
                <span className="text-emerald-400 font-medium">+{metrics.itemsCount} cursos</span>
              ) : (
                <span className="text-neutral-500">0 itens liberados</span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Section 2: Row 1 (Lucro, Conversão & Gráfico de Vendas por Hora) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Card Lucro */}
        <div className="lg:col-span-3 p-5 rounded-3xl bg-[#0c101a] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span className="font-bold text-white uppercase text-[11px] tracking-wider">Lucro</span>
              <span className="text-neutral-500">{period === "today" ? "Hoje" : period}</span>
            </div>
            
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                {formatCurrency(metrics.revenue)}
              </span>
              <span className="text-xs text-neutral-400 block mt-0.5">
                {metrics.revenue > 0 ? "100% do faturamento" : "Aguardando vendas"}
              </span>
            </div>

            <p className="text-[11px] text-emerald-400 mt-2 font-medium">
              Lucro líquido 100% (produtos digitais)
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Lucro líquido
              </span>
              <span className="font-mono text-white">{formatCurrency(metrics.revenue)} ({metrics.revenue > 0 ? "100%" : "0%"})</span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all" 
                style={{ width: metrics.revenue > 0 ? "100%" : "0%" }}
              />
            </div>
            <p className="text-[10px] text-neutral-500 mt-3">
              {metrics.paidCount > 0 
                ? `Esta conta usa ${metrics.paidCount} pedido(s) pago(s) no período.`
                : "Nenhum pedido pago registrado no período."}
            </p>
          </div>
        </div>

        {/* Card Conversão */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-[#0c101a] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span className="font-bold text-white uppercase text-[11px] tracking-wider">Conversão</span>
              <span className="text-neutral-500">{period === "today" ? "Hoje" : period}</span>
            </div>

            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                {metrics.totalOrders > 0 ? ((metrics.paidCount / metrics.totalOrders) * 100).toFixed(1) : "0.0"}%
              </span>
              <span className="text-xs text-neutral-400 block mt-0.5">
                {metrics.paidCount} de {metrics.totalOrders} pedidos foram pagos
              </span>
            </div>

            <p className="text-[11px] text-neutral-400 mt-2 font-medium">
              {metrics.totalOrders > 0 
                ? `${metrics.paidCount} pedido(s) concluído(s)`
                : "Aguardando primeiros pedidos"}
            </p>

            {/* Split Progress Bar */}
            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden flex mt-4">
              <div 
                className="bg-emerald-500 h-full transition-all" 
                style={{ width: metrics.totalOrders > 0 ? `${(metrics.paidCount / metrics.totalOrders) * 100}%` : "0%" }} 
              />
              <div 
                className="bg-amber-500/80 h-full transition-all" 
                style={{ width: metrics.totalOrders > 0 ? `${(metrics.pendingCount / metrics.totalOrders) * 100}%` : "0%" }} 
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Pagos
              </span>
              <span className="font-mono text-white font-bold">
                {metrics.paidCount} <span className="text-neutral-500 font-normal">({metrics.totalOrders > 0 ? ((metrics.paidCount / metrics.totalOrders) * 100).toFixed(1) : "0"}%)</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Aguardando PIX
              </span>
              <span className="font-mono text-neutral-300">
                {metrics.pendingCount} <span className="text-neutral-500 font-normal">({metrics.totalOrders > 0 ? ((metrics.pendingCount / metrics.totalOrders) * 100).toFixed(1) : "0"}%)</span>
              </span>
            </div>

            <div className="pt-2 text-[11px] text-neutral-400 border-t border-white/5 flex items-center justify-between">
              <span>Método: <strong>Pix</strong></span>
              <span className="font-mono text-white">
                {metrics.totalOrders > 0 
                  ? `${metrics.paidCount} de ${metrics.totalOrders} (${Math.round((metrics.paidCount / metrics.totalOrders) * 100)}%)`
                  : "0 de 0 (0%)"}
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 pt-1">
              Liberação automática de acesso via Pix VeloraPay.
            </p>
          </div>
        </div>

        {/* Card Gráfico de Vendas */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-[#0c101a] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <span className="font-bold text-white uppercase text-[11px] tracking-wider">
                Gráfico de vendas <span className="text-neutral-500 font-normal">({period === "today" ? "Hoje" : period})</span>
              </span>
              
              {/* Metric Tabs */}
              <div className="inline-flex rounded-xl bg-neutral-900 border border-white/10 p-0.5 text-xs">
                <button
                  onClick={() => setActiveChartTab("revenue")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    activeChartTab === "revenue" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Faturamento {formatCurrency(metrics.revenue)}
                </button>
                <button
                  onClick={() => setActiveChartTab("sales")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    activeChartTab === "sales" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Vendas {metrics.salesCount}
                </button>
                <button
                  onClick={() => setActiveChartTab("visits")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    activeChartTab === "visits" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Visitas {metrics.visits}
                </button>
              </div>
            </div>

            {/* SVG Interactive Line Chart */}
            <div className="relative w-full h-44 mt-3">
              
              {/* Peak Callout Badge (Only shown if real value > 0) */}
              {peakPoint && peakPoint.value > 0 && (
                <div 
                  className="absolute px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold shadow-lg flex items-center gap-1 z-10 pointer-events-none -translate-x-1/2"
                  style={{
                    left: `${(svgCoords.find((c) => c.hour === peakPoint.hour)?.x || 250) / 5}%`,
                    top: "8px",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    Pico {activeChartTab === "revenue" ? formatCurrency(peakPoint.value) : `${peakPoint.value} ${activeChartTab}`}
                  </span>
                </div>
              )}

              <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="chartGlowReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="0" y1="115" x2="500" y2="115" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="0" y1="145" x2="500" y2="145" stroke="rgba(255,255,255,0.1)" />

                {/* Gradient Fill under curve if values exist */}
                {hourlyMax > 0 && areaPath && (
                  <path d={areaPath} fill="url(#chartGlowReal)" />
                )}

                {/* Green Line Graph with peak points */}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke={hourlyMax > 0 ? "#10b981" : "rgba(255,255,255,0.15)"}
                    strokeWidth={hourlyMax > 0 ? "2.5" : "1.5"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Dynamic Data Nodes */}
                {svgCoords.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r={pt.isPeak && pt.value > 0 ? 5 : pt.value > 0 ? 4 : 2}
                    fill={pt.value > 0 ? "#10b981" : "#4b5563"}
                    stroke={pt.value > 0 ? "#ffffff" : "transparent"}
                    strokeWidth={pt.value > 0 ? 1.5 : 0}
                  />
                ))}
              </svg>
            </div>

            {/* X Axis Time Labels */}
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-2 px-1">
              <span>00:00</span>
              <span>03:00</span>
              <span>06:00</span>
              <span>09:00</span>
              <span>12:00</span>
              <span>15:00</span>
              <span>18:00</span>
              <span>21:00</span>
            </div>
          </div>
        </div>

      </div>

      {/* Section 3: Row 2 (Lugares que Compraram / Mapa do Brasil & Vendas por UTM) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Lugares que Compraram (Mapa do Brasil + Ranking) */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-[#0c101a] border border-white/[0.08]">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <span className="font-bold text-white uppercase text-[11px] tracking-wider block">
                Gráfico de vendas • Lugares que compraram
              </span>
              <span className="text-xs text-neutral-400">Distribuição geográfica real dos compradores no Brasil</span>
            </div>

            {/* Metric Switch */}
            <div className="inline-flex rounded-xl bg-neutral-900 border border-white/10 p-0.5 text-xs">
              <button
                onClick={() => setGeoTab("revenue")}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  geoTab === "revenue" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                Faturamento
              </button>
              <button
                onClick={() => setGeoTab("sales")}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  geoTab === "sales" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                Vendas
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Interactive Vector Map of Brazil */}
            <div className="md:col-span-6 flex flex-col items-center justify-center">
              <BrazilMap 
                salesByState={salesByState} 
                activeMetric={geoTab} 
              />
              <span className="text-[10px] text-neutral-500 mt-2">
                Passe o cursor sobre os estados para inspecionar
              </span>
            </div>

            {/* State Rankings List */}
            <div className="md:col-span-6 space-y-4">
              
              {/* Compradores por Estado */}
              {stateRankings.length > 0 ? (
                <div className="space-y-3">
                  {stateRankings.map((st) => (
                    <div key={st.uf} className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          <span className="font-bold text-white">{st.name} ({st.uf})</span>
                        </div>
                        <span className="font-mono font-bold text-white">
                          {geoTab === "revenue" ? formatCurrency(st.revenue) : `${st.count} pedido(s)`}{" "}
                          <span className="text-emerald-400 font-semibold">({st.percentage}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${st.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-neutral-400 space-y-1">
                  <Globe className="w-6 h-6 mx-auto mb-1 text-neutral-600" />
                  <span className="font-bold text-neutral-300 block">Nenhuma compra registrada no período</span>
                  <p className="text-[11px] text-neutral-500">
                    Os estados dos alunos acenderão no mapa do Brasil assim que os primeiros pedidos forem concluídos.
                  </p>
                </div>
              )}

              {/* Estados com Acessos Reais (Telemetria) */}
              <div className="space-y-2 pt-2 text-xs border-t border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                  Acessos Geolocalizados Rastreados
                </span>

                {visitsByStateList.length > 0 ? (
                  visitsByStateList.slice(0, 4).map((st) => (
                    <div key={st.uf} className="flex items-center justify-between text-neutral-400 text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" /> {st.name} ({st.uf})
                      </span>
                      <span className="font-mono text-neutral-300">{st.visits} acesso(s)</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-neutral-500">
                    Aguardando visitantes geolocalizados...
                  </p>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Vendas por UTM & Gateways */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Vendas por UTM */}
          <div className="p-5 rounded-3xl bg-[#0c101a] border border-white/[0.08]">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-3">
              <span className="font-bold text-white uppercase text-[11px] tracking-wider">
                Vendas por UTM
              </span>
              <span className="text-neutral-500">{period === "today" ? "Hoje" : period}</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {ordersByUtm.length > 0 ? (
                ordersByUtm.map((utm, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">{utm.name}</span>
                      <span className="text-[10px] text-neutral-500">Campanha rastreada</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-white font-bold block">{utm.count} pedido(s)</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">{formatCurrency(utm.revenue)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-neutral-500">
                  Nenhum pedido pago com tag UTM no período.
                </div>
              )}

              {/* Visitas por Canal UTM */}
              {visitsByUtmList.length > 0 && (
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Visitas por Canal Rastreado
                  </span>
                  {visitsByUtmList.slice(0, 3).map((v, i) => (
                    <div key={i} className="flex items-center justify-between text-neutral-400 text-xs">
                      <span>{v.name}</span>
                      <span className="font-mono text-neutral-300">{v.visits} visita(s)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bancos e Métodos de Pagamento */}
          <div className="p-5 rounded-3xl bg-[#0c101a] border border-white/[0.08]">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-3">
              <span className="font-bold text-white uppercase text-[11px] tracking-wider">
                Bancos e métodos de pagamento
              </span>
              <span className="text-neutral-500">{period === "today" ? "Hoje" : period}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-neutral-300">Métodos: <strong>Pix</strong></span>
                <span className="font-mono text-white font-bold">
                  {metrics.paidCount} de {metrics.totalOrders} pagos ({formatCurrency(metrics.revenue)})
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="flex items-center gap-1.5 text-neutral-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Gateway: <strong>VeloraPay</strong>
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  {formatCurrency(metrics.revenue)} ({metrics.paidCount > 0 ? "100%" : "0%"})
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Section 4: Faturamento por Produto Hoje (Tabela com Busca) */}
      <div className="p-5 rounded-3xl bg-[#0c101a] border border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-bold text-white text-base tracking-tight">
              Faturamento por produto <span className="text-neutral-500 text-xs font-normal">({period === "today" ? "Hoje" : period})</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Receita consolidada de cada curso ou combo vendido
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar produto..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-red-500"
              />
            </div>
            <span className="text-xs text-neutral-500 font-mono whitespace-nowrap">
              {productSales.length} produtos
            </span>
          </div>
        </div>

        {/* Product Table or Empty State */}
        {productSales.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-neutral-950/40">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-white/[0.02] text-neutral-500 uppercase text-[10px] font-bold border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Produto</th>
                  <th className="py-3 px-4 text-center">Unidades</th>
                  <th className="py-3 px-4 text-right">Preço cheio</th>
                  <th className="py-3 px-4 text-right">Desconto</th>
                  <th className="py-3 px-4 text-right">Faturamento líquido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {productSales.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-4 font-sans font-semibold text-white">
                      {prod.title}
                    </td>
                    <td className="py-3.5 px-4 text-center text-neutral-300">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-[11px] font-bold">
                        {prod.units}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-neutral-400">
                      {formatCurrency(prod.fullPrice)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-neutral-500">
                      - {formatCurrency(prod.discount)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-400 text-sm">
                      {formatCurrency(prod.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-neutral-400 rounded-2xl border border-dashed border-white/10 bg-neutral-950/30">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
            <p className="text-sm font-semibold text-neutral-300">
              Nenhuma venda de produto registrada no período selecionado.
            </p>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Assim que os alunos comprarem os cursos pelo site, a receita por produto aparecerá discriminada nesta tabela.
            </p>
          </div>
        )}

        {/* Table Summary Footer */}
        {productSales.length > 0 && (
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-400 px-1 pt-2">
            <span>Total consolidado dos produtos listados</span>
            <span className="font-mono font-bold text-white text-sm">
              Total: {formatCurrency(productSales.reduce((acc, p) => acc + p.revenue, 0))}
            </span>
          </div>
        )}
      </div>

    </div>
  );
}

export default AdminAnalyticsDashboard;
