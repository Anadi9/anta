/**
 * A stacked architecture diagram — the bands read top-down, which is how
 * these systems get described in conversation ("the route sits on top of a
 * provider interface, under that there are two adapters").
 *
 * `spans` renders a band as sub-cells rather than one block. That's the case
 * worth drawing: one contract with two interchangeable implementations under
 * it is the whole point of a provider abstraction, and a diagram that shows
 * it as a single grey box has drawn nothing.
 */

export type Layer = {
  name: string;
  detail?: string;
  /** Parallel implementations sitting at this level. */
  spans?: string[];
  /** Draw with the accent border — the layer the post is actually about. */
  focus?: boolean;
};

export function Layers({ layers }: { layers: Layer[] }) {
  return (
    <div className="flex flex-col gap-2">
      {layers.map((layer) => (
        <div
          key={layer.name}
          className={`border bg-bg-deep p-[clamp(12px,1.5vw,16px)] ${
            layer.focus ? "border-accent/45" : "border-line-2"
          }`}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="text-[14px] font-semibold leading-[1.3] text-ink">
              {layer.name}
            </span>
            {layer.detail ? (
              <span className="font-mono text-[11px] text-t-dim">
                {layer.detail}
              </span>
            ) : null}
          </div>

          {layer.spans ? (
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {layer.spans.map((span) => (
                <span
                  key={span}
                  className="border border-line-2 bg-surface/50 px-3 py-2 font-mono text-[11.5px] leading-[1.4] text-t2"
                >
                  {span}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
