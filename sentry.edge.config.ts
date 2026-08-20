import * as Sentry from "@sentry/nextjs";

/**
 * Edge-runtime Sentry init — middleware and any edge route. Nothing here
 * runs on the edge today (/api/scope pins `runtime = "nodejs"`), but Next
 * loads this entry regardless of whether an edge route exists, so it has to
 * be present and correct. Same DSN guard as sentry.server.config.ts.
 */
const DSN = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    tracesSampleRate: 0,
    sendDefaultPii: false,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  });
}
