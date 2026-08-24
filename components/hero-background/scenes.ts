/**
 * ANTA hero scenes — five keyword worlds composited from the rendered art
 * plates in `public/scene/`, animated with GSAP (float, parallax, entry,
 * procedural accents).
 *
 * Ported from **`design-reference/ANTA Hero.html`**, which is the first export
 * to actually ship `hero-scenes.js` — the module `ANTA Site.dc.html` only
 * `import()`ed and never included. That export's `heroMode()` returns
 * `'Scenes'` and its canvas draws nothing, so this layer *is* the hero
 * background; `HeroCanvas`'s network/blueprint modes are the fallback art, not
 * the target.
 *
 * `createHeroScenes(root, opts)` → `{ setVariant, destroy }`, same shape as the
 * reference. Framework-free on purpose: it owns a subtree of DOM nodes and a
 * pile of GSAP tweens, which React would only get in the way of. `HeroScenes`
 * is the thin component that mounts and drives it.
 *
 * DELIBERATE DEVIATIONS from the reference module:
 * - Art is served from `/scene/*.webp` (Next's `public/`) rather than the
 *   export's `assets/scene/*.png?v=6` bundle paths + `window.__resources` map.
 *   WebP, not the reference's PNG: 5.1 MB -> 1.1 MB across the 19 plates.
 *   The .webp files ARE the shipped masters — the PNG originals were removed
 *   from public/scene once the conversion was verified, since carrying both
 *   put 5 MB of never-fetched bytes in every deploy. To re-encode at a
 *   different quality, recover them from git (they were last present in
 *   commit 6d9cb73) and re-run: cwebp -q 90 -alpha_q 100 -m 6 in.png -o out.webp
 *   `-alpha_q 100` is not optional — see the note on img.src below.
 * - The accent is read from the `--color-accent` CSS variable by the caller
 *   instead of defaulting to the reference's hardcoded `#C20A62`, so the art
 *   tracks `tokens.ts` / `app/globals.css` (same rule `HeroCanvas` follows).
 * - The reference's unused `out.loops` bucket is dropped; only `out.tw` was
 *   ever written to.
 */

import { gsap } from "gsap";
import type { HeroVariant } from "./types";

const NS = "http://www.w3.org/2000/svg";
const ART = "/scene/";

/**
 * Intrinsic pixel size of every art plate in `public/scene/`, used to set
 * each <img>'s width/height attributes.
 *
 * Why this table exists: the plates are absolutely positioned and sized in
 * *percent of the hero box* (LayerDef.w), with `height:auto` — so until the
 * bytes arrive the browser has no idea how tall any of them is, lays them
 * out at zero height, and reflows the whole scene as each one decodes. The
 * width/height attributes give it the intrinsic aspect ratio up front, so
 * the box is reserved at the right size from the first frame and nothing
 * jumps. That is the standard CLS fix, and it is the reason these are
 * attributes rather than CSS: the CSS `width:100%;height:auto` still wins
 * for actual sizing, the attributes only supply the ratio.
 *
 * Keyed by `LayerDef.src`, not per layer, because several plates are reused
 * across scenes at different sizes (build_node_high and ship_blob_top each
 * appear twice) — the intrinsic size is a property of the file.
 *
 * If a plate is re-exported at a different size, update it here or the
 * reserved box will be the wrong shape.
 */
const PLATE_SIZE: Record<string, [w: number, h: number]> = {
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
};

