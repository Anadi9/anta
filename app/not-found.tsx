import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { NAV_PAGES, SITE } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Not found",
  description: "That route doesn't exist on theanta.com.",
  // A 404 is never a landing page. Next injects noindex on 404-status
  // responses automatically, but this covers the streamed-response case
  // where the status is 200 (see the not-found.js docs on status codes).
  robots: { index: false, follow: true },
};

/**
 * Root 404 — catches both `notFound()` calls and any unmatched URL.
 *
 * Deliberately built out of the same parts as a real page (Nav, Footer, the
 * bg-bg-deep hero ground with the 104px rule overlay from AboutHero) rather
 * than a bare centred message: after the /services/* redirects there will be
 * stale inbound links, and someone landing here from a search result should
 * still see a site, with somewhere to go next.
 *
 * Server component — no client leaf beyond the shared Nav.
 */
export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="relative flex flex-1 flex-col overflow-hidden border-b border-line-2 bg-bg-deep">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(90deg,rgba(245,244,241,0.055)_0_1px,transparent_1px_104px)] [mask-image:linear-gradient(to_bottom,#000,transparent_82%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[34%] left-[6%] h-[46vw] w-[46vw] opacity-[0.14] [background:radial-gradient(circle,var(--color-accent-deep)_0%,transparent_62%)]"
        />

        <div className="relative mx-auto flex w-full max-w-[1280px] flex-1 flex-col justify-center px-[clamp(18px,4vw,56px)] pb-[clamp(72px,10vw,140px)] pt-[calc(64px+clamp(56px,8vw,104px))]">
          <div className="mb-[18px] flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-accent-ink">
            <span aria-hidden className="h-3 w-3 bg-accent" />
            404&nbsp;·&nbsp;no route
          </div>

          <h1 className="mb-[22px] max-w-[18ch] text-balance text-[clamp(38px,6.4vw,84px)] font-bold leading-[0.98] tracking-[-0.035em] text-white">
            That page isn&apos;t part of the system.
          </h1>

          <p className="mb-[clamp(32px,4vw,48px)] max-w-[52ch] text-pretty text-[clamp(16px,1.6vw,19px)] leading-[1.6] text-fg-muted">
            The URL doesn&apos;t resolve to anything here — either it moved, or
            it never existed. Everything the studio publishes is on one of the
            four pages below.
          </p>

          <div className="flex flex-wrap gap-3">
            {NAV_PAGES.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="border border-border px-[18px] py-3 font-mono text-[11.5px] uppercase tracking-[0.09em] text-t1 transition-colors hover:border-accent hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {p.label}
              </Link>
            ))}
            <a
              href={`mailto:${SITE.email}?subject=${encodeURIComponent("ANTA — broken link")}`}
              className="border border-border bg-accent-deep px-[18px] py-3 font-mono text-[11.5px] font-bold uppercase tracking-[0.06em] text-[#FBFAF8] transition-shadow duration-[250ms] hover:shadow-[0_0_0_1px_var(--color-accent),0_0_28px_rgba(236,26,99,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Tell me what broke
            </a>
          </div>
        </div>
      </main>
      <Footer onThisPage={[{ href: "/#contact", label: "Contact" }]} />
    </>
  );
}
