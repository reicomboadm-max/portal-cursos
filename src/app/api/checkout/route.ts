import { NextResponse } from "next/server";
import { COURSES } from "@/lib/data";
import { createVeloraPixPayment } from "@/lib/velorapay";
import { orderStore } from "@/lib/orderStore";
import type { Order } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      courseId, 
      nome, 
      email, 
      whatsapp, 
      cpf,
      courseTitle, 
      coursePrice, 
      courseDriveUrl, 
      courseSegment 
    } = body;

    const defaultCourse = COURSES.find((c) => c.id === courseId);
    const title = courseTitle || defaultCourse?.title || "Curso de Concursos";
    const price = Number(coursePrice || defaultCourse?.price || 49.90);
    const driveUrl = courseDriveUrl || defaultCourse?.driveUrl || "https://drive.google.com";
    const segment = courseSegment || defaultCourse?.segment || "fiscal";

    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json(
        { error: "Informe um e-mail válido para liberação da pasta no Google Drive" },
        { status: 400 }
      );
    }

    const orderId = `ORD-${Date.now()}`;

    // Gerar pagamento PIX via VeloraPay
    const veloraResponse = await createVeloraPixPayment({
      amount: price,
      orderId,
      description: `Acesso Drive: ${title}`.slice(0, 100),
      customer: {
        name: nome || "Aluno",
        email: cleanEmail,
        phone: whatsapp || "",
        document: cpf || "",
      },
    });

    if (!veloraResponse.pixCopiaECola) {
      return NextResponse.json(
        { error: "A VeloraPay não retornou o código PIX copia e cola. Verifique as credenciais da API." },
        { status: 502 }
      );
    }

    const order: Order = {
      id: orderId,
      studentName: nome,
      studentEmail: email,
      studentWhatsapp: whatsapp,
      courseId: courseId || defaultCourse?.id || "custom-course",
      courseTitle: title,
      courseSegment: segment,
      amount: price,
      paymentMethod: "PIX",
      status: "PENDING",
      pixCopyPaste: veloraResponse.pixCopiaECola,
      pixQrCodeUrl: veloraResponse.qrCodeUrl || veloraResponse.qrCodeBase64,
      driveUrl: driveUrl,
      createdAt: new Date().toISOString(),
      veloraTransactionId: veloraResponse.transactionId,
    };

    // Registrar no storage de status para checagem em tempo real
    orderStore.set(orderId, {
      orderId,
      transactionId: veloraResponse.transactionId,
      status: "PENDING",
      amount: price,
    });

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
