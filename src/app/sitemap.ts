import type { MetadataRoute } from "next";
import { guides } from "@/content/guides";
import { news } from "@/content/news";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://openbimi.com";
  const staticRoutes = [
    "", "/setup", "/check", "/tools/logo", "/tools/record", "/tools/headers",
    "/tools/svg-validator", "/tools/record-generator", "/supported-inboxes", "/learn", "/guides",
    "/privacy", "/terms", "/security",
  ];
  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, changeFrequency: "weekly" as const, priority: route === "" ? 1 : 0.8 })),
    ...guides.map((guide) => ({ url: `${base}/guides/${guide.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${base}/news`, lastModified: news.map((article) => article.updated ?? article.published).sort().at(-1), changeFrequency: "weekly", priority: 0.8 },
    ...news.map((article) => ({ url: `${base}/news/${article.slug}`, lastModified: article.updated ?? article.published, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
