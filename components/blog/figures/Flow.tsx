/**
 * A staged pipeline: numbered nodes, connected, left-to-right on wide
 * screens and top-to-bottom below `md`.
 *
 * This is the workhorse figure — most of what these posts describe is "data
 * enters here, four things happen to it, this comes out". Written as an
 * ordered list under the hood so that the reading order survives with CSS
 * off and a screen reader announces "1 of 5" rather than a pile of divs.
 *
 * CONNECTORS are drawn on the *leading* edge of each node except the first,
 * so adding or removing a step never leaves a dangling arrow — the geometry
 * is a property of the node, not of the gaps between them.
 *
 * `fallback` hangs a dashed branch off a node. It exists because the
 * interesting part of a guardrail diagram is not the happy path, it is what
 * the request does when the guard trips, and drawing that as a second full
 * flow implies the two paths are equals when one is an exception.
 */

export type FlowStep = {
  /** Short label, 1–3 words. */
  title: string;
  /** One clause. Not a sentence — the caption carries the prose. */
  detail?: string;
  /** Dashed exception branch off this node, e.g. "429 → static scope". */
  fallback?: string;
};

function Chevron({ vertical }: { vertical: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 8 8"
      className={`absolute h-2 w-2 fill-accent ${
        vertical
          ? "left-1/2 top-[-28px] -translate-x-1/2 rotate-90 md:hidden"
          : "left-[-28px] top-1/2 hidden -translate-y-1/2 md:block"
      }`}
    >
      <path d="M0 0 L8 4 L0 8 Z" />
    </svg>
  );
}

export function Flow({ steps }: { steps: FlowStep[] }) {
  return (
    /*
      TWO GRID ROWS, not one row of self-contained cells.
      
      The obvious construction — one cell per step, each holding its node box
      and its branch label — makes every column size itself, so a step whose
      branch label wraps to two lines gets a shorter box than its neighbours
      and the row of boxes ends ragged. Putting the boxes in row 1 and the
      branches in row 2 aligns both across the whole figure: `1fr` lets the
      box row absorb the slack, `auto` sizes the branch row to its tallest
      label.

      Below `md` the grid is off entirely and each <li> is a normal flex
      column, so the reading order is the DOM order either way. `md:contents`
      is what promotes each step's two children into the grid — which is also
      why the connector lives on the box rather than on the <li>: at `md` the
      <li> generates no box to position against.
    */
    <ol className="flex list-none flex-col gap-0 pl-0 md:grid md:grid-flow-col md:grid-rows-[1fr_auto] md:[grid-auto-columns:minmax(0,1fr)]">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className={`flex min-w-0 flex-col md:contents ${
            i === 0 ? "" : "pt-7"
          }`}
        >
          <div
            className={`relative flex-1 border border-line-2 bg-bg-deep p-[clamp(12px,1.5vw,16px)] ${
              i === 0 ? "" : "md:ml-7"
            }`}
          >
            {i > 0 ? (
              <>
                {/* Rule: vertical on mobile, horizontal from md. */}
                <span
                  aria-hidden
                  className="absolute left-1/2 top-[-28px] h-7 w-px -translate-x-1/2 bg-line md:left-[-28px] md:top-1/2 md:h-px md:w-7 md:translate-x-0"
                />
                <Chevron vertical />
                <Chevron vertical={false} />
              </>
            ) : null}

            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent-ink">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="mt-1.5 text-balance text-[14.5px] font-semibold leading-[1.25] text-ink">
              {step.title}
            </p>
            {step.detail ? (
              <p className="mt-1.5 break-words text-[12.5px] leading-[1.5] text-t-dim">
                {step.detail}
              </p>
            ) : null}
          </div>

          {/* Always rendered, even when empty: at `md` this is the cell that
              holds the branch row's alignment, and skipping it for a step
              with no fallback would let the next step's label slide into the
              gap under the wrong box. */}
          <div className={`relative ${i === 0 ? "" : "md:ml-7"}`}>
            {step.fallback ? (
              <div className="relative mt-3 pl-4">
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-full w-px border-l border-dashed border-line"
                />
                <span
                  aria-hidden
                  className="absolute left-0 top-[9px] h-px w-3 border-t border-dashed border-line"
                />
                <p className="hyphens-auto break-words pl-1 font-mono text-[10.5px] uppercase leading-[1.5] tracking-[0.1em] text-t-dimmer">
                  {step.fallback}
                </p>
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
