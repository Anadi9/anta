import type { ComponentType } from "react";

/**
 * Slug → compiled MDX body. Kept out of lib/blog/posts.ts on purpose: the
 * index page and app/sitemap.ts read the registry for metadata only, and a
 * static import list here would drag every compiled post body into their
 * bundles too. Only app/blog/[slug]/page.tsx imports this module.
 *
 * Dynamic `import()` with a literal specifier, not a template string — the
 * bundler needs each path statically visible to resolve and pre-render it.
 *
 * Adding a post means one entry here and one in POSTS. `bodyFor()` below
 * throws on a mismatch, and it's called from generateStaticParams — which
 * runs at build time, so a registry entry with no body file fails `next
 * build` instead of 404ing in production.
 */
export const BODIES: Record<string, () => Promise<{ default: ComponentType }>> =
  {
    "what-a-3000-dollar-ai-pilot-actually-buys": () =>
      import("@/content/blog/what-a-3000-dollar-ai-pilot-actually-buys.mdx"),
    "build-vs-buy-internal-ai-tool": () =>
      import("@/content/blog/build-vs-buy-internal-ai-tool.mdx"),
    "scoring-b2b-leads-with-an-llm": () =>
      import("@/content/blog/scoring-b2b-leads-with-an-llm.mdx"),
    "what-to-ask-an-ai-agency": () =>
      import("@/content/blog/what-to-ask-an-ai-agency.mdx"),
    "llm-api-costs-without-surprises": () =>
      import("@/content/blog/llm-api-costs-without-surprises.mdx"),
    "apollo-free-plan-limits": () =>
      import("@/content/blog/apollo-free-plan-limits.mdx"),
    "automating-bol-and-pod-document-processing": () =>
      import("@/content/blog/automating-bol-and-pod-document-processing.mdx"),
    "swapping-claude-for-gemini-behind-one-interface": () =>
      import(
        "@/content/blog/swapping-claude-for-gemini-behind-one-interface.mdx"
      ),
  };

/**
 * Assert a slug has a body, synchronously.
 *
 * Deliberately not folded into the async bodyFor below: an async function
 * that throws produces a rejected promise, so generateStaticParams calling
 * it without awaiting would log an unhandled rejection and let the build
 * pass. This one throws on the call stack, so a POSTS entry with no MDX file
 * fails `next build` at static-params time, naming the slug.
 */
export function assertBody(slug: string): void {
  if (!BODIES[slug]) {
    throw new Error(
      `No MDX body registered for post "${slug}". Add content/blog/${slug}.mdx and an entry in lib/blog/bodies.ts, or remove it from POSTS.`,
    );
  }
}

/** Resolve a post body. Assumes assertBody has vouched for the slug. */
export async function bodyFor(slug: string): Promise<ComponentType> {
  assertBody(slug);
  return (await BODIES[slug]()).default;
}
