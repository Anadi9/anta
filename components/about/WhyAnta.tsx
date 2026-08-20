import { Reveal, SectionLabel } from "@/components/Reveal";
import { PROCESS } from "@/lib/about/content";

/**
 * "03 / Why ANTA" — design-reference/ANTA About.dc.html, "Why us" screen.
 *
 * Five steps on one underlined row, big accent numerals. Deliberately not
 * components/CardGrid.tsx: the reference draws these as columns sharing a
 * single baseline rule with no vertical dividers, which is a different
 * object from the bordered card grid used for "How we help" — and it's the
 * page's visual argument for "one process, no handoffs".
 */
export function WhyAnta() {
  return (
    <section
      id="why-us"
      className="relative overflow-hidden border-b border-border bg-bg px-[clamp(18px,4vw,56px)] py-[clamp(64px,9vw,120px)]"
    >
      <div className="relative mx-auto max-w-[1280px]">
        <SectionLabel>03&nbsp;/&nbsp;Why&nbsp;ANTA</SectionLabel>
        <h2 className="mb-[clamp(44px,6vw,72px)] max-w-[20ch] text-balance text-[clamp(30px,4.4vw,56px)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
          One process. No handoffs. No delay.
        </h2>

        <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
          {PROCESS.map((step) => (
            <div key={step.num} className="border-b border-line pb-5 pr-5">
              <div className="mb-2.5 font-mono text-[30px] font-bold leading-none text-accent-ink">
                {step.num}
              </div>
              <h3 className="mb-1.5 text-base font-semibold text-white">
                {step.title}
              </h3>
              <p className="text-pretty text-[13px] leading-[1.6] text-fg-muted">
                {step.body}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
