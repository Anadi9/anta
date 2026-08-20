/**
 * Single source of truth for site identity — used by layout metadata,
 * sitemap.ts, robots.ts, llms.txt generation, and JSON-LD. Change the
 * domain/name/description here, not in individual files.
 */
export const SITE = {
  name: "ANTA",
  legalName: "ANTA",
  url: "https://theanta.com", // canonical origin — apex, no www (see ARCHITECTURE.md)
  title: "ANTA — Automating Next Time-less Architecture",
  tagline:
    "An AI studio for teams that would rather ship the system than manage another hire.",
  // Plain-factual description for machine consumption (JSON-LD, llms.txt,
  // meta description). Keep this separate from brand copy on the page —
  // AI engines and search snippets need the direct version, not the poetic
  // one. Update if positioning changes.
  description:
    "ANTA is an AI development studio that designs and builds custom AI systems — internal tools, lead-generation engines, content pipelines, and workflow automation — for U.S. growth-stage companies. Founder-led, no client roster required to prove the work: every build ships to production.",
  founder: "Anadi",
  foundedLocationNote: "Built in India, operating with a US (Detroit) entity for client-facing work.",
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

export const NAV_PAGES = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/build", label: "Build" },
  { href: "/about", label: "Studio" },
] as const;
