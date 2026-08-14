import type { Metadata } from "next";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Build",
  description:
    "What ANTA builds: custom AI applications, workflow automation, stack consolidation, and team enablement — process as architecture.",
  alternates: { canonical: "/build" },
};

// Stub — build against design-reference/ANTA Build.dc.html and
// "Workflow Section Concepts.dc.html". Copy already written there:
// "process as architecture" framing, a hover-to-reveal "Workflow explorer"
// (hover a step, see the tools it runs on), and four system categories
// (custom AI applications, workflow automation, stack consolidation, team
// enablement).
export default function Build() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-bg px-6 pt-32 text-white">
        <h1 className="font-mono text-xs uppercase tracking-widest text-fg-muted">
          Build — TODO
        </h1>
      </main>
    </>
  );
}
