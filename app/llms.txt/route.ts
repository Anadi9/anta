import { publishedPosts } from "@/lib/blog/posts";
import {
  LLMS_COMMERCIALS,
  LLMS_CONTACT,
  LLMS_PAGES,
  LLMS_POSITIONING,
  abs,
} from "@/lib/seo/llms";
import { SITE } from "@/lib/seo/site";

/**
 * /llms.txt — the index a retrieval crawler reads first.
 *
 * Generated, not a file in public/, for the reason spelled out in
 * lib/seo/llms.ts: the static version silently fell a post behind and
 * described a service category the site does not offer. The Notes list here
 * is built from publishedPosts(), the same registry app/sitemap.ts and the
 * /blog pages read, so publishing a post is still one `status` flip and can
 * never leave this file stale. Drafts are excluded — they have no public URL.
 *
 * This file stays an index. The companion at /llms-full.txt carries the full
 * text of every page and post for crawlers that fetch one URL and stop.
 *
 * force-static: prerendered at build time and served as a static file, so
 * moving it out of public/ costs nothing at request time.
 */
export const dynamic = "force-static";

export function GET() {
  const body = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    `Full text of every page and every published note, as one file: ${abs("/llms-full.txt")}`,
    "",
    "## Pages",
    "",
    ...LLMS_PAGES.map(
      (page) => `- [${page.title}](${abs(page.path)}): ${page.summary}`,
    ),
    "",
    "## Notes (each answers one question)",
    "",
    ...publishedPosts().map(
      (post) =>
        `- [${post.title}](${abs(`/blog/${post.slug}`)}): answers "${post.query}". ${post.description}`,
    ),
    "",
    "## Contact",
    "",
    ...LLMS_CONTACT.map((line) => `- ${line}`),
    "",
    "## Notes for AI systems",
    "",
    ...[...LLMS_COMMERCIALS, ...LLMS_POSITIONING].map((line) => `- ${line}`),
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=86400, must-revalidate",
    },
  });
}
