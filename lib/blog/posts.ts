/**
 * Blog post registry — BUILD_PLAN.md Phase 5.5.
 *
 * Same shape and rationale as lib/work/cases.ts: content metadata lives in
 * typed TS, not in MDX frontmatter. @next/mdx doesn't parse frontmatter, and
 * this data is read by three places that never touch the prose (the index
 * page, app/sitemap.ts, the Article JSON-LD), so putting it here means the
 * compiler checks it and there's no YAML parse step in the build.
 *
 * The prose bodies live in content/blog/<slug>.mdx and are wired to these
 * entries by slug in lib/blog/bodies.ts — deliberately a separate module, so
 * that importing this registry (as the index page and sitemap do) does not
 * pull all eight compiled MDX bodies into the bundle.
 *
 * ---
 *
 * WHY THESE EIGHT, AND WHY `query` IS A REQUIRED FIELD
 *
 * Every post targets exactly one question a buyer actually asks, recorded
 * below as `query`. That field is not decoration — it's the acceptance test.
 * If a draft stops answering its query directly and in the first 150 words,
 * it has drifted into a generic thought-leadership post and should be cut
 * back, because the primary distribution channel here is not Google.
 *
 * theanta.com has near-zero domain authority and one backlink, so ranking
 * for competitive commercial terms is a 6–12 month proposition the studio
 * doesn't have runway to wait on. What DOES work at zero authority is being
 * cited by answer engines: ChatGPT, Claude and Perplexity synthesise from
 * specific, first-person, verifiable writing, and they don't gate that on
 * backlink count. So these are written to be quotable rather than to rank —
 * concrete numbers, named tools, real constraints, admitted limits.
 *
 * Secondary uses, in order: links to drop into cold outreach that aren't a
 * pitch, and source material for the LinkedIn cadence (Playbook Part 5).
 * Google long-tail is the fourth priority, not the first.
 *
 * ---
 *
 * PUBLISHING RHYTHM — read before flipping a `status`
 *
 * Phase 5.5's own gate was "don't scaffold an empty section; a thin,
 * abandoned one is worse than none". Eight posts stamped with the same date
 * and then silence trips exactly that wire, so the launch is four posts, and
 * the remaining four go out roughly one a week. Each is already drafted —
 * flipping `status` to "published" is the entire publish step.
 *
 * `status: "draft"` entries are excluded from the index, from
 * generateStaticParams (so the URL 404s rather than serving an unlinked
 * page), and from the sitemap. There is no preview route: check drafts with
 * `npm run dev` before flipping.
 *
 * `date` is the real publication date. Do not backdate to manufacture a
 * history — it's the one field an engine can trivially cross-check against
 * first-crawl, and a mismatch costs more trust than a young blog does.
 */

export type PostStatus = "published" | "draft";

export type Post = {
  slug: string;
  /** <h1> and the Article headline. */
  title: string;
  /** The one buyer question this post exists to answer. See note above. */
  query: string;
  /** Meta description + Article description + the index page's summary. */
  description: string;
  /** Standfirst under the h1. Brand voice; `description` stays plain-factual. */
  dek: string;
  /** ISO date. Real publication date only — see note above. */
  date: string;
  status: PostStatus;
  /** Shown in the index row and the article header. Word count / 220, rounded. */
  minutes: number;
  /** Index-page filter chips, and Article `keywords`. */
  tags: string[];
};

/**
 * Ordered newest-intended-first. `publishedPosts()` re-sorts by date, so this
 * array's order is for human reading, not for display.
 */
