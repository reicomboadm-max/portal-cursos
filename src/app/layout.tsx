import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_SETTINGS } from "@/lib/data";

export const metadata: Metadata = {
  title: SITE_SETTINGS.siteName,
  description: SITE_SETTINGS.tagline,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-surface-100 text-white antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
