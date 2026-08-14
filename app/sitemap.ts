import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";

// Add a row per new route. Once /work/[slug] case studies exist, generate
// their entries here too (fetch slugs, map to sitemap rows) instead of
// hand-listing them.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/work", "/build", "/about"];

  return routes.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
