"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal, SectionLabel } from "@/components/Reveal";
import { TOOLKITS } from "@/lib/home/toolkits";

/**
 * "02 / Industry toolkits" — a tab list on the left driving a detail panel
 * on the right. Real React state rather than CSS :hover, because the panel
 * lives outside the button's subtree.
 */
export function ToolkitsSection() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(TOOLKITS[0].key);
  const tool = TOOLKITS.find((t) => t.key === active) ?? TOOLKITS[0];

  return (
    <section
      id="tools"
      className="mx-auto max-w-[1280px] border-b border-border px-[clamp(18px,4vw,56px)] py-[clamp(64px,9vw,120px)]"
    >
      <Reveal className="mb-[clamp(32px,4.4vw,54px)] flex flex-wrap items-end justify-between gap-7">
        <div>
          <SectionLabel>02&nbsp;/&nbsp;Industry toolkits</SectionLabel>
          <h2 className="max-w-[22ch] text-balance text-[clamp(30px,4.4vw,56px)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
            Your stack stays. An AI layer sits on top.
          </h2>
        </div>
        <p className="max-w-[38ch] text-pretty text-[15px] leading-[1.7] text-fg-muted">
          We don&apos;t rip out what already works. Pick the team that is losing
          the week and see exactly what gets added.
        </p>
      </Reveal>

      <div className="flex flex-wrap items-stretch gap-0 lg:gap-7">
        <Reveal className="flex min-w-0 max-w-full flex-[1_1_280px] flex-col lg:max-w-[400px]">
          <div
            role="tablist"
            aria-label="Industry toolkits"
            className="flex flex-col border-t border-border"
          >
            {TOOLKITS.map((t) => {
              const on = t.key === active;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  id={`toolkit-tab-${t.key}`}
                  aria-selected={on}
                  aria-controls="toolkit-panel"
                  onClick={() => setActive(t.key)}
                  className={`flex w-full cursor-pointer items-baseline gap-[14px] border-0 border-b border-l-2 border-b-border py-[clamp(16px,2vw,22px)] pl-4 pr-1 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
                    on
                      ? "border-l-accent bg-white/[0.04]"
                      : "border-l-transparent bg-transparent hover:bg-white/[0.02]"
                  }`}
                >
                  <span
                    className={`font-mono text-[10.5px] tracking-[0.14em] ${
                      on ? "text-accent-ink" : "text-fg-faint"
                    }`}
                  >
                    {t.num}
                  </span>
                  <span
                    className={`text-[clamp(16px,1.7vw,19px)] font-semibold tracking-[-0.015em] transition-colors ${
                      on ? "text-white" : "text-fg-muted"
                    }`}
                  >
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="px-4 pt-[18px] font-mono text-[10.5px] leading-[1.8] text-fg-faint">
            Not on the list? The pattern usually still applies. Send the
            two-paragraph version.
          </p>
        </Reveal>

        <Reveal className="min-w-0 flex-[2_1_460px]" delay={0.08}>
          <div
            id="toolkit-panel"
            role="tabpanel"
            aria-labelledby={`toolkit-tab-${tool.key}`}
            className="border border-border bg-bg-raised lg:sticky lg:top-24"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tool.key}
                initial={reduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="border-b border-border px-[clamp(22px,3vw,36px)] pb-[clamp(18px,2.4vw,26px)] pt-[clamp(24px,3vw,36px)]">
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-accent-ink">
                    {tool.tag}
                  </div>
                  <h3 className="max-w-[26ch] text-[clamp(20px,2.4vw,28px)] font-semibold leading-[1.2] tracking-[-0.02em] text-white">
                    {tool.title}
                  </h3>
                  <p className="mt-3.5 max-w-[52ch] text-pretty text-[14.5px] leading-[1.7] text-fg-muted">
                    {tool.body}
                  </p>
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
                  <div className="border-r border-border px-[clamp(22px,3vw,36px)] py-[clamp(20px,2.4vw,28px)]">
                    <div className="mb-3.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-fg-faint">
                      Stays: your stack
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tool.existing.map((e) => (
                        <span
                          key={e}
                          className="border border-border px-[9px] py-[5px] font-mono text-[11px] text-fg-muted"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/[0.03] px-[clamp(22px,3vw,36px)] py-[clamp(20px,2.4vw,28px)]">
                    <div className="mb-3.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-accent-ink">
                      Added: the AI layer
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tool.layer.map((l) => (
                        <span
                          key={l}
                          className="border border-accent px-[9px] py-[5px] font-mono text-[11px] text-white"
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col border-t border-border">
                  {tool.changes.map((c) => (
                    <div
                      key={c.k}
                      className="flex flex-wrap gap-x-[18px] gap-y-1.5 border-b border-border px-[clamp(22px,3vw,36px)] py-3.5"
                    >
                      <span
                        className={`flex-[0_0_68px] pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                          c.k === "After" ? "text-accent-ink" : "text-fg-faint"
                        }`}
                      >
                        {c.k}
                      </span>
                      <span className="flex-[1_1_240px] text-sm leading-[1.6] text-fg-muted">
                        {c.v}
                      </span>
                    </div>
                  ))}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-[clamp(22px,3vw,36px)] py-4 font-mono text-[11px] text-fg-faint">
                    <span>{tool.window}</span>
                    <a
                      href="#scope"
                      className="border-b border-current pb-0.5 text-accent-ink transition-colors hover:text-accent-hot focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      Scope this one&nbsp;→
                    </a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
