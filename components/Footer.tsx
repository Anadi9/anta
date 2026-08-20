import Image from "next/image";
import Link from "next/link";
import { NAV_PAGES, SITE } from "@/lib/seo/site";

type PageLink = { href: string; label: string };

const HOME_ON_THIS_PAGE: PageLink[] = [
  { href: "#scope", label: "Scope it live" },
  { href: "#tools", label: "Industry toolkits" },
  { href: "#team", label: "How the studio operates" },
  { href: "#contact", label: "Contact" },
];

/**
 * Site footer — copy verbatim from the design-reference exports. Everything
 * is shared across pages except the "On this page" column, which each page
 * passes its own anchors for (see ANTA Work.dc.html for the Work variant).
 */
export function Footer({
  onThisPage = HOME_ON_THIS_PAGE,
}: {
  onThisPage?: PageLink[];
}) {
  return (
    <footer className="border-t border-border bg-bg-raised">
      <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(190px,1fr))] items-start gap-[clamp(28px,4vw,56px)] px-[clamp(18px,4vw,56px)] pb-[clamp(28px,3.4vw,40px)] pt-[clamp(44px,6vw,76px)]">
        <div className="col-span-full flex max-w-[46ch] flex-col gap-3.5">
          <div className="flex items-center gap-[11px]">
            <Image
              src="/anta-mark.png"
              alt="ANTA logo mark"
              width={24}
              height={24}
              className="block h-6 w-auto"
            />
            <span className="text-[17px] font-bold tracking-[0.16em] text-white">
              ANTA
            </span>
          </div>
          <p className="text-pretty text-[15px] leading-[1.7] text-fg-muted">
            {SITE.tagline}
          </p>
        </div>

        <nav aria-label="Pages" className="flex flex-col gap-[11px]">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">
            Pages
          </h2>
          {NAV_PAGES.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="font-mono text-xs text-fg-muted transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {p.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="On this page" className="flex flex-col gap-[11px]">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">
            On this page
          </h2>
          {onThisPage.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="font-mono text-xs text-fg-muted transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-[11px]">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">
            Direct
          </h2>
          <a
            href={`mailto:${SITE.email}`}
            className="font-mono text-xs text-fg-muted transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {SITE.email}
          </a>
          <a
            href={SITE.bookingUrl}
            target="_blank"
            rel="noopener"
            className="font-mono text-xs text-fg-muted transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {SITE.bookingLabel}
          </a>
          <span className="font-mono text-xs text-fg-faint">replies in 24h</span>
        </div>

        <div className="flex flex-col gap-[11px]">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">
            Studio
          </h2>
          <span className="font-mono text-xs text-fg-muted">
            Detroit, MI&nbsp;·&nbsp;U.S.
          </span>
          <span className="font-mono text-xs text-fg-muted">theanta.com</span>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-[1280px] px-[clamp(18px,4vw,56px)] py-[18px] font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
          © {new Date().getFullYear()} ANTA&nbsp;·&nbsp;Automating Next
          Time-less Architecture
        </div>
      </div>
    </footer>
  );
}
