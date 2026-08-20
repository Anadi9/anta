import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /*
    Pin the project root. Turbopack infers it by walking up for a lockfile,
    and there's a stray package-lock.json in the home directory above this
    repo — the build warns that it ignored it. Stating the root explicitly
    removes the ambiguity rather than depending on the repo boundary
    happening to fall in the right place.
  */
  turbopack: { root: __dirname },

  async redirects() {
    return [
      // The live site (github.com/Anadi9/anta) shipped two SEO pages built
      // around generic "custom website development" positioning, which
      // conflicts with what ANTA actually sells. They're being dropped, not
      // ported — but they may be indexed and linked, so redirect rather
      // than 404 and throw away whatever search equity they hold.
      // permanent: true → 308, which passes ranking signal through to /.
      { source: "/services/web-development", destination: "/", permanent: true },
      { source: "/services/custom-websites", destination: "/", permanent: true },
    ];
  },
};

/*
  The Sentry build plugin is applied only once a Sentry project actually
  exists. It does two things at build time — upload source maps and rewrite
  stack traces — and both need SENTRY_ORG/SENTRY_PROJECT plus an auth token.
  Applying it without them turns every build into a wall of warnings for no
  benefit, so it stays off until those are set in Vercel.

  Runtime error capture does NOT depend on this wrapper: that comes from
  instrumentation.ts and the sentry.*.config.ts files, which key off the DSN
  independently. Setting only the DSN gets you errors; adding the org/project
  /token here additionally gets you readable stack traces through minified
  code. Do both, in that order.
*/
const sentryConfigured = Boolean(
  process.env.SENTRY_ORG && process.env.SENTRY_PROJECT,
);

export default sentryConfigured
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      // Keep the build log readable; real failures still surface.
      silent: !process.env.CI,
      // Serve the SDK through the app's own origin so ad blockers — which
      // most of a technical, founder-heavy audience runs — don't drop the
      // error reports this whole setup exists to collect.
      tunnelRoute: "/monitoring",
      // Source maps are uploaded to Sentry, then deleted from the deployed
      // bundle so they aren't publicly downloadable.
      sourcemaps: { deleteSourcemapsAfterUpload: true },
      disableLogger: true,
    })
  : nextConfig;
