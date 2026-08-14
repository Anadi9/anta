import { SITE } from "./site";

/**
 * JSON-LD builders for structured data. Render via the <JsonLd> component
 * (components/JsonLd.tsx) inside a page/layout — never hand-write <script>
 * tags for this elsewhere, so every schema block stays consistent and
 * type-checked.
 *
 * Order of importance per current AEO guidance: Organization + WebSite on
 * every page (via layout), FAQPage on /about once its FAQ is built, and
 * BreadcrumbList once there's more than one level of navigation depth
 * (e.g. a /work/[slug] case study page).
 */

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    description: SITE.description,
    founder: {
      "@type": "Person",
      name: SITE.founder,
    },
    areaServed: "US",
    knowsAbout: [
      "AI software development",
      "Workflow automation",
      "Custom AI applications",
      "Lead generation systems",
      "Systems integration",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
  };
}

export type FaqItem = { question: string; answer: string };

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
