import type { MetadataRoute } from "next";
import { getAllSiteMapLinks, getSiteUrl } from "@/lib/site-map";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  return getAllSiteMapLinks().map((link) => ({
    url: `${siteUrl}${link.href}`,
    lastModified: now,
    changeFrequency: link.href === "/" ? "daily" : "weekly",
    priority: link.href === "/" ? 1 : 0.7,
  }));
}
