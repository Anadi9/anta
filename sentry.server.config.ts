import * as Sentry from "@sentry/nextjs";

/**
 * Server-side Sentry init (Node runtime). Loaded from instrumentation.ts.
 *
 * Guarded on the DSN rather than initialised unconditionally: with no DSN,
 * `Sentry.init` is a no-op that still installs instrumentation, and this
 * project has no Sentry project provisioned yet. Skipping init entirely
 * keeps local dev and any DSN-less deploy completely untouched — the day
 * SENTRY_DSN lands in Vercel, error capture turns on with no code change.
 *
 * Why Sentry at all, given the site is four static pages: /api/scope is the
 * one route with real moving parts (paid API call, rate limiter, Supabase
 * write, Resend send), and app/api/scope/route.ts explicitly leans on
 * exceptions being captured — a swallowed failure there is a lost lead with
 * no trace of it having existed.
 */
const DSN = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    // Pre-revenue on Sentry's free tier: 5k errors/month is plenty, but
    // full-rate tracing would burn the 10k-span quota in days. Errors are
    // what matter here; performance data comes from Vercel Speed Insights.
    tracesSampleRate: 0,
    // Never let an error report leak a visitor's scope query or email.
    sendDefaultPii: false,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  });
}
