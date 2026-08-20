import type { MetadataRoute } from "next";
import { publishedPosts } from "@/lib/blog/posts";
import { SITE } from "@/lib/seo/site";

// Add a row per new route. Once /work/[slug] case studies exist, generate
// their entries here too (fetch slugs, map to sitemap rows) instead of
// hand-listing them.
//
// /blog posts ARE generated, off the same registry the pages render from, so
// publishing a post is one `status` flip and never a forgotten sitemap edit.
// Drafts are excluded, since publishedPosts() filters them — a draft has no
// route, so listing it would be submitting a 404.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/work", "/build", "/about", "/blog"];

  const pages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  // `lastModified` is the post's own publication date, not the build date.
  // Stamping every post with today on each deploy is a freshness claim the
  // content hasn't earned, and search engines discount a sitemap where
  // everything changes every time.
  const posts: MetadataRoute.Sitemap = publishedPosts().map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(`${post.date}T00:00:00Z`),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...pages, ...posts];
}
