import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Shared Open Graph card renderer. Each route's `opengraph-image.tsx` is a
 * three-line file that calls `ogImage()` with its own eyebrow and headline,
 * so all four cards stay identical apart from their copy — the alternative
 * (four hand-built JSX trees) drifts the moment the palette changes.
 *
 * Fonts are read off disk from `assets/og-fonts/` rather than fetched at
 * build time. `next/font/google` can't hand its files to `ImageResponse`,
 * and a build-time fetch to fonts.gstatic.com makes the build fail on a
 * flaky network — these are the same two families as the site (Space
 * Grotesk Bold, JetBrains Mono), committed once.
 *
 * Colours are the literal token values from app/globals.css. Satori (what
 * `ImageResponse` renders with) resolves neither CSS custom properties nor
 * Tailwind classes, so they can't be referenced here — if the tokens change,
 * change them here too.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const BG = "#0b0b0c";
const ACCENT = "#ec1a63";
const WHITE = "#ffffff";
const MUTED = "rgba(255,255,255,0.62)";
const LINE = "rgba(255,255,255,0.12)";

/*
  Paths are written out as single literal strings rather than assembled from
  a spread (`join(process.cwd(), ...parts)`). Turbopack statically analyses
  these reads to decide what to trace into the serverless bundle: a dynamic
  path is unanalysable, so it conservatively traces *the entire project* —
  including all of public/ and its 19 scene plates — into every OG route.
  The build warns about exactly this. Literal paths trace three files.
*/
const ROOT = process.cwd();

export async function ogImage({
  eyebrow,
  headline,
  footer = "theanta.com",
}: {
  /** Small mono label above the headline, e.g. "Work · case study". */
  eyebrow: string;
  headline: string;
  footer?: string;
}) {
  const [sans, mono, mark] = await Promise.all([
    readFile(join(ROOT, "assets/og-fonts/SpaceGrotesk-Bold.ttf")),
    readFile(join(ROOT, "assets/og-fonts/JetBrainsMono-Regular.ttf")),
    readFile(join(ROOT, "public/anta-mark.png")),
  ]);

  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          fontFamily: "Space Grotesk",
          padding: "64px 72px",
          position: "relative",
        }}
      >
        {/* Accent bloom, top-right — the same ambient wash the pages carry. */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -160,
            width: 760,
            height: 760,
            background: `radial-gradient(circle, ${ACCENT} 0%, transparent 62%)`,
            opacity: 0.22,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- satori
              renders plain <img> only; next/image has no meaning here. */}
          <img src={markSrc} alt="" height={44} />
          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "0.16em",
              color: WHITE,
            }}
          >
            ANTA
          </div>
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 17,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: MUTED,
              paddingTop: 4,
            }}
          >
            ai dev studio
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: "JetBrains Mono",
              fontSize: 20,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: ACCENT,
              marginBottom: 26,
            }}
          >
            <div style={{ width: 12, height: 12, background: ACCENT }} />
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: 74,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
              color: WHITE,
              maxWidth: 940,
            }}
          >
            {headline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${LINE}`,
            paddingTop: 26,
            fontFamily: "JetBrains Mono",
            fontSize: 19,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          <div>{footer}</div>
          <div>detroit, mi · built, not templated</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Space Grotesk", data: sans, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
