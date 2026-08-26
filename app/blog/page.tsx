import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { BlogHero } from "@/components/blog/BlogHero";
import { PostList } from "@/components/blog/PostList";
import { ContactSection } from "@/components/home/ContactSection";
import { POSTS, publishedPosts } from "@/lib/blog/posts";
import { blogIndexJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { SITE } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Briefs",
  description:
    "Working briefs on building custom AI systems for growth-stage teams: what a fixed-price pilot actually includes, when to buy the SaaS instead, how LLM lead scoring fails, and what to ask a studio before signing.",
  alternates: { canonical: "/blog" },
};

const ON_THIS_PAGE = [
  { href: "#index", label: "Index" },
  { href: "#contact", label: "Contact" },
  { href: "/#scope", label: "Scope it live" },
];

// Server component — see ARCHITECTURE.md §2. No client leaf here: the index
// is a static list, and a tag filter over four posts would add interactive
// state to justify itself. Add one when the archive is large enough that
// scanning it is actually work.
export default function Blog() {
  const posts = publishedPosts();
  const scheduled = POSTS.length - posts.length;

  return (
    <>
      <JsonLd
        data={blogIndexJsonLd(
          posts.map((p) => ({
            title: p.title,
            description: p.description,
            url: `${SITE.url}/blog/${p.slug}`,
            date: p.date,
          })),
        )}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "Briefs", url: `${SITE.url}/blog` },
        ])}
      />
      <BlogHero liveCount={posts.length} scheduledCount={scheduled} />
      <main>
        <PostList posts={posts} />
        <ContactSection label={"02 / Contact"} />
      </main>
      <Footer onThisPage={ON_THIS_PAGE} />
    </>
  );
}
