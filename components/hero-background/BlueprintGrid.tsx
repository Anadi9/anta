import { useEffect, useRef } from "react";
import gsap from "gsap";
import { rnd, tokens } from "./tokens";

export type BlueprintGridProps = {
  width?: number;
  height?: number;
  minor?: number;
  major?: number;
  labels?: [number, number, string][];
  paused?: boolean;
};

const DEFAULT_LABELS: [number, number, string][] = [
  [128, 132, "B.12"], [1268, 108, "X.104"], [1288, 132, "260.0"],
  [672, 452, "X.104"], [672, 476, "Y.58"], [1180, 812, "R.66"], [312, 690, "A.19"],
];

/** Faint self-drawing blueprint grid + coordinate annotations + scan line. */
export function BlueprintGrid({
  width = 1440, height = 900, minor = 24, major = 96,
  labels = DEFAULT_LABELS, paused = false,
}: BlueprintGridProps) {
  const vRef = useRef<SVGLineElement[]>([]);
  const hRef = useRef<SVGLineElement[]>([]);
  const marksRef = useRef<SVGGElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);

  const vs = Array.from({ length: Math.floor(width / minor) + 1 }, (_, i) => i * minor);
  const hs = Array.from({ length: Math.floor(height / minor) + 1 }, (_, i) => i * minor);

  useEffect(() => {
    const v = vRef.current.filter(Boolean);
    const h = hRef.current.filter(Boolean);
    gsap.set(v, { strokeDasharray: height, strokeDashoffset: paused ? 0 : height });
    gsap.set(h, { strokeDasharray: width, strokeDashoffset: paused ? 0 : width });
    if (paused) { gsap.set(marksRef.current, { opacity: 1 }); return; }

    const tl = gsap.timeline();
    tl.to(v, { strokeDashoffset: 0, duration: 1.2, ease: "power2.out", stagger: { each: 0.012, from: "start" } }, 0)
      .to(h, { strokeDashoffset: 0, duration: 1.2, ease: "power2.out", stagger: { each: 0.014, from: "start" } }, 0.15)
      .to(marksRef.current, { opacity: 1, duration: 0.9, ease: "power2.out" }, 1.5);

    const scan = gsap.fromTo(scanRef.current, { top: "-14%" }, { top: "106%", duration: 8, ease: "none", repeat: -1 });
    return () => { tl.kill(); scan.kill(); };
  }, [paused, width, height]);

  const stroke = (isMajor: boolean) => `rgba(${tokens.accentRgb},${isMajor ? 0.3 : 0.13})`;

  return (
    <>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}>
        {vs.map((x, i) => (
          <line key={`v${x}`} ref={(el) => { if (el) vRef.current[i] = el; }}
            x1={x} y1={0} x2={x} y2={height}
            stroke={stroke(x % major === 0)} strokeWidth={x % major === 0 ? 0.9 : 0.55} />
        ))}
        {hs.map((y, i) => (
          <line key={`h${y}`} ref={(el) => { if (el) hRef.current[i] = el; }}
            x1={0} y1={y} x2={width} y2={y}
            stroke={stroke(y % major === 0)} strokeWidth={y % major === 0 ? 0.9 : 0.55} />
        ))}
        <g ref={marksRef} opacity={0}>
          {labels.map(([x, y, text], i) => (
            <g key={i}>
              <text x={x} y={y} fill={`rgba(${tokens.accentRgb},0.72)`}
                fontFamily="ui-monospace, 'JetBrains Mono', monospace" fontSize={13}>{text}</text>
              <circle cx={x - 12} cy={y - 4} r={2.4} fill="#ff86b3" />
            </g>
          ))}
          {Array.from({ length: 16 }, (_, i) => (
            <circle key={`p${i}`} r={2.2} fill="#ff86b3" opacity={0.85}
              cx={48 + Math.round((rnd(i + 5) * (width - 100)) / minor) * minor}
              cy={48 + Math.round((rnd(i + 61) * (height - 100)) / minor) * minor} />
          ))}
        </g>
      </svg>
      <div ref={scanRef} aria-hidden
        style={{
          position: "absolute", left: 0, right: 0, height: 120, top: "-14%",
          background: `linear-gradient(180deg,transparent,rgba(${tokens.accentRgb},0.14),rgba(255,180,205,0.10),transparent)`,
        }} />
    </>
  );
}
