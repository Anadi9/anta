import type { Metadata } from "next";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Proof of work, not pitch decks — real ANTA builds, including the Lead Intelligence Agent (B2B lead scoring, cold email generation, outreach sequencing).",
  alternates: { canonical: "/work" },
};

// Stub — build against design-reference/ANTA Work.dc.html.
// Real case study content already written there: the Lead Intelligence
// Agent (stack: Next.js, Postgres, Vercel, Claude API, Apollo, HubSpot,
// Lemlist), a "System log" terminal-feed component, and a "fit score" /
// "reply rate" stats block. Reuse real numbers from that build — don't
// invent metrics.
//
// Once there's more than one case study, split this into /work (index)
// and /work/[slug] (individual case studies) so each one is independently
// linkable and indexable — add BreadcrumbList schema at that point too.
export default function Work() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-bg px-6 pt-32 text-white">
        <h1 className="font-mono text-xs uppercase tracking-widest text-fg-muted">
          Work — TODO
        </h1>
      </main>
    </>
  );
}
