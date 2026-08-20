import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ContactSection } from "@/components/home/ContactSection";
import { FeaturedCase } from "@/components/work/FeaturedCase";
import { SystemLog } from "@/components/work/SystemLog";
import { WorkHero } from "@/components/work/WorkHero";
import { caseStudyJsonLd } from "@/lib/seo/jsonld";
import { SITE } from "@/lib/seo/site";
import { FEATURED } from "@/lib/work/cases";

export const metadata: Metadata = {
  title: "Work",
  description:
    "The ANTA Lead Intelligence Agent, in production: B2B lead scoring, cold-email generation and outreach sequencing on Next.js, Postgres, Vercel, the Claude API, Apollo, HubSpot and Lemlist — plus six more systems already scoped.",
  alternates: { canonical: "/work" },
};

const ON_THIS_PAGE = [
  { href: "#index", label: "System log" },
  { href: "#contact", label: "Contact" },
  { href: "/#scope", label: "Scope it live" },
];

// Server component — see ARCHITECTURE.md §2. Only SystemLog is a client
// leaf (filter + accordion state). Built against
// design-reference/ANTA Work.dc.html.
//
// One case study, so this stays a single /work page. When there's a second,
// split into /work (index) + /work/[slug] and add BreadcrumbList schema —
// don't do it preemptively.
export default function Work() {
  return (
    <>
      <JsonLd
        data={caseStudyJsonLd({
          headline: `${FEATURED.title} — ANTA case study`,
          description: FEATURED.whatItDoes,
          url: `${SITE.url}/work`,
          applicationName: FEATURED.title,
          stack: FEATURED.stack,
        })}
      />
      <WorkHero />
      <main>
        <FeaturedCase />
        <SystemLog />
        {/* non-breaking spaces around the slash, matching the other eyebrows */}
        <ContactSection label={"03 / Contact"} />
      </main>
      <Footer onThisPage={ON_THIS_PAGE} />
    </>
  );
}
