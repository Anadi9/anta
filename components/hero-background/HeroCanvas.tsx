"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";
import type { HeroVariant } from "./types";

/**
 * Hero background, ported from design-reference/ANTA Site.dc.html.
 *
 * This is a direct port of the hero `<canvas>` that ANTA Site.dc.html
 * implements inline (its `initCanvas` / `seedParticles` / `getLayoutPositions`
 * / `assignLayout` / `drawFrame` / `triggerBurst` methods, lines 947-1443, and
 * the `bp*` blueprint suite, lines 1085-1354). ANTA Site.dc.html is the only
 * reference for the hero background; nothing here comes from any other export.
 *
 * MODES. The reference exposes `heroBackground` as an enum with four values —
 * `Scenes | Network | Blueprint | None` (line 493). Three of those are
 * implemented inside the file and are ported here. `Scenes` is not: it
 * dynamically imports `hero-scenes.js` (line 946), a module that is not part
 * of the export and does not exist in this repo, so it cannot be matched. The
 * enum's next value, `Network`, is our default — it is the mode the reference
 * falls back to in `drawFrame`, and it reacts to all five hero words through
 * `assignLayout`.
 *
 * The canvas is full-bleed and unmasked (ANTA Site.dc.html:115). The centre
 * ellipse mask and the .78 opacity in the reference belong to the *separate*
 * scene `<div>` on line 116, which only the missing `Scenes` mode fills — do
 * not apply them to this layer.
 *
 * DELIBERATE ADDITION: an IntersectionObserver parks the RAF loop when the
 * hero scrolls out of view. The reference runs its loop unconditionally; an
 * always-on canvas below the fold is wasted battery.
 */

export type HeroCanvasMode = "network" | "blueprint" | "none";

type Particle = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  jseed: number;
  jphase: number;
};

type Pulse = { a: Particle; b: Particle; t0: number; dur: number };
type Burst = { x: number; y: number; t0: number };
type Rgb = { r: number; g: number; b: number };
type Pt = { x: number; y: number };
type KeepRect = { l: number; r: number; t: number; b: number };
type Quad = [number, number][];

type BpLabel = { a: [number, number]; s: "left" | "right"; t: string; u: string };
type BpSpec = {
  sheet: string;
  rev: string;
  focus: number;
  dimW: string;
  dimH: string;
  title: string;
  labels: BpLabel[];
};

/** ANTA Site.dc.html:1109-1130 — the per-keyword annotation layer. */
const BP_SPECS: Record<HeroVariant, BpSpec> = {
  build: {
    sheet: "01",
    rev: "C",
    focus: 1,
    dimW: "1840",
    dimH: "0620",
    title: "FRAME ASSY",
    labels: [
      { a: [2, 3], s: "left", t: "PLATE 03 / A-01", u: "STACK · 3 OFF" },
      { a: [1, 2], s: "right", t: "FASTEN ×4", u: "M6 · 12 N·m" },
      { a: [0, 0], s: "left", t: "BASE DATUM", u: "FIXED" },
    ],
  },
  automate: {
    sheet: "02",
    rev: "D",
    focus: 2,
    dimW: "1240",
    dimH: "0480",
    title: "CYCLE PATH",
    labels: [
      { a: [2, 2], s: "right", t: "TRIGGER NODE", u: "EVT · WEBHOOK" },
      { a: [1, 3], s: "left", t: "CYCLE 0.40 s", u: "LOOP ∞" },
      { a: [0, 1], s: "right", t: "FALLBACK", u: "RETRY ×3" },
    ],
  },
  architect: {
    sheet: "03",
    rev: "A",
    focus: 0,
    dimW: "2260",
    dimH: "0740",
    title: "LOAD PATH",
    labels: [
      { a: [0, 3], s: "left", t: "LOAD PATH", u: "BEARING · N-S" },
      { a: [2, 1], s: "right", t: "GRID 12 × 8", u: "MOD 240" },
      { a: [1, 0], s: "left", t: "DATUM A", u: "SET 0,0" },
    ],
  },
  design: {
    sheet: "04",
    rev: "B",
    focus: 1,
    dimW: "0960",
    dimH: "0360",
    title: "SECTION B–B",
    labels: [
      { a: [1, 2], s: "right", t: "SURFACE FIN.", u: "RA 0.8" },
      { a: [2, 0], s: "left", t: "TOL ± 0.2", u: "ISO 2768-f" },
      { a: [0, 2], s: "right", t: "SECTION B–B", u: "SCALE 1:2" },
    ],
  },
  ship: {
    sheet: "05",
    rev: "D",
    focus: 2,
    dimW: "1520",
    dimH: "0540",
    title: "RELEASE GATE",
    labels: [
      { a: [2, 3], s: "left", t: "RELEASE GATE", u: "QA · PASS" },
      { a: [1, 1], s: "right", t: "SHIP SET 04", u: "CRATE 2 OFF" },
      { a: [0, 0], s: "left", t: "SIGN-OFF", u: "REV D" },
    ],
  },
};

