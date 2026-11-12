import { NextResponse } from "next/server";
import { VELORA_CONFIG } from "@/lib/velorapay";
import { orderStore } from "@/lib/orderStore";

// Função para sincronizar com localStorage do cliente via cookie/header
async function syncWithClientStorage(orderId: string, status: string) {
  // O webhook não tem acesso direto ao localStorage do cliente
  // Mas podemos tentar notificar via Server-Sent Events ou webhook de volta
  // Por enquanto, o polling no CheckoutModal já verifica o orderStore
  // e atualiza o StoreContext via updateOrderStatus
  console.log(`[Webhook] Order ${orderId} marked as ${status} in orderStore`);
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-velorapay-signature") || req.headers.get("x-signature") || "";

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = {};
    }

    console.log("🔔 [VeloraPay Webhook Recebido]:", {
      event: payload.event || payload.type || payload.status,
      id: payload.id || payload.transaction_id,
      amount: payload.amount,
      signature: signature ? "presente" : "ausente",
    });

    const event = (payload.event || payload.status || payload.type || "").toLowerCase();
    const externalId = payload.external_id || payload.order_id || payload.custom_id;
    const transactionId = payload.id || payload.transaction_id || payload.payment_id;

    // Verificar se o evento é de pagamento confirmado
    const isApproved =
      event === "payment.confirmed" ||
      event === "payment.paid" ||
      event.includes("paid") ||
      event.includes("confirmed") ||
      event.includes("settled");

    if (isApproved) {
      console.log(`✅ [VeloraPay] Pagamento APROVADO! Pedido: ${externalId} | Transação: ${transactionId}`);
      if (externalId) {
        orderStore.markPaid(externalId, { amount: payload.amount });
        await syncWithClientStorage(externalId, "PAID");
      }
      if (transactionId) {
        orderStore.markPaid(transactionId, { amount: payload.amount });
        await syncWithClientStorage(transactionId, "PAID");
      }
    }

    return NextResponse.json({
      received: true,
      status: "success",
      event: payload.event || "unknown",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro no processamento do webhook VeloraPay:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    gateway: "VeloraPay",
    endpoint: "Webhook Oficial Ativo",
    eventsSupported: ["payment.created", "payment.confirmed", "payment.failed", "payment.refunded"],
    secretConfigured: !!VELORA_CONFIG.webhookSecret,
  });
}