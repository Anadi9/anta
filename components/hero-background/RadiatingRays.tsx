import { useEffect, useRef } from "react";
import gsap from "gsap";
import { rnd, tokens } from "./tokens";

export type RadiatingRaysProps = {
  originX?: number;
  originY?: number;
  count?: number;
  paused?: boolean;
};

/** Pulsing energy burst from a focal point — feeds the node cluster downstream. */
export function RadiatingRays({ originX = 590, originY = 470, count = 38, paused = false }: RadiatingRaysProps) {
  const raysRef = useRef<SVGLineElement[]>([]);
  const dotsRef = useRef<SVGCircleElement[]>([]);

  useEffect(() => {
    const rays = raysRef.current.filter(Boolean);
    const dots = dotsRef.current.filter(Boolean);
    if (paused) { gsap.set(rays, { scale: 1, opacity: 1 }); gsap.set(dots, { opacity: 0 }); return; }
    const tweens = [
      gsap.fromTo(rays, { scale: 0.3, opacity: 0.1 }, {
        scale: 1, opacity: 1, duration: 2.4, ease: "sine.inOut", repeat: -1, yoyo: true,
        svgOrigin: `${originX} ${originY}`, stagger: { each: 0.055, from: "random" },
      }),
      gsap.fromTo(dots, { x: 0, y: 0, opacity: 0 }, {
        x: (i: number) => 320 + 420 * rnd(i + 13),
        y: (i: number) => (rnd(i + 27) - 0.5) * 420,
        opacity: 0, duration: 3, ease: "power1.out", repeat: -1, stagger: 0.25,
      }),
    ];
    return () => { tweens.forEach((t) => t.kill()); };
  }, [paused, originX, originY, count]);

  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + rnd(i + 3) * 0.14;
        const len = 150 + 620 * rnd(i + 9);
        return (
          <line key={i} ref={(el) => { if (el) raysRef.current[i] = el; }}
            x1={originX} y1={originY}
            x2={originX + Math.cos(a) * len} y2={originY + Math.sin(a) * len * 0.72}
            stroke={`rgba(${tokens.accentRgb},${(0.16 + 0.5 * rnd(i + 17)).toFixed(2)})`}
            strokeWidth={Number((0.6 + 1.3 * rnd(i + 29)).toFixed(2))} strokeLinecap="round" />
        );
      })}
      <circle cx={originX} cy={originY} r={5} fill="#fff" />
      {Array.from({ length: 10 }, (_, i) => (
        <circle key={`d${i}`} ref={(el) => { if (el) dotsRef.current[i] = el; }}
          cx={originX} cy={originY} r={2 + 2 * rnd(i + 5)} fill="#ffd9e7" opacity={0} />
      ))}
    </g>
  );
}
