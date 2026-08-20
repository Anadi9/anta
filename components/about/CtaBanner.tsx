import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/seo/site";

/**
 * Closing CTA — design-reference/ANTA About.dc.html, "CTA banner" screen.
 *
 * The About page ends on this centred banner rather than the two-column
 * components/home/ContactSection.tsx used by /work and /build; the reference
 * gives it its own copy ("Move before the gap closes"), which lands the
 * adoption-curve argument the rest of the page builds. Keeps `id="contact"`
 * so the footer's "On this page" anchor and the nav CTA resolve the same way
 * they do everywhere else.
 */
export function CtaBanner() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-b border-border bg-bg"
    >
      <Reveal className="relative mx-auto flex max-w-[1280px] flex-col items-center px-[clamp(18px,4vw,56px)] py-[clamp(72px,11vw,148px)] text-center">
        <h2 className="mb-[22px] max-w-[20ch] text-balance text-[clamp(32px,5.6vw,68px)] font-bold leading-none tracking-[-0.035em] text-white">
          Move before the gap closes.
        </h2>
        <p className="mb-[clamp(30px,4vw,44px)] max-w-[46ch] text-pretty text-[clamp(15px,1.5vw,18px)] leading-[1.7] text-fg-muted">
          Send the two-paragraph version of your problem. You&apos;ll get a
          real technical response, not a discovery questionnaire.
        </p>
        <a
          href={`mailto:${SITE.email}?subject=${encodeURIComponent("ANTA project inquiry")}`}
          className="inline-flex items-center gap-3 bg-accent-deep px-[30px] py-4 font-mono text-[13px] font-bold uppercase tracking-[0.08em] text-white transition-shadow hover:shadow-[0_0_0_1px_var(--color-accent),0_0_34px_rgba(236,26,99,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Start a conversation
          <span aria-hidden>→</span>
        </a>
      </Reveal>
    </section>
  );
}
