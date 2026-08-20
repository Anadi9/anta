"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal, SectionLabel } from "@/components/Reveal";
import { SITE } from "@/lib/seo/site";
import { streamScope } from "@/lib/scope/client";
import {
  HOLD_LINES,
  PRESETS,
  SCOPES,
  THINKING_LINES,
  resolveScopeKey,
  scopeMailHref,
  type ScopeKey,
  type ScopeResult,
} from "@/lib/scope/static-scopes";

type Phase = "idle" | "thinking" | "result";

/**
 * How long the terminal holds after its last line before giving up on the
 * live scope and revealing the static one.
 *
 * This is a ceiling, not a delay: the stream resolving — with a scope OR with
 * an error — cancels the hold immediately, so a fast failure still falls back
 * fast and the grace costs nothing in the common case. It only elapses when a
 * generation is genuinely slow, and its real job is bounding a request that
 * hangs (the route's maxDuration is 60s, which is far too long to stare at a
 * cursor). Tune against observed p90 latency for the configured provider.
 */
const RESULT_GRACE_MS = 9000;

/**
 * How long each HOLD_LINES phrase sits before the next one replaces it.
 *
 * The hold would otherwise be a frozen terminal, which reads as a hang rather
 * than as work in progress. Slow enough to be readable rather than a flicker;
 * fast enough that two or three land inside a typical hold.
 */
const HOLD_CYCLE_MS = 2200;

/**
 * Pacing of the staged terminal feed: delay before the first line, then
 * between lines, then a longer beat after the last one.
 *
 * Deliberately close to the 900ms heartbeat in app/api/scope/route.ts. The
 * feed is a claim about work happening on the server, and when the local timer
 * runs faster than that heartbeat the claim is visibly false — four steps
 * "complete" inside 1.7s while the model has barely started, which reads as a
 * progress bar with nothing behind it. Matching the server's cadence means
 * whichever source advances the feed, it advances at the same rate.
 */
const FEED_LEAD_MS = 400;
const FEED_LINE_MS = 700;
const FEED_LAST_MS = 900;

/**
 * Optional context the visitor can attach before scoping.
 *
 * Chips rather than fields, and skippable: the contact section a screen below
 * promises "not a calendar link and a discovery questionnaire", so anything
 * that gates the answer behind a form would contradict the pitch in the same
 * scroll. Two taps sharpen the scope; zero taps still gets one.
 */
const SIZE_BANDS = ["1–10", "11–50", "50+"];

/** The tools this ICP actually runs — see ANTA_ICP_Doc.md, not a generic list. */
const TOOL_CHIPS = [
  "HubSpot",
  "Salesforce",
  "Slack",
  "Notion",
  "Airtable",
  "QuickBooks",
  "Zendesk",
  "Intercom",
];

/**
 * Mirrors the caps in app/api/scope/route.ts (MAX_TOOLS / MAX_TOOL_LEN).
 *
 * The route silently drops anything past them, so enforcing the same numbers
 * here means a visitor who types their own stack sees it refused in the UI
 * rather than accepted and then quietly missing from the scope.
 */
const MAX_TOOLS = 8;
const MAX_TOOL_LEN = 32;

/**
 * One-tap corrections offered under a finished scope.
 *
 * Phrased as the visitor's objection, not as a setting, because that's what a
 * real scoping call sounds like — someone says "we're smaller than that" and
 * the engineer re-cuts it. Each one re-runs the generation with the scope on
 * screen as context.
 */
