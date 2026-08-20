"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import {
  FLOWS,
  FLOW_STEPS,
  NODE_TAGS,
  SURFACE,
  edgeGeom,
  type FlowNode,
} from "@/lib/build/workflows";

/**
 * "02 / How it runs" — the workflow explorer from
 * design-reference/ANTA Build.dc.html. A rail of five workflows on the left,
 * the selected one drawn as a node graph on the right. A trace advances one
 * column every 1.5s, lighting nodes and drawing edges as it goes; when it
 * reaches the end it moves to the next workflow.
 *
 * Client component for three reasons, all of them state that has to cross
 * component boundaries: the selected workflow (rail → diagram), the trace
 * step (timer → nodes, edges, rail progress bar and the step counter in the
 * header), and the active node (a node → its tool popover, plus the z-index
 * of its own wrapper).
 *
 * Two deliberate departures from the reference:
 *
 *  - Nodes are `<button>`s, not hover-only `<div>`s. The reference reveals a
 *    node's tool stack on `mouseenter` alone, which is unreachable by
 *    keyboard and on touch. Focus and click reveal it here too.
 *  - Under prefers-reduced-motion the trace doesn't run: every flow renders
 *    in its completed state (all nodes lit, all edges drawn) and the rail
 *    becomes a plain selector. Required site-wide, see BUILD_PLAN Phase 5.
 */

const TICK_MS = 1500;

/** Tool popovers flip above the card for nodes low on the surface, which
 *  would otherwise be clipped by the diagram's horizontal scroll container. */
const FLIP_BELOW_Y = 60;

