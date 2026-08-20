import { Reveal, SectionLabel } from "@/components/Reveal";

/**
 * "04 / TEAM — SYSTEM_MAP" — how the studio operates. Five stages in an
 * asymmetric grid (design spans both rows on the left, automate spans the
 * bottom), collapsing to a single column below `lg`. Copy verbatim from
 * design-reference/ANTA Site.dc.html.
 */

const STAGES = [
  {
    num: "01",
    name: "DESIGN",
    heading: "Research, prototyping, product strategy",
    body: "We map the workflow before we touch code: who does what, where it breaks, what a system actually needs to replace. Prototypes get tested against real inputs, not demos.",
  },
  {
    num: "02",
    name: "ARCHITECTURE",
    heading: "The system, sequenced before it's built",
    body: "Every input, owner, and failure point mapped before a line of code exists.",
  },
  {
    num: "03",
    name: "BUILD",
    heading: "Engineering & AI integration",
    body: "Claude and API-level integrations wired into the tools you already run, built and tested against your actual data.",
  },
  {
    num: "04",
    name: "SHIP",
    heading: "Deploy, monitor, iterate",
    body: "Live in production, with dashboards and alerts so issues surface before your team notices them.",
  },
  {
    num: "05",
    name: "AUTOMATE",
    heading: "Continuous feedback loop",
    body: "Every deploy feeds the next one. Usage, edge cases, and founder notes get folded back into the system on a standing weekly review, not a quarterly one.",
  },
] as const;

export function ProcessSection() {
  const [design, architecture, build, ship, automate] = STAGES;

  return (
    <section
      id="team"
      className="relative overflow-hidden border-t border-white/[0.14] bg-[#0B0C0E]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            "radial-gradient(rgba(245,244,241,0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-[1320px] px-[clamp(18px,4vw,56px)] py-[clamp(56px,7vw,100px)]">
        <Reveal className="mb-[clamp(28px,4vw,46px)]">
          <SectionLabel>04&nbsp;/&nbsp;TEAM&nbsp;:&nbsp;SYSTEM_MAP</SectionLabel>
          <h2 className="max-w-[20ch] text-balance text-[clamp(30px,4.4vw,56px)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
            How the studio operates
          </h2>
        </Reveal>

        <Reveal className="grid grid-cols-1 gap-3.5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-[auto_auto]">
          {/* 01 · DESIGN — full-height left column */}
          <div className="relative min-h-[420px] overflow-hidden border border-white/[0.16] p-[clamp(24px,3vw,34px)] lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <div className="font-mono text-xs tracking-[0.1em] text-accent-ink">
              {design.num}&nbsp;·&nbsp;{design.name}
            </div>
            <h3 className="mt-3.5 max-w-[22ch] text-[clamp(18px,1.8vw,22px)] font-medium leading-[1.3] tracking-[-0.01em] text-white">
              {design.heading}
            </h3>
            <p className="relative z-10 mt-4 max-w-[32ch] text-pretty text-sm leading-[1.7] text-fg-muted">
              {design.body}
            </p>
            <div
              aria-hidden
              className="absolute -bottom-[60px] -right-[60px] size-[260px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 38% 32%, rgba(255,120,190,0.55), rgba(236,26,99,0.35) 45%, transparent 72%)",
              }}
            />
          </div>

          {/* 02–04 — top row */}
          {[architecture, build, ship].map((stage) => (
            <div
              key={stage.num}
              className="min-h-[200px] border border-accent/40 p-[clamp(22px,2.6vw,30px)]"
            >
              <div className="font-mono text-xs tracking-[0.1em] text-accent-ink">
                {stage.num}&nbsp;·&nbsp;{stage.name}
              </div>
              <h3 className="mt-3.5 max-w-[20ch] text-[clamp(17px,1.6vw,20px)] font-medium leading-[1.3] tracking-[-0.01em] text-white">
                {stage.heading}
              </h3>
              <p className="mt-3.5 max-w-[28ch] text-pretty text-[13.5px] leading-[1.65] text-fg-muted">
                {stage.body}
              </p>
            </div>
          ))}

          {/* 05 · AUTOMATE — spans the bottom row */}
          <div className="relative min-h-[200px] border border-white/[0.16] p-[clamp(22px,2.6vw,30px)] lg:col-start-2 lg:col-end-5 lg:row-start-2">
            <div className="font-mono text-xs tracking-[0.1em] text-accent-ink">
              {automate.num}&nbsp;·&nbsp;{automate.name}
            </div>
            <h3 className="mt-3.5 max-w-[20ch] text-[clamp(17px,1.6vw,20px)] font-medium leading-[1.3] tracking-[-0.01em] text-white">
              {automate.heading}
            </h3>
            <p className="mt-3.5 max-w-[46ch] text-pretty text-[13.5px] leading-[1.65] text-fg-muted">
              {automate.body}
            </p>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="absolute right-5 top-5 size-[18px] fill-none stroke-accent stroke-2"
            >
              <path d="M3 12a9 9 0 0 1 15.5-6.3M21 12a9 9 0 0 1-15.5 6.3M17.5 3v5h-5M6.5 21v-5h5" />
            </svg>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
