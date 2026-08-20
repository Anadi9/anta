import { Reveal, SectionLabel } from "@/components/Reveal";
import {
  FEATURED,
  GENERATED_DRAFT,
  SCORED_ACCOUNTS,
  SEQUENCE,
  type ScoredAccount,
} from "@/lib/work/cases";

/**
 * "01 / Featured case" — the Lead Intelligence Agent, rendered as the
 * product surface itself (scoring table + generated draft + sequence)
 * rather than as a screenshot. Layout and copy from
 * design-reference/ANTA Work.dc.html.
 *
 * Static, so this stays a server component; the only client work on this
 * page is the filter/accordion in SystemLog.
 */

const TONE: Record<
  ScoredAccount["tone"],
  { name: string; bar: string; score: string; stage: string }
> = {
  hot: {
    name: "text-white",
    bar: "bg-accent",
    score: "text-accent-ink",
    stage: "text-accent-ink",
  },
  warm: {
    name: "text-white",
    bar: "bg-white/40",
    score: "text-fg-muted",
    stage: "text-fg-muted",
  },
  cold: {
    name: "text-fg-faint",
    bar: "bg-white/15",
    score: "text-fg-faint",
    stage: "text-fg-faint",
  },
};

const ROW_GRID = "grid grid-cols-[1fr_92px_74px] gap-3";

export function FeaturedCase() {
  return (
    <section className="mx-auto max-w-[1280px] border-b border-border px-[clamp(18px,4vw,56px)] py-[clamp(64px,9vw,120px)]">
      <Reveal className="mb-[clamp(32px,5vw,56px)] flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionLabel>01&nbsp;/&nbsp;Featured case</SectionLabel>
          <h2 className="max-w-[20ch] text-[clamp(30px,4.4vw,56px)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
            {FEATURED.title}
          </h2>
        </div>
        <div className="text-right font-mono text-[11px] uppercase tracking-[0.1em] text-fg-faint">
          <div>shipped&nbsp;·&nbsp;v1.4</div>
          <div className="mt-1.5">internal&nbsp;+&nbsp;client&nbsp;deploys</div>
        </div>
      </Reveal>

      <Reveal>
        <div className="border border-border bg-bg-raised">
          {/* terminal chrome bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-[18px] py-3.5 font-mono text-[11px] text-fg-faint">
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="h-[7px] w-[7px] bg-accent motion-safe:animate-[anta-breathe_2s_ease-in-out_infinite]"
              />
              <span className="tracking-[0.08em] text-white">
                {FEATURED.processId}
              </span>
            </span>
            <span className="tracking-[0.1em]">
              run&nbsp;#2,417&nbsp;·&nbsp;312&nbsp;accounts&nbsp;scored&nbsp;·&nbsp;41s
            </span>
          </div>

          <div className="flex flex-wrap">
            {/* scored accounts table */}
            <div className="min-w-0 flex-[1.5_1_400px] border-border lg:border-r">
              <div
                className={`${ROW_GRID} border-b border-border px-[18px] py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint`}
              >
                <span>Account&nbsp;/&nbsp;signal</span>
                <span>Fit score</span>
                <span className="text-right">Stage</span>
              </div>

              {SCORED_ACCOUNTS.map((a) => {
                const tone = TONE[a.tone];
                return (
                  <div
                    key={a.name}
                    className={`${ROW_GRID} items-center border-b border-border/60 px-[18px] py-[15px] transition-colors last:border-b-0 hover:bg-white/[0.03]`}
                  >
                    <div className="min-w-0">
                      <div className={`text-sm font-medium ${tone.name}`}>
                        {a.name}
                      </div>
                      <div className="mt-[5px] font-mono text-[10.5px] text-fg-faint">
                        {a.signal}
                      </div>
                    </div>
                    <div>
                      <div
                        className="h-1 bg-white/10"
                        role="img"
                        aria-label={`Fit score ${a.score} of 100`}
                      >
                        <div
                          className={`h-1 ${tone.bar}`}
                          style={{ width: `${a.score}%` }}
                        />
                      </div>
                      <div
                        className={`mt-[7px] font-mono text-[10.5px] ${tone.score}`}
                        aria-hidden
                      >
                        {a.score}
                      </div>
                    </div>
                    <div
                      className={`text-right font-mono text-[10px] tracking-[0.08em] ${tone.stage}`}
                    >
                      {a.stage}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* generated draft + sequence */}
            <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-4 border-t border-border p-[18px] lg:border-t-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
                Generated draft&nbsp;·&nbsp;{GENERATED_DRAFT.account}
              </div>
              <div className="border border-border bg-white/[0.02] p-[15px]">
                <div className="mb-3 font-mono text-[10.5px] text-fg-faint">
                  {GENERATED_DRAFT.subject}
                </div>
                <p className="text-[13.5px] leading-[1.65] text-fg-muted">
                  {GENERATED_DRAFT.body}
                </p>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {GENERATED_DRAFT.tags.map((t) => (
                    <span
                      key={t}
                      className="border border-border px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.08em] text-fg-faint"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
                Sequence
              </div>
              <ol className="flex flex-col gap-[9px] font-mono text-[11.5px]">
                {SEQUENCE.map((s) => (
                  <li
                    key={s.step}
                    className={`flex justify-between ${
                      s.active ? "text-accent-ink" : "text-fg-faint"
                    }`}
                  >
                    <span className="whitespace-pre">{s.step}</span>
                    <span>{s.when}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-auto flex justify-between border-t border-border pt-3.5 font-mono text-[11px]">
                <span className="text-fg-faint">reply rate</span>
                <span className="text-accent-ink">{FEATURED.replyRate}</span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-[clamp(28px,4vw,44px)] flex flex-wrap gap-[clamp(24px,4vw,56px)]">
        <div className="flex-[1.4_1_340px]">
          <h3 className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg-faint">
            What it does
          </h3>
          <p className="max-w-[62ch] text-pretty text-[15.5px] leading-[1.7] text-fg-muted">
            {FEATURED.whatItDoes}
          </p>
        </div>
        <div className="flex-[1_1_260px]">
          <h3 className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg-faint">
            Stack used
          </h3>
          <ul className="flex flex-wrap gap-2">
            {FEATURED.stack.map((t) => (
              <li
                key={t}
                className="border border-border px-2.5 py-1.5 font-mono text-[11px] text-white"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
