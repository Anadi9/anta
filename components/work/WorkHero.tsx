import Link from "next/link";
import { Nav } from "@/components/Nav";

/**
 * Work page hero — design-reference/ANTA Work.dc.html lines 62–87
 * ("Work hero" screen), matched element for element.
 *
 * The reference paints this band on #0A0A0B (`--color-bg-deep`), not on the
 * site's warmer #0A0508 ground, and its greys are the warm mono ramp
 * (#6E6C66 / #5E5C57 / #C9C7C1), not white-alpha. Both are tokens now.
 *
 * Two deliberate departures, each noted at its line: the accent text colour
 * and the log-count strip.
 */
export function WorkHero() {
  return (
    <>
      <Nav />
      <section className="relative overflow-hidden border-b border-line-2 bg-bg-deep">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(90deg,rgba(245,244,241,0.055)_0_1px,transparent_1px_104px)] [mask-image:linear-gradient(to_bottom,#000,transparent_82%)]"
        />
        {/* Accent bloom, top-left (reference line 64). */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[34%] left-[6%] h-[46vw] w-[46vw] opacity-[0.14] [background:radial-gradient(circle,var(--color-accent-deep)_0%,transparent_62%)]"
        />

        {/* The 64px is clearance for the fixed nav, which is out of flow.
            The clamp is the gap between the nav's bottom edge and the
            breadcrumb.

            Deliberate deviation from the reference, applied 21 Aug 2026: the
            exports specify clamp(56px,8vw,104px), tightened here to
            clamp(32px,4.5vw,60px) (104px -> 60px on desktop) to lift the hero
            and get more of the h1 above the fold. The same value is set on
            BuildHero, AboutHero and BlogHero — these four are one system, so
            change them together or they visibly desync. Article headers
            (app/blog/[slug]/page.tsx) run their own tighter value on purpose;
            see the note there. */}
        <div className="relative mx-auto max-w-[1280px] px-[clamp(18px,4vw,56px)] pt-[calc(64px+clamp(32px,4.5vw,60px))]">
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
              Work
            </span>
          </nav>

          <h1 className="max-w-[16ch] text-balance text-[clamp(38px,7.4vw,96px)] font-bold leading-[0.96] tracking-[-0.04em] text-ink-max">
            Proof of work, not pitch decks.
          </h1>
          <p className="mt-[clamp(20px,2.6vw,30px)] max-w-[54ch] text-pretty text-[clamp(15px,1.5vw,18px)] leading-[1.7] text-t7">
            Shipped systems, shown the way they actually run: the interface,
            the pipeline behind it, and the stack it sits on.
          </p>
        </div>

        <div className="relative mt-[clamp(40px,6vw,72px)] border-t border-line-2">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-7 gap-y-3.5 px-[clamp(18px,4vw,56px)] py-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-t-dimmer">
            <span className="flex items-center gap-2.5 text-t-bright">
              <span
                aria-hidden
                className="h-[7px] w-[7px] bg-accent motion-safe:animate-[anta-breathe_2.4s_ease-in-out_infinite]"
              />
              {/* Reference reads "{{ logCount }} systems in the log" — a
                  template placeholder that would render "7". Only the Lead
                  Intelligence Agent is actually shipped; the other six in
                  lib/work/cases.ts are scoped. On a page headlined "Proof of
                  work, not pitch decks" that count has to be honest, so it's
                  split rather than totalled. */}
              <span>one&nbsp;shipped&nbsp;·&nbsp;six&nbsp;scoped</span>
            </span>
            <span>one&nbsp;featured&nbsp;·&nbsp;the&nbsp;rest&nbsp;expandable</span>
            {/* Reference uses --acc (#C20A62) for this link; at 10.5px that
                measures 3.3:1 on #0A0A0B. accent-ink is the in-system
                accessible substitute (4.8:1) documented in globals.css. */}
            <a
              href="#index"
              className="text-accent-ink transition-colors hover:text-accent-hot focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Jump to the index&nbsp;↓
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
