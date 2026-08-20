import type { Metadata } from "next";
import {
  Space_Grotesk,
  JetBrains_Mono,
  Dancing_Script,
  Silkscreen,
  Bitcount_Prop_Single,
} from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { PageAmbience } from "@/components/PageAmbience";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import { SITE } from "@/lib/seo/site";

// Body/headline sans + technical mono — the two workhorse fonts.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

// Decorative fonts — used sparingly (wordmark, signature accents only).
// See design-reference/*.dc.html for exactly where these show up.
const dancingScript = Dancing_Script({
  variable: "--font-script",
  weight: "700",
  subsets: ["latin"],
});

const silkscreen = Silkscreen({
  variable: "--font-pixel",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const bitcount = Bitcount_Prop_Single({
  variable: "--font-display",
  subsets: ["latin"],
});

// Root metadata. Per-page metadata (in each app/**/page.tsx) should
// override title/description — this is the fallback + the shared OG/Twitter
// defaults. metadataBase makes every relative image/URL below resolve
// against the real domain instead of localhost in previews.
// The GA4 property that already exists and has history on it — ported
// forward from the live repo, NOT a new property. Public by definition (it
// ships in the page), so a committed default is fine; the env var only
// exists so a preview/staging deploy can point somewhere else without a
// code change.
const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-BF6M3EFFKH";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.tagline,
  applicationName: SITE.name,
  authors: [{ name: SITE.founder }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.tagline,
    // No `images` here on purpose: every route ships its own
    // `opengraph-image.tsx` (rendered by lib/seo/og.tsx), and Next's
    // file-convention image wins over a config-declared one. Listing a
    // static fallback as well would only add a second og:image tag that
    // scrapers pick between at random.
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.tagline,
  },
  // Fill in once Google Search Console gives you the real code — see
  // BUILD_PLAN.md. Leaving this unset until it's real; a placeholder
  // string is worse than nothing.
  // verification: { google: "" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${dancingScript.variable} ${silkscreen.variable} ${bitcount.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-white font-sans overflow-x-hidden">
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <PageAmbience />
        {/*
          Lifts page content above the fixed decorative layers in
          PageAmbience (which sit at z-0). Mirrors the reference's
          `main { position: relative; z-index: 1 }`.
        */}
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          {children}
        </div>
        {/*
          Gated on a production build so `npm run dev` doesn't pollute the
          real property with localhost traffic. This is still true for
          Vercel preview deploys, which is deliberate — BUILD_PLAN Phase 7
          requires confirming GA4 receives data from a preview before
          cutting production over.
        */}
        {process.env.NODE_ENV === "production" && (
          <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
        )}
        {/*
          Vercel Analytics (traffic) and Speed Insights (Core Web Vitals).
          Both are no-ops outside a Vercel deployment, so unlike GA they need
          no NODE_ENV gate — and both must stay mounted regardless of GA:
          Speed Insights is the only field-data view of what the GSAP/scene
          animation layer actually costs real visitors on real devices, which
          is why it's in the stack at all (CLAUDE.md, Analytics).

          Neither is enabled by merely installing the package — switch both
          on in the Vercel project's Analytics and Speed Insights tabs, or
          they collect nothing.
        */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
