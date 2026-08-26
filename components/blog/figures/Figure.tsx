import type { ReactNode } from "react";

/**
 * The frame every in-article diagram sits in.
 *
 * One wrapper rather than each diagram drawing its own chrome: the label
 * strip, the panel border, the caption and — importantly — the escape from
 * the 68ch prose measure are identical for all of them, and a diagram that
 * invents its own version of that is how a figure ends up 4px out of
 * alignment with the one above it.
 *
 * MEASURE. mdx-components.tsx caps paragraphs at 68ch on the elements
 * themselves, not on a wrapper, precisely so figures can be wider. `wide`
 * takes the full prose column (~74ch on lg); the default holds the same
 * 68ch the paragraphs do, which is right for anything with fewer than about
 * four columns of content.
 *
 * NUMBERING is an explicit `n` prop, not a counter. Auto-numbering would
 * need either a client-side context provider (turning every static article
 * into a hydrated one for the sake of a label) or a CSS counter that the
 * caption's `aria` text can't read. Typing the number is cheaper than both,
 * and MDX authors are already numbering the figures in their heads.
 *
 * The `id` makes a figure linkable — the rail's TOC doesn't list them, but
 * an outreach email pointing at one specific diagram is a real use.
 */
export function Figure({
  n,
  id,
  label,
  caption,
  wide = false,
  children,
}: {
  /** Figure number, shown as "Fig. 03". Unique within a post. */
  n: number;
  /** Anchor id. Defaults to `fig-<n>`. */
  id?: string;
  /** Mono strip beside the number — what the diagram *is*. */
  label: string;
  /**
   * The sentence below the panel. Say what the reader should take from the
   * diagram, not what the diagram contains — the diagram already contains it.
   */
  caption: ReactNode;
  /** Break out to the full prose column instead of holding the 68ch measure. */
  wide?: boolean;
  children: ReactNode;
}) {
  const anchor = id ?? `fig-${n}`;

  return (
    <figure
      id={anchor}
      className={`mt-[clamp(30px,3.6vw,48px)] scroll-mt-[88px] ${
        wide ? "max-w-full" : "max-w-[68ch]"
      }`}
    >
      <div className="flex items-baseline gap-3 border-b border-line-2 pb-2 font-mono text-[10.5px] uppercase tracking-[0.16em]">
        <span className="text-accent-ink">
          Fig.&nbsp;{String(n).padStart(2, "0")}
        </span>
        <span className="text-t-dim">{label}</span>
      </div>

      {/* `figure-plate` (app/globals.css) flips the palette tokens inside
          the panel, so every diagram body paints itself light against the
          dark page — the strip above and the caption below stay on the page
          ground with the prose. */}
      <div className="figure-plate overflow-x-auto border border-line-2 border-t-0 bg-surface p-[clamp(16px,2.4vw,28px)]">
        {children}
      </div>

      <figcaption className="mt-2.5 max-w-[62ch] text-[13.5px] leading-[1.6] text-t-dim">
        {caption}
      </figcaption>
    </figure>
  );
}
