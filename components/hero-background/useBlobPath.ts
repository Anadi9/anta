import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { rnd } from "./tokens";

export type BlobGeometry = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** Base rotation of the point ring, in radians. */
  rotation?: number;
};

export type BlobOptions = {
  /** Point count — must stay constant between keyframes so radii can tween. */
  points?: number;
  /** [min, max] radius multiplier per point. */
  radiusRange?: [number, number];
  /** Morph duration in seconds. */
  duration?: number;
  /** Stable seed so the shape is identical on server and client. */
  seed?: number;
  /** Alternating long/short radii — reads as a faceted "star" blob. */
  star?: boolean;
  /** Freeze on first frame (prefers-reduced-motion). */
  paused?: boolean;
};

/**
 * Catmull-Rom → cubic Bezier, closed loop. Produces a smooth organic outline
 * from a ring of N radii. Same N in and out, so the *radii* tween, never the
 * path string — that's what lets us morph without MorphSVGPlugin.
 */
export function buildPathFromRadii(radii: number[], g: BlobGeometry): string {
  const n = radii.length;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (g.rotation ?? 0) + (i / n) * Math.PI * 2;
    pts.push([g.cx + Math.cos(a) * g.rx * radii[i], g.cy + Math.sin(a) * g.ry * radii[i]]);
  }
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d + " Z";
}

const makeRadii = (n: number, range: [number, number], seed: number, star?: boolean) => {
  const [lo, hi] = range;
  return Array.from({ length: n }, (_, i) => {
    const base = lo + (hi - lo) * rnd(seed + i * 3.7);
    return star ? base * (i % 2 ? 0.45 : 1) : base;
  });
};

/**
 * Returns an animated SVG path string for one organic blob.
 *
 *   const path = useBlobPath({ points: 9, seed: 3 }, { cx: 210, cy: 130, rx: 300, ry: 250 });
 *   <path d={path} fill="url(#blobFill)" />
 */
export function useBlobPath(options: BlobOptions, geometry: BlobGeometry): string {
  const {
    points = 8,
    radiusRange = [0.7, 1],
    duration = 8,
    seed = 1,
    star = false,
    paused = false,
  } = options;

  const radiiRef = useRef<number[]>(makeRadii(points, radiusRange, seed, star));
  const [path, setPath] = useState(() => buildPathFromRadii(radiiRef.current, geometry));
  const geoRef = useRef(geometry);
  geoRef.current = geometry;

  useEffect(() => {
    radiiRef.current = makeRadii(points, radiusRange, seed, star);
    setPath(buildPathFromRadii(radiiRef.current, geoRef.current));
    if (paused) return;

    const radii = radiiRef.current;
    const target: gsap.TweenVars = {
      duration,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      onUpdate: () => setPath(buildPathFromRadii(radii, geoRef.current)),
    };
    // Same point count, new radii — the tween interpolates the numbers.
    makeRadii(points, radiusRange, seed + 100, star).forEach((r, i) => {
      (target as Record<string, unknown>)[String(i)] = r;
    });

    const tween = gsap.to(radii, target);
    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, radiusRange[0], radiusRange[1], duration, seed, star, paused]);

  return path;
}
