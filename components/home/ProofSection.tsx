import Link from "next/link";
import { Reveal, SectionLabel } from "@/components/Reveal";

/**
 * "03 / Proof".
 *
 * The design reference (ANTA Site.dc.html) has three cards of bracketed
 * `[Placeholder client]` copy — those can't ship as-is. This renders the one
 * system that genuinely exists, the Lead Intelligence Agent, using the same
 * figures shown in design-reference/ANTA Work.dc.html, and links through to
 * the full case study. Add the second and third cards here when there are
 * real ones to add — don't reinstate the placeholders.
 */

const FACETS = [
  {
    label: "Sources & enriches",
    body: "Accounts pulled from Apollo, enriched against firmographic and hiring signals.",
  },
  {
    label: "Scores fit",
    body: "A Claude-driven rubric tuned per ICP, not a static lead-score formula.",
  },
  {
    label: "Drafts & sequences",
    body: "First-touch email in the founder's voice, pushed to Lemlist, replies synced to HubSpot.",
  },
];

const STATS = [
  { value: "312", label: "accounts scored / run" },
  { value: "11.4%", label: "reply rate" },
  { value: "41s", label: "per run" },
];

export function ProofSection() {
  return (
    <section
      id="proof"
      className="mx-auto max-w-[1280px] border-b border-border px-[clamp(18px,4vw,56px)] py-[clamp(64px,9vw,120px)]"
    >
      <Reveal className="mb-[clamp(32px,4.4vw,54px)] flex flex-wrap items-end justify-between gap-7">
        <div>
          <SectionLabel>03&nbsp;/&nbsp;Proof</SectionLabel>
          <h2 className="max-w-[20ch] text-balance text-[clamp(30px,4.4vw,56px)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
            Systems that shipped and stayed shipped.
          </h2>
        </div>
        <p className="max-w-[38ch] text-pretty text-[15px] leading-[1.7] text-fg-muted">
          The studio&apos;s own lead engine, running in production. Shown the
          way it actually runs — the interface, the pipeline behind it, and the
          stack it sits on.
        </p>
      </Reveal>

      <Reveal>
        <article className="border border-border bg-bg-raised">
          <div className="flex flex-wrap items-start justify-between gap-6 border-b border-border p-[clamp(24px,3vw,40px)]">
            <div className="min-w-0 flex-[1_1_420px]">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">
                ANTA&nbsp;·&nbsp;Sales &amp; RevOps
              </div>
              <h3 className="text-[clamp(22px,2.6vw,32px)] font-semibold leading-[1.15] tracking-[-0.02em] text-white">
                Lead Intelligence Agent
              </h3>
              <p className="mt-3.5 max-w-[56ch] text-pretty text-[15px] leading-[1.7] text-fg-muted">
                B2B lead scoring, cold email generation and outreach sequencing
                in one pipeline. One operator reviews; nothing sends unreviewed.
              </p>
            </div>
            <div className="font-mono text-[11px] leading-[1.9] text-fg-faint">
              <div>shipped&nbsp;·&nbsp;v1.4</div>
              <div>internal + client deploys</div>
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
            {FACETS.map((f) => (
              <div
                key={f.label}
                className="border-b border-r border-border p-[clamp(20px,2.4vw,30px)]"
              >
                <div className="mb-3 font-mono text-[9.5px] uppercase tracking-[0.14em] text-accent-ink">
                  {f.label}
                </div>
                <p className="text-pretty text-sm leading-[1.65] text-fg-muted">
                  {f.body}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6 p-[clamp(20px,2.4vw,30px)]">
            <dl className="flex flex-wrap gap-x-10 gap-y-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block font-mono text-[clamp(20px,2.4vw,28px)] text-white">
                      {s.value}
                    </span>
                    <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
                      {s.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              href="/work"
              className="border-b border-current pb-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-accent-ink transition-colors hover:text-accent-hot focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Read the case study&nbsp;→
            </Link>
          </div>
        </article>
      </Reveal>
    </section>
  );
}