function hexToRgb(hex: string): Rgb {
  const h = hex.replace("#", "").trim();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** ANTA Site.dc.html:1019-1069 — particle target positions per hero word. */
function getLayoutPositions(
  word: HeroVariant,
  w: number,
  h: number,
  n: number,
): Pt[] {
  const pts: Pt[] = [];
  if (word === "build") {
    const cx = w * 0.5,
      cy = h * 0.42;
    const rings = [0, Math.min(w, h) * 0.13, Math.min(w, h) * 0.24];
    const perRing = Math.ceil((n - 1) / (rings.length - 1)) || 1;
    pts.push({ x: cx, y: cy });
    rings.slice(1).forEach((r, ri) => {
      for (let k = 0; k < perRing; k++) {
        const a = (k / perRing) * Math.PI * 2 + ri * 0.5;
        pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.82 });
      }
    });
  } else if (word === "architect") {
    const cols = Math.max(2, Math.ceil(Math.sqrt(n * (w / h))));
    const rows = Math.max(2, Math.ceil(n / cols));
    const mx = w * 0.14,
      my = h * 0.16;
    const gw = (w - 2 * mx) / (cols - 1 || 1),
      gh = (h - 2 * my) / (rows - 1 || 1);
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) pts.push({ x: mx + c * gw, y: my + r * gh });
  } else if (word === "automate") {
    const lines = 3,
      perLine = Math.ceil(n / lines);
    for (let l = 0; l < lines; l++) {
      const baseY = h * (0.2 + l * 0.3);
      for (let k = 0; k < perLine; k++) {
        const t = k / (perLine - 1 || 1);
        pts.push({ x: t * w, y: baseY + Math.sin(t * Math.PI * 2 + l) * h * 0.05 });
      }
    }
  } else if (word === "design") {
    const cx = w * 0.5,
      cy = h * 0.4,
      r = Math.min(w, h) * 0.27;
    pts.push({ x: cx, y: cy });
    for (let k = 1; k < n; k++) {
      const a = (k / (n - 1)) * Math.PI * 2;
      pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.86 });
    }
  } else {
    // "ship" — an arrow: a shaft from lower-left to upper-right plus a head.
    const x0 = w * 0.16,
      y0 = h * 0.78,
      x1 = w * 0.84,
      y1 = h * 0.16;
    const shaft = Math.max(3, Math.round(n * 0.7));
    for (let k = 0; k < shaft; k++) {
      const t = k / (shaft - 1 || 1);
      pts.push({ x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t });
    }
    const ang = Math.atan2(y1 - y0, x1 - x0);
    const head = n - shaft;
    for (let k = 0; k < head; k++) {
      const spread = (k / (head - 1 || 1) - 0.5) * 0.9;
      const back = 16 + (k % 3) * 6;
      pts.push({
        x: x1 - Math.cos(ang + spread) * back,
        y: y1 - Math.sin(ang + spread) * back,
      });
    }
  }
  return pts.length ? pts : [{ x: w / 2, y: h / 2 }];
}

