import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { BuildHero } from "@/components/build/BuildHero";
import { CardGrid } from "@/components/CardGrid";
import { WorkflowExplorer } from "@/components/build/WorkflowExplorer";
import { ContactSection } from "@/components/home/ContactSection";
import { BUILD_FAQ, PROCESS, SYSTEMS } from "@/lib/build/workflows";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  serviceJsonLd,
} from "@/lib/seo/jsonld";
import { SITE } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Build",
  description:
    "What ANTA builds: custom AI applications, workflow automation, stack consolidation, and lead-gen and content tooling, with five workflows drawn the way they execute, from trigger to output.",
  alternates: { canonical: "/build" },
};

const ON_THIS_PAGE = [
  { href: "#systems", label: "What we build" },
  { href: "#flows", label: "Workflow explorer" },
  { href: "#process", label: "Process" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

// Server component — see ARCHITECTURE.md §2. WorkflowExplorer is the only
// client leaf (selected flow, trace step, active node). Built against
// design-reference/ANTA Build.dc.html.
export default function Build() {
  return (
    <>
      {/* The price, machine-readable. This is the page that answers "what
          does it cost", so the Service/Offer node lives here rather than in
          the root layout — a site-wide Offer would claim every page is the
          offer page. */}
      <JsonLd data={serviceJsonLd({ categories: SYSTEMS })} />
      {/* Same array the <Faq> below renders, so schema and page can't drift. */}
      <JsonLd data={faqJsonLd(BUILD_FAQ)} />
      {/* Two levels only. The visible representation of this trail is the
          nav, not a breadcrumb strip — /build is a top-level page — but the
          markup still tells an engine where the page sits in the site. */}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "Build", url: `${SITE.url}/build` },
        ])}
      />
      <BuildHero />
      <main>
        <CardGrid
          id="systems"
          label={"01 / What we build"}
          heading="Four kinds of system. All of them yours."
          cards={SYSTEMS}
        />
        <WorkflowExplorer />
        <CardGrid
          id="process"
          label={"03 / Process"}
          heading="Process as architecture."
          cards={PROCESS}
          minColumn={220}
          headingWidth="20ch"
        />
        <Faq
          items={BUILD_FAQ}
          label={"04 / FAQ"}
          heading="What people ask before scoping one."
        />
        <ContactSection label={"05 / Contact"} />
      </main>
      <Footer onThisPage={ON_THIS_PAGE} />
    </>
  );
}
