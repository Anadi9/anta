"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Fixed 64px nav, built against the header in
 * design-reference/ANTA Site.dc.html (lines 67–110).
 *
 * Departures from the reference, both deliberate:
 *  - No theme toggle. The reference is light-default with a dark switch; we
 *    ship dark-only, so there's nothing to toggle.
 *  - The reference swaps the CTA label to "Contact" on mid-width screens
 *    (`navCta`). Same idea here, done with CSS rather than a resize listener.
 *
 * The reference marks the current page by leaving its nav link at full ink
 * while the others sit muted; that's reproduced here off `usePathname`, with
 * `aria-current="page"` so it isn't colour-only.
 */

const LINKS = [
  { href: "/work", label: "Work", index: "01" },
  { href: "/build", label: "Build", index: "02" },
  { href: "/about", label: "About", index: "05" },
];

export function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  // Scroll progress bar pinned to the nav's bottom edge (`setNavBarRef` in
  // the reference). rAF-throttled so the scroll handler stays passive-cheap.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Don't leave a stale open menu behind if the viewport widens past the
  // breakpoint where the hamburger disappears.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const close = () => setMenuOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-line backdrop-blur-[14px]"
      style={{ backgroundColor: "var(--nav-bg)" }}
    >
      <nav className="relative mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-5 px-[clamp(18px,4vw,56px)]">
        <Link href="/" className="flex shrink-0 items-center gap-[11px]">
          <Image
            src="/anta-mark.png"
            alt=""
            width={26}
            height={26}
            priority
            className="block h-[26px] w-auto"
          />
          <span className="text-[19px] font-bold leading-none tracking-[0.16em] text-ink">
            ANTA
          </span>
          <span className="hidden whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-t5 lg:inline">
            ai&nbsp;dev&nbsp;studio
          </span>
        </Link>

        <div className="flex min-w-0 items-center gap-[clamp(14px,2.4vw,34px)] font-mono text-[11.5px] uppercase tracking-[0.09em]">
          <div className="hidden items-center gap-[clamp(14px,2.4vw,34px)] md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className={`whitespace-nowrap py-1.5 transition-colors hover:text-ink ${
                  pathname === l.href
                    ? "text-ink underline decoration-accent decoration-2 underline-offset-[7px]"
                    : "text-t2"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 cursor-pointer flex-col justify-center gap-1 border border-line px-3 transition-colors hover:border-accent md:hidden"
          >
            <span
              aria-hidden
              className="block h-[1.5px] w-full bg-ink transition-transform duration-[250ms]"
              style={{ transform: menuOpen ? "translateY(5.5px) rotate(45deg)" : "none" }}
            />
            <span
              aria-hidden
              className="block h-[1.5px] w-full bg-ink transition-opacity duration-200"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              aria-hidden
              className="block h-[1.5px] w-full bg-ink transition-transform duration-[250ms]"
              style={{ transform: menuOpen ? "translateY(-5.5px) rotate(-45deg)" : "none" }}
            />
          </button>

          <Link
            href="/#contact"
            className="hidden whitespace-nowrap bg-accent-deep px-4 py-[9px] font-bold tracking-[0.06em] text-[#FBFAF8] transition-shadow duration-[250ms] hover:shadow-[0_0_0_1px_var(--color-accent),0_0_28px_rgba(236,26,99,0.28)] md:inline-block"
          >
            <span className="hidden lg:inline">Start a conversation</span>
            <span className="lg:hidden">Contact</span>
          </Link>
        </div>

        <div
          aria-hidden
          className="absolute bottom-[-1px] left-0 h-0.5 bg-accent"
          style={{ width: `${progress * 100}%` }}
        />
      </nav>

      {menuOpen && (
        <div
          className="flex max-h-[calc(100svh-64px)] flex-col overflow-y-auto border-t border-line-3 px-[clamp(18px,4vw,56px)] pb-5 pt-1.5 md:hidden"
          style={{ backgroundColor: "var(--nav-bg-dense)" }}
        >
          {LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              aria-current={pathname === l.href ? "page" : undefined}
              className={`flex min-h-[52px] items-center gap-3.5 font-mono text-sm uppercase tracking-[0.06em] text-ink ${
                i < LINKS.length - 1 ? "border-b border-line-3" : ""
              }`}
            >
              <span
                className={`text-[10px] tracking-[0.14em] ${
                  pathname === l.href ? "text-accent-ink" : "text-t6"
                }`}
              >
                {l.index}
              </span>
              {l.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-3 flex min-h-[52px] items-center justify-between gap-3.5 bg-accent-deep px-[18px] font-mono text-[13px] font-bold uppercase tracking-[0.06em] text-[#FBFAF8]"
          >
            Start a conversation
            <span className="text-[15px]">→</span>
          </Link>
        </div>
      )}
    </header>
  );
}
