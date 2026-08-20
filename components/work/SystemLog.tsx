"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";
import { Reveal, SectionLabel } from "@/components/Reveal";
import {
  CASES,
  CASE_CATEGORIES,
  type CaseEntry,
  type CaseFilter,
} from "@/lib/work/cases";

/**
 * "02 / System log" — the case index from
 * design-reference/ANTA Work.dc.html: category filter chips with counts,
 * and rows that expand into architecture / sequence / stack / before-after.
 *
 * Client component because the filter and the open row drive each other and
 * the panel content lives outside the button that toggles it. The reference
 * animates the panel with a fixed `max-height`, which clips long rows — this
 * uses Framer Motion's `height: auto` instead, and collapses to an instant
 * toggle under prefers-reduced-motion.
 *
 * `Sales` intentionally has zero rows: the one Sales system, the Lead
 * Intelligence Agent, is the featured case above. Selecting it surfaces the
 * empty state, which is a deliberate part of the design.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export function SystemLog() {
  const [filter, setFilter] = useState<CaseFilter>("All");
  const [open, setOpen] = useState<string>("triage");
  const reduced = useReducedMotion();
  const panelIdBase = useId();

  const shown = CASES.filter((c) => filter === "All" || c.cat === filter);

  const note = shown.length
    ? `Filter shows ${shown.length} of ${CASES.length} scoped systems · the shipped case above makes ${CASES.length + 1}.`
    : "Nothing scoped under that filter yet — the pattern usually still applies. Send the two-paragraph version.";

  return (
    <section
      id="index"
      className="mx-auto max-w-[1280px] border-b border-border px-[clamp(18px,4vw,56px)] py-[clamp(64px,9vw,120px)]"
    >
      <Reveal className="mb-[clamp(28px,4vw,44px)] flex flex-wrap items-end justify-between gap-7">
        <div>
          <SectionLabel>02&nbsp;/&nbsp;System log</SectionLabel>
          <h2 className="max-w-[20ch] text-balance text-[clamp(30px,4.4vw,56px)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
            What gets built next.
          </h2>
        </div>
        <p className="max-w-[36ch] text-pretty text-[15px] leading-[1.7] text-fg-muted">
          Six systems already scoped — architecture, sequence and stack worked
          out. Filter by the team that owns the bottleneck. Open a row for the
          detail.
        </p>
      </Reveal>

      <Reveal className="mb-[clamp(22px,3vw,34px)] flex flex-wrap gap-2">
        {CASE_CATEGORIES.map((cat) => {
          const on = filter === cat;
          const count =
            cat === "All"
              ? CASES.length
              : CASES.filter((c) => c.cat === cat).length;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(cat)}
              className={`inline-flex items-baseline gap-2 border px-3.5 py-[9px] font-mono text-[11px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                on
                  ? "border-white bg-white text-bg"
                  : "border-border text-fg-muted hover:border-accent hover:text-white"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[9.5px] ${on ? "text-bg/60" : "text-fg-faint"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </Reveal>

      <Reveal className="border-t border-border">
        {shown.map((c) => (
          <LogRow
            key={c.key}
            entry={c}
            open={open === c.key}
            panelId={`${panelIdBase}-${c.key}`}
            reduced={!!reduced}
            onToggle={() => setOpen(open === c.key ? "" : c.key)}
          />
        ))}
      </Reveal>

      <Reveal className="mt-5 font-mono text-[10.5px] leading-[1.8] text-fg-faint">
        <p aria-live="polite">{note}</p>
      </Reveal>
    </section>
  );
}

function LogRow({
  entry: c,
  open,
  panelId,
  reduced,
  onToggle,
}: {
  entry: CaseEntry;
  open: boolean;
  panelId: string;
  reduced: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`border-b border-border transition-colors ${
        open ? "bg-bg-raised" : ""
      }`}
    >
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full flex-wrap items-baseline gap-x-5 gap-y-3 px-0.5 py-[clamp(18px,2.2vw,26px)] text-left transition-colors hover:bg-white/[0.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span
            className={`flex-[0_0_34px] font-mono text-[11px] tracking-[0.12em] ${
              open ? "text-accent-ink" : "text-fg-faint"
            }`}
          >
            {c.num}
          </span>
          <span className="flex min-w-0 flex-[1_1_260px] flex-col gap-[7px]">
            <span
              className={`text-[clamp(18px,2.1vw,24px)] font-semibold tracking-[-0.02em] transition-colors ${
                open ? "text-white" : "text-white/85"
              }`}
            >
              {c.title}
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-faint">
              {c.cat}&nbsp;·&nbsp;{c.stack.length} services
            </span>
          </span>
          <span
            className={`flex-[0_1_auto] font-mono text-[10.5px] uppercase tracking-[0.1em] ${
              open ? "text-accent-ink" : "text-fg-faint"
            }`}
          >
            {c.status}
          </span>
          <span
            aria-hidden
            className={`flex-[0_0_24px] text-right font-mono text-base leading-none transition-transform duration-300 ${
              open ? "rotate-45 text-accent-ink" : "text-fg-faint"
            }`}
          >
            +
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.6, ease: EASE },
              opacity: { duration: 0.45 },
            }}
            className="overflow-hidden"
          >
            <div className="mt-0.5 flex flex-wrap gap-[clamp(24px,4vw,56px)] border-t border-border px-0.5 pb-[clamp(28px,3.4vw,40px)] pt-1">
              <div className="min-w-0 flex-[1.5_1_380px] pt-[22px]">
                <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
                  What it does
                </h4>
                <p className="mb-5 max-w-[62ch] text-pretty text-[15px] leading-[1.7] text-fg-muted">
                  {c.summary}
                </p>
                <ol className="flex flex-col border-t border-border">
                  {c.mechanics.map((m) => (
                    <li
                      key={m.n}
                      className="flex gap-3.5 border-b border-border py-[11px] font-mono text-[11.5px] leading-[1.55]"
                    >
                      <span className="flex-[0_0_26px] text-accent-ink">{m.n}</span>
                      <span className="text-white/85">{m.t}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-[22px] pt-[22px]">
                <div>
                  <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
                    Stack
                  </h4>
                  <ul className="flex flex-wrap gap-1.5">
                    {c.stack.map((t) => (
                      <li
                        key={t}
                        className="border border-border px-2.5 py-[5px] font-mono text-[11px] text-fg-muted"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-border bg-white/[0.02]">
                  <div className="border-b border-border px-4 py-3.5">
                    <h4 className="mb-[7px] font-mono text-[9.5px] uppercase tracking-[0.14em] text-fg-faint">
                      Before
                    </h4>
                    <p className="text-[13.5px] leading-[1.6] text-fg-muted">
                      {c.before}
                    </p>
                  </div>
                  <div className="px-4 py-3.5">
                    <h4 className="mb-[7px] font-mono text-[9.5px] uppercase tracking-[0.14em] text-accent-ink">
                      After
                    </h4>
                    <p className="text-[13.5px] leading-[1.6] text-white">
                      {c.after}
                    </p>
                  </div>
                </div>

                <a
                  href="#contact"
                  className="self-start border-b border-current pb-[3px] font-mono text-[11px] tracking-[0.06em] text-accent-ink transition-colors hover:text-accent-hot focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Ask about this one&nbsp;→
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
