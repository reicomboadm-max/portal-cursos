import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { FloatingSupportWidget } from "@/components/FloatingSupportWidget";

export const metadata: Metadata = {
  title: "DriveConcursos VIP • Pastas de Cursos no Google Drive",
  description: "Os melhores materiais para concursos em pastas do Google Drive com envio no seu Gmail em até 24 horas após o pagamento via PIX.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-[#07090e] text-white antialiased selection:bg-indigo-500 selection:text-white min-h-screen">
        <StoreProvider>
          {children}
          <FloatingSupportWidget />
        </StoreProvider>
      </body>
    </html>
  );
}
