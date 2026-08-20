import { Reveal, SectionLabel } from "@/components/Reveal";
import type { Card } from "@/lib/build/workflows";

/**
 * The numbered bordered-card grid used twice on the Build page — "01 / What
 * we build" and "03 / Process" — from design-reference/ANTA Build.dc.html.
 * Identical markup in the reference apart from the eyebrow, heading and
 * minimum column width, so it ships as one component rather than two.
 */
export function CardGrid({
  id,
  label,
  heading,
  intro,
  cards,
  minColumn = 280,
  headingWidth = "22ch",
  className = "",
}: {
  id: string;
  label: string;
  heading: string;
  /** Lead paragraph under the heading — only the About page's grid has one. */
  intro?: string;
  cards: Card[];
  /** Reference uses 280px for the four systems, 220px for the three steps. */
  minColumn?: number;
  headingWidth?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-[1280px] border-b border-border px-[clamp(18px,4vw,56px)] py-[clamp(64px,9vw,120px)] ${className}`}
    >
      <Reveal className="mb-[clamp(36px,5vw,60px)]">
        <SectionLabel>{label}</SectionLabel>
        <h2
          className="text-balance text-[clamp(30px,4.4vw,56px)] font-bold leading-[1.02] tracking-[-0.03em] text-white"
          style={{ maxWidth: headingWidth }}
        >
          {heading}
        </h2>
        {intro && (
          <p className="mt-[22px] max-w-[62ch] text-pretty text-[clamp(15px,1.5vw,18px)] leading-[1.7] text-fg-muted">
            {intro}
          </p>
        )}
      </Reveal>

      <div
        className="grid border-l border-t border-border"
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${minColumn}px, 1fr))`,
        }}
      >
        {cards.map((c) => (
          <Reveal
            key={c.num}
            className="border-b border-r border-border p-[clamp(24px,3vw,36px)] transition-colors hover:bg-white/[0.03]"
          >
            <div className="mb-[26px] font-mono text-[11px] tracking-[0.14em] text-accent-ink">
              {c.num}
            </div>
            <h3 className="mb-3.5 text-[clamp(19px,1.9vw,23px)] font-semibold leading-[1.2] tracking-[-0.015em] text-white">
              {c.title}
            </h3>
            <p className="text-pretty text-[14.5px] leading-[1.65] text-fg-muted">
              {c.body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
