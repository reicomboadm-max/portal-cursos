"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MOCK_ORDERS, SITE_SETTINGS } from "@/lib/data";
import { Mail, Play, CreditCard, DollarSign, Users, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [tab, setTab] = useState<"vendas" | "pedidos">("vendas");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pc_admin");
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch {
          setUser({ name: "Administrador", email: "admin@seuemail.com", role: "admin" });
        }
      } else {
        setUser({ name: "Administrador", email: "admin@seuemail.com", role: "admin" });
        localStorage.setItem("pc_admin", JSON.stringify({ name: "Administrador", email: "admin@seuemail.com", role: "admin" }));
      }
    }
  }, []);

  if (!user || !["admin@seuemail.com", "admin2@seuemail.com"].includes(user.email)) {
    return (
      <div className="min-h-screen bg-surface-100 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Acesso restrito</h1>
          <p className="text-gray-400">Apenas administradores podem acessar este painel.</p>
          <Link href="/login" className="mt-4 inline-block text-brand-400 hover:underline">Fazer login</Link>
        </div>
      </div>
    );
  }

  const totalVendas = MOCK_ORDERS.reduce((sum, o) => sum + (o.status === "PAID" ? o.amount : 0), 0);
  const totalPedidos = MOCK_ORDERS.length;
  const pedidosPendentes = MOCK_ORDERS.filter((o) => o.status !== "PAID").length;
  const pedidosPagos = MOCK_ORDERS.filter((o) => o.status === "PAID").length;

  return (
    <div className="min-h-screen bg-surface-100 text-white">
      <Navbar user={user} onLogin={() => {}} onLogout={() => { localStorage.removeItem("pc_admin"); window.location.reload(); }} />
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
              <p className="text-gray-400 text-sm">Estatísticas de vendas e serviços adquiridos</p>
            </div>
            <div className="flex gap-2">
              <Link href="/cursos" className="text-sm text-gray-400 hover:text-white">Ver site</Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total em Vendas"
              value={`R$ ${totalVendas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              icon={<DollarSign className="w-5 h-5 text-brand-400" />}
              trend="+12% este mês"
              trendColor="text-accent-emerald"
            />
            <StatCard
              title="Total de Pedidos"
              value={totalPedidos}
              icon={<Users className="w-5 h-5 text-accent-cyan" />}
              trend={pedidosPagos + " pagos"}
              trendColor="text-accent-emerald"
            />
            <StatCard
              title="Pagos"
              value={pedidosPagos}
              icon={<CheckCircle className="w-5 h-5 text-accent-emerald" />}
              trend="Confirmados"
              trendColor="text-accent-emerald"
            />
            <StatCard
              title="Pendentes"
              value={pedidosPendentes}
              icon={<Clock className="w-5 h-5 text-accent-amber" />}
              trend="Aguardando pagamento"
              trendColor="text-accent-amber"
            />
          </div>

          <div className="flex gap-4 border-b border-white/10 mb-8">
            <button
              onClick={() => setTab("vendas")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === "vendas" ? "border-brand-500 text-brand-400" : "text-gray-400 hover:text-white border-transparent"}`}
            >
              Vendas
            </button>
            <button
              onClick={() => setTab("pedidos")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === "pedidos" ? "border-brand-500 text-brand-400" : "text-gray-400 hover:text-white border-transparent"}`}
            >
              Pedidos
            </button>
          </div>

          {tab === "vendas" && (
            <div className="rounded-xl border border-white/10 bg-surface-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h2 className="text-lg font-bold text-white">Resumo de Vendas</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/5 bg-surface-300/10">
                      <th className="px-4 py-3 text-gray-400 font-medium">Data</th>
                      <th className="px-4 py-3 text-gray-400 font-medium">Cliente</th>
                      <th className="px-4 py-3 text-gray-400 font-medium">E-mail</th>
                      <th className="px-4 py-3 text-gray-400 font-medium">Produto</th>
                      <th className="px-4 py-3 text-gray-400 font-medium">Valor</th>
                      <th className="px-4 py-3 text-gray-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...MOCK_ORDERS].reverse().map((p) => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-gray-400">{new Date(p.createdAt).toLocaleDateString("pt-BR")}</td>
                        <td className="px-4 py-3 text-white font-medium">{p.studentName}</td>
                        <td className="px-4 py-3 text-gray-300 text-xs">{p.studentEmail}</td>
                        <td className="px-4 py-3 text-white">{p.courseTitle}</td>
                        <td className="px-4 py-3 text-white">R$ {p.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.status === "PAID" ? "bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30" : "bg-gray-500/20 text-gray-400 border border-gray-500/30"}`}>
                            {p.status === "PAID" ? "Pago" : "Pendente"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "pedidos" && (
            <div className="rounded-xl border border-white/10 bg-surface-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h2 className="text-lg font-bold text-white">Todos os Pedidos</h2>
                <p className="text-xs text-gray-500 mt-1">Quem, como, qual produto, e-mail, valor e status.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/5 bg-surface-300/10">
                      <th className="px-4 py-3 text-gray-400 font-medium">Pedido</th>
                      <th className="px-4 py-3 text-gray-400 font-medium">Cliente</th>
                      <th className="px-4 py-3 text-gray-400 font-medium">E-mail</th>
                      <th className="px-4 py-3 text-gray-400 font-medium">Produto</th>
                      <th className="px-4 py-3 text-gray-400 font-medium">Segmento</th>
                      <th className="px-4 py-3 text-gray-400 font-medium">Pagamento</th>
                      <th className="px-4 py-3 text-gray-400 font-medium">Valor</th>
                      <th className="px-4 py-3 text-gray-400 font-medium">Status</th>
                      <th className="px-4 py-3 text-gray-400 font-medium">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...MOCK_ORDERS].reverse().map((p) => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.id}</td>
                        <td className="px-4 py-3 text-white font-medium">{p.studentName}</td>
                        <td className="px-4 py-3 text-gray-300 text-xs">{p.studentEmail}</td>
                        <td className="px-4 py-3 text-white">{p.courseTitle}</td>
                        <td className="px-4 py-3 text-gray-300 text-xs capitalize">{p.courseSegment}</td>
                        <td className="px-4 py-3 text-gray-300 text-xs">{p.paymentMethod}</td>
                        <td className="px-4 py-3 text-white">R$ {p.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.status === "PAID" ? "bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30" : "bg-gray-500/20 text-gray-400 border border-gray-500/30"}`}>
                            {p.status === "PAID" ? "Pago" : "Pendente"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{new Date(p.createdAt).toLocaleDateString("pt-BR")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendColor }: { title: string; value: string | number; icon: React.ReactNode; trend: string; trendColor: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-brand-400">
          {icon}
        </div>
      </div>
      <p className={`mt-3 text-xs font-medium ${trendColor}`}>{trend}</p>
    </div>
  );
}
