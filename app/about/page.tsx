import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "We design and build the AI systems your team needs, so you scale without adding headcount — one process, no handoffs, no delay.",
  alternates: { canonical: "/about" },
};

// Stub — build against design-reference/ANTA About.dc.html and
// "ANTA About Options.dc.html" (alternate layout). Copy is already
// written there: "the shift" framing, "how we help" pillars, and an
// objection-handling FAQ ("questions that come up before the first call").
//
// When the FAQ section is built, populate faqJsonLd() below with the real
// Q&A pairs from the reference — don't leave it empty, FAQPage schema is
// one of the highest-value schema types for both classic SEO snippets and
// AI answer engines.
export default function About() {
  const faqItems: { question: string; answer: string }[] = [
    // TODO: fill from design-reference/ANTA About.dc.html
  ];

  return (
    <>
      <Nav />
      {faqItems.length > 0 && <JsonLd data={faqJsonLd(faqItems)} />}
      <main className="min-h-screen bg-bg px-6 pt-32 text-white">
        <h1 className="font-mono text-xs uppercase tracking-widest text-fg-muted">
          Studio — TODO
        </h1>
      </main>
    </>
  );
}
