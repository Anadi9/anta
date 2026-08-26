import Link from "next/link";
import { Nav } from "@/components/Nav";

/**
 * /blog hero. There is no .dc.html reference for this section — the design
 * exports cover four pages and none of them is a blog — so it is assembled
 * from the Work hero's structure (components/work/WorkHero.tsx: bg-deep
 * band, vertical rule texture, accent bloom, breadcrumb, oversized h1,
 * mono strip on a top border) rather than invented. Same tokens, same
 * clamp scale, same breadcrumb markup. Deviating here would make /blog the
 * one page that doesn't look like the site.
 *
 * The strip carries a live/scheduled count instead of Work's shipped/scoped
 * split, for the same reason that one is split: it's the honest number, and
 * it sets the expectation that more are coming rather than implying a
 * larger archive than exists.
 */
export function BlogHero({
  liveCount,
  scheduledCount,
}: {
  liveCount: number;
  scheduledCount: number;
}) {
  return (
    <>
      <Nav />
      <section className="relative overflow-hidden border-b border-line-2 bg-bg-deep">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(90deg,rgba(245,244,241,0.055)_0_1px,transparent_1px_104px)] [mask-image:linear-gradient(to_bottom,#000,transparent_82%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[34%] left-[6%] h-[46vw] w-[46vw] opacity-[0.14] [background:radial-gradient(circle,var(--color-accent-deep)_0%,transparent_62%)]"
        />

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
              Briefs
            </span>
          </nav>

          <h1 className="max-w-[16ch] text-balance text-[clamp(38px,7.4vw,96px)] font-bold leading-[0.96] tracking-[-0.04em] text-ink-max">
            Briefs from inside the build.
          </h1>
          <p className="mt-[clamp(20px,2.6vw,30px)] max-w-[54ch] text-pretty text-[clamp(15px,1.5vw,18px)] leading-[1.7] text-t7">
            What things cost, what breaks, and what I&rsquo;d ask before
            signing. Written from systems that are actually running, not from
            a content calendar.
          </p>
        </div>

        <div className="relative mt-[clamp(40px,6vw,72px)] border-t border-line-2">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-7 gap-y-3.5 px-[clamp(18px,4vw,56px)] py-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-t-dimmer">
            <span className="flex items-center gap-2.5 text-t-bright">
              <span
                aria-hidden
                className="h-[7px] w-[7px] bg-accent motion-safe:animate-[anta-breathe_2.4s_ease-in-out_infinite]"
              />
              <span>
                {liveCount}&nbsp;published
                {scheduledCount > 0 ? (
                  <>&nbsp;·&nbsp;{scheduledCount}&nbsp;scheduled</>
                ) : null}
              </span>
            </span>
            <span>one&nbsp;question&nbsp;per&nbsp;post</span>
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
