import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { rnd, tokens } from "./tokens";

gsap.registerPlugin(MotionPathPlugin);

const ARROW_PATH =
  "M 1030 392 Q 1120 402 1176 396 L 1176 336 Q 1180 320 1196 332 L 1332 462 Q 1342 470 1332 478 " +
  "L 1196 608 Q 1180 620 1176 604 L 1176 544 Q 1120 538 1030 548 Q 1008 470 1030 392 Z";

export type CometTrailProps = {
  idPrefix: string;
  particles?: number;
  streaks?: number;
  paused?: boolean;
};

/** Outlined rocket-arrow + MotionPath particle stream + speed-line streaks. */
export function CometTrail({ idPrefix, particles = 12, streaks = 14, paused = false }: CometTrailProps) {
  const arrowRef = useRef<SVGGElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const dotsRef = useRef<SVGCircleElement[]>([]);
  const streakRef = useRef<SVGLineElement[]>([]);

  useEffect(() => {
    const dots = dotsRef.current.filter(Boolean);
    const lines = streakRef.current.filter(Boolean);
    if (paused) { gsap.set(lines, { scaleX: 1, opacity: 1 }); gsap.set(dots, { opacity: 0 }); return; }
    const tweens = [
      gsap.fromTo(lines, { scaleX: 0, opacity: 0 }, {
        scaleX: 1, opacity: 1, duration: 1.6, ease: "power2.out",
        repeat: -1, repeatDelay: 0.4, stagger: { each: 0.12, from: "random" }, svgOrigin: "380 470",
      }),
      gsap.to(dots, {
        motionPath: { path: trailRef.current!, align: trailRef.current!, alignOrigin: [0.5, 0.5] },
        opacity: 1, duration: 3.6, ease: "none", repeat: -1, stagger: 0.28,
      }),
      gsap.to(arrowRef.current, { x: 16, y: -8, duration: 4.5, ease: "sine.inOut", repeat: -1, yoyo: true }),
    ];
    return () => { tweens.forEach((t) => t.kill()); };
  }, [paused, particles, streaks]);

  return (
    <g>
      {Array.from({ length: streaks }, (_, i) => {
        const y = 150 + rnd(i + 3) * 620;
        const x1 = 380 + rnd(i + 11) * 520;
        const len = 120 + rnd(i + 19) * 380;
        return (
          <line key={i} ref={(el) => { if (el) streakRef.current[i] = el; }}
            x1={x1} y1={y} x2={x1 + len} y2={y - rnd(i + 29) * 26}
            stroke={`rgba(${tokens.accentRgb},${(0.2 + 0.5 * rnd(i + 37)).toFixed(2)})`}
            strokeWidth={Number((0.7 + 1.2 * rnd(i + 41)).toFixed(2))} strokeLinecap="round" />
        );
      })}

      <path ref={trailRef} d="M 560 500 C 760 430, 940 520, 1150 470" fill="none" stroke="none" />
      {Array.from({ length: particles }, (_, i) => (
        <circle key={`p${i}`} ref={(el) => { if (el) dotsRef.current[i] = el; }}
          cx={0} cy={0} r={2 + 3 * rnd(i + 7)} fill="#ffd9e7" opacity={0} />
      ))}

      <g ref={arrowRef}>
        <path d={ARROW_PATH} fill={`url(#${idPrefix}-fill)`} opacity={0.42} />
        <path d={ARROW_PATH} fill="none" stroke={`url(#${idPrefix}-rim)`} strokeWidth={2.4}
          filter={`url(#${idPrefix}-blur)`} opacity={0.95} />
        <path d={ARROW_PATH} fill="none" stroke="rgba(255,214,230,0.85)" strokeWidth={1} />
      </g>
    </g>
  );
}
