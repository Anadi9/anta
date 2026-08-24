import { Reveal, SectionLabel } from "@/components/Reveal";
import type { FaqItem } from "@/lib/seo/jsonld";

/**
 * The disclosure FAQ block, from design-reference/ANTA About.dc.html.
 *
 * Originally components/about/Faq.tsx, hardwired to lib/about/content.ts.
 * It now takes its copy as a prop because /build and /work carry their own
 * FAQ sections: the markup is identical in all three and the only things
 * that differ are the eyebrow, the heading and the array.
 *
 * Native `<details>`, as in the reference, so this stays a server component
 * with zero JS and the answers are in the DOM for crawlers and AI engines
 * even while collapsed. The `+` marker rotates to `×` via the `open` state —
 * `group-open` handles it in CSS, no client state needed. The default
 * disclosure triangle is suppressed in app/globals.css.
 *
 * Every page that renders this must feed the SAME array to faqJsonLd(), so
 * the FAQPage schema can't drift from what's actually on screen. Schema for
 * an answer a visitor cannot find on the page is a structured-data
 * violation, not a shortcut.
 */
export function Faq({
  items,
  label,
  heading,
  id = "faq",
}: {
  items: readonly FaqItem[];
  /** Numbered eyebrow, e.g. "04 / FAQ". Pass the non-breaking spaces. */
  label: React.ReactNode;
  heading: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="mx-auto max-w-[1280px] border-b border-border px-[clamp(18px,4vw,56px)] py-[clamp(64px,9vw,120px)]"
    >
      <div className="flex flex-wrap gap-[clamp(32px,5vw,80px)]">
        <div className="flex-[0_1_320px]">
          <SectionLabel>{label}</SectionLabel>
          <h2 className="max-w-[16ch] text-balance text-[clamp(26px,3.4vw,40px)] font-bold leading-[1.06] tracking-[-0.02em] text-white">
            {heading}
          </h2>
        </div>

        <Reveal className="flex min-w-0 flex-[1_1_460px] flex-col">
          {items.map((item, i) => (
            <details
              key={item.question}
              className={`group border-t border-border py-5 ${
                i === items.length - 1 ? "border-b" : ""
              }`}
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                {item.question}
                <span
                  aria-hidden
                  className="shrink-0 font-mono text-lg leading-none text-accent-ink transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3.5 max-w-[58ch] text-pretty text-[14.5px] leading-[1.7] text-fg-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
