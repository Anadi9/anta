import { useEffect, useRef } from "react";
import gsap from "gsap";
import { rnd, tokens } from "./tokens";

export type CubeClusterProps = {
  /** Cubes per axis (3 → 27 cubes). */
  size?: number;
  cubeSize?: number;
  gap?: number;
  paused?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

const FACE_TRANSFORMS = (s: number) => [
  `translateZ(${s / 2}px)`,
  `rotateY(180deg) translateZ(${s / 2}px)`,
  `rotateY(90deg) translateZ(${s / 2}px)`,
  `rotateY(-90deg) translateZ(${s / 2}px)`,
  `rotateX(90deg) translateZ(${s / 2}px)`,
  `rotateX(-90deg) translateZ(${s / 2}px)`,
];

/**
 * CSS-3D cube lattice that assembles on mount (GSAP stagger from scattered
 * offsets), then wobbles forever. Connector lines draw in with dashoffset.
 */
export function CubeCluster({
  size = 3, cubeSize = 56, gap = 7, paused = false, className, style,
}: CubeClusterProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const cubesRef = useRef<HTMLDivElement[]>([]);
  const linesRef = useRef<SVGPathElement[]>([]);

  const span = (cubeSize + gap) * size - gap;
  const half = span / 2;
  const box = span * 2.2;

  const cells: { x: number; y: number; z: number; d: number }[] = [];
  for (let x = 0; x < size; x++)
    for (let y = 0; y < size; y++)
      for (let z = 0; z < size; z++)
        cells.push({ x, y, z, d: x + y + z });
  cells.sort((a, b) => a.d - b.d); // assemble front-to-back

  const nodes: [number, number][] = [[-96, 22], [64, -66], [352, -34]];
  const anchors: [number, number][] = [[128, 150], [206, 118], [318, 148]];

  useEffect(() => {
    const cubes = cubesRef.current.filter(Boolean);
    const lines = linesRef.current.filter(Boolean);
    lines.forEach((l) => {
      const len = l.getTotalLength();
      gsap.set(l, { strokeDasharray: len, strokeDashoffset: paused ? 0 : len });
    });
    if (paused) {
      gsap.set(cubes, { opacity: 1, x: 0, y: 0, z: 0, rotationY: 0 });
      return;
    }
    const tweens = [
      gsap.from(cubes, {
        opacity: 0, duration: 1.15, ease: "power3.out", stagger: 0.02,
        x: (i: number) => (rnd(i + 3) - 0.5) * 460,
        y: (i: number) => (rnd(i + 19) - 0.5) * 420,
        z: (i: number) => (rnd(i + 31) - 0.5) * 460,
        rotationY: (i: number) => (rnd(i + 43) - 0.5) * 180,
      }),
      gsap.to(lines, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", stagger: 0.18, delay: 1 }),
      gsap.to(groupRef.current, {
        rotationY: "-=16", rotationX: "+=7",
        duration: 11, ease: "sine.inOut", repeat: -1, yoyo: true,
      }),
    ];
    return () => { tweens.forEach((t) => t.kill()); };
  }, [paused, size]);

  return (
    <div className={className} style={{ position: "absolute", width: box, height: box, perspective: 1500, ...style }}>
      <div
        ref={groupRef}
        style={{
          position: "absolute", inset: 0, transformStyle: "preserve-3d",
          transform: "rotateX(-22deg) rotateY(-34deg)",
        }}
      >
        {cells.map((c, i) => {
          const px = c.x * (cubeSize + gap) - half + cubeSize / 2;
          const py = c.y * (cubeSize + gap) - half + cubeSize / 2;
          const pz = c.z * (cubeSize + gap) - half + cubeSize / 2;
          return (
            <div
              key={i}
              style={{
                position: "absolute", left: "50%", top: "50%",
                width: cubeSize, height: cubeSize,
                margin: `${-cubeSize / 2}px 0 0 ${-cubeSize / 2}px`,
                transformStyle: "preserve-3d",
                transform: `translate3d(${px}px,${py}px,${pz}px)`,
              }}
            >
              <div
                ref={(el) => { if (el) cubesRef.current[i] = el; }}
                style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}
              >
                {FACE_TRANSFORMS(cubeSize).map((t, f) => (
                  <div
                    key={f}
                    style={{
                      position: "absolute", inset: 0, transform: t,
                      background: `linear-gradient(135deg,rgba(${tokens.accentRgb},0.22),rgba(12,4,8,0.9))`,
                      border: `1px solid rgba(${tokens.accentRgb},0.5)`,
                      boxShadow: `inset 0 0 22px rgba(${tokens.accentRgb},0.18), 0 0 14px rgba(${tokens.accentRgb},0.12)`,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Floor grid under the lattice */}
        <div
          style={{
            position: "absolute", left: "50%", top: "50%", width: 560, height: 560,
            margin: "-280px 0 0 -280px",
            transform: `rotateX(90deg) translateZ(-${half + 46}px)`,
            backgroundImage:
              `linear-gradient(rgba(${tokens.accentRgb},0.42) 1px,transparent 1px),` +
              `linear-gradient(90deg,rgba(${tokens.accentRgb},0.42) 1px,transparent 1px)`,
            backgroundSize: "34px 34px", opacity: 0.55,
            maskImage: "radial-gradient(circle at 50% 50%,#000 8%,rgba(0,0,0,0.35) 42%,transparent 72%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 50%,#000 8%,rgba(0,0,0,0.35) 42%,transparent 72%)",
          }}
        />
      </div>

      {/* Input nodes → top faces */}
      <svg viewBox={`0 0 ${box} ${box}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        {nodes.map(([nx, ny], i) => (
          <g key={i}>
            <path
              ref={(el) => { if (el) linesRef.current[i] = el; }}
              d={`M ${nx} ${ny} L ${anchors[i][0]} ${anchors[i][1]}`}
              fill="none" stroke={`rgba(${tokens.accentRgb},0.6)`} strokeWidth={1}
            />
            <circle cx={nx} cy={ny} r={7} fill={tokens.accent} opacity={0.9}
              style={{ filter: `drop-shadow(0 0 12px rgba(${tokens.accentRgb},0.9))` }} />
            <circle cx={anchors[i][0]} cy={anchors[i][1]} r={3} fill="#fff" opacity={0.9} />
          </g>
        ))}
      </svg>
    </div>
  );
}