const rnd = (s: number) => {
  const x = Math.sin(s * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

const hexToRgb = (hex: string) => {
  const h = (hex || "#C20A62").replace("#", "");
  const f =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(f, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

type Feather = number | { l?: number; r?: number; t?: number; b?: number };

/**
 * cx/cy — centre of the plate, % of the hero box.
 * w      — width, % of the hero box.
 * z      — parallax depth (0 = anchored, 1 = most reactive).
 * fx/fy/rot/dur — the idle float: amplitude in px/deg, period in seconds.
 * in     — entry offset {x, y, s(cale), r(otation)}.
 */
type LayerDef = {
  src: string;
  cx: number;
  cy: number;
  w: number;
  z?: number;
  op?: number;
  blend?: string;
  flip?: 0 | 1;
  dur?: number;
  fx?: number;
  fy?: number;
  rot?: number;
  feather?: Feather;
  in?: { x?: number; y?: number; s?: number; r?: number };
};

type ExtraKey =
  | "twinkle"
  | "orbs"
  | "orbsAuto"
  | "links"
  | "blueprint"
  | "flow"
  | "streaks";

type SceneDef = {
  glows?: string[];
  layers?: LayerDef[];
  extras?: ExtraKey[];
};

/* ---------------- scene definitions ---------------- */

const SCENES: Record<HeroVariant, SceneDef> = {
  design: {
    glows: [
      "left:2%;top:-12%;width:34%;height:96%;background:radial-gradient(ellipse at 50% 50%,rgba($A,0.10),transparent 66%);",
      "right:-10%;top:-16%;width:40%;height:72%;background:radial-gradient(ellipse at 58% 50%,rgba($A,0.11),transparent 64%);",
      "right:-12%;bottom:-20%;width:42%;height:76%;background:radial-gradient(ellipse at 58% 50%,rgba($A,0.10),transparent 64%);",
    ],
    layers: [
      { src: "design_ribbon", cx: 15, cy: 50, w: 32, z: 0.55, dur: 17, fx: 12, fy: 30, rot: 1.6, feather: { l: 4, r: 42, t: 4, b: 4 }, in: { x: -90, s: 1.06 } },
      { src: "design_top_right", cx: 89, cy: 16, w: 32, z: 0.4, dur: 19, fx: -14, fy: 20, rot: -1.4, in: { x: 70, y: -50 } },
      { src: "design_bottom_right", cx: 84, cy: 80, w: 32, z: 0.46, dur: 21, fx: -18, fy: -18, rot: 1.2, in: { x: 70, y: 50 } },
    ],
    extras: ["orbs", "twinkle"],
  },

  build: {
    glows: [
      "right:2%;top:2%;width:54%;height:94%;background:radial-gradient(circle at 52% 48%,rgba($A,0.17),transparent 62%);",
      "left:2%;top:4%;width:36%;height:90%;background:radial-gradient(ellipse at 50% 50%,rgba($A,0.08),transparent 66%);",
    ],
    layers: [
      { src: "build_floor", cx: 64, cy: 84, w: 44, z: 0.1, op: 0.7, blend: "screen", dur: 24, fx: 10, fy: -8, in: { y: 40, s: 1.04 } },
      { src: "build_cubes", cx: 80, cy: 52, w: 40, z: 0.5, dur: 18, fx: -12, fy: -16, rot: 0.8, in: { y: 60, s: 0.9 } },
      { src: "build_node_high", cx: 15, cy: 35, w: 32, z: 0.72, dur: 11, fx: 16, fy: -20, rot: 4, in: { x: -50, y: -40, s: 0.86 } },
      { src: "build_node_low", cx: 17, cy: 84, w: 28, z: 0.66, dur: 13, fx: 14, fy: 22, rot: -4, in: { x: -60, y: 30, s: 0.86 } },
      { src: "build_node_high", cx: 91, cy: 10, w: 13, z: 0.8, op: 0.85, flip: 1, dur: 9.5, fx: -14, fy: 18, rot: -6, in: { x: 50, y: -30, s: 0.84 } },
    ],
    extras: ["links", "twinkle"],
  },

  architect: {
    glows: [
      "left:-10%;bottom:-24%;width:52%;height:70%;background:radial-gradient(ellipse at 50% 50%,rgba($A,0.11),transparent 64%);",
      "right:-12%;top:-16%;width:44%;height:66%;background:radial-gradient(ellipse at 55% 50%,rgba($A,0.08),transparent 64%);",
    ],
    layers: [
      { src: "arch_curve", cx: 15, cy: 82, w: 44, z: 0.34, dur: 20, fx: 14, fy: -12, rot: 0.8, in: { x: -60, y: 40 } },
      { src: "arch_panel", cx: 81, cy: 84, w: 38, z: 0.3, dur: 22, fx: -12, fy: -14, rot: -0.7, in: { x: 60, y: 40 } },
      { src: "arch_star", cx: 19, cy: 13, w: 19, z: 0.7, dur: 12, fx: 15, fy: -16, rot: 5, in: { x: -40, y: -46, s: 0.88 } },
      { src: "arch_sphere", cx: 87, cy: 15, w: 16, z: 0.62, dur: 10, fx: -12, fy: 16, rot: -3, in: { x: 40, y: -40, s: 0.88 } },
    ],
    extras: ["blueprint"],
  },

  automate: {
    glows: [
      "left:14%;top:50%;width:30%;height:52%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(255,190,222,0.10),rgba($A,0.09) 34%,transparent 70%);",
      "left:72%;top:52%;width:44%;height:82%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba($A,0.16),transparent 62%);",
      "left:-8%;bottom:-24%;width:44%;height:60%;background:radial-gradient(ellipse at 50% 50%,rgba($A,0.10),transparent 64%);",
    ],
    layers: [
      { src: "auto_ribbon", cx: 16, cy: 86, w: 47, z: 0.2, dur: 22, fx: 14, fy: -12, rot: 0.8, in: { x: -60, y: 40 } },
      { src: "ship_blob_top", cx: 20, cy: 16, w: 18, z: 0.78, op: 0.85, dur: 10, fx: 14, fy: -16, rot: 6, in: { y: -50, s: 0.85 } },
      { src: "ship_blob_top", cx: 68, cy: 10, w: 13, z: 0.74, op: 0.85, flip: 1, dur: 12, fx: -12, fy: 16, rot: -5, in: { y: -50, s: 0.85 } },
      { src: "auto_in", cx: 8, cy: 40, w: 20, z: 0.44, blend: "screen", dur: 16, fx: 12, fy: 12, in: { x: -70, s: 1.05 } },
      { src: "auto_core", cx: 72, cy: 48, w: 36, z: 0.52, dur: 15, fx: -10, fy: -14, rot: 1, in: { s: 0.9 } },
      { src: "auto_out", cx: 88, cy: 47, w: 30, z: 0.46, blend: "screen", dur: 17, fx: -14, fy: 10, in: { x: 70, s: 1.04 } },
    ],
    extras: ["flow", "orbsAuto"],
  },

  ship: {
    glows: [
      "left:-10%;top:-16%;width:44%;height:70%;background:radial-gradient(ellipse at 46% 48%,rgba($A,0.09),transparent 64%);",
      "left:-12%;bottom:-22%;width:46%;height:56%;background:radial-gradient(ellipse at 50% 50%,rgba($A,0.08),transparent 64%);",
      "left:78%;top:49%;width:40%;height:54%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(255,168,204,0.26),rgba($A,0.15) 34%,transparent 70%);",
    ],
    layers: [
      { src: "ship_streaks", cx: 60, cy: 50, w: 38, z: 0.24, op: 0.55, blend: "screen", dur: 20, fx: 18, fy: -10, in: { x: -60, s: 1.05 } },
      { src: "ship_blob_low", cx: 9, cy: 86, w: 44, z: 0.3, dur: 21, fx: 14, fy: -12, rot: 0.8, in: { x: -60, y: 40 } },
      { src: "ship_blob_top", cx: 10, cy: 15, w: 24, z: 0.6, dur: 13, fx: 14, fy: 18, rot: -3, in: { x: -50, y: -40 } },
      { src: "ship_arrow", cx: 75, cy: 48, w: 46, z: 0.5, blend: "screen", dur: 6.5, fx: 26, fy: -8, in: { x: 120, s: 0.94 } },
    ],
    extras: ["streaks", "twinkle"],
  },
};

/* ---------------- public API ---------------- */

export type HeroScenesOptions = {
  accent?: string;
  reduced?: boolean;
  /** Scales the procedural accent counts (dots, streams, streaks). */
  intensity?: number;
};

export type HeroScenesApi = {
  setVariant(name: HeroVariant): void;
  destroy(): void;
};

type Out = { tw: gsap.core.Animation[]; arts?: Art[] };

type Art = {
  L: LayerDef;
  par: HTMLDivElement;
  wrap: HTMLDivElement;
  img: HTMLImageElement;
  i: number;
  depth?: number;
  qx?: (v: number) => void;
  qy?: (v: number) => void;
};

type Scene = {
  name: HeroVariant;
  el: HTMLDivElement;
  out: Out;
  dead?: boolean;
  timer?: ReturnType<typeof setTimeout>;
};

export function createHeroScenes(
  root: HTMLElement,
  opts: HeroScenesOptions = {},
): HeroScenesApi {
  const g = gsap;
  const acc = opts.accent || "#C20A62";
  const rgb = hexToRgb(acc);
  const A = (a: number | string) => `rgba(${rgb},${a})`;
  const reduced = !!opts.reduced;
  const intensity = opts.intensity == null ? 0.8 : opts.intensity;
  const uid = "hs" + Math.floor(Math.random() * 99999);
  let current: Scene | null = null;
  let token = 0;
  const live: Scene[] = [];

  // The first scene built is the one on screen at first paint, so its plates
  // are the hero's LCP candidates and are fetched at high priority. Every
  // later scene is built only when the headline verb rotates to it (see
  // setVariant) — that art is speculative, seconds away from being needed,
  // and must not compete with anything the visitor is actually waiting on.
  let firstBuild = true;

  const dv = (css: string, parent?: Element) => {
    const e = document.createElement("div");
    e.style.cssText = css;
    if (parent) parent.appendChild(e);
    return e;
  };

  const sv = <K extends keyof SVGElementTagNameMap>(
    tag: K,
    attrs: Record<string, string | number>,
    parent?: Element,
  ): SVGElementTagNameMap[K] => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, String(attrs[k]));
    if (parent) parent.appendChild(e);
    return e;
  };

  const svgRoot = (parent: Element) => {
    const s = sv(
      "svg",
      { viewBox: "0 0 1440 900", preserveAspectRatio: "xMidYMid slice" },
      parent,
    );
    s.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block;overflow:visible;";
    return s;
  };

  /* ---------------- procedural accents ---------------- */

  const twinkle = (host: Element, out: Out, n: number, seed: number) => {
    const grp = dv("position:absolute;inset:0;", host);
    const dots: HTMLDivElement[] = [];
    const count = Math.max(8, Math.round((n || 22) * intensity));
    for (let i = 0; i < count; i++) {
      const s = (1.4 + 2.2 * rnd(i + seed)).toFixed(1);
      dots.push(
        dv(
          "position:absolute;left:" +
            (3 + rnd(i + seed + 7) * 94).toFixed(1) +
            "%;top:" +
            (4 + rnd(i + seed + 53) * 92).toFixed(1) +
            "%;width:" +
            s +
            "px;height:" +
            s +
            "px;border-radius:50%;background:#ffd0e2;box-shadow:0 0 " +
            (5 + rnd(i + seed + 11) * 9).toFixed(1) +
            "px " +
            A(0.8) +
            ";",
          grp,
        ),
      );
    }
    if (reduced) return;
    out.tw.push(
      g.fromTo(
        dots,
        { opacity: 0.12 },
        {
          opacity: 0.9,
          duration: 2.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.17, from: "random" },
        },
      ),
    );
  };

  // BUILD — dashed circuit lines between the floating node clusters and the cube stack
  const links = (host: Element, out: Out) => {
    const svg = svgRoot(host);
    const segs = [
      [418, 190, 690, 330],
      [288, 566, 640, 470],
      [1310, 180, 1030, 300],
      [418, 190, 288, 566],
    ];
    const lines = segs.map((s) =>
      sv(
        "path",
        {
          d: `M ${s[0]} ${s[1]} L ${s[2]} ${s[3]}`,
          fill: "none",
          stroke: A(0.5),
          "stroke-width": 1.1,
          "stroke-dasharray": "4 8",
          "stroke-linecap": "round",
        },
        svg,
      ),
    );
    segs.forEach((s) =>
      sv("circle", { cx: s[2], cy: s[3], r: 2.4, fill: "#ffe4ef", opacity: 0.85 }, svg),
    );
    if (reduced) return;
    out.tw.push(
      g.from(lines, {
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.12,
        delay: 0.5,
      }),
    );
    out.tw.push(
      g.to(lines, { strokeDashoffset: -48, duration: 3.2, ease: "none", repeat: -1 }),
    );
  };

  // ARCHITECT — the drafting field: fine grid, brackets, crosshairs, coordinate call-outs
  const blueprint = (host: Element, out: Out) => {
    const svg = svgRoot(host);
    const gridG = sv("g", {}, svg);
    const dashG = sv("g", { opacity: 0 }, svg);
    const notes = sv("g", { opacity: 0 }, svg);

    const ln = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      a: number,
      w?: number,
      p?: Element,
    ) =>
      sv(
        "line",
        { x1, y1, x2, y2, stroke: A(a), "stroke-width": w || 1, "stroke-linecap": "square" },
        p || gridG,
      );

    const dln = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      a: number,
      dash?: string,
    ) =>
      sv(
        "line",
        { x1, y1, x2, y2, stroke: A(a), "stroke-width": 1, "stroke-dasharray": dash || "5 7" },
        dashG,
      );

    const txt = (
      x: number,
      y: number,
      s: string,
      size?: number,
      fill?: string,
      anchor?: string,
    ) => {
      const t = sv(
        "text",
        {
          x,
          y,
          fill: fill || "rgba(255,110,165,0.92)",
          "font-family": "'JetBrains Mono', monospace",
          "font-size": size || 13,
          "letter-spacing": "0.08em",
          "text-anchor": anchor || "start",
        },
        notes,
      );
      t.textContent = s;
      return t;
    };

    const dot = (x: number, y: number, r?: number, o?: number) =>
      sv(
        "circle",
        { cx: x, cy: y, r: r || 2, fill: "#ff86b3", opacity: o == null ? 0.85 : o },
        notes,
      );

    const plus = (x: number, y: number, s: number, a?: number) => {
      ln(x - s, y, x + s, y, a || 0.5, 1, notes);
      ln(x, y - s, x, y + s, a || 0.5, 1, notes);
    };

    const gridEls: SVGElement[] = [];
    (
      [
        [72, 0.09],
        [297, 0.13],
        [470, 0.1],
        [620, 0.12],
        [771, 0.09],
        [1010, 0.16],
        [1205, 0.1],
        [1352, 0.08],
      ] as [number, number][]
    ).forEach((v) => gridEls.push(ln(v[0], 0, v[0], 900, v[1], 0.8)));
    (
      [
        [96, 0.12],
        [306, 0.09],
        [470, 0.08],
        [612, 0.1],
        [746, 0.09],
        [820, 0.11],
      ] as [number, number][]
    ).forEach((h) => gridEls.push(ln(0, h[0], 1440, h[0], h[1], 0.8)));

    const sq = [258, 266, 353, 364];
    gridEls.push(ln(sq[0], sq[1], sq[2], sq[1], 0.42, 1));
    gridEls.push(ln(sq[2], sq[1], sq[2], sq[3], 0.42, 1));
    gridEls.push(ln(sq[2], sq[3], sq[0], sq[3], 0.42, 1));
    gridEls.push(ln(sq[0], sq[3], sq[0], sq[1], 0.42, 1));
    dln(sq[0], sq[1], sq[2], sq[3], 0.45, "4 6");
    dln(sq[2], sq[1], sq[0], sq[3], 0.45, "4 6");
    [
      [sq[0], sq[1]],
      [sq[2], sq[1]],
      [sq[0], sq[3]],
      [sq[2], sq[3]],
    ].forEach((c) => dot(c[0], c[1], 1.8, 0.9));

    const br = 46;
    const fr = [1049, 117, 1344, 603];
    const corner = (x: number, y: number, sx: number, sy: number) => {
      gridEls.push(ln(x, y, x + br * sx, y, 0.48, 1.2));
      gridEls.push(ln(x, y, x, y + br * sy, 0.48, 1.2));
    };
    corner(fr[0], fr[1], 1, 1);
    corner(fr[2], fr[1], -1, 1);
    corner(fr[0], fr[3], 1, -1);
    corner(fr[2], fr[3], -1, -1);
    gridEls.push(ln(fr[0], fr[1], fr[0], fr[3], 0.14, 1));
    gridEls.push(ln(fr[2], fr[1], fr[2], fr[3], 0.14, 1));

    const inr = [1120, 218, 1292, 478];
    dln(inr[0], inr[1], inr[2], inr[1], 0.34);
    dln(inr[2], inr[1], inr[2], inr[3], 0.34);
    dln(inr[2], inr[3], inr[0], inr[3], 0.34);
    dln(inr[0], inr[3], inr[0], inr[1], 0.34);

    const arcs = [
      sv(
        "circle",
        { cx: 10, cy: 700, r: 344, fill: "none", stroke: A(0.15), "stroke-width": 1 },
        gridG,
      ),
      sv(
        "circle",
        { cx: 10, cy: 700, r: 196, fill: "none", stroke: A(0.12), "stroke-width": 1 },
        gridG,
      ),
    ];

    txt(1341, 62, "X. 892");
    txt(1341, 85, "Y. 348");
    sv(
      "circle",
      { cx: 1318, cy: 68, r: 6.5, fill: "none", stroke: A(0.7), "stroke-width": 1 },
      notes,
    );
    plus(1318, 68, 12, 0.7);
    txt(222, 208, "Y.278");
    dot(206, 203, 1.9);
    txt(930, 152, "A.24");
    sv(
      "path",
      {
        d: "M 976 158 L 1006 186 L 1032 186",
        fill: "none",
        stroke: A(0.55),
        "stroke-width": 1,
      },
      notes,
    );
    txt(922, 632, "B.52");
    [
      [901, 732],
      [755, 823],
      [620, 96],
      [470, 306],
      [1206, 822],
    ].forEach((c) => plus(c[0], c[1], 5, 0.42));

    const pts: SVGElement[] = [];
    for (let i = 0; i < 16; i++)
      pts.push(
        dot(60 + rnd(i + 5) * 1320, 40 + rnd(i + 61) * 830, 1.5 + rnd(i + 3) * 0.9, 0.6),
      );

    const solid: SVGElement[] = gridEls.concat(arcs);
    solid.forEach((el) => {
      const len =
        "getTotalLength" in el ? (el as SVGGeometryElement).getTotalLength() : 0;
      if (len) g.set(el, { strokeDasharray: len, strokeDashoffset: len });
    });
    if (reduced) {
      g.set(solid, { strokeDashoffset: 0 });
      g.set([dashG, notes], { opacity: 1 });
      return;
    }
    const tl = g.timeline();
    tl.to(
      gridEls,
      { strokeDashoffset: 0, duration: 1.3, ease: "power2.out", stagger: { each: 0.035 } },
      0,
    )
      .to(arcs, { strokeDashoffset: 0, duration: 2.2, ease: "power1.inOut" }, 0.35)
      .to(dashG, { opacity: 1, duration: 0.8, ease: "power2.out" }, 1.0)
      .to(notes, { opacity: 1, duration: 0.9, ease: "power2.out" }, 1.35);
    out.tw.push(tl);
    out.tw.push(
      g.to(dashG.querySelectorAll("line"), {
        strokeDashoffset: -24,
        duration: 3.6,
        ease: "none",
        repeat: -1,
      }),
    );
    out.tw.push(
      g.fromTo(
        pts,
        { opacity: 0.25 },
        {
          opacity: 0.95,
          duration: 2.1,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.2, from: "random" },
        },
      ),
    );
    const bar = dv(
      "position:absolute;left:0;right:0;height:120px;top:-14%;background:linear-gradient(180deg,transparent," +
        A(0.1) +
        ",rgba(255,180,205,0.07),transparent);",
      host,
    );
    out.tw.push(
      g.fromTo(bar, { top: "-14%" }, { top: "106%", duration: 9, ease: "none", repeat: -1 }),
    );
  };

  // AUTOMATE — packets travelling the intake fan and radiating out of the core
  const flow = (host: Element, out: Out) => {
    const svg = svgRoot(host);
    const F1 = { x: 300, y: 430 };
    const F2 = { x: 940, y: 430 };
    const comets: { el: SVGPathElement; len: number; i: number }[] = [];

    const stream = (d: string, i: number) => {
      const path = sv(
        "path",
        {
          d,
          fill: "none",
          stroke: A((0.1 + 0.2 * rnd(i + 29)).toFixed(2)),
          "stroke-width": 0.7,
          "stroke-linecap": "round",
        },
        svg,
      );
      const comet = sv(
        "path",
        {
          d,
          fill: "none",
          stroke: "rgba(255,228,246,0.95)",
          "stroke-width": 1.5,
          "stroke-linecap": "round",
        },
        svg,
      );
      const len = path.getTotalLength ? path.getTotalLength() : 300;
      comets.push({ el: comet, len: len || 300, i });
    };

    const nL = Math.max(9, Math.round(15 * intensity));
    for (let i = 0; i < nL; i++) {
      const t = (i / (nL - 1) - 0.5) * 1.3 + (rnd(i + 5) - 0.5) * 0.06;
      const L = 210 + 130 * rnd(i + 17);
      const sx = F1.x - Math.cos(t) * L;
      const sy = F1.y + Math.sin(t) * L * 1.15;
      stream(
        "M " +
          sx.toFixed(1) +
          " " +
          sy.toFixed(1) +
          " C " +
          (sx + L * 0.42).toFixed(1) +
          " " +
          (sy + (F1.y - sy) * 0.06).toFixed(1) +
          ", " +
          (F1.x - L * 0.36).toFixed(1) +
          " " +
          (F1.y + (sy - F1.y) * 0.22).toFixed(1) +
          ", " +
          F1.x +
          " " +
          F1.y,
        i,
      );
    }
    const nR = Math.max(8, Math.round(13 * intensity));
    for (let i = 0; i < nR; i++) {
      const t = (i / (nR - 1) - 0.5) * 1.4 + (rnd(i + 61) - 0.5) * 0.06;
      const L = 160 + 150 * rnd(i + 71);
      const ex = F2.x + Math.cos(t) * L;
      const ey = F2.y + Math.sin(t) * L * 1.35;
      stream(
        "M " +
          F2.x +
          " " +
          F2.y +
          " C " +
          (F2.x + L * 0.34).toFixed(1) +
          " " +
          (F2.y + (ey - F2.y) * 0.1).toFixed(1) +
          ", " +
          (ex - L * 0.34).toFixed(1) +
          " " +
          (ey - (ey - F2.y) * 0.16).toFixed(1) +
          ", " +
          ex.toFixed(1) +
          " " +
          ey.toFixed(1),
        200 + i,
      );
    }

    const hud = sv("g", { opacity: 0 }, svg);
    const loop = sv(
      "path",
      {
        d: "M 330 660 C 400 800, 700 852, 900 838 C 1030 828, 1090 740, 1100 640",
        fill: "none",
        stroke: A(0.55),
        "stroke-width": 1.1,
        "stroke-dasharray": "2 9",
        "stroke-linecap": "round",
      },
      hud,
    );
    sv(
      "path",
      {
        d: "M 1093 654 L 1100 638 L 1107 654",
        fill: "none",
        stroke: A(0.85),
        "stroke-width": 1.1,
        "stroke-linecap": "round",
      },
      hud,
    );
    sv(
      "circle",
      {
        cx: 660,
        cy: 800,
        r: 12,
        fill: "none",
        stroke: A(0.75),
        "stroke-width": 1.2,
        "stroke-dasharray": "3 4",
      },
      hud,
    );
    const t1 = sv(
      "text",
      {
        x: 688,
        y: 796,
        fill: "rgba(255,58,140,0.95)",
        "font-family": "'JetBrains Mono', monospace",
        "font-size": 10.5,
        "font-weight": 700,
        "letter-spacing": "0.15em",
      },
      hud,
    );
    t1.textContent = "LEARNING LOOP";
    const t2 = sv(
      "text",
      {
        x: 688,
        y: 817,
        fill: "rgba(238,230,236,0.86)",
        "font-family": "'Space Grotesk', Helvetica, Arial, sans-serif",
        "font-size": 11.5,
      },
      hud,
    );
    t2.textContent = "Continuous Improvement";

    // intake callout — bracketed box under the converging fan
    const bx0 = 176,
      by0 = 600,
      bx1 = 314,
      by1 = 700;
    const brk = sv("g", { opacity: 0 }, hud);
    sv(
      "path",
      {
        d: `M ${bx0} ${by0 + 36} L ${bx0} ${by0} L ${bx0 + 26} ${by0}`,
        fill: "none",
        stroke: A(0.8),
        "stroke-width": 1.2,
        "stroke-linecap": "square",
      },
      brk,
    );
    sv(
      "path",
      {
        d: `M ${bx0 + 34} ${by0} L ${bx0 + 62} ${by0}`,
        fill: "none",
        stroke: A(0.55),
        "stroke-width": 1.2,
        "stroke-linecap": "square",
      },
      brk,
    );
    sv(
      "path",
      {
        d: `M ${bx1} ${by1 - 26} L ${bx1} ${by1} L ${bx1 - 26} ${by1}`,
        fill: "none",
        stroke: A(0.8),
        "stroke-width": 1.2,
        "stroke-linecap": "square",
      },
      brk,
    );
    const i1 = sv(
      "text",
      {
        x: bx0 + 26,
        y: by0 + 34,
        fill: "rgba(255,58,140,0.95)",
        "font-family": "'JetBrains Mono', monospace",
        "font-size": 12,
        "font-weight": 700,
        "letter-spacing": "0.15em",
      },
      brk,
    );
    i1.textContent = "INPUTS";
    const i2 = sv(
      "text",
      {
        x: bx0 + 26,
        y: by0 + 63,
        fill: "rgba(238,230,236,0.86)",
        "font-family": "'Space Grotesk', Helvetica, Arial, sans-serif",
        "font-size": 13,
      },
      brk,
    );
    i2.textContent = "Unstructured";
    const i3 = sv(
      "text",
      {
        x: bx0 + 26,
        y: by0 + 85,
        fill: "rgba(238,230,236,0.86)",
        "font-family": "'Space Grotesk', Helvetica, Arial, sans-serif",
        "font-size": 13,
      },
      brk,
    );
    i3.textContent = "Data Streams";

    if (reduced) {
      g.set([hud, brk], { opacity: 1 });
      return;
    }
    out.tw.push(g.to(brk, { opacity: 1, duration: 0.9, ease: "power2.out", delay: 0.75 }));
    out.tw.push(g.to(hud, { opacity: 1, duration: 1.1, ease: "power2.out", delay: 0.5 }));
    out.tw.push(
      g.to(loop, { strokeDashoffset: -66, duration: 3.4, ease: "none", repeat: -1 }),
    );
    comets.forEach((c, i) => {
      g.set(c.el, {
        strokeDasharray: (16 + 26 * rnd(i + 9)).toFixed(0) + " " + Math.ceil(c.len),
      });
      out.tw.push(
        g.fromTo(
          c.el,
          { strokeDashoffset: 0 },
          {
            strokeDashoffset: -c.len,
            duration: 2.2 + 2 * rnd(i + 21),
            ease: "none",
            repeat: -1,
            delay: rnd(i + 33) * 2.6,
          },
        ),
      );
    });
  };

  // SHIP — slipstream light streaks fanning back from the arrow
  const streaks = (host: Element, out: Out) => {
    const svg = svgRoot(host);
    const FX = 700,
      FY = 440;
    const n = Math.max(18, Math.round(40 * intensity));
    for (let i = 0; i < n; i++) {
      const ang = (rnd(i * 1.9 + 3) - 0.5) * 1.05;
      const ux = Math.cos(ang),
        uy = Math.sin(ang);
      const d0 = 280 + rnd(i + 17) * 520,
        L = 140 + rnd(i + 41) * 380;
      const x1 = FX + ux * d0,
        y1 = FY + uy * d0,
        x2 = FX + ux * (d0 + L),
        y2 = FY + uy * (d0 + L);
      const grp = sv("g", { opacity: 0.9 }, svg);
      sv(
        "line",
        {
          x1,
          y1,
          x2,
          y2,
          stroke: A((0.2 + 0.5 * rnd(i + 29)).toFixed(2)),
          "stroke-width": (0.6 + 1 * rnd(i + 7)).toFixed(2),
          "stroke-linecap": "round",
        },
        grp,
      );
      if (rnd(i + 53) > 0.64)
        sv(
          "circle",
          {
            cx: x2,
            cy: y2,
            r: (1.1 + 1.6 * rnd(i + 61)).toFixed(2),
            fill: "#ffd9e8",
            opacity: 0.9,
          },
          grp,
        );
      if (reduced) continue;
      out.tw.push(
        g.fromTo(
          grp,
          { opacity: 0.08, x: -ux * 130, y: -uy * 130 },
          {
            opacity: 1,
            x: ux * 60,
            y: uy * 60,
            duration: 2.6 + rnd(i + 71) * 2.8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: rnd(i + 83) * 2.4,
          },
        ),
      );
    }
  };

  type Spot = { cx: number; cy: number; r: number };

  // DESIGN — small glass-sphere accents scattered around the ribbons, echoing their material
  const orbs = (host: Element, out: Out, spotsIn?: Spot[]) => {
    const svg = svgRoot(host);
    const defs = sv("defs", {}, svg);
    const grad = sv(
      "radialGradient",
      { id: uid + "-orb", cx: "35%", cy: "30%", r: "75%" },
      defs,
    );
    sv("stop", { offset: "0%", "stop-color": "#ffeaf3" }, grad);
    sv("stop", { offset: "28%", "stop-color": "#f3aecb" }, grad);
    sv("stop", { offset: "62%", "stop-color": A(0.9) }, grad);
    sv("stop", { offset: "100%", "stop-color": "#1a0410" }, grad);
    const spots: Spot[] = spotsIn || [
      { cx: 66, cy: 12, r: 20 },
      { cx: 71.5, cy: 18.5, r: 8 },
      { cx: 33, cy: 25, r: 5.5 },
      { cx: 87, cy: 47, r: 8.5 },
      { cx: 26, cy: 69, r: 8 },
      { cx: 36, cy: 87, r: 10.5 },
      { cx: 38.5, cy: 92, r: 5.5 },
      { cx: 84, cy: 71, r: 8.5 },
      { cx: 95, cy: 80, r: 6 },
    ];
    const balls = spots.map((s) =>
      sv(
        "circle",
        {
          cx: (s.cx * 14.4).toFixed(1),
          cy: (s.cy * 9).toFixed(1),
          r: s.r,
          fill: "url(#" + uid + "-orb)",
          stroke: "rgba(255,255,255,0.18)",
          "stroke-width": 0.6,
        },
        svg,
      ),
    );
    if (reduced) return;
    out.tw.push(
      g.from(balls, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: "50% 50%",
        duration: 0.9,
        ease: "back.out(1.6)",
        stagger: { each: 0.06, from: "random" },
        delay: 0.3,
      }),
    );
    balls.forEach((b, i) => {
      out.tw.push(
        g.to(b, {
          y: "+=" + (6 + rnd(i + 40) * 8).toFixed(1),
          duration: 3 + rnd(i + 12) * 2.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: rnd(i + 4) * 2,
        }),
      );
    });
  };

  // AUTOMATE — the drifting glass spheres of the reference composition
  const AUTO_SPOTS: Spot[] = [
    { cx: 59, cy: 14.5, r: 15 },
    { cx: 77.5, cy: 23, r: 12 },
    { cx: 29.5, cy: 29, r: 9 },
    { cx: 21, cy: 78, r: 8 },
    { cx: 61.5, cy: 75, r: 10.5 },
    { cx: 91, cy: 63, r: 6 },
  ];

  const EXTRAS: Record<ExtraKey, (host: Element, out: Out) => void> = {
    twinkle: (host, out) => twinkle(host, out, 22, 3),
    orbs: (host, out) => orbs(host, out),
    orbsAuto: (host, out) => orbs(host, out, AUTO_SPOTS),
    links,
    blueprint,
    flow,
    streaks,
  };

  /* ---------------- scene builder ---------------- */

  const build = (name: HeroVariant, host: HTMLElement, out: Out) => {
    const def = SCENES[name];
    if (!def) return;
    const eager = firstBuild;
    firstBuild = false;
    (def.glows || []).forEach((css) =>
      dv("position:absolute;pointer-events:none;" + css.split("$A").join(rgb), host),
    );

    const artHost = dv("position:absolute;inset:0;", host);
    const arts: Art[] = [];
    (def.layers || []).forEach((L, i) => {
      const anchor = dv(
        "position:absolute;left:" +
          L.cx +
          "%;top:" +
          L.cy +
          "%;width:" +
          L.w +
          "%;transform:translate(-50%,-50%);will-change:transform;",
        artHost,
      );
      const par = dv("position:relative;width:100%;", anchor);
      const wrap = dv("position:relative;width:100%;", par);
      const img = document.createElement("img");
      // WebP, not the source PNGs: the 19 plates were 5.1 MB as PNG and are
      // 1.1 MB as WebP at q90 (the design scene alone, which is what paints
      // first, went 1043K -> 188K). Encoded with `-alpha_q 100` because every
      // plate carries a knocked-out matte and the feathered edges below are
      // masks over that alpha — a lossy alpha channel would print crop edges.
      // Single format, no <picture> fallback: this builds bare <img> nodes,
      // and WebP has no meaningful gap in the browsers this site targets.
      img.src = ART + L.src + ".webp";
      img.alt = "";
      img.decoding = "async";
      // Intrinsic size -> reserved box -> no reflow when the plate decodes.
      // See PLATE_SIZE. Unknown src is left unsized rather than guessed.
      const size = PLATE_SIZE[L.src];
      if (size) {
        img.width = size[0];
        img.height = size[1];
      }
      img.fetchPriority = eager ? "high" : "low";

      const feRaw: Feather = L.feather == null ? 4 : L.feather;
      const isObj = typeof feRaw === "object";
      const fl = isObj ? feRaw.l || 0 : feRaw;
      const fr = isObj ? feRaw.r || 0 : feRaw;
      const ft = isObj ? feRaw.t || 0 : feRaw;
      const fb = isObj ? feRaw.b || 0 : feRaw;
      const stops = (a: number, b: number) =>
        (a ? "transparent,#000 " + a + "%," : "#000,") +
        "#000 " +
        (100 - b) +
        "%" +
        (b ? ",transparent" : "");
      const mask =
        fl || fr || ft || fb
          ? "linear-gradient(to right," +
            stops(fl, fr) +
            "),linear-gradient(to bottom," +
            stops(ft, fb) +
            ")"
          : "";
      // The art plates carry a knocked-out paper matte; the low-alpha residue is
      // stripped in the PNGs and the plate edges are feathered so no crop
      // rectangle ever prints.
      img.style.cssText =
        "display:block;width:100%;height:auto;opacity:" +
        (L.op == null ? 1 : L.op) +
        ";" +
        (L.blend ? "mix-blend-mode:" + L.blend + ";" : "") +
        (mask
          ? "-webkit-mask-image:" +
            mask +
            ";mask-image:" +
            mask +
            ";-webkit-mask-composite:source-in;mask-composite:intersect;"
          : "") +
        (L.flip ? "transform:scaleX(-1);" : "") +
        "will-change:transform;";
      wrap.appendChild(img);
      arts.push({ L, par, wrap, img, i });
    });

    (def.extras || []).forEach((k) => EXTRAS[k] && EXTRAS[k](host, out));

    arts.forEach((a) => {
      const L = a.L;
      const e = L.in || {};
      if (!reduced) {
        out.tw.push(
          g.from(a.wrap, {
            opacity: 0,
            x: e.x || 0,
            y: e.y || 0,
            scale: e.s == null ? 1 : e.s,
            rotation: e.r || 0,
            duration: 1.15,
            ease: "power3.out",
            delay: 0.05 + a.i * 0.07,
            transformOrigin: "50% 50%",
          }),
        );
        const fx = L.fx || 0,
          fy = L.fy || 0,
          rot = L.rot || 0,
          sx = L.flip ? -1 : 1;
        out.tw.push(
          g.fromTo(
            a.img,
            { scaleX: sx, x: -fx / 2, y: -fy / 2, rotation: -rot / 2 },
            {
              scaleX: sx,
              x: fx / 2,
              y: fy / 2,
              rotation: rot / 2,
              duration: L.dur || 14,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              transformOrigin: "50% 50%",
            },
          ),
        );
      }
      // parallax
      a.depth = L.z == null ? 0.4 : L.z;
      a.qx = g.quickTo(a.par, "x", { duration: 0.9, ease: "power2.out" });
      a.qy = g.quickTo(a.par, "y", { duration: 0.9, ease: "power2.out" });
    });
    out.arts = arts;
  };

  /* ---------------- pointer parallax ---------------- */

  const onMove = (ev: PointerEvent) => {
    const b = root.getBoundingClientRect();
    if (!b.width) return;
    const px = ((ev.clientX - b.left) / b.width - 0.5) * 2;
    const py = ((ev.clientY - b.top) / b.height - 0.5) * 2;
    live.forEach((s) => {
      if (s.dead || !s.out.arts) return;
      s.out.arts.forEach((a) => {
        if (a.qx && a.qy) {
          a.qx(-px * 34 * (a.depth ?? 0.4));
          a.qy(-py * 24 * (a.depth ?? 0.4));
        }
      });
    });
  };
  if (!reduced) window.addEventListener("pointermove", onMove, { passive: true });

  /* ---------------- lifecycle ---------------- */

  const kill = (scene: Scene | null) => {
    if (!scene || scene.dead) return;
    scene.dead = true;
    scene.out.tw.forEach((t) => t && t.kill());
    if (scene.el && scene.el.parentNode) scene.el.parentNode.removeChild(scene.el);
  };

  const sweep = () => {
    const keep = live.filter((s) => !s.dead).map((s) => s.el);
    Array.prototype.slice.call(root.children).forEach((c: Element) => {
      if (keep.indexOf(c as HTMLDivElement) === -1) root.removeChild(c);
    });
  };

  const api: HeroScenesApi = {
    setVariant(name) {
      if (!root || !SCENES[name] || (current && current.name === name)) return;
      const my = ++token;
      const el = dv("position:absolute;inset:0;opacity:0;", root);
      const out: Out = { tw: [] };
      build(name, el, out);
      const next: Scene = { name, el, out };
      live.push(next);
      const prev = current;
      current = next;
      live.slice().forEach((s) => {
        if (s !== next && s !== prev) {
          clearTimeout(s.timer);
          kill(s);
        }
      });
      for (let i = live.length - 1; i >= 0; i--) if (live[i].dead) live.splice(i, 1);
      g.to(el, { opacity: 1, duration: reduced ? 0 : 0.9, ease: "power2.out" });
      if (prev) {
        g.to(prev.el, {
          opacity: 0,
          duration: reduced ? 0 : 0.7,
          ease: "power2.in",
          onComplete: () => {
            if (my <= token) {
              clearTimeout(prev.timer);
              kill(prev);
              sweep();
            }
          },
        });
        clearTimeout(prev.timer);
        prev.timer = setTimeout(
          () => {
            kill(prev);
            sweep();
          },
          reduced ? 0 : 1400,
        );
      }
      sweep();
    },
    destroy() {
      token++;
      window.removeEventListener("pointermove", onMove);
      live.forEach((s) => {
        clearTimeout(s.timer);
        kill(s);
      });
      live.length = 0;
      current = null;
      while (root.firstChild) root.removeChild(root.firstChild);
    },
  };

  return api;
}