export function WorkflowExplorer() {
  const reduced = useReducedMotion();
  const [flowIndex, setFlowIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const flow = FLOWS[flowIndex];
  // Reduced motion renders the finished state rather than freezing at step 0.
  const trace = reduced ? FLOW_STEPS : step;

  // One timeout per tick rather than an interval, so advancing the flow
  // stays out of the `setStep` updater — updaters run twice under StrictMode
  // and would skip a workflow every wrap-around.
  useEffect(() => {
    if (reduced || paused) return;
    const t = setTimeout(() => {
      if (step < FLOW_STEPS) {
        setStep(step + 1);
      } else {
        setFlowIndex((flowIndex + 1) % FLOWS.length);
        setStep(0);
      }
    }, TICK_MS);
    return () => clearTimeout(t);
  }, [reduced, paused, step, flowIndex]);

  const select = (i: number) => {
    setFlowIndex(i);
    setStep(0);
  };

  const byId = new Map<string, FlowNode>(flow.nodes.map((n) => [n.id, n]));

  return (
    <section
      id="flows"
      className="relative overflow-hidden border-b border-border bg-bg-raised"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.45] [background-image:radial-gradient(rgba(245,244,241,0.10)_1px,transparent_1px)] [background-size:28px_28px]"
      />

      <div className="relative mx-auto max-w-[1320px] px-[clamp(18px,4vw,56px)] py-[clamp(56px,7vw,100px)]">
        <Reveal className="mb-[clamp(28px,4vw,46px)] flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-accent-hot">
              02&nbsp;/&nbsp;How it runs
            </div>
            <h2 className="max-w-[20ch] text-balance text-[clamp(26px,3.6vw,42px)] font-bold leading-[1.08] tracking-[-0.025em] text-white">
              Five systems, drawn as they execute.
            </h2>
          </div>
          <p className="max-w-[34ch] text-pretty text-sm leading-[1.7] text-fg-muted">
            {reduced
              ? "Pick a workflow to see what it runs on."
              : "Hover any step to see what it runs on."}
          </p>
        </Reveal>

        <Reveal>
          <div
            className="flex flex-wrap border border-border bg-white/[0.015]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* ------------------------------------------------ rail */}
            <div className="min-w-[216px] flex-[0_1_264px] border-border max-lg:basis-full lg:border-r">
              <div className="flex justify-between gap-2 border-b border-border px-4 py-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">
                <span>Workflows</span>
                <span className="text-white/25">
                  {String(FLOWS.length).padStart(2, "0")}
                </span>
              </div>

              {FLOWS.map((f, i) => {
                const active = i === flowIndex;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => select(i)}
                    aria-current={active ? "true" : undefined}
                    className={`relative block w-full border-b border-l-2 border-b-border px-4 pb-3.5 pt-[15px] text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
                      active
                        ? "border-l-accent-hot bg-accent-hot/[0.06]"
                        : "border-l-transparent hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="flex items-baseline gap-2.5">
                      <span
                        className={`w-4 flex-none font-mono text-[9.5px] tracking-[0.12em] ${
                          active ? "text-accent-hot" : "text-fg-faint"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`text-[13px] font-semibold tracking-[-0.01em] transition-colors ${
                          active ? "text-white" : "text-fg-muted"
                        }`}
                      >
                        {f.name}
                      </span>
                    </span>
                    <span className="mt-1.5 block pl-[26px] font-mono text-[10px] tracking-[0.04em] text-fg-faint">
                      {f.stat}
                    </span>
                    <span
                      aria-hidden
                      className="absolute bottom-[-1px] left-0 h-px bg-accent-hot transition-[width] duration-500"
                      style={{
                        width: active
                          ? `${(Math.min(trace, FLOW_STEPS) / FLOW_STEPS) * 100}%`
                          : 0,
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {/* --------------------------------------------- diagram */}
            <div className="flex min-w-0 flex-[1_1_560px] flex-col">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-[18px] py-3.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-faint">
                <span>{flow.trigger}</span>
                <span
                  className={
                    trace >= FLOW_STEPS ? "text-accent-hot" : "text-fg-faint"
                  }
                >
                  {trace >= FLOW_STEPS
                    ? "Run complete"
                    : `Step ${trace + 1} / ${FLOW_STEPS}`}
                </span>
              </div>

              <div
                className="overflow-x-auto px-4 py-3.5"
                role="group"
                aria-label={`${flow.name} workflow diagram`}
              >
                <div
                  className="relative w-full min-w-[900px]"
                  style={{ aspectRatio: `${SURFACE.w} / ${SURFACE.h}` }}
                >
                  {/* edges */}
                  <svg
                    aria-hidden
                    viewBox={`0 0 ${SURFACE.w} ${SURFACE.h}`}
                    className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible"
                  >
                    {flow.edges.map((e) => {
                      const a = byId.get(e.from);
                      const b = byId.get(e.to);
                      if (!a || !b) return null;
                      const g = edgeGeom(a, b, e.route);
                      const on = trace >= (e.activateAt ?? b.col);
                      return (
                        <g key={`${e.from}-${e.to}-${e.label ?? ""}`}>
                          <path
                            d={g.d}
                            fill="none"
                            stroke="rgba(245,244,241,0.15)"
                            strokeWidth={1}
                          />
                          <path
                            d={g.arrow}
                            fill="none"
                            stroke="rgba(245,244,241,0.15)"
                            strokeWidth={1}
                          />
                          <path
                            d={g.d}
                            fill="none"
                            stroke="var(--color-accent-hot)"
                            strokeWidth={1.6}
                            strokeDasharray={g.length}
                            strokeDashoffset={on ? 0 : g.length}
                            style={{
                              transition: reduced
                                ? undefined
                                : "stroke-dashoffset .65s ease",
                              filter:
                                "drop-shadow(0 0 5px rgba(255,61,129,0.5))",
                            }}
                          />
                          <path
                            d={g.arrow}
                            fill="none"
                            stroke="var(--color-accent-hot)"
                            strokeWidth={1.6}
                            opacity={on ? 1 : 0}
                            style={{
                              transition: reduced
                                ? undefined
                                : "opacity .3s ease .4s",
                            }}
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* edge labels — HTML, so they stay upright and legible */}
                  {flow.edges.map((e) => {
                    if (!e.label) return null;
                    const a = byId.get(e.from);
                    const b = byId.get(e.to);
                    if (!a || !b) return null;
                    const g = edgeGeom(a, b, e.route);
                    const on = trace >= (e.activateAt ?? b.col);
                    return (
                      <div
                        key={`label-${e.from}-${e.to}-${e.label}`}
                        aria-hidden
                        className={`pointer-events-none absolute z-[3] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border bg-bg-raised px-1.5 py-[3px] font-mono text-[9.5px] uppercase tracking-[0.1em] transition-colors duration-300 ${
                          on
                            ? "border-accent-hot/45 text-accent-hot"
                            : "border-border text-fg-faint"
                        }`}
                        style={{ left: `${g.labelX}%`, top: `${g.labelY}%` }}
                      >
                        {e.label}
                      </div>
                    );
                  })}

                  {/* nodes */}
                  {flow.nodes.map((n) => (
                    <FlowNodeCard
                      key={n.id}
                      node={n}
                      live={trace === n.col}
                      done={trace > n.col}
                      open={activeNode === n.id}
                      onOpen={() => setActiveNode(n.id)}
                      onClose={() => setActiveNode(null)}
                      onToggle={() =>
                        setActiveNode((c) => (c === n.id ? null : n.id))
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-[18px] gap-y-2 border-t border-border px-[18px] py-[13px] font-mono text-[9.5px] uppercase tracking-[0.14em] text-fg-faint">
                <span className="flex items-center gap-[7px]">
                  <span
                    aria-hidden
                    className="h-2 w-2 border-l-2 border-white/45 bg-white/10"
                  />
                  Trigger
                </span>
                <span className="flex items-center gap-[7px]">
                  <span aria-hidden className="h-2 w-2 bg-white/[0.14]" />
                  Step
                </span>
                <span className="flex items-center gap-[7px]">
                  <span
                    aria-hidden
                    className="h-2 w-2 border-l-2 border-accent-hot bg-accent-hot/20"
                  />
                  Gate
                </span>
                <span className="text-white/25 sm:ml-auto">
                  Select a step for its tools
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FlowNodeCard({
  node,
  live,
  done,
  open,
  onOpen,
  onClose,
  onToggle,
}: {
  node: FlowNode;
  live: boolean;
  done: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}) {
  const border = live
    ? "var(--color-accent-hot)"
    : done
      ? "rgba(247,246,243,0.30)"
      : "rgba(247,246,243,0.13)";

  const leadEdge =
    node.kind === "gate"
      ? live || done
        ? "var(--color-accent-hot)"
        : "rgba(255,61,129,0.45)"
      : node.kind === "trigger"
        ? "rgba(245,244,241,0.45)"
        : border;

  const flip = node.y > FLIP_BELOW_Y;

  return (
    <div
      className="absolute w-[15%] min-w-[132px] -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${node.x}%`, top: `${node.y}%`, zIndex: open ? 7 : 2 }}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        type="button"
        onClick={onToggle}
        onFocus={onOpen}
        onBlur={onClose}
        aria-expanded={open}
        className="relative block w-full px-3 pb-[13px] pt-[11px] text-left transition-[border-color,box-shadow,background,opacity,transform] duration-[450ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        style={{
          background: live ? "#17121a" : "#131417",
          border: `1px solid ${border}`,
          borderLeft: `2px solid ${leadEdge}`,
          opacity: live || done ? 1 : 0.6,
          boxShadow: live
            ? "0 0 0 1px var(--color-accent-hot), 0 16px 44px -20px rgba(255,61,129,0.9)"
            : "none",
          transform: live ? "translateY(-2px)" : undefined,
        }}
      >
        <span
          className={`block font-mono text-[9px] uppercase tracking-[0.16em] transition-colors duration-[450ms] ${
            live ? "text-accent-hot" : "text-fg-faint"
          }`}
        >
          {NODE_TAGS[node.kind]}
        </span>
        <span className="mt-2 block text-[13.5px] font-semibold leading-[1.25] tracking-[-0.012em] text-white">
          {node.label}
        </span>
        <span className="mt-1.5 block text-pretty text-[11px] leading-[1.5] text-fg-muted">
          {node.desc}
        </span>
      </button>

      {open && (
        <div
          className={`absolute left-1/2 z-[6] flex -translate-x-1/2 gap-[5px] whitespace-nowrap border border-accent-hot/50 bg-bg-raised p-1.5 ${
            flip ? "bottom-[calc(100%+9px)]" : "top-[calc(100%+9px)]"
          }`}
        >
          {node.tools.map((t) => (
            <span
              key={t}
              className="border border-accent-hot/30 px-1.5 py-[3px] font-mono text-[9.5px] tracking-[0.05em] text-accent-hot"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
