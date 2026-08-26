import { PROFILES, SITE } from "./site";

/**
 * JSON-LD builders for structured data. Render via the <JsonLd> component
 * (components/JsonLd.tsx) inside a page/layout — never hand-write <script>
 * tags for this elsewhere, so every schema block stays consistent and
 * type-checked.
 *
 * What's emitted where: Organization + WebSite on every page (via the root
 * layout); Service + Offer on /build, which is the page that answers "what
 * does it cost"; FAQPage on /about, /build and /work, each from the array
 * that page also renders; BreadcrumbList on every page below the root;
 * Article on /work and on each /blog post.
 *
 * The one hard rule for FAQPage: never emit a question whose answer isn't
 * on the page. Every caller passes the same array to faqJsonLd() and to
 * <Faq>, which is what makes that structurally impossible rather than a
 * thing to remember.
 */

/**
 * The founder as a first-class entity.
 *
 * A solo, founder-led studio's credibility graph runs through the person at
 * least as much as the company: while ANTA has no org-level profiles, no
 * client logos and no press, "Anadi" is the node an answer engine can
 * actually corroborate against GitHub and (once it exists) LinkedIn. Emitted
 * inline as the Organization's `founder` rather than as a separate top-level
 * block, so the person and the company resolve as one connected entity.
 */
