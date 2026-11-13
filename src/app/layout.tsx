import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { FloatingSupportWidget } from "@/components/FloatingSupportWidget";

export const metadata: Metadata = {
  title: "Central do Aprovado • Cursos & Materiais Google Drive",
  description: "Cursos e materiais completos para concursos públicos com acesso compartilhado no Google Drive.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="stylesheet" href="/fonts.css" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body 
        className="min-h-screen bg-neutral-950 text-white antialiased selection:bg-red-600 selection:text-white"
        style={{ fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" }}
      >
        <StoreProvider>
          {children}
          <FloatingSupportWidget />
        </StoreProvider>
      </body>
    </html>
  );
}
