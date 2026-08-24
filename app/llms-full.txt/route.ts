import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FAQ } from "@/lib/about/content";
import { publishedPosts } from "@/lib/blog/posts";
import { BUILD_FAQ } from "@/lib/build/workflows";
import {
  LLMS_COMMERCIALS,
  LLMS_CONTACT,
  LLMS_PAGES,
  LLMS_POSITIONING,
  abs,
} from "@/lib/seo/llms";
import { SITE } from "@/lib/seo/site";
import { WORK_FAQ } from "@/lib/work/cases";

/**
 * /llms-full.txt — the whole site as one plain-text document.
 *
 * /llms.txt is an *index*: it tells a retrieval crawler what exists
 * and where. This is the companion that removes the second hop. A crawler
 * answering "what does ANTA charge" from llms.txt has to fetch /about, or
 * /build, or a post, and most retrieval bots fetch one URL and stop. This
 * file is the one URL where stopping still gets the whole answer.
 *
 * Generated, never hand-written, and that is the entire point: the post
 * bodies are read from the same MDX files the site renders, the FAQs from
 * the same arrays the pages render, and the shared copy from lib/seo/llms.ts
 * that /llms.txt also reads. Adding a post is one `status` flip in
 * lib/blog/posts.ts and both files follow.
 *
 * Drafts are excluded — publishedPosts() filters them, and a draft has no
 * public URL, so publishing its full text here would be shipping content the
 * site itself won't serve.
 *
 * force-static: this touches disk, and it must do so at build time only,
 * exactly like lib/blog/toc.ts. Vercel serves the result as a static file.
 */
export const dynamic = "force-static";

/**
 * Strip anything that isn't prose from an MDX body, and demote its headings
 * by one level.
 *
 * The demotion matters more than it looks. Each post is introduced here
 * under an `##` title, and the posts themselves open their sections at `##`
 * too — so without this, a post's own sections read as siblings of the post
 * title and the whole file flattens into one undifferentiated list of
 * headings. Demoting nests each post's sections underneath it, which is what
 * a retrieval system chunking this file by heading needs in order to keep a
 * section attached to the note it came from.
 */
function mdxToText(raw: string): string {
  return raw
    // No current post has imports or exports — the bodies are prose only,
    // and metadata lives in lib/blog/posts.ts. This guards the day one does.
    .replace(/^(import|export)\s.+$/gm, "")
    .replace(/^(#{1,5}) /gm, "#$1 ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function faqBlock(heading: string, items: readonly { question: string; answer: string }[]) {
  return [
    `### ${heading}`,
    "",
    ...items.flatMap((item) => [`**${item.question}**`, "", item.answer, ""]),
  ].join("\n");
}

export function GET() {
  const posts = publishedPosts();

  const sections: string[] = [];

  sections.push(
    [
      `# ${SITE.name} — full text`,
      "",
      `> ${SITE.description}`,
      "",
      `Canonical site: ${SITE.url}`,
      `Index version of this file: ${abs("/llms.txt")}`,
      "Generated from the site's own source at build time. Every page and every published note is reproduced below in full.",
      "",
      "## Positioning",
      "",
      ...LLMS_POSITIONING.map((line) => `- ${line}`),
      "",
      "## Commercials",
      "",
      ...LLMS_COMMERCIALS.map((line) => `- ${line}`),
      "",
      "## Contact",
      "",
      ...LLMS_CONTACT.map((line) => `- ${line}`),
    ].join("\n"),
  );

  sections.push(
    [
      "## Pages",
      "",
      ...LLMS_PAGES.map(
        (page) => `- [${page.title}](${abs(page.path)}): ${page.summary}`,
      ),
    ].join("\n"),
  );

  sections.push(
    [
      "## Frequently asked questions, in full",
      "",
      "These are reproduced verbatim from the pages that render them.",
      "",
      faqBlock("From /about — positioning and objections", FAQ),
      faqBlock("From /build — scope and mechanics", BUILD_FAQ),
      faqBlock("From /work — the evidence", WORK_FAQ),
    ].join("\n"),
  );

  const noteIndex = [
    "## Notes",
    "",
    "Each note answers one buyer question. Full text follows in the next section.",
    "",
    ...posts.map(
      (post) =>
        `- [${post.title}](${abs(`/blog/${post.slug}`)}) — answers "${post.query}". Published ${post.date}.`,
    ),
  ].join("\n");
  sections.push(noteIndex);

  for (const post of posts) {
    const raw = readFileSync(
      join(process.cwd(), "content", "blog", `${post.slug}.mdx`),
      "utf8",
    );

    sections.push(
      [
        `## ${post.title}`,
        "",
        `URL: ${abs(`/blog/${post.slug}`)}`,
        `Answers: "${post.query}"`,
        `Published: ${post.date} · ${post.minutes} min read · ${post.tags.join(", ")}`,
        "",
        post.description,
        "",
        "---",
        "",
        mdxToText(raw),
      ].join("\n"),
    );
  }

  return new Response(`${sections.join("\n\n")}\n`, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      // Long-lived: the content only changes on deploy, and a redeploy
      // serves a new static file anyway.
      "cache-control": "public, max-age=0, s-maxage=86400, must-revalidate",
    },
  });
}
