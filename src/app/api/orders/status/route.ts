import { NextResponse } from "next/server";
import { orderStore } from "@/lib/orderStore";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const txId = searchParams.get("txId");

    const idToCheck = orderId || txId;
    if (!idToCheck) {
      return NextResponse.json({ error: "orderId ou txId é obrigatório" }, { status: 400 });
    }

    const record = orderStore.get(idToCheck);

    return NextResponse.json({
      orderId: record?.orderId || orderId,
      status: record?.status || "PENDING",
      paid: record?.status === "PAID",
      paidAt: record?.paidAt,
      amount: record?.amount,
      updatedAt: record?.updatedAt,
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao consultar status" }, { status: 500 });
  }
}

