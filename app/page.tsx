import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { ContactSection } from "@/components/home/ContactSection";
import { HeroSection } from "@/components/home/HeroSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ProofSection } from "@/components/home/ProofSection";
import { ScopeSection } from "@/components/home/ScopeSection";
import { ToolkitsSection } from "@/components/home/ToolkitsSection";
import { SITE } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  alternates: { canonical: "/" },
};

// Server component — stays thin. Interactivity lives in the leaf section
// components (HeroSection, ScopeSection, ToolkitsSection); the static ones
// stay server-rendered. Real copy is in design-reference/ANTA Site.dc.html.
export default function Home() {
  return (
    <>
      <HeroSection />
      <main>
        <ScopeSection />
        <ToolkitsSection />
        <ProofSection />
        <ProcessSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