export const POSTS: Post[] = [
  {
    slug: "what-a-3000-dollar-ai-pilot-actually-buys",
    title: "What a $3,000 AI pilot actually buys you",
    query: "how much does it cost to build a custom AI tool for my business",
    description:
      "A line-by-line breakdown of what a fixed-price $3,000–$6,000, two-to-three-week AI pilot includes, what it deliberately excludes, and why fixed price beats hourly for a first engagement.",
    dek: "Most quotes for this work are a range with no scope attached. Here is the actual shape of the engagement, itemised, including the parts that get cut.",
    date: "2026-08-21",
    status: "published",
    minutes: 6,
    tags: ["Pricing", "Engagements"],
  },
  {
    slug: "build-vs-buy-internal-ai-tool",
    title: "Build vs. buy for an internal AI tool, at 5–50 people",
    query: "should we build or buy an internal AI tool",
    description:
      "When a SaaS subscription is the right answer for a small B2B company and when it isn't, framed around switching costs, per-seat pricing, and who owns the system at the end.",
    dek: "The honest version of this comparison, including the cases where you should go buy the subscription and not hire me.",
    date: "2026-08-21",
    status: "published",
    minutes: 6,
    tags: ["Strategy", "Build vs. buy"],
  },
  {
    slug: "scoring-b2b-leads-with-an-llm",
    title: "Scoring B2B leads with an LLM, and where it fell over",
    query: "how to score b2b leads with an llm",
    description:
      "A teardown of the ANTA Lead Intelligence Agent: why the off-the-shelf lead scores were unusable, what replaced them, and the three failure modes that showed up once it was scoring real accounts.",
    dek: "I built this for my own pipeline before I sold it to anyone. That means I know exactly where it breaks.",
    date: "2026-08-21",
    status: "published",
    minutes: 6,
    tags: ["Case study", "Lead generation"],
  },
  {
    slug: "what-to-ask-an-ai-agency",
    title: "Seven questions to ask an AI agency before you sign",
    query: "what to ask an ai agency before signing a contract",
    description:
      "The questions that separate a studio that will ship you a working system from one that will bill you for a discovery phase: repo ownership, model cost exposure, handover, and what happens when the pilot fails.",
    dek: "Written by someone who wants you to ask him these. If a vendor gets cagey on question three, you have your answer.",
    date: "2026-08-21",
    status: "published",
    minutes: 5,
    tags: ["Buying", "Engagements"],
  },

  {
    slug: "llm-api-costs-without-surprises",
    title: "Shipping a public LLM endpoint without a surprise bill",
    query: "how to add an llm feature without runaway api costs",
    description:
      "The cost controls on a public, unauthenticated AI endpoint in production: per-IP rate limiting, structured outputs, low reasoning effort, and a static fallback that keeps the feature working when every one of them trips.",
    dek: "The Scope tool on this site calls a frontier model, from an unauthenticated public route, with no login. Here is every guardrail holding that up.",
    date: "2026-08-24",
    status: "published",
    minutes: 5,
    tags: ["Engineering", "Cost control"],
  },

  // --- Drafted, scheduled. Flip `status` one at a time, roughly weekly. ---

  {
    slug: "apollo-free-plan-limits",
    title: "What the Apollo.io free plan can't do (and what it costs to fix)",
    query: "apollo.io free plan limits api access",
    description:
      "A working account's map of the Apollo.io free tier: which API endpoints are gated to paid plans, what lead credits versus export credits actually mean in practice, and the manual workflow that replaces the API.",
    dek: "I hit this wall building my own prospecting pipeline. The documentation does not make the boundary obvious, so here it is.",
    date: "2026-09-04",
    status: "draft",
    minutes: 5,
    tags: ["Tooling", "Lead generation"],
  },
  {
    slug: "automating-bol-and-pod-document-processing",
    title: "Automating BOL and POD document handling in a 3PL back office",
    query: "automate bill of lading and proof of delivery processing",
    description:
      "How document intake actually works in a small freight brokerage, which parts of it an LLM handles reliably, which parts must stay deterministic, and how the result gets back into a TMS.",
    dek: "The A/P admin job posting is the tell. Here is what the work is and which half of it is automatable.",
    date: "2026-09-11",
    status: "draft",
    minutes: 5,
    tags: ["Logistics", "Workflow automation"],
  },
  {
    slug: "swapping-claude-for-gemini-behind-one-interface",
    title: "Swapping Claude for Gemini behind one interface",
    query: "how to switch llm providers without rewriting your app",
    description:
      "A provider abstraction that makes the paid and free model paths interchangeable behind a single contract, so switching costs one environment variable and no redeploy, with the schema translation that makes it work.",
    dek: "Two providers, one contract, one env var. The interesting part is not the abstraction, it's what refuses to abstract cleanly.",
    date: "2026-09-18",
    status: "draft",
    minutes: 5,
    tags: ["Engineering", "Architecture"],
  },
];

/** Live posts, newest first. The only list the index page and sitemap use. */
export function publishedPosts(): Post[] {
  return POSTS.filter((p) => p.status === "published").sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug && p.status === "published");
}

export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
