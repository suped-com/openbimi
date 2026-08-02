import type { MetadataRoute } from "next";
import { guides } from "@/content/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://openbimi.com";
  const staticRoutes = ["", "/check", "/tools/svg-validator", "/tools/record-generator", "/guides"];
  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, changeFrequency: "weekly" as const, priority: route === "" ? 1 : 0.8 })),
    ...guides.map((guide) => ({ url: `${base}/guides/${guide.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
