"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import { SITE } from "@/lib/seo/site";

/**
 * Route-segment error boundary — wraps every page under the root layout, so
 * the Nav/Footer chrome is gone here but globals.css and the fonts are not.
 *
 * `retry` (not `reset`) is the Next 16 prop: it re-fetches and re-renders the
 * boundary's children, so a transient server failure genuinely recovers in
 * place instead of just clearing the error state. See the error.js reference.
 *
 * Errors from Server Components arrive here with a generic message and a
 * `digest` — the real message stays server-side. The digest is printed
 * because it's the only handle a visitor can quote that matches a server log
 * or a Sentry event.
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-bg-deep px-[clamp(18px,4vw,56px)] py-[clamp(72px,10vw,140px)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(90deg,rgba(245,244,241,0.055)_0_1px,transparent_1px_104px)] [mask-image:linear-gradient(to_bottom,#000,transparent_82%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[34%] left-[6%] h-[46vw] w-[46vw] opacity-[0.14] [background:radial-gradient(circle,var(--color-accent-deep)_0%,transparent_62%)]"
      />

      <div className="relative mx-auto w-full max-w-[1280px]">
        <div className="mb-[18px] flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-accent-ink">
          <span aria-hidden className="h-3 w-3 bg-accent" />
          error&nbsp;·&nbsp;unhandled
        </div>

        <h1 className="mb-[22px] max-w-[18ch] text-balance text-[clamp(38px,6.4vw,84px)] font-bold leading-[0.98] tracking-[-0.035em] text-white">
          Something on my end broke.
        </h1>

        <p className="mb-[clamp(32px,4vw,48px)] max-w-[52ch] text-pretty text-[clamp(16px,1.6vw,19px)] leading-[1.6] text-fg-muted">
          Not your browser, not your connection. The error is logged and I&apos;ll
          see it. Retrying often works — if it doesn&apos;t, email me and
          I&apos;ll fix it today.
        </p>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="cursor-pointer border border-border bg-accent-deep px-[18px] py-3 font-mono text-[11.5px] font-bold uppercase tracking-[0.06em] text-[#FBFAF8] transition-shadow duration-[250ms] hover:shadow-[0_0_0_1px_var(--color-accent),0_0_28px_rgba(236,26,99,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-border px-[18px] py-3 font-mono text-[11.5px] uppercase tracking-[0.09em] text-t1 transition-colors hover:border-accent hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Home
          </Link>
          <a
            href={`mailto:${SITE.email}?subject=${encodeURIComponent(
              `ANTA — site error${error.digest ? ` (${error.digest})` : ""}`,
            )}`}
            className="border border-border px-[18px] py-3 font-mono text-[11.5px] uppercase tracking-[0.09em] text-t1 transition-colors hover:border-accent hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Email me
          </a>
        </div>

        {error.digest && (
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-faint">
            ref&nbsp;·&nbsp;{error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
