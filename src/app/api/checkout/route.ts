import { NextResponse } from "next/server";
import { getCourseBySlug, COURSES } from "@/lib/data";
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
    if (!email.includes("@gmail.com")) {
      return NextResponse.json({ error: "E-mail Gmail é obrigatório para acesso ao Drive" }, { status: 400 });
    }

    const order: Order = {
      id: `ORD-${Date.now()}`,
      studentName: nome,
      studentEmail: email,
      studentWhatsapp: whatsapp,
      courseId: course.id,
      courseTitle: course.title,
      courseSegment: course.segment,
      amount: course.price,
      paymentMethod: "PIX",
      status: "PENDING",
      pixCopyPaste: `00020126580014BR.GOV.BCB.PIX0136${Date.now()}5204000053039865405${course.price.toFixed(2)}5802BR59${nome.length}${nome}6009Sao Paulo62290525MERCADO PAGO:ID${Date.now()}6304`,
      driveUrl: course.driveUrl,
      createdAt: new Date().toISOString(),
    };

    // Em produção, salvar no banco e gerar QR Code PIX real
    return NextResponse.json({
      success: true,
      orderId: order.id,
      pixCopyPaste: order.pixCopyPaste,
      amount: order.amount,
      message: "Pedido criado com sucesso. Aguarde confirmação do pagamento.",
    });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao gerar pagamento" }, { status: 500 });
  }
}

