import * as Sentry from "@sentry/nextjs";

/**
 * Client instrumentation entry — runs before the app becomes interactive.
 * Catches browser-side exceptions, which on this site means the animation
 * layer (HeroScenes/GSAP) and the Scope panel's streaming fetch.
 *
 * DSN-guarded exactly like the server config: no DSN, no init, no bundle
 * cost beyond the import. See sentry.server.config.ts for the reasoning.
 */
const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    tracesSampleRate: 0,
    // No session replay: it would record visitors' Scope-it-live input,
    // and the free-tier replay quota is small enough to be noise anyway.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    sendDefaultPii: false,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