export function personJsonLd() {
  return {
    "@type": "Person",
    "@id": `${SITE.url}/#founder`,
    name: SITE.founder,
    jobTitle: "Founder",
    email: SITE.email,
    worksFor: { "@id": `${SITE.url}/#organization` },
    knowsAbout: [
      "AI application development",
      "Large language model integration",
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Workflow automation",
    ],
    ...(PROFILES.founder.length > 0 ? { sameAs: [...PROFILES.founder] } : {}),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    // Stable @id so every other schema block on the site (Article publisher,
    // Person worksFor) can point at this one node by reference instead of
    // re-describing the org. Consumers that build an entity graph — which is
    // what AI answer engines do — resolve those references into a single
    // entity rather than three loosely-similar ones.
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    description: SITE.description,
    email: SITE.email,
    founder: personJsonLd(),
    // Corroborating profiles. Omitted entirely rather than emitted empty —
    // an empty sameAs is noise, and Google's structured-data parsing prefers
    // an absent optional property to a vacant one. See PROFILES in site.ts
    // for why this matters and what still needs creating.
    ...(PROFILES.org.length > 0 ? { sameAs: [...PROFILES.org] } : {}),
    // How to actually reach the studio. Answer engines asked "how do I
    // contact ANTA" read this before they read the page body, and the two
    // real channels are the mailbox and the Cal.com link — there is no
    // phone line and no contact form, so nothing here invents one.
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: SITE.email,
      url: SITE.bookingUrl,
      areaServed: "US",
      availableLanguage: "English",
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

export function faqJsonLd(items: readonly FaqItem[]) {
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
 * The studio's offer, as a machine-readable price.
 *
 * Why this exists: "how much does it cost" is the single most asked buyer
 * question, and until now the answer lived only in prose (/about FAQ, the
 * pilot post) and in llms.txt. Prose is extractable but ambiguous — an
 * engine has to decide whether "$3,000–$6,000" is a price, an example, or a
 * competitor's number. A PriceSpecification with min, max and currency is
 * unambiguous, and it is what gets read back when someone asks an answer
 * engine what ANTA charges.
 *
 * The numbers here are the real published band and must stay in sync with
 * the /about FAQ, the /build FAQ and content/blog/what-a-3000-dollar-ai-
 * pilot-actually-buys.mdx. If the band changes, it changes in all four.
 *
 * Deliberately NOT modelling the retainer as a second priced Offer: there is
 * no published retainer number, and an Offer with no price is a weaker
 * signal than no Offer at all. The retainer is described in `description`
 * where it can be stated honestly as "scoped per engagement".
 *
 * `hasOfferCatalog` carries the four system categories from
 * lib/build/workflows.ts so the *shape* of the work is machine-readable
 * alongside the price — an engine answering "what does ANTA build" gets a
 * list rather than having to parse four card headings out of the DOM.
 */
export function serviceJsonLd(opts: {
  /** The four "what we build" categories — {title, body} from SYSTEMS. */
  categories: readonly { title: string; body: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE.url}/build#service`,
    name: "Custom AI system development",
    serviceType: "Custom AI software development",
    description:
      "Design and build of custom AI systems for growth-stage companies: custom AI applications, workflow automation, stack consolidation, and lead-generation and content tooling. A first engagement is a fixed-price pilot of $3,000–$6,000 covering two to three weeks and one narrowly scoped system, shipped to production. Ongoing work afterwards runs as a monthly retainer scoped per engagement, not an hourly rate.",
    url: `${SITE.url}/build`,
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: "US",
    audience: {
      "@type": "BusinessAudience",
      name: "Growth-stage B2B companies, roughly 5–50 people",
    },
    offers: {
      "@type": "Offer",
      name: "Fixed-price AI pilot",
      description:
        "One narrowly scoped system, built and deployed to production in two to three weeks at a price agreed before work starts. Includes the integration into the tools the work already happens in, the reliability work (retries, rate limits, a cap on model spend, a defined behaviour on every failure path), and the repository in the client's own account from the first commit. Excludes open-ended discovery phases and per-seat licensing — there are none.",
      category: "Fixed-price pilot engagement",
      url: SITE.bookingUrl,
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "PriceSpecification",
        "@id": `${SITE.url}/build#pilot-price`,
        minPrice: 3000,
        maxPrice: 6000,
        priceCurrency: "USD",
        valueAddedTaxIncluded: false,
      },
      seller: { "@id": `${SITE.url}/#organization` },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "What ANTA builds",
      itemListElement: opts.categories.map((c) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: c.title,
          description: c.body,
          provider: { "@id": `${SITE.url}/#organization` },
        },
      })),
    },
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
    author: { "@id": `${SITE.url}/#founder` },
    // By reference, not re-declared — resolves to the ProfessionalService
    // node emitted from the root layout on every page.
    publisher: { "@id": `${SITE.url}/#organization` },
    about: {
      "@type": "SoftwareApplication",
      name: opts.applicationName,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: opts.description,
      author: { "@id": `${SITE.url}/#founder` },
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

/**
 * Article schema for a /blog post.
 *
 * Separate from caseStudyJsonLd rather than a shared builder with optional
 * fields: that one models a *system* (its `about` is a SoftwareApplication,
 * `mentions` is a stack), this one models a *piece of writing* answering a
 * question. Merging them would produce a builder where half the arguments
 * are inert on any given call.
 *
 * Two fields carry most of the weight for AI answer engines:
 *
 * - `about` as a Question with the post's target query. This is the whole
 *   AEO thesis in one field — it states, machine-readably, which question
 *   this document answers, so a retrieval system matching a user's query
 *   doesn't have to infer it from the prose.
 * - `author` by reference to the founder node, not an inline string. A named
 *   person with corroborating sameAs profiles (lib/seo/site.ts PROFILES) is
 *   an entity an engine can verify; a bare byline string is not.
 *
 * `dateModified` falls back to `datePublished` — an unedited post is
 * accurately described as unmodified, and emitting today's date on every
 * build would be a freshness signal the content hasn't earned.
 */
export function articleJsonLd(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  query: string;
  keywords: readonly string[];
  wordCountMinutes: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
    inLanguage: "en-US",
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: { "@id": `${SITE.url}/#founder` },
    publisher: { "@id": `${SITE.url}/#organization` },
    keywords: opts.keywords.join(", "),
    timeRequired: `PT${opts.wordCountMinutes}M`,
    about: {
      "@type": "Question",
      name: opts.query,
    },
  };
}

/**
 * ItemList for the /blog index. Gives an engine crawling the index the full
 * set of posts and their target questions in one pass, rather than requiring
 * it to fetch and parse eight separate article pages to learn what's there.
 */
export function blogIndexJsonLd(
  posts: { title: string; description: string; url: string; date: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE.url}/blog#blog`,
    name: `${SITE.name} — Briefs`,
    description:
      "Working briefs on building custom AI systems: pricing, architecture, cost control, and teardowns of systems actually in production.",
    url: `${SITE.url}/blog`,
    publisher: { "@id": `${SITE.url}/#organization` },
    author: { "@id": `${SITE.url}/#founder` },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      url: p.url,
      datePublished: p.date,
      author: { "@id": `${SITE.url}/#founder` },
    })),
  };
}
