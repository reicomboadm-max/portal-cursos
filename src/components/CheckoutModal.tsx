"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/types";
import { 
  X, 
  Lock, 
  Copy, 
  Check, 
  MessageCircle, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Clock,
  MailCheck
} from "lucide-react";
import Link from "next/link";

export function CheckoutModal() {
  const { 
    selectedCourseForCheckout, 
    closeCheckout, 
    createOrder, 
    settings,
    simulatePaymentApproval,
    loginAsStudent
  } = useStore();

  const [step, setStep] = useState<"form" | "pix">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPaidSimulated, setIsPaidSimulated] = useState(false);

  if (!selectedCourseForCheckout) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsLoading(true);
    try {
      const newOrder = await createOrder({
        courseId: selectedCourseForCheckout.id,
        studentName: name,
        studentEmail: email,
        studentWhatsapp: whatsapp,
      });

      setOrder(newOrder);
      setStep("pix");
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar pedido. Verifique os dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPix = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.pixCopyPaste);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSimulatePayment = () => {
    if (!order) return;
    simulatePaymentApproval(order.id);
    setIsPaidSimulated(true);
    // Also auto log the student in
    loginAsStudent(order.studentEmail, order.studentName);
  };

  const cleanWhatsappNumber = settings.whatsappSupport.replace(/\D/g, "");
  const whatsappReceiptMessage = order
    ? encodeURIComponent(
        `Olá! Acabei de realizar o pagamento via PIX para o pedido *${order.id}* do curso *${order.courseTitle}* no valor de ${formatCurrency(order.amount)}. Meu Gmail para envio do Drive em até 24h é: *${order.studentEmail}*`
      )
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#0c101d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-surface-100/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {step === "form" ? "Checkout do Curso • Envio em até 24h" : "Pagamento do Pedido via PIX"}
              </h2>
              <p className="text-xs text-gray-400">
                {step === "form" ? "Preencha seu Gmail para receber o acesso ao Drive" : `Pedido: ${order?.id}`}
              </p>
            </div>
          </div>
          <button
            onClick={closeCheckout}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Course Summary Banner */}
        <div className="p-4 sm:p-5 bg-indigo-950/40 border-b border-indigo-500/20 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Curso Escolhido</span>
            <p className="text-sm font-bold text-white truncate">{selectedCourseForCheckout.title}</p>
            <p className="text-xs text-indigo-200">
              {selectedCourseForCheckout.folderSize} • {selectedCourseForCheckout.platform}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs text-gray-400 line-through block">
              {formatCurrency(selectedCourseForCheckout.originalPrice)}
            </span>
            <span className="text-xl font-black text-emerald-400">
              {formatCurrency(selectedCourseForCheckout.price)}
            </span>
          </div>
        </div>

        {/* STEP 1: FORM */}
        {step === "form" && (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            
            {/* Delivery Alert: 24 hours */}
            <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-start gap-3">
              <Clock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-200 leading-relaxed">
                <strong className="text-white block mb-0.5">Prazo de Envio: até 24 Horas</strong>
                Após a confirmação do pagamento no PIX, adicionaremos seu e-mail como leitor na pasta oficial do Google Drive no prazo de até 24 horas.
              </div>
            </div>

            {/* Gmail Warning */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200/90 leading-relaxed">
                <strong className="text-amber-300 block mb-0.5">Atenção ao E-mail de Envio:</strong>
                Informe seu endereço do <strong>@gmail.com</strong>. O acesso ao Google Drive será compartilhado diretamente neste e-mail.
              </div>
            </div>

            {/* Inputs */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Seu Nome Completo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Eduardo da Silva"
                className="w-full px-4 py-3 rounded-xl bg-surface-100 border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Seu E-mail Gmail para Receber o Drive *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seunome@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-surface-100 border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                WhatsApp com DDD (para envio de notificações e suporte)
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-3 rounded-xl bg-surface-100 border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Processado com segurança via <strong className="text-white font-semibold">VeloraPay</strong> • PIX Instantâneo</span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>{isLoading ? "Gerando Pedido PIX..." : "Gerar Chave e QR Code PIX"}</span>
            </button>
          </form>
        )}

        {/* STEP 2: PIX */}
        {step === "pix" && order && (
          <div className="p-5 sm:p-6 space-y-5 text-center">
            
            {/* Status Alert */}
            {isPaidSimulated ? (
              <div className="p-4 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 space-y-3">
                <div className="flex items-center justify-center gap-2 font-bold text-base text-white">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span>PAGAMENTO PIX CONFIRMADO!</span>
                </div>
                
                <div className="p-3 rounded-xl bg-black/40 text-left space-y-1.5 border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                    <Clock className="w-4 h-4" />
                    <span>Em processamento de envio (prazo: até 24h)</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    O link de acesso ao curso <strong>{order.courseTitle}</strong> será compartilhado no seu Gmail:
                  </p>
                  <p className="text-xs font-mono font-bold text-white bg-white/5 px-2.5 py-1 rounded">
                    {order.studentEmail}
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href="/aluno"
                    onClick={closeCheckout}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center justify-center gap-1.5"
                  >
                    <MailCheck className="w-4 h-4" />
                    <span>Acompanhar Pedido na Área do Aluno</span>
                  </Link>

                  <a
                    href={`https://wa.me/${cleanWhatsappNumber}?text=${whatsappReceiptMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Avisar no WhatsApp sobre o pagamento</span>
                  </a>
                </div>
              </div>
            ) : (
              <>
                {/* QR Code Container */}
                <div className="flex flex-col items-center">
                  <p className="text-xs text-gray-300 mb-2">
                    Escaneie o QR Code no seu banco para pagar:
                  </p>
                  <div className="p-3 bg-white rounded-2xl shadow-xl inline-block border-2 border-indigo-500/30">
                    {order.pixQrCodeUrl ? (
                      <Image
                        src={order.pixQrCodeUrl}
                        alt="QR Code PIX"
                        width={190}
                        height={190}
                        unoptimized
                        className="w-44 h-44 block mx-auto rounded-lg"
                      />
                    ) : (
                      <div className="w-44 h-44 flex items-center justify-center text-xs text-black">
                        Gerando QR Code...
                      </div>
                    )}
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Valor a pagar: {formatCurrency(order.amount)}</span>
                  </div>
                </div>

                {/* Copia e Cola Field */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1 text-left">
                    Ou copie o código PIX Copia e Cola:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={order.pixCopyPaste}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-gray-300 text-xs font-mono truncate focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 transition flex items-center gap-1.5"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? "Copiado!" : "Copiar"}</span>
                    </button>
                  </div>
                </div>

                {/* Clear instructions */}
                <div className="text-left text-xs text-gray-300 bg-surface-100/60 p-3.5 rounded-xl border border-white/5 space-y-1">
                  <p className="text-white font-semibold mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Prazo e envio do Drive:</span>
                  </p>
                  <p>1. Copie o código acima e pague no app do seu banco.</p>
                  <p>2. Assim que o pagamento for confirmado, adicionaremos o Gmail <strong>{order.studentEmail}</strong> à pasta.</p>
                  <p>3. O envio é realizado em <strong>até 24 horas</strong> após a compra.</p>
                </div>

                {/* WhatsApp Receipt Button */}
                <a
                  href={`https://wa.me/${cleanWhatsappNumber}?text=${whatsappReceiptMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Enviar Comprovante pelo WhatsApp</span>
                </a>

                {/* Demo / Test Simulation button */}
                <div className="pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    className="w-full py-2 px-3 rounded-lg text-[11px] font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 border border-dashed border-indigo-500/30 transition flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-indigo-400" />
                    <span>[Modo Demonstração] Simular Pagamento do PIX</span>
                  </button>
                </div>
              </>
            )}

            <button
              onClick={() => {
                setStep("form");
                setIsPaidSimulated(false);
              }}
              className="text-xs text-gray-400 hover:text-gray-200"
            >
              ← Voltar / Alterar dados
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