/** ANTA Site.dc.html:1131-1136 — deterministic pseudo-coordinates per word. */
function bpCoord(word: string, i: number): string {
  let seed = 7;
  for (let k = 0; k < word.length; k++) seed = (seed * 31 + word.charCodeAt(k)) % 9973;
  const x = ((seed * (i + 3)) % 900) + 100;
  const y = ((seed * (i + 11)) % 700) + 60;
  return "X" + x + " Y" + y;
}

class HeroCanvasEngine {
  private ctx: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private acc: Rgb;
  private particles: Particle[] = [];
  private pulses: Pulse[] = [];
  private burst: Burst | null = null;
  private lastPulseSpawn = 0;
  private bpAnno: { word: HeroVariant; t0: number } | null = null;
  private bpPrev: { word: HeroVariant; t0: number } | null = null;
  private bpKeep: KeepRect[] = [];
  private bpKeepT = -1e9;

  constructor(
    private canvas: HTMLCanvasElement,
    private word: HeroVariant,
    public mode: HeroCanvasMode,
    private move: boolean,
    accent: string,
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2d context unavailable");
    this.ctx = ctx;
    this.acc = hexToRgb(accent);
  }

  /** ANTA Site.dc.html:957-970 — DPR-aware sizing off the parent box. */
  resize() {
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.max(1, rect.width * dpr);
    this.canvas.height = Math.max(1, rect.height * dpr);
    this.canvas.style.width = rect.width + "px";
    this.canvas.style.height = rect.height + "px";
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = rect.width;
    this.h = rect.height;
    this.seedParticles();
    this.seedBlueprint();
  }

  /** ANTA Site.dc.html:637-645 — word change bursts, relayouts, re-annotates. */
  setWord(word: HeroVariant) {
    if (word === this.word) return;
    this.word = word;
    this.triggerBurst();
    this.assignLayout(word);
    this.assignBlueprintShape(word);
  }

  draw(t: number) {
    if (this.mode === "none") {
      this.ctx.clearRect(0, 0, this.w, this.h);
      return;
    }
    if (this.mode === "blueprint") this.drawBlueprintFrame(t);
    else this.drawFrame(t);
  }

  // ---- Network ----------------------------------------------------------

  /** ANTA Site.dc.html:1010-1018 — count scales with hero area, clamped 16..42. */
  private seedParticles() {
    if (!this.w || !this.h) return;
    const count = Math.max(16, Math.min(42, Math.round((this.w * this.h) / 30000)));
    this.particles = Array.from({ length: count }, () => {
      const x = Math.random() * this.w,
        y = Math.random() * this.h;
      return { x, y, tx: x, ty: y, jseed: Math.random() * Math.PI * 2, jphase: 0 };
    });
    this.assignLayout(this.word);
  }

  private assignLayout(word: HeroVariant) {
    if (!this.w || !this.h || !this.particles.length) return;
    const positions = getLayoutPositions(word, this.w, this.h, this.particles.length);
    this.particles.forEach((p, i) => {
      const pos = positions[i % positions.length];
      p.tx = pos.x;
      p.ty = pos.y;
    });
  }

  /** ANTA Site.dc.html:1357-1364 — expanding ring on every word change. */
  private triggerBurst() {
    if (!this.w || !this.h) return;
    this.burst = {
      x: this.w * 0.5 + (Math.random() - 0.5) * this.w * 0.28,
      y: this.h * 0.34 + (Math.random() - 0.5) * this.h * 0.14,
      t0: performance.now(),
    };
  }

