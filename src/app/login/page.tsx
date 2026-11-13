"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Lock, User as UserIcon, AlertTriangle } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "cadastro">("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmSenha: "",
  });
  const [error, setError] = useState("");

  const ADMIN_EMAILS = ["admin@seuemail.com", "admin2@seuemail.com"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      if (mode === "login") {
        const role = ADMIN_EMAILS.includes(formData.email) ? "admin" : "student";
        router.push(role === "admin" ? "/admin/dashboard" : "/minha-conta");
      } else {
        router.push("/login");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-surface-100 text-white">
      <Navbar user={null} onLogin={() => {}} onLogout={() => {}} />
      <main className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="flex items-center justify-center gap-2 mb-6">
              <BrandLogo size={42} showText={true} />
            </Link>
            <h2 className="text-2xl font-bold text-white mb-2">
              {mode === "login" ? "Entrar na sua conta" : "Criar sua conta"}
            </h2>
            <p className="text-gray-400 text-sm">
              {mode === "login"
                ? "Acesse sua área de aluno para ver seus cursos adquiridos."
                : "Cadastre-se para comprar cursos e acessar sua área do cliente."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "cadastro" && (
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Nome completo</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-surface-200/50 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-500"
                  placeholder="João Silva"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-mail
              </label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-surface-200/50 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-500"
                placeholder="seuemail@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Senha
              </label>
              <input
                type="password"
                required
                minLength={6}
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-surface-200/50 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-500"
                placeholder="••••••••"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              />
            </div>
            {mode === "cadastro" && (
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Confirmar senha</label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-surface-200/50 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-500"
                  placeholder="••••••••"
                  value={formData.confirmSenha}
                  onChange={(e) => setFormData({ ...formData, confirmSenha: e.target.value })}
                />
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-neon flex items-center justify-center gap-2"
            >
              {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Aguarde</span> : mode === "login" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            {mode === "login"
              ? "Não tem uma conta? "
              : "Já tem uma conta? "}
            <button
              onClick={() => setMode(mode === "login" ? "cadastro" : "login")}
              className="text-brand-400 font-medium hover:text-brand-300"
            >
              {mode === "login" ? "Cadastre-se" : "Entrar"}
            </button>
          </p>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-500 mb-3">Acesso para administradores:</p>
            <div className="text-xs text-gray-400 space-y-1">
              <div>admin@seuemail.com</div>
              <div>admin2@seuemail.com</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

