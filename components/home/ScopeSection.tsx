"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal, SectionLabel } from "@/components/Reveal";
import { streamScope } from "@/lib/scope/client";
import {
  PRESETS,
  SCOPES,
  THINKING_LINES,
  resolveScopeKey,
  scopeMailHref,
  type ScopeKey,
  type ScopeResult,
} from "@/lib/scope/static-scopes";

type Phase = "idle" | "thinking" | "result";

const NOTES = [
  "scoped from 40+ shipped systems",
  "an estimate, not a quote",
  "the scope is yours to take anywhere",
];

/**
 * "Scope it live" — the AI Solution Engineer panel.
 *
 * Two paths, one UI. A chip or a free-text submit POSTs to /api/scope, which
 * streams a real Claude-generated scope back (BUILD_PLAN Phase 6, data flow in
 * ARCHITECTURE.md §3). Meanwhile the hand-written scope in
 * lib/scope/static-scopes.ts is resolved by keyword as a floor: if the API is
 * unconfigured, rate-limited, slow, or down, the panel still answers with a
 * real architecture instead of an error. The visitor can't tell which path ran,
 * which is the point — this widget is the site's proof of work, and it is never
 * allowed to look broken.
 *
 * The terminal feed advances on whichever arrives first: the stream's status
 * events, or the local staged timer. Keeping the timer means the feed never
 * stalls on a slow first token, and the live result simply cuts it short.
 */
