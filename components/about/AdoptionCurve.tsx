import Link from "next/link";
import { Reveal, SectionLabel } from "@/components/Reveal";
import { STAGES } from "@/lib/about/content";

/**
 * "01 / The adoption curve" — the market ledger, from option 5a in
 * design-reference/ANTA About Options.dc.html (see lib/about/content.ts for
 * why that option over the base About export's stage cards).
 *
 * Four spec rows, stage 03 lit as the current one. Each row is a flex layout
 * that wraps rather than a table: the stage copy is a sentence, not a cell
 * value, and it needs to reflow to full width on narrow screens instead of
 * squeezing into a fixed column.
 */
export function AdoptionCurve() {
  return (
    <section
      id="shift"
      className="relative overflow-hidden border-b border-border bg-bg px-[clamp(18px,4vw,56px)] py-[clamp(64px,9vw,120px)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(90deg,rgba(245,244,241,0.055)_0_1px,transparent_1px_104px)] [mask-image:linear-gradient(to_bottom,transparent,#000_34%,#000_66%,transparent)]"
      />

      <div className="relative mx-auto max-w-[1280px]">
        <SectionLabel>01&nbsp;/&nbsp;The&nbsp;adoption&nbsp;curve</SectionLabel>

        <Reveal className="mb-[clamp(32px,5vw,44px)] flex flex-wrap items-end justify-between gap-7">
          <h2 className="max-w-[20ch] text-balance text-[clamp(30px,4.4vw,56px)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
            Adopt, or get dragged out by whoever did.
          </h2>
          <p className="max-w-[34ch] text-pretty text-[15px] leading-[1.7] text-fg-muted">
            This isn&apos;t a hype cycle. It&apos;s a market redraw that is
            already three stages in.
          </p>
        </Reveal>

        <Reveal className="border-t border-line">
          {STAGES.map((s) => (
            <div
              key={s.num}
              className={`flex flex-wrap gap-x-6 gap-y-1.5 border-b border-l-2 border-line py-5 pl-[18px] ${
                s.current
                  ? "border-l-accent bg-[linear-gradient(90deg,rgba(236,26,99,0.10),transparent_62%)] sm:py-[22px]"
                  : ""
              }`}
            >
              <span
                className={`w-[58px] shrink-0 pt-1 font-mono text-[10.5px] tracking-[0.14em] ${
                  s.current ? "text-accent-hot" : "text-fg-faint"
                }`}
              >
                {s.num}
              </span>
              <span
                className={`w-[132px] shrink-0 text-base font-semibold tracking-[-0.015em] ${
                  s.current ? "text-white" : "text-t6"
                }`}
              >
                {s.name}
              </span>
              <span
                className={`min-w-0 flex-[1_1_300px] text-sm leading-[1.6] ${
                  s.current ? "text-t1" : "text-t6"
                }`}
              >
                {s.body}
              </span>
              <span
                className={`flex w-[92px] shrink-0 items-center gap-2 pt-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
                  // Reference sets the passed/ahead status in #3A3A3E (the
                  // --color-t9 token), which measures 1.79:1 here — it's real
                  // text, so it moves up to the faint tier at 4.53:1.
                  s.current ? "text-white" : "text-fg-faint"
                }`}
              >
                {s.current && (
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 shrink-0 bg-accent motion-safe:animate-[anta-breathe_1.4s_ease-in-out_infinite]"
                  />
                )}
                {s.status}
              </span>
            </div>
          ))}
        </Reveal>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <span className="font-mono text-[11px] text-fg-faint">
            stage&nbsp;03&nbsp;of&nbsp;04&nbsp;· one exit: build the system
            while it&apos;s still a decision
          </span>
          {/* The reference links to an on-page #scope anchor; the live tool
              lives on the homepage, so this crosses pages to it. */}
          <Link
            href="/#scope"
            className="border-b border-current pb-0.5 font-mono text-[11px] text-accent-ink transition-colors hover:text-accent-hot focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Scope the system&nbsp;→
          </Link>
        </div>
      </div>
    </section>
  );
}
