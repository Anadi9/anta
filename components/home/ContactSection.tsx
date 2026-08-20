import { Reveal, SectionLabel } from "@/components/Reveal";
import { SITE } from "@/lib/seo/site";

/**
 * Contact block — copy verbatim from design-reference/ANTA Site.dc.html.
 * Identical on every page; only the section number in the eyebrow changes
 * (it's "03 / Contact" on ANTA Work.dc.html), so that's a prop.
 */
export function ContactSection({ label = "Contact" }: { label?: string }) {
  return (
    <section
      id="contact"
      className="relative mx-auto max-w-[1280px] px-[clamp(18px,4vw,56px)] py-[clamp(72px,10vw,140px)]"
    >
      <Reveal className="flex flex-wrap items-end justify-between gap-8 lg:gap-[clamp(32px,5vw,72px)]">
        <div className="min-w-0 flex-[1_1_460px]">
          <SectionLabel>{label}</SectionLabel>
          <h2 className="mb-[22px] max-w-[16ch] text-balance text-[clamp(34px,5.6vw,76px)] font-bold leading-[0.98] tracking-[-0.035em] text-white">
            You already know what to build.
          </h2>
          <p className="max-w-[48ch] text-pretty text-[clamp(16px,1.6vw,19px)] leading-[1.6] text-fg-muted">
            Send the two-paragraph version. You&apos;ll get a real technical
            response, not a calendar link and a discovery questionnaire.
          </p>
        </div>

        <div className="min-w-0 flex-[1_1_320px]">
          <a
            href={`mailto:${SITE.email}?subject=${encodeURIComponent("ANTA — project inquiry")}`}
            className="block border border-border p-[clamp(24px,3vw,34px)] transition-colors hover:border-accent hover:bg-white/[0.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <div className="mb-3.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-faint">
              Direct&nbsp;·&nbsp;replies in 24h
            </div>
            <div className="break-all font-mono text-[clamp(15px,1.8vw,21px)] text-accent-ink">
              {SITE.email}
            </div>
            <div className="mt-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.08em] text-fg-faint">
              <span>Write the email</span>
              <span aria-hidden className="text-[15px]">
                →
              </span>
            </div>
          </a>
          <div className="mt-3.5 font-mono text-[11px] leading-[1.9] text-fg-faint">
            <div>
              booking&nbsp;·&nbsp;
              <a
                href={SITE.bookingUrl}
                target="_blank"
                rel="noopener"
                className="text-accent-ink transition-colors hover:text-accent-hot focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {SITE.bookingLabel}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
