import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { FloatingSupportWidget } from "@/components/FloatingSupportWidget";

export const metadata: Metadata = {
  title: "DriveConcursos • Central de Estudos & Cursos Google Drive",
  description: "Cursos e materiais completos para concursos públicos com acesso compartilhado no Google Drive.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#050507] text-white antialiased selection:bg-red-600 selection:text-white min-h-screen">
        <StoreProvider>
          {children}
          <FloatingSupportWidget />
        </StoreProvider>
      </body>
    </html>
  );
}
