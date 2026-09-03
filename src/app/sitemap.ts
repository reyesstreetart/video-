import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site-config";
import { experienceSlugs } from "@/content/experiences";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();
  const statics = ["", "/experiences", "/expertise", "/methode", "/studio", "/contact", "/mentions-legales", "/confidentialite"];
  return [
    ...statics.map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...experienceSlugs.map((s) => ({ url: `${base}/experiences/${s}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