export function ScopeSection() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [key, setKey] = useState<ScopeKey>("leads");
  const [live, setLive] = useState<ScopeResult | null>(null);
  const [asked, setAsked] = useState("");
  const [shown, setShown] = useState(0);
  const [query, setQuery] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inflight = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      inflight.current?.abort();
    },
    [],
  );

  const run = useCallback(
    (nextKey: ScopeKey, prompt: string) => {
      if (timer.current) clearTimeout(timer.current);
      inflight.current?.abort();

      setKey(nextKey);
      setLive(null);
      setAsked(prompt);
      setShown(0);
      setPhase("thinking");

      const controller = new AbortController();
      inflight.current = controller;

      void streamScope(prompt, {
        signal: controller.signal,
        // Server progress outranks the local timer, but never rewinds it.
        onStatus: (step) =>
          setShown((s) => Math.max(s, Math.min(step, THINKING_LINES.length))),
      }).then((outcome) => {
        if (controller.signal.aborted) return;
        if (timer.current) clearTimeout(timer.current);
        if (outcome.ok) setLive(outcome.scope);
        setPhase("result");
      });

      // Reduced motion: no staged feed. The result still swaps in when the
      // stream lands; until then the static scope is already on screen.
      if (reduced) {
        setPhase("result");
        return;
      }

      let i = 0;
      const step = () => {
        i += 1;
        if (i > THINKING_LINES.length) {
          // Timer ran out first — show the static scope now. If the live one
          // arrives later it replaces the copy in place.
          setPhase("result");
          return;
        }
        setShown((s) => Math.max(s, i));
        timer.current = setTimeout(step, i === THINKING_LINES.length ? 460 : 330);
      };
      timer.current = setTimeout(step, 240);
    },
    [reduced],
  );

  const submit = () => {
    const q = query.trim();
    if (!q) return;
    run(resolveScopeKey(q), q);
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    inflight.current?.abort();
    setPhase("idle");
    setQuery("");
    setAsked("");
    setLive(null);
    setShown(0);
  };

  const result = live ?? SCOPES[key];
  const status =
    phase === "idle" ? "ready" : phase === "thinking" ? "scoping…" : "draft scope";
  const meta = phase === "result" ? "estimate · not a quote" : "answers in seconds";

  return (
    <section
      id="scope"
      className="relative overflow-hidden border-b border-border bg-[#0A0A0B]"
    >
      {/* Vertical rule texture + accent bloom, masked top and bottom. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,#000_34%,#000_66%,transparent)]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(245,244,241,0.055) 0 1px, transparent 1px 104px)",
        }}
      />
      <div className="relative mx-auto flex max-w-[1280px] flex-wrap items-start gap-9 px-[clamp(18px,4vw,56px)] py-[clamp(64px,9vw,120px)] lg:gap-20">
        <Reveal className="min-w-0 flex-[1_1_340px]">
          <SectionLabel>01&nbsp;/&nbsp;Scope it live</SectionLabel>
          <h2 className="max-w-[19ch] text-balance text-[clamp(30px,4.2vw,52px)] font-bold leading-[1.03] tracking-[-0.03em] text-white">
            Get the architecture before you get the invoice.
          </h2>
          <p className="mt-5 max-w-[46ch] text-pretty text-[15px] leading-[1.75] text-fg-muted">
            Tell the engineer where your week is going. It answers with what we
            would put in a written spec — the system, the sequence, the stack.
            No email gate, no discovery questionnaire.
          </p>
          <ul className="mt-[clamp(26px,3.4vw,38px)] flex flex-col gap-[11px] font-mono text-[11px] tracking-[0.05em] text-fg-faint">
            {NOTES.map((note) => (
              <li key={note} className="flex gap-3">
                <span aria-hidden className="text-accent-ink">
                  —
                </span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="min-w-0 flex-[1_1_480px]" delay={0.08}>
          <div className="relative flex min-h-[392px] flex-col border border-border bg-bg-raised shadow-[0_40px_80px_-50px_rgba(0,0,0,0.9)]">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-[13px] font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-faint">
              <span className="flex items-center gap-[9px] text-white">
                <motion.span
                  aria-hidden
                  className="size-[7px] bg-accent"
                  animate={reduced ? undefined : { opacity: [1, 0.35, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
                AI Solution Engineer
              </span>
              <span aria-live="polite">{status}</span>
            </div>

            <div className="flex flex-1 flex-col px-5 pb-6 pt-[22px]">
              <AnimatePresence mode="wait" initial={false}>
                {phase === "idle" && (
                  <motion.div
                    key="idle"
                    className="flex flex-col gap-[18px]"
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-[16.5px] leading-[1.5] tracking-[-0.01em] text-white">
                      Where is your team losing the week?
                    </p>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2">
                      {PRESETS.map((preset) => (
                        <button
                          key={preset.key}
                          type="button"
                          onClick={() => run(preset.key, preset.label)}
                          className="cursor-pointer border border-white/[0.14] bg-white/[0.04] px-[13px] py-3 text-left font-mono text-[11.5px] leading-[1.45] text-fg-muted transition-colors hover:border-accent hover:bg-white/[0.07] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-stretch gap-2">
                      <label htmlFor="scope-input" className="sr-only">
                        Describe where your team is losing the week
                      </label>
                      <input
                        id="scope-input"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submit();
                        }}
                        placeholder="…or describe it in your own words"
                        className="min-w-0 flex-1 border border-white/[0.14] bg-[#0A0A0B] p-[13px] font-mono text-xs text-white outline-none transition-colors placeholder:text-fg-faint focus:border-accent"
                      />
                      <button
                        type="button"
                        onClick={submit}
                        className="shrink-0 cursor-pointer border border-accent-deep bg-accent-deep px-[18px] font-mono text-[11.5px] font-bold uppercase tracking-[0.08em] text-white transition-shadow hover:shadow-[0_0_26px_rgba(236,26,99,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        Scope
                      </button>
                    </div>
                    <p className="font-mono text-[10.5px] leading-[1.7] text-fg-faint">
                      Returns a real architecture, timeline and stack. No email,
                      no form.
                    </p>
                  </motion.div>
                )}

                {phase === "thinking" && (
                  <motion.div
                    key="thinking"
                    className="flex flex-col gap-[14px] font-mono text-xs leading-[1.8]"
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex gap-[10px] text-white">
                      <span className="text-fg-faint">›</span>
                      <span>{asked}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {THINKING_LINES.slice(0, shown).map((line, i) => (
                        <div
                          key={line}
                          className={`flex gap-[10px] ${
                            i < shown - 1 ? "text-fg-faint" : "text-white"
                          }`}
                        >
                          <span className="text-fg-faint">
                            {i < shown - 1 ? "✓" : "›"}
                          </span>
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                    <motion.span
                      aria-hidden
                      className="inline-block h-[15px] w-2 bg-accent"
                      animate={reduced ? undefined : { opacity: [1, 1, 0, 0] }}
                      transition={{ duration: 1.05, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
                    />
                  </motion.div>
                )}

                {phase === "result" && (
                  <motion.div
                    key="result"
                    className="flex flex-1 flex-col gap-4"
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex gap-[10px] font-mono text-[11px] leading-[1.6] text-fg-faint">
                      <span>›</span>
                      <span>{asked}</span>
                    </div>
                    <div>
                      <div className="mb-[9px] font-mono text-[10px] uppercase tracking-[0.16em] text-accent-ink">
                        Proposed system
                      </div>
                      <h3 className="text-[clamp(20px,2.1vw,26px)] font-semibold leading-[1.15] tracking-[-0.02em] text-white">
                        {result.name}
                      </h3>
                    </div>
                    <p className="text-pretty text-sm leading-[1.7] text-fg-muted">
                      {result.verdict}
                    </p>
                    <div className="flex flex-col border-t border-border">
                      {result.steps.map((step) => (
                        <div
                          key={step.day}
                          className="flex gap-[14px] border-b border-border py-[11px] font-mono text-[11.5px] leading-[1.5]"
                        >
                          <span className="flex-[0_0_62px] text-accent-ink">
                            {step.day}
                          </span>
                          <span className="text-fg-muted">{step.text}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.stack.map((tech) => (
                        <span
                          key={tech}
                          className="border border-border px-2 py-[5px] font-mono text-[10.5px] text-fg-muted"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
                      <a
                        href="https://cal.com/anta/intro"
                        target="_blank"
                        rel="noopener"
                        className="flex items-center justify-center gap-[10px] border border-accent-deep bg-accent-deep px-5 py-[14px] font-mono text-xs font-bold uppercase tracking-[0.06em] text-white transition-shadow hover:shadow-[0_0_26px_rgba(236,26,99,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        Get this scoped <span aria-hidden>→</span>
                      </a>
                      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[11px]">
                        <a
                          href={scopeMailHref(asked, result)}
                          className="border-b border-current pb-0.5 tracking-[0.04em] text-fg-faint transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                          or email this scope&nbsp;→
                        </a>
                        <button
                          type="button"
                          onClick={reset}
                          className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.08em] text-fg-faint transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                          Scope another&nbsp;↺
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
            <span>anta&nbsp;·&nbsp;solution&nbsp;engineer&nbsp;v2</span>
            <span>{meta}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
