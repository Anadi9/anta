/**
 * Per-post banner composition.
 *
 * WHY THIS IS DATA AND NOT ART FILES
 *
 * Every banner is assembled at render time from the same 19 art plates the
 * hero uses (`public/scene/*.webp`), laid out by the numbers below and
 * painted over a coded ground — grid rules, accent bloom, mono index strip.
 * Nothing here is a per-post image file.
 *
 * That is a deliberate trade. A bespoke 1600px hero image per post would
 * look richer, but it costs a render per post, ships ~150KB each, and — the
 * part that actually decides it — cannot be restyled. When the accent moves
 * or the header height changes, a folder of baked PNGs is 8 files to
 * regenerate and a composition is a number to edit. The plates are already
 * in the bundle for the homepage hero, so a banner adds no new bytes to a
 * warm cache.
 *
 * The intended upgrade path, if bespoke art is ever wanted: add an
 * `art: "/blog/<slug>.webp"` field, render it as the single plate, and keep
 * the coded ground exactly as is. The ground is the part that carries the
 * brand; the plates are the part that carries the subject.
 *
 * PICKING PLATES. Match the *motion* of the post, not its nouns. A piece
 * about filtering wants something converging; one about swapping providers
 * wants two of something. Reaching for `auto_core` on every post because it
 * looks the most impressive gives eight identical banners.
 *
 * Coordinates are percentages of the banner box: `cx`/`cy` position the
 * plate's centre, `w` is its width as a percentage of banner width. Plates
 * are allowed — encouraged — to overhang the edges; the band clips them and
 * a plate that fits neatly inside looks like a sticker.
 */

export type Plate = {
  /** Filename stem in public/scene/, without the extension. */
  src: PlateName;
  /** Centre position, % of the banner box. */
  cx: number;
  cy: number;
  /** Width, % of banner width. */
  w: number;
  /** 0–1. Defaults to 1; the plates already carry their own falloff. */
  op?: number;
  /** Mirror horizontally — usually to point a directional plate inward. */
  flip?: boolean;
  /** Edge feather, % of the plate, as [left, right, top, bottom]. */
  feather?: [number, number, number, number];
};

export type PlateName = keyof typeof PLATE_SIZE;

/**
 * Intrinsic pixel dimensions, mirroring the table in
 * components/hero-background/scenes.ts. Duplicated rather than imported on
 * purpose: that module is a 1200-line client-side GSAP scene builder, and
 * importing it from a server component to read one constant would pull the
 * whole thing — and its "use client" boundary — into the article route.
 *
 * If a plate is ever re-exported at a different size, both tables change.
 */
export const PLATE_SIZE = {
  arch_curve: [620, 292],
  arch_panel: [540, 340],
  arch_sphere: [230, 206],
  arch_star: [290, 310],
  auto_core: [432, 450],
  auto_in: [282, 405],
  auto_out: [370, 680],
  auto_ribbon: [520, 310],
  build_cubes: [505, 670],
  build_floor: [595, 400],
  build_node_high: [322, 370],
  build_node_low: [380, 360],
  design_bottom_right: [720, 465],
  design_ribbon: [400, 915],
  design_top_right: [490, 330],
  ship_arrow: [576, 430],
  ship_blob_low: [528, 349],
  ship_blob_top: [238, 369],
  ship_streaks: [525, 880],
} as const satisfies Record<string, readonly [number, number]>;

/**
 * The stock photograph behind the banner, when a post has one.
 *
 * The photo id and credit live here rather than in a JSON sidecar because
 * this is the file someone opens to change how a banner looks — splitting
 * "which photo" from "where the plates sit" would mean editing two files to
 * answer one question.
 *
 * scripts/art.ts turns this into public/blog/art/<slug>.webp. That file is
 * build output; this block is the source. A post with `art` ignores
 * `plates` entirely — the photo *is* the composition, and layering abstract
 * plates over a photograph reads as a mistake.
 *
 * LICENCE. Unsplash's licence grants free commercial use with no permission
 * needed and attribution merely appreciated, so `credit` is not a legal
 * requirement — it is kept because the alternative is a repo full of
 * photographs whose provenance nobody can reconstruct, and because the
 * footer costs one line.
 */
