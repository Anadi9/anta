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
    // Google's Organization guidance wants a logo it can render in a
    // knowledge panel, and `image` is what most AI answer engines read.
    // Both point at real, absolute URLs: the 512px app icon (dark ground,
    // square) and the generated homepage social card.
    logo: `${SITE.url}/icon.png`,
    image: SITE.ogImage,
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

/**
 * Article schema for a case study (/work). Kept as `Article` rather than
 * `CreativeWork`/`Product` because search and AI engines have the widest,
 * best-tested support for it — the goal here is extractability, not the
 * most semantically precise type.
 *
 * `about` carries the system itself as a SoftwareApplication so the stack
 * is machine-readable, which is what an AI engine answering "what has ANTA
 * actually built" needs to pick up.
 */
export function caseStudyJsonLd(opts: {
  headline: string;
  description: string;
  url: string;
  applicationName: string;
  stack: readonly string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    inLanguage: "en-US",
    author: { "@type": "Person", name: SITE.founder },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    about: {
      "@type": "SoftwareApplication",
      name: opts.applicationName,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: opts.description,
      author: { "@type": "Person", name: SITE.founder },
    },
    mentions: opts.stack.map((tech) => ({
      "@type": "SoftwareApplication",
      name: tech,
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
