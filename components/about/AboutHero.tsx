import Link from "next/link";
import { Nav } from "@/components/Nav";

/**
 * About page hero — design-reference/ANTA About.dc.html lines 139–165
 * ("About hero" screen), matched element for element. Same construction as
 * components/work/WorkHero.tsx; see that file for the ground/grey notes.
 *
 * The reference puts the breathing accent dot in the eyebrow above the
 * headline (not in the footer strip, as Work and Build do) — kept that way.
 *
 * The second `<p>` is not in the reference. It's the plain-factual statement
 * of who ANTA is and what it does, required by BUILD_PLAN Phase 3: search
 * snippets and AI answer engines extract facts far more reliably from direct
 * sentences than from a stylised headline. Keep it in sync with
 * SITE.description in lib/seo/site.ts.
 */
export function AboutHero() {
  return (
    <>
      <Nav />
      <section className="relative overflow-hidden border-b border-line-2 bg-bg-deep">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(90deg,rgba(245,244,241,0.055)_0_1px,transparent_1px_104px)] [mask-image:linear-gradient(to_bottom,#000,transparent_82%)]"
        />
        {/* Accent bloom, top-left (reference line 141). */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[34%] left-[6%] h-[46vw] w-[46vw] opacity-[0.14] [background:radial-gradient(circle,var(--color-accent-deep)_0%,transparent_62%)]"
        />

        <div className="relative mx-auto max-w-[1280px] px-[clamp(18px,4vw,56px)] pt-[calc(64px+clamp(56px,8vw,104px))]">
          <nav
            aria-label="Breadcrumb"
            className="mb-[clamp(26px,4vw,44px)] flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-t-dim"
          >
            <Link
              href="/"
              className="transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Home
            </Link>
            <span aria-hidden className="text-t9">
              /
            </span>
            <span aria-current="page" className="text-ink">
              About
            </span>
          </nav>

          <div className="mb-[18px] flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-ink">
            <span
              aria-hidden
              className="h-[7px] w-[7px] bg-accent motion-safe:animate-[anta-breathe_2.4s_ease-in-out_infinite]"
            />
            <span>Why&nbsp;ANTA&nbsp;exists</span>
          </div>

          <h1 className="max-w-[20ch] text-balance text-[clamp(36px,6.6vw,84px)] font-bold leading-[0.98] tracking-[-0.04em] text-ink-max">
            The market doesn&apos;t wait for you to catch up.
          </h1>
          <p className="mt-[clamp(20px,2.6vw,30px)] max-w-[56ch] text-pretty text-[clamp(15px,1.5vw,18px)] leading-[1.7] text-t7">
            Every quarter you spend deciding whether AI applies to you, three
            competitors already shipped with it. ANTA exists to close that gap
            before it becomes permanent.
          </p>
          <p className="mt-6 max-w-[62ch] text-pretty text-[14.5px] leading-[1.75] text-t-dim">
            ANTA is an AI development studio, founded and run by Anadi, working
            with a U.S. entity in Detroit, Michigan. It designs and builds
            custom AI systems for U.S. growth-stage B2B companies, typically
            5–50 people. That means internal tools, lead-generation engines,
            content pipelines and workflow automation. Engagements start as a
            fixed-price pilot sprint and the code is the client&apos;s from the
            first commit.
          </p>
        </div>

        <div className="relative mt-[clamp(40px,6vw,72px)] border-t border-line-2">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-7 gap-y-3.5 px-[clamp(18px,4vw,56px)] py-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-t-dimmer">
            <span>automating&nbsp;next&nbsp;time-less&nbsp;architecture</span>
            <span>detroit,&nbsp;mi&nbsp;·&nbsp;overlaps&nbsp;et</span>
            {/* accent-ink rather than the reference's #C20A62 — see WorkHero. */}
            <a
              href="#shift"
              className="text-accent-ink transition-colors hover:text-accent-hot focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              See the shift&nbsp;↓
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
