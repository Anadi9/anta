import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ContactSection } from "@/components/home/ContactSection";
import { FeaturedCase } from "@/components/work/FeaturedCase";
import { SystemLog } from "@/components/work/SystemLog";
import { WorkHero } from "@/components/work/WorkHero";
import {
  breadcrumbJsonLd,
  caseStudyJsonLd,
  faqJsonLd,
} from "@/lib/seo/jsonld";
import { SITE } from "@/lib/seo/site";
import { FEATURED, WORK_FAQ } from "@/lib/work/cases";

export const metadata: Metadata = {
  title: "Work",
  description:
    "The ANTA Lead Intelligence Agent, in production: B2B lead scoring, cold-email generation and outreach sequencing on Next.js, Postgres, Vercel, the Claude API, Apollo, HubSpot and Lemlist, plus six more systems already scoped.",
  alternates: { canonical: "/work" },
};

const ON_THIS_PAGE = [
  { href: "#index", label: "System log" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
  { href: "/#scope", label: "Scope it live" },
];

// Server component — see ARCHITECTURE.md §2. Only SystemLog is a client
// leaf (filter + accordion state). Built against
// design-reference/ANTA Work.dc.html.
//
// One case study, so this stays a single /work page. When there's a second,
// split into /work (index) + /work/[slug] — don't do it preemptively. The
// BreadcrumbList below gains a third level at that point.
export default function Work() {
  return (
    <>
      <JsonLd
        data={caseStudyJsonLd({
          headline: `${FEATURED.title}: an ANTA case study`,
          description: FEATURED.whatItDoes,
          url: `${SITE.url}/work`,
          applicationName: FEATURED.title,
          stack: FEATURED.stack,
        })}
      />
      {/* Same array the <Faq> below renders, so schema and page can't drift. */}
      <JsonLd data={faqJsonLd(WORK_FAQ)} />
      {/* Two levels only — /work is top-level, and the nav is the visible
          representation of the trail. The markup still places the page. */}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "Work", url: `${SITE.url}/work` },
        ])}
      />
      <WorkHero />
      <main>
        <FeaturedCase />
        <SystemLog />
        <Faq
          items={WORK_FAQ}
          label={"03 / FAQ"}
          heading="What people ask about the work."
        />
        {/* non-breaking spaces around the slash, matching the other eyebrows */}
        <ContactSection label={"04 / Contact"} />
      </main>
      <Footer onThisPage={ON_THIS_PAGE} />
    </>
  );
}
