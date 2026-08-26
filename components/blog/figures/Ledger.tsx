/**
 * An itemised breakdown with proportional bars — where money, time or
 * tokens actually went.
 *
 * The bar widths are computed from `share`, which the author states, rather
 * than derived from parsing `value`. Values in these posts are ranges and
 * mixed units ("$600–900", "~40%", "2 days"), and a component that tries to
 * parse them will one day silently render a 0-width bar because someone
 * typed an en-dash. Stating the share is honest about it being an
 * approximation anyway.
 *
 * Shares are not asserted to total 100. Several of these breakdowns
 * deliberately don't — an "and the rest is contingency" line is a real
 * answer, and rounding a set of ranges to exactly 100 would be fiction.
 */

export type LedgerItem = {
  label: string;
  /** Displayed verbatim, right-aligned. Any unit. */
  value: string;
  /** 0–100. Bar width only — see the note above. */
  share: number;
  note?: string;
};

export function Ledger({
  items,
  total,
}: {
  items: LedgerItem[];
  /** Optional summed row, shown on a rule below the items. */
  total?: { label: string; value: string };
}) {
  return (
    <div className="flex flex-col gap-3.5">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-[13.5px] font-medium leading-[1.4] text-ink">
              {item.label}
            </span>
            <span className="shrink-0 font-mono text-[12.5px] text-t-bright">
              {item.value}
            </span>
          </div>

          <div
            aria-hidden
            className="mt-1.5 h-[6px] w-full bg-surface-2"
          >
            <div
              className="h-full bg-accent/70"
              style={{ width: `${Math.max(0, Math.min(100, item.share))}%` }}
            />
          </div>

          {item.note ? (
            <p className="mt-1.5 text-[12px] leading-[1.5] text-t-dim">
              {item.note}
            </p>
          ) : null}
        </div>
      ))}

      {total ? (
        <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-line pt-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-t-dim">
            {total.label}
          </span>
          <span className="font-mono text-[13px] text-accent-ink">
            {total.value}
          </span>
        </div>
      ) : null}
    </div>
  );
}
