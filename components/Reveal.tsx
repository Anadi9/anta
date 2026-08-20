"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-triggered reveal used by every homepage section below the hero.
 * Mirrors the `data-reveal` IntersectionObserver behaviour in
 * design-reference/ANTA Site.dc.html (22px rise, .75s, once) but respects
 * prefers-reduced-motion — required site-wide, see BUILD_PLAN Phase 5.
 *
 * `initial` is deliberately NOT branched on `reduced`, and this component
 * must keep rendering a `motion.div` in both cases. It used to return a
 * plain `<div>` when reduced, which broke as follows: `useReducedMotion`
 * resolves false during SSR but true on the client's first render, so the
 * server emitted `style="opacity:0;transform:translateY(22px)"` and the
 * client rendered no style at all. React does not patch mismatched
 * attributes during hydration — it logs the mismatch and keeps the server's
 * — so the inline `opacity: 0` survived, and nothing was left to animate it
 * away. Every reduced-motion visitor got a blank page below the hero.
 *
 * Keeping `initial` unconditional makes the server and first client render
 * identical; only the props that never reach the HTML change, so the
 * reduced path simply snaps to the visible state at duration 0 instead of
 * waiting for the viewport.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      {...(reduced
        ? { animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
        : {
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "0px 0px -8% 0px" },
            transition: { duration: 0.75, delay, ease: [0.2, 0.7, 0.2, 1] },
          })}
    >
      {children}
    </motion.div>
  );
}

/** `01 / Scope it live` — the monospace section eyebrow used throughout. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-[18px] font-mono text-[11px] uppercase tracking-[0.18em] text-accent-ink">
      {children}
    </div>
  );
}
