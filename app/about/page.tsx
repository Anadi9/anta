import type { Metadata } from "next";
import { CardGrid } from "@/components/CardGrid";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { AboutHero } from "@/components/about/AboutHero";
import { AdoptionCurve } from "@/components/about/AdoptionCurve";
import { CtaBanner } from "@/components/about/CtaBanner";
import { Faq } from "@/components/about/Faq";
import { WhyAnta } from "@/components/about/WhyAnta";
import { FAQ, HOW_WE_HELP } from "@/lib/about/content";
import { faqJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Why ANTA exists: the AI adoption curve is three stages in, and the gap compounds every quarter. Custom AI software, workflow redesign, automation and team enablement in one process, with no handoffs and code yours from the first commit.",
  alternates: { canonical: "/about" },
};

const ON_THIS_PAGE = [
  { href: "#shift", label: "The shift" },
  { href: "#how", label: "How we help" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

// Server component — see ARCHITECTURE.md §2. This page has no client leaf at
// all: the FAQ runs on native <details>, so nothing here ships JS beyond the
// shared Nav and the Reveal wrappers. Built against
// design-reference/ANTA About.dc.html, with the adoption-curve section from
// option 5a of "ANTA About Options.dc.html" (reasoning in lib/about/content.ts).
export default function About() {
  return (
    <>
      {/* FAQPage schema and the rendered FAQ read the same array, so they
          can't drift — BUILD_PLAN Phase 3. */}
      <JsonLd data={faqJsonLd(FAQ)} />
      <AboutHero />
      <main>
        <AdoptionCurve />
        <CardGrid
          id="how"
          label={"02 / How we help"}
          heading="We build the system you'd build, if you had the time."
          intro="Custom AI software, workflows, and automation, built into how your team already works rather than bolted on top of it."
          cards={HOW_WE_HELP}
          minColumn={230}
          headingWidth="20ch"
        />
        <WhyAnta />
        <Faq />
        <CtaBanner />
      </main>
      <Footer onThisPage={ON_THIS_PAGE} />
    </>
  );
}
