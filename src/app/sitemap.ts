import type { MetadataRoute } from "next";
import { guides } from "@/content/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://openbimi.com";
  const staticRoutes = [
    "", "/setup", "/check", "/tools/logo", "/tools/record", "/tools/headers",
    "/tools/svg-validator", "/tools/record-generator", "/providers", "/learn", "/guides",
    "/open", "/status", "/privacy", "/terms", "/security",
  ];
  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, changeFrequency: "weekly" as const, priority: route === "" ? 1 : 0.8 })),
    ...guides.map((guide) => ({ url: `${base}/guides/${guide.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
