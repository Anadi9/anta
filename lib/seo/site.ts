/**
 * Single source of truth for site identity — used by layout metadata,
 * sitemap.ts, robots.ts, llms.txt generation, and JSON-LD. Change the
 * domain/name/description here, not in individual files.
 */
export const SITE = {
  name: "ANTA",
  legalName: "ANTA",
  url: "https://theanta.com", // canonical origin — apex, no www (see ARCHITECTURE.md)
  // Search/social title. Deliberately NOT the brand expansion ("Automating
  // Next Time-less Architecture", kept below as `brandline`): a title tag is
  // a retrieval surface, and nobody searches a brand koan. This one carries
  // the category, the buyer, and the geo, which is what both Google and AI
  // answer engines match a query against. The poetic line still does its
  // brand work in on-page copy — it just doesn't get to spend the one
  // highest-authority string on the site.
  title: "ANTA | Custom AI Development Studio for U.S. Growth-Stage Teams",
  // The wordmark expansion. On-page/brand use only — never a title tag.
  brandline: "Automating Next Time-less Architecture",
  tagline:
    "An AI studio for teams that would rather ship the system than manage another hire.",
  // Plain-factual description for machine consumption (JSON-LD, llms.txt,
  // meta description). Keep this separate from brand copy on the page —
  // AI engines and search snippets need the direct version, not the poetic
  // one. Update if positioning changes.
  description:
    "ANTA is an AI development studio that designs and builds custom AI systems for U.S. growth-stage companies: internal tools, lead-generation engines, content pipelines, and workflow automation. Founder-led, no client roster required to prove the work: every build ships to production.",
  founder: "Anadi",
  twitter: "@theanta", // update if/when a real handle exists — remove field if not
  // Social cards are generated per route by app/**/opengraph-image.tsx (see
  // lib/seo/og.tsx) — there is no static OG file to point at. This is kept
  // as the absolute URL of the homepage card, for the places that need a
  // concrete image URL rather than a meta tag: JSON-LD `image`, llms.txt.
  ogImage: "https://theanta.com/opengraph-image",
  // The Zoho mailbox is `anadit@theanta.com` — the design references and the
  // first pass of this build both wrote `anadit@theanta.com`, which is not a
  // real address on the account and bounces. Every mailto on the site reads
  // from here, so an alias change is a one-line edit.
  email: "anadit@theanta.com",
  // Cal.com handle is `antaconsulting`, not `anta` — `anta` was not available
  // at signup. Every booking link on the site reads from here, so if the
  // handle is ever renamed in Cal.com settings this is the only edit.
  bookingUrl: "https://cal.com/antaconsulting/intro",
  bookingLabel: "cal.com/antaconsulting/intro",
} as const;

/**
 * Independent profiles that corroborate ANTA as a real entity, emitted as
 * schema.org `sameAs` (see lib/seo/jsonld.ts).
 *
 * Why this exists: theanta.com asserting "ANTA is an AI studio" is an
 * unverifiable claim to an answer engine. The same claim, cross-referenced
 * against profiles on hosts the engine already trusts, is an entity — and
 * entities get cited. This is the single highest-leverage AEO field on the
 * site, and it is currently near-empty, which is the bottleneck.
 *
 * Hard rule: every URL here must resolve to a live, ANTA/Anadi-owned page.
 * A `sameAs` pointing at a 404 or at someone else's profile is worse than
 * an absent one — it's a failed corroboration rather than a missing one.
 * Add entries only once the profile actually exists and is published.
 *
 * ORG: profiles for the studio itself. LinkedIn is live; the rest are still
 * to be created, in this priority order:
 *   1. LinkedIn company page — DONE
 *   2. Crunchbase organization profile
 *   3. GitHub organization (if the studio's public work moves off the
 *      personal account)
 *   4. Clutch / G2 listing, if a real review ever lands there
 *
 * One live profile is enough to stop ANTA reading as an unverifiable claim,
 * but corroboration strengthens with independent sources — a second and
 * third host are worth more than more detail on the first.
 *
 * FOUNDER: profiles for Anadi personally. A founder-led studio's entity
 * graph runs through the person as much as the company, so these carry
 * real weight while the org profiles are still empty.
 */
export const PROFILES = {
  org: [
    "https://www.linkedin.com/company/theanta/",
  ] as string[],
  founder: [
    "https://www.linkedin.com/in/anadi-thakur-92163316b/",
    "https://github.com/Anadi9",
  ] as string[],
} as const;

export const NAV_PAGES = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/build", label: "Build" },
  { href: "/about", label: "Studio" },
] as const;
