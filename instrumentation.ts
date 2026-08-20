import type { Instrumentation } from "next";
import * as Sentry from "@sentry/nextjs";

/**
 * Server instrumentation entry (see the instrumentation.js file convention).
 * `register` runs once per server instance, before the first request is
 * served; the runtime split is required because the two Sentry SDK builds
 * are not interchangeable.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

/**
 * Catches errors thrown during server rendering and inside route handlers —
 * including anything that escapes /api/scope. Safe to export unconditionally:
 * with no DSN, `Sentry.init` never ran and this is an inert call.
 */
export const onRequestError: Instrumentation.onRequestError =
  Sentry.captureRequestError;
