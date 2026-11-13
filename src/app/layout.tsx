import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { FloatingSupportWidget } from "@/components/FloatingSupportWidget";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.centraldoaprovado.com.br"),
  title: {
    default: "Central do Aprovado • Cursos Completos para Concursos no Google Drive",
    template: "%s | Central do Aprovado",
  },
  description: "Acesse os melhores cursos e materiais atualizados para concursos públicos (Área Fiscal, Policial, Tribunais, Bancos). Videoaulas Full HD e PDFs completos no seu Google Drive com acesso vitalício.",
  keywords: [
    "central do aprovado",
    "cursos para concurso",
    "concursos publicos",
    "rateio de cursos",
    "google drive concursos",
    "area fiscal",
    "carreiras policiais",
    "tribunais e mp",
    "sefaz",
    "receita federal",
    "inss",
    "policia federal",
    "material para concurso",
    "videoaulas drive"
  ],
  authors: [{ name: "Central do Aprovado", url: "https://www.centraldoaprovado.com.br" }],
  creator: "Central do Aprovado",
  publisher: "Central do Aprovado",
  alternates: {
    canonical: "https://www.centraldoaprovado.com.br",
  },
  openGraph: {
    title: "Central do Aprovado • Cursos & Materiais no Google Drive",
    description: "Os melhores cursos e pastas completas para concursos públicos no Google Drive. Videoaulas Full HD e PDFs no seu Gmail com acesso vitalício.",
    url: "https://www.centraldoaprovado.com.br",
    siteName: "Central do Aprovado",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Central do Aprovado - Cursos & Drives Oficiais",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Central do Aprovado • Cursos & Materiais no Google Drive",
    description: "Pastas organizadas e 100% atualizadas para concursos públicos com acesso vitalício no Google Drive.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "Xl7qcW3Gf6ZiN51bL6OBgrwTO0m6Ue4fP0omz-DLr-Y",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.centraldoaprovado.com.br/#website",
      "url": "https://www.centraldoaprovado.com.br",
      "name": "Central do Aprovado",
      "description": "Central de cursos e materiais completos para concursos públicos com acesso compartilhado no Google Drive.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.centraldoaprovado.com.br/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://www.centraldoaprovado.com.br/#organization",
      "name": "Central do Aprovado",
      "url": "https://www.centraldoaprovado.com.br",
      "logo": "https://www.centraldoaprovado.com.br/logo-central-aprovado.png",
      "sameAs": []
    }
  ]
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
        <meta name="google-site-verification" content="Xl7qcW3Gf6ZiN51bL6OBgrwTO0m6Ue4fP0omz-DLr-Y" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body 
        className="min-h-screen bg-neutral-950 text-white antialiased selection:bg-red-600 selection:text-white"
        style={{ fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" }}
      >
        <StoreProvider>
          {children}
          <FloatingSupportWidget />
          <AnalyticsTracker />
        </StoreProvider>
      </body>
    </html>
  );
}
