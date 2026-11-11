import { NextResponse } from "next/server";
import { MOCK_ORDERS } from "@/lib/data";

export async function GET() {
  return NextResponse.json(MOCK_ORDERS);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Em produção, salvar no banco de dados
    return NextResponse.json({ success: true, orderId: `ORD-${Date.now()}` });
  } catch {
    return NextResponse.json({ error: "Erro ao processar pedido" }, { status: 500 });
  }
}

