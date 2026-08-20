import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { BuildHero } from "@/components/build/BuildHero";
import { CardGrid } from "@/components/CardGrid";
import { WorkflowExplorer } from "@/components/build/WorkflowExplorer";
import { ContactSection } from "@/components/home/ContactSection";
import { PROCESS, SYSTEMS } from "@/lib/build/workflows";

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
  { href: "#contact", label: "Contact" },
];

// Server component — see ARCHITECTURE.md §2. WorkflowExplorer is the only
// client leaf (selected flow, trace step, active node). Built against
// design-reference/ANTA Build.dc.html.
export default function Build() {
  return (
    <>
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
        <ContactSection label={"04 / Contact"} />
      </main>
      <Footer onThisPage={ON_THIS_PAGE} />
    </>
  );
}
