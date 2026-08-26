/**
 * Fetches and treats the stock photograph behind a post banner.
 *
 *   node scripts/art.ts              # every post missing its file
 *   node scripts/art.ts <slug>       # one post, re-fetched even if present
 *
 * WHY A SCRIPT AND NOT A DOWNLOAD FOLDER
 *
 * The source of truth for a banner photo is the `art` block in
 * lib/blog/banners.ts — a photo id, a crop bias, and a credit. The .webp in
 * public/blog/art/ is build output: delete the folder and this rebuilds it.
 * That is the whole reason the treatment below lives in code rather than in
 * someone's Photoshop history. When the palette moves, the banners are one
 * `node scripts/art.ts` away from matching it again.
 *
 * THE TREATMENT IS THE BRAND, NOT THE PHOTO.
 *
 * Eight unrelated stock photos do not read as a set. Eight stock photos put
 * through the same desaturate -> darken -> cool-tint pass do, because what
 * the eye matches on is tone, not subject. The numbers are tuned so the
 * result sits *under* the #ec1a63 accent bloom PostBanner paints over it:
 * a photo that keeps its own colour fights the accent, and the band stops
 * looking like the rest of the site.
 *
 * Deliberately not a full accent duotone — that reads as a template. Near
 * monochrome plus the site's own bloom keeps the accent meaning "ANTA"
 * rather than meaning "this image has been processed".
 */
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { BANNERS } from "../lib/blog/banners.ts";

/** Banner box. 2.29:1 — the widest ratio PostBanner's clamp ever renders. */
const W = 1600;
const H = 700;

const OUT = join(process.cwd(), "public/blog/art");

async function build(slug: string, force: boolean) {
  const art = BANNERS[slug]?.art;
  if (!art) {
    console.log(`· ${slug} — no art block, skipped`);
    return;
  }

  const dest = join(OUT, `${slug}.webp`);
  if (existsSync(dest) && !force) {
    console.log(`· ${slug} — exists`);
    return;
  }

  // Pulled at 3200px un-cropped so the framing below is ours, not
  // Unsplash's entropy guess.
  const res = await fetch(`https://images.unsplash.com/${art.photo}?q=90&fm=jpg&w=3200`);
  if (!res.ok) throw new Error(`${slug}: unsplash ${res.status}`);
  const src = Buffer.from(await res.arrayBuffer());

  const out = await sharp(src)
    .resize(W, H, { fit: "cover", position: art.crop ?? "attention" })
    .grayscale()
    // Pull the frame down and compress its range: the band is a backdrop
    // for an h1, and anything above ~70% luminance steals from the type.
    // Slope 0.82 / intercept -12 lands the brightest highlight near 200 —
    // reads as "lit" without competing.
    .linear(0.82, -12)
    // Cool near-black tint. Warm greys go muddy against #ec1a63.
    .tint({ r: 214, g: 220, b: 236 })
    .modulate({ brightness: 0.92 })
    .webp({ quality: 72, effort: 6 })
    .toBuffer();

  await writeFile(dest, out);
  console.log(
    `✓ ${slug}.webp — ${(out.length / 1024).toFixed(0)}KB — © ${art.credit.name}`,
  );
}

const [, , slug] = process.argv;
await mkdir(OUT, { recursive: true });
if (slug) await build(slug, true);
else for (const s of Object.keys(BANNERS)) await build(s, false);