  /** ANTA Site.dc.html:1366-1443. */
  private drawFrame(t: number) {
    const ctx = this.ctx,
      w = this.w,
      h = this.h;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    const acc = this.acc;
    const move = this.move;

    this.particles.forEach((p) => {
      if (move) {
        p.x += (p.tx - p.x) * 0.045;
        p.y += (p.ty - p.y) * 0.045;
        p.jphase += 0.015;
        p.x += Math.sin(p.jphase + p.jseed) * 0.15;
        p.y += Math.cos(p.jphase * 0.8 + p.jseed) * 0.15;
      }
      p.x = Math.max(0, Math.min(w, p.x));
      p.y = Math.max(0, Math.min(h, p.y));
    });

    const maxDist = Math.min(210, w * 0.22);
    ctx.lineWidth = 1;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i],
          b = this.particles[j];
        const dx = a.x - b.x,
          dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist) {
          const alpha = (1 - d / maxDist) * 0.16;
          ctx.strokeStyle = `rgba(${acc.r},${acc.g},${acc.b},${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    this.particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${acc.r},${acc.g},${acc.b},0.5)`;
      ctx.fill();
    });

    if (move && this.particles.length > 1 && t - this.lastPulseSpawn > 850) {
      this.lastPulseSpawn = t;
      const i = Math.floor(Math.random() * this.particles.length);
      let j = Math.floor(Math.random() * this.particles.length);
      if (j === i) j = (j + 1) % this.particles.length;
      this.pulses.push({
        a: this.particles[i],
        b: this.particles[j],
        t0: t,
        dur: 1000 + Math.random() * 500,
      });
    }
    this.pulses = this.pulses.filter((p) => t - p.t0 < p.dur);
    this.pulses.forEach((p) => {
      const prog = (t - p.t0) / p.dur;
      const x = p.a.x + (p.b.x - p.a.x) * prog;
      const y = p.a.y + (p.b.y - p.a.y) * prog;
      const fade = prog < 0.15 ? prog / 0.15 : prog > 0.85 ? (1 - prog) / 0.15 : 1;
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${acc.r},${acc.g},${acc.b},${0.85 * fade})`;
      ctx.shadowColor = `rgba(${acc.r},${acc.g},${acc.b},0.8)`;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    if (this.burst) {
      const age = t - this.burst.t0;
      const dur = 900;
      if (age < dur) {
        const prog = age / dur;
        ctx.beginPath();
        ctx.arc(this.burst.x, this.burst.y, 18 + prog * 150, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${acc.r},${acc.g},${acc.b},${0.4 * (1 - prog)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        this.burst = null;
      }
    }
  }

  // ---- Blueprint --------------------------------------------------------

  /** ANTA Site.dc.html:1085-1101 — three exploded isometric plates. */
  private bpGeom() {
    const w = this.w,
      h = this.h;
    const pw = Math.min(w * 0.44, 560);
    const sk = pw * 0.34;
    const pd = pw * 0.2;
    const gap = Math.min(Math.max(h * 0.15, 46), 120);
    const cx = w * 0.5,
      cy = h * 0.52;
    const x0 = cx - (pw + sk) / 2;
    const plates: Quad[] = [];
    for (let i = 0; i < 3; i++) {
      const y = cy + gap - i * gap;
      plates.push([
        [x0, y],
        [x0 + pw, y],
        [x0 + pw + sk, y - pd],
        [x0 + sk, y - pd],
      ]);
    }
    return { plates, pw, sk, pd, gap, cx, cy, x0 };
  }

  private seedBlueprint() {
    this.bpAnno = { word: this.word, t0: performance.now() - 900 };
    this.bpPrev = null;
  }

  private assignBlueprintShape(word: HeroVariant) {
    if (this.bpAnno && this.bpAnno.word === word) return;
    this.bpPrev = this.bpAnno;
    this.bpAnno = { word, t0: performance.now() };
  }

  /**
   * ANTA Site.dc.html:1142-1157 — annotations never overlap the headline.
   * Measures the hero's text nodes, cached for 500ms.
   */
  private bpKeepOut(t: number): KeepRect[] {
    if (this.bpKeep.length && t - this.bpKeepT < 500) return this.bpKeep;
    const parent = this.canvas.parentElement;
    if (!parent) return (this.bpKeep = []);
    const cr = this.canvas.getBoundingClientRect();
    const rects: KeepRect[] = [];
    parent.querySelectorAll("h1, h2, p, a, button, span[data-copy]").forEach((n) => {
      const r = n.getBoundingClientRect();
      if (!r.width || !r.height) return;
      rects.push({
        l: r.left - cr.left - 10,
        r: r.right - cr.left + 10,
        t: r.top - cr.top - 8,
        b: r.bottom - cr.top + 8,
      });
    });
    this.bpKeepT = t;
    return (this.bpKeep = rects);
  }

  private bpClear(box: KeepRect, keep: KeepRect[]): boolean {
    for (let i = 0; i < keep.length; i++) {
      const k = keep[i];
      if (box.l < k.r && box.r > k.l && box.t < k.b && box.b > k.t) return false;
    }
    return true;
  }

  private bpTextBox(text: string, x: number, y: number, align: string): KeepRect {
    const wid = this.ctx.measureText(text).width;
    const l = align === "center" ? x - wid / 2 : align === "right" ? x - wid : x;
    return { l, r: l + wid, t: y - 10, b: y + 4 };
  }

  private bpLine(a: number[], b: number[], alpha: number, dash?: number[]) {
    const ctx = this.ctx;
    ctx.save();
    if (dash) ctx.setLineDash(dash);
    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
    ctx.restore();
  }

  /** ANTA Site.dc.html:1168-1354. */
  private drawBlueprintFrame(t: number) {
    const ctx = this.ctx,
      w = this.w,
      h = this.h;
    if (!w || !h) return;
    if (!this.bpAnno) this.seedBlueprint();
    const anno = this.bpAnno!;
    ctx.clearRect(0, 0, w, h);
    const acc = this.acc;
    const A = (a: number) => `rgba(${acc.r},${acc.g},${acc.b},${a})`;
    const move = this.move;
    const tight = w < 800;
    const g = this.bpGeom();
    const spec = BP_SPECS[anno.word] ?? BP_SPECS.build;
    ctx.lineWidth = 1;
    ctx.lineJoin = "miter";

    // sheet border + corner brackets
    const p = 26,
      arm = 20;
    this.bpLine([p, p], [w - p, p], 0.05);
    this.bpLine([p, h - p], [w - p, h - p], 0.05);
    this.bpLine([p, p], [p, h - p], 0.05);
    this.bpLine([w - p, p], [w - p, h - p], 0.05);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    (
      [
        [p, p, 1, 1],
        [w - p, p, -1, 1],
        [p, h - p, 1, -1],
        [w - p, h - p, -1, -1],
      ] as const
    ).forEach(([bx, by, sx, sy]) => {
      ctx.beginPath();
      ctx.moveTo(bx, by + arm * sy);
      ctx.lineTo(bx, by);
      ctx.lineTo(bx + arm * sx, by);
      ctx.stroke();
    });

    // explode axes through corresponding corners
    const bot = g.plates[0],
      top = g.plates[2];
    for (let c = 0; c < 4; c++) {
      this.bpLine(
        [bot[c][0], bot[c][1] + 22],
        [top[c][0], top[c][1] - 30],
        0.075,
        [2, 5],
      );
    }

    // centre axis (dash-dot)
    ctx.save();
    ctx.setLineDash([14, 5, 2, 5]);
    this.bpLine(
      [g.cx + g.sk / 2, g.plates[2][3][1] - 52],
      [g.cx + g.sk / 2, g.plates[0][0][1] + 44],
      0.09,
    );
    ctx.restore();

    // plates
    g.plates.forEach((q, i) => {
      const on = i === spec.focus;
      ctx.strokeStyle = on ? A(0.34) : "rgba(255,255,255,0.12)";
      ctx.lineWidth = on ? 1.25 : 1;
      ctx.beginPath();
      q.forEach((c, k) => (k === 0 ? ctx.moveTo(c[0], c[1]) : ctx.lineTo(c[0], c[1])));
      ctx.closePath();
      ctx.stroke();
      // inset outline
      const ix = (q[0][0] + q[2][0]) / 2,
        iy = (q[0][1] + q[2][1]) / 2,
        s = 0.82;
      ctx.strokeStyle = on ? A(0.18) : "rgba(255,255,255,0.055)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      q.forEach((c, k) => {
        const x = ix + (c[0] - ix) * s,
          y = iy + (c[1] - iy) * s;
        k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
      // bolt holes
      q.forEach((c) => {
        const x = ix + (c[0] - ix) * 0.9,
          y = iy + (c[1] - iy) * 0.9;
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.strokeStyle = on ? A(0.4) : "rgba(255,255,255,0.13)";
        ctx.stroke();
      });
      // node markers
      ctx.fillStyle = on ? A(0.75) : "rgba(255,255,255,0.28)";
      q.forEach((c) => {
        ctx.beginPath();
        ctx.arc(c[0], c[1], 1.7, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // dimension stack: width under the assembly, height left of it
    const keep = this.bpKeepOut(t);
    const copyBottom = keep.reduce(
      (m, k) => (k.r > w * 0.2 && k.l < w * 0.8 ? Math.max(m, k.b) : m),
      0,
    );
    let dy = g.plates[0][0][1] + 46;
    if (copyBottom && dy < copyBottom + 20) dy = Math.min(copyBottom + 26, h - p - 30);
    const dx0 = g.plates[0][0][0],
      dx1 = g.plates[0][1][0];
    this.bpLine([dx0, dy], [dx1, dy], 0.16);
    [dx0, dx1].forEach((x) => {
      this.bpLine([x, dy - 4.5], [x, dy + 4.5], 0.22);
      this.bpLine([x, g.plates[0][0][1] + 8], [x, dy - 2], 0.07);
    });
    const vx = g.plates[0][0][0] - 34;
    const vy0 = g.plates[2][2][1],
      vy1 = g.plates[0][1][1];
    this.bpLine([vx, vy0], [vx, vy1], 0.16);
    [vy0, vy1].forEach((y) => this.bpLine([vx - 4.5, y], [vx + 4.5, y], 0.22));

    // ---- annotation layer (redrawn per keyword) ----
    const drawAnno = (sp: BpSpec & { word: string }, alpha: number, slide: number) => {
      if (alpha <= 0.01) return;
      const mono = (px: number) => px + 'px "JetBrains Mono", monospace';
      ctx.textBaseline = "alphabetic";

      // dimension values
      ctx.font = mono(tight ? 9 : 10);
      ctx.fillStyle = `rgba(255,255,255,${0.34 * alpha})`;
      ctx.textAlign = "center";
      const bW = this.bpTextBox(sp.dimW, (dx0 + dx1) / 2, dy - 7 + slide, "center");
      if (this.bpClear(bW, keep)) ctx.fillText(sp.dimW, (dx0 + dx1) / 2, dy - 7 + slide);
      const vmid = (vy0 + vy1) / 2;
      if (this.bpClear({ l: vx - 18, r: vx - 2, t: vmid - 26, b: vmid + 26 }, keep)) {
        ctx.save();
        ctx.translate(vx - 8, vmid);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(sp.dimH, 0, 0);
        ctx.restore();
      }

      // title block, bottom left
      ctx.textAlign = "left";
      ctx.font = mono(tight ? 9 : 10);
      ctx.fillStyle = A(0.62 * alpha);
      ctx.fillText(sp.title, p + 10, h - p - 30 + slide);
      ctx.fillStyle = `rgba(255,255,255,${0.26 * alpha})`;
      ctx.font = mono(9);
      ctx.fillText(
        "SHEET " + sp.sheet + "  ·  REV " + sp.rev + "  ·  SCALE 1:2",
        p + 10,
        h - p - 15 + slide,
      );

      // sheet header, right
      ctx.textAlign = "right";
      ctx.fillStyle = `rgba(255,255,255,${0.24 * alpha})`;
      ctx.fillText("ANTA / " + sp.word.toUpperCase() + ".SYS", w - p - 10, p + 20 + slide);

      // leader labels
      if (!tight) {
        ctx.font = mono(9.5);
        sp.labels.forEach((L) => {
          const q = g.plates[L.a[0]],
            node = q[L.a[1]];
          const right = L.s === "right";
          const gx = right ? w - p - 118 : p + 118;
          const step = 16 * (right ? 1 : -1);
          const bendX = node[0] + step;
          const bendY = node[1] - 16;
          ctx.textAlign = right ? "left" : "right";
          const tx0 = right ? gx + 6 : gx - 6;
          if (
            !this.bpClear(this.bpTextBox(L.t, tx0, bendY - 4 + slide, ctx.textAlign), keep) ||
            !this.bpClear(this.bpTextBox(L.u, tx0, bendY + 9 + slide, ctx.textAlign), keep)
          )
            return;
          ctx.strokeStyle = `rgba(255,255,255,${0.2 * alpha})`;
          ctx.beginPath();
          ctx.moveTo(node[0], node[1]);
          ctx.lineTo(bendX, bendY);
          ctx.lineTo(gx, bendY);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(node[0], node[1], 2.6, 0, Math.PI * 2);
          ctx.strokeStyle = A(0.45 * alpha);
          ctx.stroke();
          ctx.textAlign = right ? "left" : "right";
          const tx = right ? gx + 6 : gx - 6;
          ctx.fillStyle = `rgba(255,255,255,${0.4 * alpha})`;
          ctx.fillText(L.t, tx, bendY - 4 + slide);
          ctx.fillStyle = `rgba(255,255,255,${0.2 * alpha})`;
          ctx.fillText(L.u, tx, bendY + 9 + slide);
        });
      }

      // coordinate labels at plate corners
      ctx.font = mono(8);
      ctx.textAlign = "left";
      ctx.fillStyle = `rgba(255,255,255,${0.19 * alpha})`;
      g.plates.forEach((q, i) => {
        const c = q[0];
        const near = sp.labels.some((L) => {
          const n = g.plates[L.a[0]][L.a[1]];
          return Math.abs(n[0] - c[0]) < 70 && Math.abs(n[1] - c[1]) < 40;
        });
        if (near) return;
        const txt = bpCoord(sp.word, i);
        if (!this.bpClear(this.bpTextBox(txt, c[0] + 8, c[1] + 13 + slide, "left"), keep))
          return;
        ctx.fillText(txt, c[0] + 8, c[1] + 13 + slide);
      });
    };

    const dur = 420;
    const ease = (x: number) => 1 - Math.pow(1 - x, 3);
    if (this.bpPrev) {
      const pr = Math.min(1, (t - anno.t0) / (dur * 0.5));
      if (pr < 1)
        drawAnno(
          { ...BP_SPECS[this.bpPrev.word], word: this.bpPrev.word },
          (1 - pr) * 0.6,
          0,
        );
      else this.bpPrev = null;
    }
    const cur = move ? ease(Math.min(1, (t - anno.t0) / dur)) : 1;
    drawAnno({ ...spec, word: anno.word }, cur, (1 - cur) * 5);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }
}

export type HeroCanvasProps = {
  /** The active hero word. Drives particle layout and blueprint annotations. */
  word: HeroVariant;
  /** `heroBackground` from the reference, minus the unavailable `Scenes`. */
  mode?: HeroCanvasMode;
  className?: string;
};

export function HeroCanvas({ word, mode = "network", className = "" }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<HeroCanvasEngine | null>(null);
  const reduced = useReducedMotion();

  // The engine is rebuilt only when something structural changes. Word changes
  // go through `setWord` so the burst/relayout fires instead of a reseed.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const accent =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-accent")
        .trim() || "#ec1a63";

    let engine: HeroCanvasEngine;
    try {
      engine = new HeroCanvasEngine(canvas, word, mode, !reduced, accent);
    } catch {
      return;
    }
    engineRef.current = engine;
    engine.resize();

    const onResize = () => engine.resize();
    window.addEventListener("resize", onResize);

    let raf = 0;
    let running = false;
    const loop = (t: number) => {
      engine.draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    let io: IntersectionObserver | null = null;
    if (reduced) {
      engine.draw(0);
    } else if (canvas.parentElement) {
      io = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? start() : stop()),
        { threshold: 0 },
      );
      io.observe(canvas.parentElement);
    } else {
      start();
    }

    return () => {
      stop();
      io?.disconnect();
      window.removeEventListener("resize", onResize);
      engineRef.current = null;
    };
    // `word` is intentionally omitted — it is applied via setWord below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, reduced]);

  useEffect(() => {
    engineRef.current?.setWord(word);
  }, [word]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}
    />
  );
}

export default HeroCanvas;
