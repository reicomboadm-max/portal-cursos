import { MetadataRoute } from "next";
import { initialCourses } from "@/data/courses";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.centraldoaprovado.com.br";
  const now = new Date();

  // Static main pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cursos`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Dynamic course pages for Google Search indexation
  const coursePages: MetadataRoute.Sitemap = initialCourses
    .filter((course) => course.active)
    .map((course) => ({
      url: `${baseUrl}/cursos/${course.slug}`,
      lastModified: course.updatedAt ? new Date(course.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [...staticPages, ...coursePages];
}

