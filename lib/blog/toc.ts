import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Table-of-contents extraction for /blog articles.
 *
 * The headings are read out of the MDX source rather than declared a second
 * time in lib/blog/posts.ts. A hand-maintained TOC drifts the first time a
 * section gets renamed, and the drift is silent: the rail keeps saying the
 * old thing and the anchor 404s to the top of the page.
 *
 * Read at build time only. Every /blog/[slug] is statically generated
 * (generateStaticParams + dynamicParams = false), so this touches disk during
 * `next build` and never during a request.
 *
 * Deliberately a regex over the raw file and not a remark plugin: extracting
 * headings through the MDX pipeline would mean adding a plugin, and under
 * Turbopack those must be referenced by string name with serializable options
 * because JS functions can't cross into Rust. Two lines of regex against
 * content this file's author also writes is the smaller moving part.
 *
 * The tradeoff, stated so it isn't discovered later: this matches `## ` at
 * the start of a line, so a `## ` appearing inside a fenced code block would
 * be picked up as a heading. No current post does that. If one ever needs to,
 * either fence-strip here or fall back to a real plugin.
 */

export type TocEntry = { id: string; text: string };

/**
 * Shared with the `h2` renderer in mdx-components.tsx. Both sides must derive
 * the same id from the same text or the anchors silently miss, so neither is
 * allowed its own copy of this.
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’'"“”]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Strip the inline markdown that survives in a heading line. */
function stripInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .trim();
}

export function getToc(slug: string): TocEntry[] {
  // Path is assembled rather than literal, unlike lib/seo/og.tsx — the note
  // there is about Turbopack tracing whole directories into serverless
  // bundles. This runs only at build time for statically generated pages, and
  // the traced directory is content/blog, which is the eight files being
  // rendered anyway.
  const source = readFileSync(
    join(process.cwd(), "content", "blog", `${slug}.mdx`),
    "utf8",
  );

  return source
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const text = stripInline(line.slice(3));
      return { id: slugifyHeading(text), text };
    });
}
