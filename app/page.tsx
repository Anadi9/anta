import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { SITE } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  alternates: { canonical: "/" },
};

// Server component — stays thin. All interactivity lives in HeroSection
// and (once built) the other section components. Real copy is in
// design-reference/ANTA Site.dc.html.
export default function Home() {
  return (
    <>
      <HeroSection />

      {/* TODO — build against design-reference/ANTA Site.dc.html:
          - "Scope it live" interactive tool (id="scope")
          - "How the studio operates" process section
          - Proof-of-work strip
          - Contact / footer (id="contact")
          See BUILD_PLAN.md for the page-by-page order and prompts. */}
    </>
  );
}
