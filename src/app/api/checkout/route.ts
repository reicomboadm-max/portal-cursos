import { NextResponse } from "next/server";
import { COURSES } from "@/lib/data";
import { createVeloraPixPayment } from "@/lib/velorapay";
import type { Order } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { courseId, nome, email, whatsapp } = body;

    const course = COURSES.find((c) => c.id === courseId);
    if (!course) {
      return NextResponse.json({ error: "Curso não encontrado" }, { status: 404 });
    }

    // Validar e-mail Gmail para acesso ao Drive
    if (!email || !email.includes("@gmail.com")) {
      return NextResponse.json(
        { error: "E-mail Gmail é obrigatório para liberação da pasta no Google Drive" },
        { status: 400 }
      );
    }

    const orderId = `ORD-${Date.now()}`;

    // Gerar pagamento PIX via VeloraPay
    const veloraResponse = await createVeloraPixPayment({
      amount: course.price,
      orderId,
      description: `Acesso Drive 2026: ${course.title}`,
      customer: {
        name: nome,
        email: email,
        phone: whatsapp || "",
      },
    });

    const order: Order = {
      id: orderId,
      studentName: nome,
      studentEmail: email,
      studentWhatsapp: whatsapp,
      courseId: course.id,
      courseTitle: course.title,
      courseSegment: course.segment,
      amount: course.price,
      paymentMethod: "PIX",
      status: "PENDING",
      pixCopyPaste: veloraResponse.pixCopiaECola,
      pixQrCodeUrl: veloraResponse.qrCodeUrl || veloraResponse.qrCodeBase64,
      driveUrl: course.driveUrl,
      createdAt: new Date().toISOString(),
      veloraTransactionId: veloraResponse.transactionId,
    };

    return NextResponse.json({
      success: true,
      orderId: order.id,
      pixCopyPaste: order.pixCopyPaste,
      qrCode: order.pixQrCodeUrl,
      transactionId: order.veloraTransactionId,
      amount: order.amount,
      gateway: "VeloraPay",
      message: "PIX gerado via VeloraPay. Efetue o pagamento para liberação do Drive.",
    });
  } catch (err) {
    console.error("Erro no checkout:", err);
    return NextResponse.json({ error: "Erro ao gerar pagamento PIX" }, { status: 500 });
  }
}