const REFINEMENTS = [
  "We're smaller than that",
  "Cut it to one week",
  "We can't add new tools",
  "Go deeper on the hard part",
];

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
 *
 * Crucially the panel reveals a scope exactly once. The feed is ~1.7s of
 * copy while a live generation takes several seconds, so flipping to the
 * static scope the moment the feed ends meant the visitor watched the answer
 * rewrite itself mid-read — a different name, a different stack — which reads
 * as a broken widget, not a thorough one. So when the feed runs out the panel
 * holds on the terminal (all lines checked, cursor still blinking, which is
 * honest: it IS still working) and reveals only when the stream resolves.
 * RESULT_GRACE_MS caps that hold.
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
  // Set once the grace window expires and the static scope is committed to
  // screen. A live scope arriving after that is dropped rather than swapped
  // in: past this point the visitor is already reading, and replacing the
  // answer under them is the exact failure this hold exists to prevent.
  const settled = useRef(false);
  // -1 = not holding. Otherwise an ever-incrementing counter indexed into
  // HOLD_LINES modulo its length, so the phrases loop for as long as the
  // generation runs.
  const [hold, setHold] = useState(-1);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  // Context chips (idle state).
  const [size, setSize] = useState<string | null>(null);
  const [tools, setTools] = useState<string[]>([]);
  // Tools the visitor typed in themselves, in addition to TOOL_CHIPS. Kept
  // separate so they can be removed from the row entirely (a preset chip only
  // toggles off) — a mistyped tool would otherwise sit there for good.
  const [customTools, setCustomTools] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [toolDraft, setToolDraft] = useState("");
  const toolInput = useRef<HTMLInputElement | null>(null);
  // Which step is expanded, by index. Only one at a time — the panel is a
  // fixed-height terminal and two open details push the CTA below the fold.
  const [openStep, setOpenStep] = useState<number | null>(null);
  // Free-text correction under a finished scope.
  const [refineText, setRefineText] = useState("");
  // How many times this scope has been re-cut. Shown in the status line so a
  // visitor can see the panel is responding to them, not re-rolling.
  const [passes, setPasses] = useState(0);

  const stopHold = useCallback(() => {
    if (holdTimer.current) clearInterval(holdTimer.current);
    holdTimer.current = null;
    setHold(-1);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (holdTimer.current) clearInterval(holdTimer.current);
      inflight.current?.abort();
    },
    [],
  );

  const run = useCallback(
    (
      nextKey: ScopeKey,
      prompt: string,
      // Present on a re-cut: carries the scope currently on screen plus the
      // correction, so the model revises rather than starts over.
      refine?: {
        previous: { name: string; verdict: string; stack: string[] };
        instruction: string;
      },
    ) => {
      if (timer.current) clearTimeout(timer.current);
      stopHold();
      inflight.current?.abort();

      settled.current = false;
      setKey(nextKey);
      // A re-cut keeps the previous scope on screen until the new one lands —
      // blanking it would make a refinement feel like starting over, and the
      // visitor loses the thing they were reacting to.
      if (!refine) setLive(null);
      setAsked(prompt);
      setOpenStep(null);
      setShown(0);
      setPhase("thinking");

      const controller = new AbortController();
      inflight.current = controller;

      void streamScope(prompt, {
        signal: controller.signal,
        context:
          size || tools.length
            ? { size: size ?? undefined, tools: tools.length ? tools : undefined }
            : undefined,
        refine,
        // Server progress outranks the local timer, but never rewinds it.
        onStatus: (step) =>
          setShown((s) => Math.max(s, Math.min(step, THINKING_LINES.length))),
      }).then((outcome) => {
        if (controller.signal.aborted) return;
        if (timer.current) clearTimeout(timer.current);
        stopHold();
        if (outcome.ok && !settled.current) setLive(outcome.scope);
        settled.current = true;
        setPhase("result");
      });

      // Reduced motion: no staged feed, but the same one-reveal rule. Holding
      // here shows a static terminal (the query and a non-blinking cursor)
      // rather than animating — the point is to avoid the rewrite, not to add
      // motion back.
      if (reduced) {
        timer.current = setTimeout(() => {
          settled.current = true;
          setPhase("result");
        }, RESULT_GRACE_MS);
        return;
      }

      let i = 0;
      const step = () => {
        i += 1;
        if (i > THINKING_LINES.length) {
          // Feed exhausted, stream still open. Hold the terminal — every line
          // checked, cursor blinking — and give the live scope RESULT_GRACE_MS
          // to land so the reveal happens once. Only on expiry does the static
          // scope commit.
          setHold(0);
          holdTimer.current = setInterval(
            () => setHold((h) => h + 1),
            HOLD_CYCLE_MS,
          );
          timer.current = setTimeout(() => {
            settled.current = true;
            stopHold();
            setPhase("result");
          }, RESULT_GRACE_MS);
          return;
        }
        setShown((s) => Math.max(s, i));
        timer.current = setTimeout(
          step,
          i === THINKING_LINES.length ? FEED_LAST_MS : FEED_LINE_MS,
        );
      };
      timer.current = setTimeout(step, FEED_LEAD_MS);
    },
    [reduced, size, stopHold, tools],
  );

  const submit = () => {
    const q = query.trim();
    if (!q) return;
    run(resolveScopeKey(q), q);
  };

  const toggleTool = (tool: string) =>
    setTools((current) =>
      current.includes(tool)
        ? current.filter((t) => t !== tool)
        : current.length >= MAX_TOOLS
          ? current
          : [...current, tool],
    );

  /**
   * Commit whatever is in the custom-tool input.
   *
   * Comma-separated so a visitor can paste their stack in one go, and matched
   * case-insensitively against what's already on screen so typing "hubspot"
   * selects the existing chip instead of adding a duplicate one next to it.
   */
  const addTools = () => {
    const parts = toolDraft
      .split(",")
      .map((t) => t.replace(/\s+/g, " ").trim().slice(0, MAX_TOOL_LEN))
      .filter(Boolean);
    setToolDraft("");
    if (!parts.length) return;

    const known = [...TOOL_CHIPS, ...customTools];
    const selected = [...tools];
    const added: string[] = [];

    for (const part of parts) {
      // Reuse the existing chip's casing when it's already a known tool, so
      // the row never shows the same tool twice under two spellings.
      const label = known.find((k) => k.toLowerCase() === part.toLowerCase()) ?? part;
      if (selected.some((t) => t.toLowerCase() === label.toLowerCase())) continue;
      if (selected.length >= MAX_TOOLS) break;
      selected.push(label);
      if (!known.includes(label)) {
        known.push(label);
        added.push(label);
      }
    }

    setTools(selected);
    if (added.length) setCustomTools((current) => [...current, ...added]);
  };

  /** Drop a typed-in tool from the row entirely — presets only toggle off. */
  const removeCustomTool = (tool: string) => {
    setCustomTools((current) => current.filter((t) => t !== tool));
    setTools((current) => current.filter((t) => t !== tool));
  };

  /**
   * Re-cut the scope on screen. `asked` is unchanged — the bottleneck didn't
   * change, the read on it did — so the terminal still shows what they
   * originally described.
   */
  const refineWith = (instruction: string) => {
    const text = instruction.trim();
    if (!text || phase !== "result") return;
    setPasses((n) => n + 1);
    setRefineText("");
    run(key, asked, {
      previous: {
        name: result.name,
        verdict: result.verdict,
        stack: result.stack,
      },
      instruction: text,
    });
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    stopHold();
    inflight.current?.abort();
    settled.current = false;
    setPhase("idle");
    setQuery("");
    setAsked("");
    setLive(null);
    setShown(0);
    setOpenStep(null);
    setRefineText("");
    setPasses(0);
  };

  const result = live ?? SCOPES[key];
  const status =
    phase === "idle"
      ? "ready"
      : phase === "thinking"
        ? passes > 0
          ? "re-cutting…"
          : "scoping…"
        : passes > 0
          ? `draft scope · pass ${passes + 1}`
          : "draft scope";
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
                    <div className="flex flex-col gap-2 border-y border-border py-3">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
                          team
                        </span>
                        {SIZE_BANDS.map((band) => (
                          <button
                            key={band}
                            type="button"
                            aria-pressed={size === band}
                            onClick={() => setSize((c) => (c === band ? null : band))}
                            className={`cursor-pointer border px-2 py-[3px] font-mono text-[10.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                              size === band
                                ? "border-accent bg-accent/[0.12] text-white"
                                : "border-white/[0.14] text-fg-faint hover:border-white/30 hover:text-white"
                            }`}
                          >
                            {band}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
                          stack
                        </span>
                        {TOOL_CHIPS.map((tool) => {
                          const on = tools.includes(tool);
                          return (
                            <button
                              key={tool}
                              type="button"
                              aria-pressed={on}
                              onClick={() => toggleTool(tool)}
                              className={`cursor-pointer border px-2 py-[3px] font-mono text-[10.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                                on
                                  ? "border-accent bg-accent/[0.12] text-white"
                                  : "border-white/[0.14] text-fg-faint hover:border-white/30 hover:text-white"
                              }`}
                            >
                              {tool}
                            </button>
                          );
                        })}
                        {customTools.map((tool) => {
                          const on = tools.includes(tool);
                          return (
                            <span
                              key={tool}
                              className={`flex items-center border font-mono text-[10.5px] transition-colors ${
                                on
                                  ? "border-accent bg-accent/[0.12] text-white"
                                  : "border-white/[0.14] text-fg-faint hover:border-white/30"
                              }`}
                            >
                              <button
                                type="button"
                                aria-pressed={on}
                                onClick={() => toggleTool(tool)}
                                className="cursor-pointer py-[3px] pl-2 pr-1 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                              >
                                {tool}
                              </button>
                              <button
                                type="button"
                                aria-label={`Remove ${tool}`}
                                onClick={() => removeCustomTool(tool)}
                                className="cursor-pointer py-[3px] pl-1 pr-[6px] text-fg-faint transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                        {adding ? (
                          <>
                            <label htmlFor="scope-tool-input" className="sr-only">
                              Add a tool your team runs
                            </label>
                            <input
                              id="scope-tool-input"
                              ref={toolInput}
                              type="text"
                              value={toolDraft}
                              maxLength={MAX_TOOL_LEN}
                              autoComplete="off"
                              onChange={(e) => setToolDraft(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === ",") {
                                  e.preventDefault();
                                  addTools();
                                } else if (e.key === "Escape") {
                                  setToolDraft("");
                                  setAdding(false);
                                } else if (e.key === "Backspace" && !toolDraft && customTools.length) {
                                  removeCustomTool(customTools[customTools.length - 1]);
                                }
                              }}
                              // Blur commits rather than discards: a visitor who
                              // types a tool and clicks straight on Scope should
                              // get that tool in the scope, not lose it.
                              onBlur={() => {
                                addTools();
                                setAdding(false);
                              }}
                              placeholder="tool name"
                              className="w-[104px] border border-accent bg-[#0A0A0B] px-2 py-[3px] font-mono text-[10.5px] text-white outline-none placeholder:text-fg-faint"
                            />
                          </>
                        ) : (
                          <button
                            type="button"
                            disabled={tools.length >= MAX_TOOLS}
                            onClick={() => {
                              setAdding(true);
                              // The input mounts this tick; focus on the next.
                              requestAnimationFrame(() => toolInput.current?.focus());
                            }}
                            className="cursor-pointer border border-dashed border-white/[0.22] px-2 py-[3px] font-mono text-[10.5px] text-fg-faint transition-colors hover:border-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:border-white/[0.1] disabled:text-fg-faint/50 disabled:hover:border-white/[0.1] disabled:hover:text-fg-faint/50"
                          >
                            {tools.length >= MAX_TOOLS ? `${MAX_TOOLS} max` : "+ add yours"}
                          </button>
                        )}
                      </div>
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
                      no form. The chips are optional — they just sharpen it.
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
                      {THINKING_LINES.slice(0, shown).map((line, i) => {
                        // While holding, every staged line is done — the
                        // unfinished step is the cycling one below.
                        const done = hold >= 0 || i < shown - 1;
                        return (
                          <div
                            key={line}
                            className={`flex gap-[10px] ${
                              done ? "text-fg-faint" : "text-white"
                            }`}
                          >
                            <span className="text-fg-faint">
                              {done ? "✓" : "›"}
                            </span>
                            <span>{line}</span>
                          </div>
                        );
                      })}
                      {hold >= 0 && (
                        <div className="flex gap-[10px] text-white">
                          <span className="text-fg-faint">›</span>
                          {/* Keyed on the phrase so each swap remounts and
                              crossfades rather than snapping. */}
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                              key={hold % HOLD_LINES.length}
                              initial={reduced ? false : { opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={reduced ? undefined : { opacity: 0 }}
                              transition={{ duration: 0.22 }}
                            >
                              {HOLD_LINES[hold % HOLD_LINES.length]}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                      )}
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
                    {result.issue && (
                      <div className="border-l-2 border-accent/40 pl-3">
                        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">
                          I read this as
                        </div>
                        <p className="text-pretty text-[13px] leading-[1.6] text-fg-muted">
                          {result.issue}
                        </p>
                      </div>
                    )}
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
                      {result.steps.map((step, i) => {
                        const open = openStep === i;
                        // Only steps carrying detail are interactive: a static
                        // fallback scope renders the same rows, minus the
                        // affordance, rather than an expander that opens onto
                        // nothing.
                        const Row = step.detail ? "button" : "div";
                        return (
                          <div key={step.day} className="border-b border-border">
                            <Row
                              {...(step.detail
                                ? {
                                    type: "button" as const,
                                    onClick: () => setOpenStep(open ? null : i),
                                    "aria-expanded": open,
                                  }
                                : {})}
                              className={`flex w-full gap-[14px] py-[11px] text-left font-mono text-[11.5px] leading-[1.5] ${
                                step.detail
                                  ? "cursor-pointer transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                  : ""
                              }`}
                            >
                              <span className="flex-[0_0_62px] text-accent-ink">
                                {step.day}
                              </span>
                              <span className="flex-1 text-fg-muted">{step.text}</span>
                              {step.detail && (
                                <span
                                  aria-hidden
                                  className={`shrink-0 text-fg-faint transition-transform ${
                                    open ? "rotate-90" : ""
                                  }`}
                                >
                                  ›
                                </span>
                              )}
                            </Row>
                            <AnimatePresence initial={false}>
                              {open && step.detail && (
                                <motion.div
                                  key="detail"
                                  initial={reduced ? false : { height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                                  transition={{ duration: 0.22 }}
                                  className="overflow-hidden"
                                >
                                  <p className="pb-[11px] pl-[76px] text-pretty text-[12px] leading-[1.65] text-fg-faint">
                                    {step.detail}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                    <div>
                      <div className="mb-[7px] font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">
                        What I&apos;d need from you
                      </div>
                      <ul className="flex flex-col gap-[5px]">
                        {result.needs.map((need) => (
                          <li
                            key={need}
                            className="flex gap-[10px] font-mono text-[11px] leading-[1.55] text-fg-muted"
                          >
                            <span aria-hidden className="text-accent-ink">
                              —
                            </span>
                            <span>{need}</span>
                          </li>
                        ))}
                      </ul>
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
                      {/* Re-cut the scope. Sits above the CTA deliberately:
                          someone who disagrees with the scope should find the
                          fix before they find the "book a call" button. */}
                      <div className="flex flex-col gap-2">
                        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">
                          Not quite right?
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {REFINEMENTS.map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => refineWith(r)}
                              className="cursor-pointer border border-white/[0.14] px-2 py-[4px] font-mono text-[10.5px] text-fg-faint transition-colors hover:border-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-stretch gap-2">
                          <label htmlFor="scope-refine" className="sr-only">
                            Correct the scope in your own words
                          </label>
                          <input
                            id="scope-refine"
                            type="text"
                            value={refineText}
                            onChange={(e) => setRefineText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") refineWith(refineText);
                            }}
                            placeholder="…or tell me what I got wrong"
                            className="min-w-0 flex-1 border border-white/[0.14] bg-[#0A0A0B] px-[11px] py-[9px] font-mono text-[11px] text-white outline-none transition-colors placeholder:text-fg-faint focus:border-accent"
                          />
                          <button
                            type="button"
                            onClick={() => refineWith(refineText)}
                            className="shrink-0 cursor-pointer border border-white/[0.14] px-3 font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg-muted transition-colors hover:border-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                          >
                            Re-cut
                          </button>
                        </div>
                      </div>
                      <a
                        href={SITE.bookingUrl}
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
