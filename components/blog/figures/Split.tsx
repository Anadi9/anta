/**
 * Two-sided comparison. Deliberately not a <table>: the two sides are not
 * row-aligned facts about a shared axis, they're two independent arguments,
 * and forcing them into rows invites the false symmetry where every point on
 * the left must be answered by a point on the right.
 *
 * `verdict` is required. A comparison figure that doesn't say which side won
 * is a figure that makes the reader do the work the post was supposed to do.
 */

export type SplitSide = {
  title: string;
  /** Mono kicker above the title — usually the condition, e.g. "Buy when". */
  kicker: string;
  points: string[];
};

export function Split({
  left,
  right,
  verdict,
}: {
  left: SplitSide;
  right: SplitSide;
  verdict: string;
}) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-px bg-line-2 sm:grid-cols-2">
        {[left, right].map((side, i) => (
          <div
            key={side.title}
            className="bg-bg-deep p-[clamp(14px,1.8vw,20px)]"
          >
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
                i === 0 ? "text-accent-ink" : "text-t-dim"
              }`}
            >
              {side.kicker}
            </span>
            <p className="mt-2 text-[15.5px] font-semibold leading-[1.25] text-ink">
              {side.title}
            </p>
            <ul className="mt-3.5 flex list-none flex-col gap-2 pl-0">
              {side.points.map((point) => (
                <li
                  key={point}
                  className="relative pl-[1.15em] text-[13px] leading-[1.6] text-t2 before:absolute before:left-0 before:top-[0.62em] before:h-[4px] before:w-[4px] before:bg-line before:content-['']"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-px flex flex-wrap items-baseline gap-x-2.5 gap-y-1 border-t border-line-2 bg-bg-deep px-[clamp(14px,1.8vw,20px)] py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-t-dimmer">
        <span className="text-accent-ink">Verdict</span>
        <span className="normal-case tracking-[0.04em] text-t-bright">
          {verdict}
        </span>
      </p>
    </div>
  );
}
