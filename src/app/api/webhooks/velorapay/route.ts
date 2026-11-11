import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log("🔔 [VeloraPay Webhook Recebido]:", JSON.stringify(payload, null, 2));

    // A VeloraPay geralmente envia status como 'paid', 'completed', 'approved' ou 'settled'
    const status = (payload.status || payload.event || "").toLowerCase();
    const externalId = payload.external_id || payload.order_id || payload.custom_id;
    const transactionId = payload.id || payload.transaction_id;

    if (status.includes("paid") || status.includes("settled") || status.includes("approved")) {
      console.log(`✅ Pagamento confirmado via VeloraPay para o pedido: ${externalId} (Transação: ${transactionId})`);
      // O pedido pode ser marcado como liberado no banco/store
    }

    return NextResponse.json({
      received: true,
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro ao processar webhook VeloraPay:", error);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: "VeloraPay Webhook Endpoint",
    status: "active",
    instructions: "Configure esta URL no painel da VeloraPay para confirmação automática de PIX.",
  });
}
