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
  ogImage: "/og/default.png", // see BUILD_PLAN Phase: OG images
} as const;

export const NAV_PAGES = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/build", label: "Build" },
  { href: "/about", label: "Studio" },
] as const;