export type Art = {
  /** Unsplash image path, e.g. "photo-1662441049246-5505c7decc5e". */
  photo: string;
  /**
   * Crop bias passed to sharp's `fit: cover`. Default "attention" lets it
   * pick; name a side when the subject must clear the left-hand scrim.
   */
  crop?: "attention" | "entropy" | "left" | "right" | "top" | "bottom" | "centre";
  credit: { name: string; username: string };
};

export type Banner = {
  /**
   * Two or three words in the mono strip, describing the *diagram* the
   * banner implies. Not the post title repeated — the title sits directly
   * above it at 40px+, and echoing it wastes the one line of type the
   * banner gets.
   */
  motif: string;
  /** Ignored when `art` is set. */
  plates: Plate[];
  art?: Art;
};

export const BANNERS: Record<string, Banner> = {
  // Money broken into parts: a stack of discrete blocks, plus the floor grid
  // under it to read as an itemised surface rather than a pile.
  "what-a-3000-dollar-ai-pilot-actually-buys": {
    motif: "Scope, itemised",
    plates: [
      { src: "build_floor", cx: 62, cy: 96, w: 52, op: 0.55, feather: [18, 12, 40, 0] },
      { src: "build_cubes", cx: 78, cy: 44, w: 26, op: 0.9, feather: [10, 10, 8, 22] },
      { src: "arch_sphere", cx: 94, cy: 24, w: 9, op: 0.7, feather: [20, 20, 20, 20] },
    ],
    // A cabinet of small labelled drawers. The post's argument is that a
    // fixed budget is not one lump but a set of separately-named
    // compartments you can open and count. A pile of banknotes would have
    // illustrated the price; this illustrates the itemisation.
    art: {
      photo: "photo-1746957064801-2cf6a5286bf7",
      credit: { name: "MChe Lee", username: "mclee" },
    },
  },

  // Two masses of comparable weight, held apart. The decision is a fork, so
  // the composition is symmetrical in a way none of the others are.
  "build-vs-buy-internal-ai-tool": {
    plates: [
      { src: "build_node_low", cx: 64, cy: 58, w: 20, op: 0.8, feather: [14, 14, 14, 14] },
      { src: "build_node_high", cx: 86, cy: 38, w: 18, op: 0.8, feather: [14, 14, 14, 14] },
      { src: "arch_curve", cx: 76, cy: 84, w: 46, op: 0.4, feather: [20, 20, 30, 20] },
    ],
    motif: "One fork, two costs",
    // Track switches with their levers still thrown. Two routes out of one
    // piece of iron, and the choice is mechanical, reversible and made in
    // advance — which is the honest shape of build-vs-buy.
    art: {
      photo: "photo-1773431709195-19d9b96d4967",
      credit: { name: "pavel ondera", username: "pavelba" },
    },
  },

  // Many in, few out — the plates that literally converge and emit.
  "scoring-b2b-leads-with-an-llm": {
    motif: "Many in, few out",
    plates: [
      { src: "auto_in", cx: 58, cy: 46, w: 15, op: 0.75, feather: [30, 10, 14, 14] },
      { src: "auto_core", cx: 76, cy: 50, w: 26, op: 0.95, feather: [12, 12, 10, 12] },
      { src: "auto_out", cx: 95, cy: 56, w: 18, op: 0.7, feather: [10, 30, 14, 14] },
    ],
    // Plant pipework converging into a smaller run. Many in, few out, as
    // plumbing rather than as a marketing funnel — the funnel diagram is
    // what every other lead-scoring post already uses.
    art: {
      photo: "photo-1657950715343-a72c6fe3a27a",
      credit: { name: "Peter Herrmann", username: "tama66" },
    },
  },

  // A held-up panel with annotations: the checklist, not a machine.
  "what-to-ask-an-ai-agency": {
    motif: "Seven checks",
    plates: [
      { src: "arch_panel", cx: 74, cy: 48, w: 34, op: 0.85, feather: [14, 14, 12, 16] },
      { src: "arch_star", cx: 93, cy: 70, w: 14, op: 0.6, feather: [18, 18, 18, 18] },
    ],
    // A vernier caliper's scale, close. Seven questions are an instrument
    // for measuring somebody, and this is what an instrument that measures
    // precisely actually looks like.
    art: {
      photo: "photo-1685038408124-e20ecac92293",
      credit: { name: "Bozhin Karaivanov", username: "bkaraivanov" },
    },
  },

  // Velocity meeting a barrier — streaks running into something that stops
  // them. This one is about guardrails, so the plate that reads as "fast"
  // is deliberately the one being clipped.
  "llm-api-costs-without-surprises": {
    motif: "Four guards, one fallback",
    plates: [
      { src: "ship_streaks", cx: 54, cy: 52, w: 30, op: 0.45, feather: [30, 18, 16, 16] },
      { src: "ship_arrow", cx: 75, cy: 48, w: 30, op: 0.95, feather: [16, 14, 14, 14] },
      { src: "ship_blob_low", cx: 94, cy: 80, w: 16, op: 0.45, feather: [22, 22, 22, 22] },
    ],
    // A cockpit guidance panel mid pre-flight setup: rows of discrete
    // switches, each one a limit somebody set on purpose before departure.
    // That is the post's argument as an object. The obvious searches — a
    // dollar sign, a rising graph — illustrate the *fear*; this one
    // illustrates the answer.
    art: {
      photo: "photo-1662441049246-5505c7decc5e",
      credit: { name: "Sean Mullen", username: "yyz_guy" },
    },
  },

  "apollo-free-plan-limits": {
    motif: "Where the wall is",
    plates: [
      { src: "arch_panel", cx: 80, cy: 52, w: 32, op: 0.75, feather: [16, 14, 14, 16] },
      { src: "arch_sphere", cx: 62, cy: 34, w: 10, op: 0.65, feather: [20, 20, 20, 20] },
    ],
    // A blank concrete face meeting the frame at an angle. The post is
    // about locating a boundary, not complaining about it, so the wall is
    // photographed as a fact rather than as an obstacle.
    art: {
      photo: "photo-1606061411100-e9d3e3dd9fc5",
      credit: { name: "Matze Bob", username: "matzebob" },
    },
  },

  "automating-bol-and-pod-document-processing": {
    motif: "Paper in, records out",
    plates: [
      { src: "design_ribbon", cx: 68, cy: 46, w: 16, op: 0.6, feather: [20, 20, 24, 24] },
      { src: "design_bottom_right", cx: 88, cy: 66, w: 36, op: 0.8, feather: [16, 12, 16, 12] },
    ],
    // Bound ledgers stacked on a dark table. Deliberately the *records*
    // half of the motif and not the paper half: the interesting output of
    // document processing is the row you can query, not the scan.
    art: {
      photo: "photo-1584099799061-455b6b0b7f00",
      credit: { name: "Odd Sun", username: "maybeimdreaming" },
    },
  },

  "swapping-claude-for-gemini-behind-one-interface": {
    motif: "Two paths, one contract",
    plates: [
      { src: "auto_ribbon", cx: 72, cy: 44, w: 30, op: 0.8, feather: [16, 16, 16, 16] },
      { src: "design_top_right", cx: 93, cy: 30, w: 24, op: 0.6, feather: [18, 12, 12, 18] },
    ],
    // A modular synth rack. Interchangeable modules from different makers,
    // all speaking one patch standard — the closest thing in the physical
    // world to putting two model providers behind one interface.
    art: {
      photo: "photo-1618577468440-6706245765ea",
      credit: { name: "Adi Goldstein", username: "adigold1" },
    },
  },
};

/**
 * Composition for a slug, or `null` for one with no entry.
 *
 * Returning null rather than throwing is the right failure here: a post
 * without a banner should publish as a text header, which is exactly what
 * the site shipped before banners existed. Making it a build error would
 * mean a new post can't go live until someone has picked plates for it,
 * which puts art direction on the critical path of publishing.
 */
export function bannerFor(slug: string): Banner | null {
  return BANNERS[slug] ?? null;
}
