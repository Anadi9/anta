import type { ReactNode } from "react";

/**
 * A margin note promoted into the flow — the aside that would otherwise
 * become a parenthetical three lines long.
 *
 * Only three kinds, on purpose. A callout system with eight colours ends up
 * decorative: the reader stops reading the label and starts reading the hue,
 * and every one of these posts has the same three asides — a thing that is
 * true but easy to miss, a thing that will cost you money, and a limit of
 * what's being claimed.
 */

const KINDS = {
  note: { label: "Note", accent: "border-l-line" },
  cost: { label: "Cost", accent: "border-l-accent" },
  limit: { label: "Limit", accent: "border-l-t9" },
} as const;

export function Note({
  kind = "note",
  title,
  children,
}: {
  kind?: keyof typeof KINDS;
  title?: string;
  children: ReactNode;
}) {
  const { label, accent } = KINDS[kind];

  return (
    <aside
      className={`mt-[clamp(24px,2.8vw,34px)] max-w-[68ch] border-l-2 ${accent} bg-surface/40 py-3.5 pl-[clamp(14px,1.8vw,20px)] pr-4`}
    >
      <p className="flex flex-wrap items-baseline gap-x-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-t-dim">
        <span className={kind === "cost" ? "text-accent-ink" : undefined}>
          {label}
        </span>
        {title ? (
          <span className="normal-case tracking-[0.04em] text-t-bright">
            {title}
          </span>
        ) : null}
      </p>
      {/* The MDX <p> mapping supplies the top margin on the first child, so
          the padding above is set to look right with it, not without it. */}
      <div className="[&>p:first-child]:mt-1.5 [&>p]:max-w-none [&>p]:text-[14px]">
        {children}
      </div>
    </aside>
  );
}
