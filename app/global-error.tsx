"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { SITE } from "@/lib/seo/site";

/**
 * Last-resort boundary: catches errors thrown by the root layout itself,
 * which app/error.tsx sits inside of and therefore can't catch.
 *
 * This file *replaces* the root layout when active, so none of the usual
 * scaffolding reaches it — no globals.css, no next/font variables, no
 * Tailwind classes worth relying on. Everything is inlined against literal
 * token values (--color-bg-deep, --color-accent-ink, --color-ink from
 * app/globals.css) with a system font stack, so it renders correctly even
 * when the stylesheet is the thing that failed.
 *
 * `metadata` exports don't work in a Client Component, hence React's
 * <title>. Keeping it dark-painted explicitly matters: the default UI here
 * follows the OS colour scheme, which would flash white on a dark-only site.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const mono =
    'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';

  return (
    <html lang="en">
      <title>Something went wrong | ANTA</title>
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          background: "#0a0a0b",
          color: "#f5f4f1",
          fontFamily: `system-ui, -apple-system, "Segoe UI", sans-serif`,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <main
          style={{
            width: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "clamp(72px, 10vw, 140px) clamp(18px, 4vw, 56px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 18,
              fontFamily: mono,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#ef2168",
            }}
          >
            <span
              aria-hidden
              style={{ width: 12, height: 12, background: "#ec1a63" }}
            />
            error · fatal
          </div>

          <h1
            style={{
              margin: "0 0 22px",
              maxWidth: "18ch",
              fontSize: "clamp(38px, 6.4vw, 84px)",
              fontWeight: 700,
              lineHeight: 0.98,
              letterSpacing: "-0.035em",
              color: "#ffffff",
            }}
          >
            The site failed to load.
          </h1>

          <p
            style={{
              margin: "0 0 clamp(32px, 4vw, 48px)",
              maxWidth: "52ch",
              fontSize: "clamp(16px, 1.6vw, 19px)",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            This one&apos;s on me and it&apos;s already logged. Reload, or email
            me and I&apos;ll fix it today.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "#c20a62",
                color: "#FBFAF8",
                padding: "12px 18px",
                fontFamily: mono,
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Try again
            </button>
            <a
              href={`mailto:${SITE.email}?subject=${encodeURIComponent("ANTA site down")}`}
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#d9d7d1",
                padding: "12px 18px",
                fontFamily: mono,
                fontSize: 11.5,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              {SITE.email}
            </a>
          </div>

          {error.digest && (
            <p
              style={{
                marginTop: 24,
                fontFamily: mono,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              ref · {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
