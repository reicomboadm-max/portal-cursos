import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/aluno/*",
          "/minha-conta/*",
        ],
      },
    ],
    sitemap: "https://www.centraldoaprovado.com.br/sitemap.xml",
    host: "https://www.centraldoaprovado.com.br",
  };
}

