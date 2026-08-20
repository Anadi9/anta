/**
 * Page-wide ambient layer — the fixed decorative texture that wraps every
 * page in the design-reference exports (ANTA Site.dc.html lines 63–64): a
 * 118° hairline grain over the whole viewport, masked so it fades out by
 * ~78% of the way down. Viewport-anchored rather than page-anchored, so it
 * stays put while content scrolls.
 *
 * The reference pairs it with a soft accent bloom bleeding in from the
 * top-right. That's dropped site-wide — the corner radial-gradient glow is
 * the stock look of every generated dark landing page, and the texture plus
 * the real scene art carry the ambience without it.
 *
 * Sits at z-0 and is purely decorative. Page content is lifted to z-10 in
 * app/layout.tsx (the reference does the same with `main { z-index: 1 }`),
 * so opaque sections — the dark Scope and Team blocks — correctly occlude
 * the texture, and it only shows through where the ground is the page bg.
 */
export function PageAmbience() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundImage:
          "repeating-linear-gradient(118deg, var(--tex) 0 1px, transparent 1px 13px)",
        maskImage:
          "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.35) 42%, transparent 78%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.35) 42%, transparent 78%)",
      }}
    />
  );
}
