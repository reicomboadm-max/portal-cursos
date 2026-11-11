"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCourseBySlug, SITE_SETTINGS } from "@/lib/data";
import { COURSES } from "@/lib/data";
import { Mail, Lock, CreditCard, Phone, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import type { Course } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [courseId, setCourseIdState] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [step, setStep] = useState<"dados" | "pagamento" | "sucesso">("dados");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    confirmEmail: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const id = params.get("course");
    if (id) {
      setCourseIdState(id);
      const c = COURSES.find((x) => x.id === id);
      setCourse(c || null);
    }
  }, []);

  const isAdmin = user ? ["admin@seuemail.com", "admin2@seuemail.com"].includes(user.email) : false;

  const onLogin = () => setUser({ name: "Usuário", email: "usuario@gmail.com", role: "student" });
  const onLogout = () => setUser(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.nome.trim()) e.nome = "Informe seu nome";
    if (!formData.email.trim()) e.email = "Informe seu e-mail";
    else if (!formData.email.includes("@gmail.com")) e.email = "Use um e-mail Gmail para acesso ao Drive";
    if (!formData.whatsapp.trim()) e.whatsapp = "Informe seu WhatsApp";
    if (formData.email !== formData.confirmEmail) e.confirmEmail = "E-mails não coincidem";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const gerarPix = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setStep("sucesso");
    setLoading(false);
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-surface-100 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Curso não encontrado.</p>
          <Link href="/cursos" className="text-brand-400 hover:underline mt-4 inline-block">Voltar aos cursos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-100 text-white">
      <Navbar user={user} onLogin={onLogin} onLogout={onLogout} />
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {step === "dados" && (
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-surface-200 p-6">
                  <h2 className="text-lg font-bold mb-2">Resumo do pedido</h2>
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <span className="text-gray-400 text-sm">{course.title}</span>
                    <span className="text-white font-medium">R$ {course.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="pt-4 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">Total</span>
                    <span className="text-xl font-bold text-accent-emerald">R$ {course.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <p className="mt-4 text-xs text-gray-500">
                    O acesso ao Google Drive será enviado para o e-mail informado após confirmação do pagamento.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-surface-200 p-6">
                  <h2 className="text-lg font-bold mb-6">Seus dados</h2>
                  <form onSubmit={(e) => { e.preventDefault(); gerarPix(); }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Seu nome completo</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-lg border border-white/10 bg-surface-300/50 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-500"
                          placeholder="João Silva"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        />
                        {errors.nome && <p className="text-xs text-red-400 mt-1">{errors.nome}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">E-mail (Gmail obrigatório)</label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 rounded-lg border border-white/10 bg-surface-300/50 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-500"
                          placeholder="seuemail@gmail.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Confirme o e-mail</label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 rounded-lg border border-white/10 bg-surface-300/50 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-500"
                          placeholder="seuemail@gmail.com"
                          value={formData.confirmEmail}
                          onChange={(e) => setFormData({ ...formData, confirmEmail: e.target.value })}
                        />
                        {errors.confirmEmail && <p className="text-xs text-red-400 mt-1">{errors.confirmEmail}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">WhatsApp (com DDD)</label>
                        <input
                          type="tel"
                          className="w-full px-3 py-2 rounded-lg border border-white/10 bg-surface-300/50 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-500"
                          placeholder="11999999999"
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        />
                        {errors.whatsapp && <p className="text-xs text-red-400 mt-1">{errors.whatsapp}</p>}
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-xs text-gray-500 mb-3">
                          ⚠️ O e-mail deve ser Gmail para receber o acesso ao Google Drive.
                        </p>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-neon flex items-center justify-center gap-2"
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                          Gerar Pagamento PIX
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {step === "sucesso" && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-accent-emerald/20 flex items-center justify-center mx-auto mb-6 text-accent-emerald">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Pagamento gerado!</h2>
              <p className="text-gray-400 mb-8">
                Copie o código PIX abaixo ou escaneie o QR Code com o app do seu banco.
              </p>

              <div className="rounded-2xl border border-white/10 bg-surface-200 p-6 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-400">Código PIX (copia e cola)</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("PIX_CODIGO_EXEMPLO_AQUI");
                      alert("Código copiado!");
                    }}
                    className="text-xs text-brand-400 hover:text-brand-300"
                  >
                    Copiar
                  </button>
                </div>
                <div className="bg-surface-300/20 rounded-xl p-3 mb-4 text-xs font-mono text-gray-300 break-all border border-white/5">
                  00020126580014BR.GOV.BCB.PIX0136...
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors">
                    Pagar com PIX
                  </button>
                  <button className="px-4 py-3 border border-white/10 hover:bg-white/10 text-white rounded-xl transition-colors">
                    QR Code
                  </button>
                </div>
              </div>

              <p className="mt-6 text-xs text-gray-500">
                Após a confirmação, o acesso ao Drive será enviado para <br />
                <span className="text-brand-400 font-medium">{formData.email}</span>
              </p>
              <Link
                href="/cursos"
                className="mt-8 inline-block text-brand-400 hover:text-brand-300"
              >
                Voltar aos cursos
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

