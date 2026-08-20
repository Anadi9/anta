import Link from "next/link";
import { Nav } from "@/components/Nav";

/**
 * Build page hero — design-reference/ANTA Build.dc.html lines 62–87
 * ("Build hero" screen), matched element for element. Same construction as
 * components/work/WorkHero.tsx; see that file for the ground/grey notes.
 *
 * Copy fix: the reference sub-headline reads "Four kinds of system, and five
 * of them drawn the way they execute" — four and five refer to two different
 * things (system categories vs. workflows), so as written it's a broken
 * sentence. Reworded to name both counts explicitly; the rest is verbatim.
 */
export function BuildHero() {
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
              Build
            </span>
          </nav>

          <h1 className="max-w-[19ch] text-balance text-[clamp(36px,6.6vw,84px)] font-bold leading-[0.98] tracking-[-0.04em] text-ink-max">
            What we build — and how it actually runs.
          </h1>
          <p className="mt-[clamp(20px,2.6vw,30px)] max-w-[54ch] text-pretty text-[clamp(15px,1.5vw,18px)] leading-[1.7] text-t7">
            Four kinds of system, and five workflows drawn the way they execute
            in production. Pick a workflow and follow it from trigger to output.
          </p>
        </div>

        <div className="relative mt-[clamp(40px,6vw,72px)] border-t border-line-2">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-7 gap-y-3.5 px-[clamp(18px,4vw,56px)] py-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-t-dimmer">
            <span className="flex items-center gap-2.5 text-t-bright">
              <span
                aria-hidden
                className="h-[7px] w-[7px] bg-accent motion-safe:animate-[anta-breathe_2.4s_ease-in-out_infinite]"
              />
              <span>four&nbsp;system&nbsp;types</span>
            </span>
            <span>five&nbsp;workflows&nbsp;·&nbsp;live&nbsp;trace</span>
            {/* accent-ink rather than the reference's #C20A62 — see WorkHero. */}
            <a
              href="#flows"
              className="text-accent-ink transition-colors hover:text-accent-hot focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Open the explorer&nbsp;↓
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
