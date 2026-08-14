import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useBlobPath, type BlobGeometry, type BlobOptions } from "./useBlobPath";
import { rnd, tokens } from "./tokens";

/**
 * Gradient/filter defs every glossy shape shares. Render ONE of these per SVG
 * root and pass the same `idPrefix` to the shapes below.
 */
export function BlobDefs({ idPrefix }: { idPrefix: string }) {
  return (
    <defs>
      <radialGradient id={`${idPrefix}-fill`} cx="32%" cy="24%" r="86%">
        <stop offset="0%" stopColor={`rgba(${tokens.accentHotRgb},0.55)`} />
        <stop offset="16%" stopColor={`rgba(${tokens.accentRgb},0.34)`} />
        <stop offset="40%" stopColor="#2a0714" />
        <stop offset="100%" stopColor="#0d0308" />
      </radialGradient>
      <linearGradient id={`${idPrefix}-rim`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffd6e6" />
        <stop offset="38%" stopColor={tokens.accent} />
        <stop offset="100%" stopColor={`rgba(${tokens.accentRgb},0.05)`} />
      </linearGradient>
      <radialGradient id={`${idPrefix}-spec`}>
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
      <filter id={`${idPrefix}-blur`} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="7" />
      </filter>
    </defs>
  );
}

type GlossyBlobProps = BlobOptions &
  BlobGeometry & {
    idPrefix: string;
    opacity?: number;
    rimWidth?: number;
    /** Drift distance in user units on the parallax loop. */
    driftX?: number;
    driftY?: number;
    /** Rotation in degrees on the parallax loop. */
    spin?: number;
  };

/** One large liquid blob: gradient body, blurred rim light, specular highlight. */
export function GlossyBlob(props: GlossyBlobProps) {
  const {
    idPrefix, cx, cy, rx, ry, rotation, opacity = 1, rimWidth = 1.6,
    driftX = 22, driftY = -18, spin = 4, duration = 8, paused, ...blobOpts
  } = props;

  const path = useBlobPath({ ...blobOpts, duration, paused }, { cx, cy, rx, ry, rotation });
  const groupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (paused || !groupRef.current) return;
    const tween = gsap.to(groupRef.current, {
      x: driftX, y: driftY, rotation: spin,
      svgOrigin: `${cx} ${cy}`,
      duration: duration * 1.7, ease: "sine.inOut", repeat: -1, yoyo: true,
    });
    return () => { tween.kill(); };
  }, [paused, driftX, driftY, spin, cx, cy, duration]);

  return (
    <g ref={groupRef} opacity={opacity}>
      <path d={path} fill={`url(#${idPrefix}-fill)`} />
      <path
        d={path} fill="none" stroke={`url(#${idPrefix}-rim)`}
        strokeWidth={rimWidth} opacity={0.85} filter={`url(#${idPrefix}-blur)`}
      />
      <ellipse
        cx={cx - rx * 0.34} cy={cy - ry * 0.44} rx={rx * 0.3} ry={ry * 0.16}
        fill={`url(#${idPrefix}-spec)`} opacity={0.34}
        transform={`rotate(-26 ${cx} ${cy})`}
      />
    </g>
  );
}

type BubbleProps = {
  idPrefix: string; cx: number; cy: number; r: number;
  seed?: number; paused?: boolean; opacity?: number;
};

/** Small glossy sphere on its own desynced float loop. */
export function Bubble({ idPrefix, cx, cy, r, seed = 1, paused, opacity = 0.92 }: BubbleProps) {
  const ref = useRef<SVGGElement>(null);
  useEffect(() => {
    if (paused || !ref.current) return;
    const tween = gsap.to(ref.current, {
      y: 14 + rnd(seed) * 22,
      x: (rnd(seed + 7) - 0.5) * 20,
      duration: 4.5 + rnd(seed + 3) * 4.5,
      ease: "sine.inOut", repeat: -1, yoyo: true, delay: rnd(seed + 11) * 2,
    });
    return () => { tween.kill(); };
  }, [paused, seed]);

  return (
    <g ref={ref} opacity={opacity}>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${idPrefix}-fill)`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={`url(#${idPrefix}-rim)`} strokeWidth={1} opacity={0.8} />
      <ellipse cx={cx - r * 0.34} cy={cy - r * 0.42} rx={r * 0.3} ry={r * 0.2} fill={`url(#${idPrefix}-spec)`} opacity={0.55} />
    </g>
  );
}

/** Scatter N bubbles around a focal point. */
export function BubbleField({
  idPrefix, cx, cy, spread = 320, count = 5, seed = 1, paused,
}: { idPrefix: string; cx: number; cy: number; spread?: number; count?: number; seed?: number; paused?: boolean }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Bubble
          key={i} idPrefix={idPrefix} paused={paused} seed={seed + i * 13}
          cx={cx + (rnd(seed + i) - 0.5) * spread * 2}
          cy={cy + (rnd(seed + i + 40) - 0.5) * spread * 1.4}
          r={10 + rnd(seed + i + 80) * 22}
        />
      ))}
    </>
  );
}
