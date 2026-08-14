import { useEffect, useRef } from "react";
import { rnd, tokens } from "./tokens";

export type ParticleNetworkProps = {
  nodeCount?: number;
  /** Multiplies nodeCount — a single knob for scene density. */
  density?: number;
  origin?: "left" | "right" | "center";
  /** Fraction of the box the cloud spans, 0-1. */
  spread?: number;
  seed?: number;
  paused?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

type Node = {
  x: number; y: number; vx: number; vy: number;
  s: number; pts: number; rot: number; bright: boolean; ph: number;
};

/**
 * Canvas 2D node field: faceted dark stars + a few glowing "active" nodes,
 * linked by distance-faded pink lines. rAF loop, no GSAP — cheapest per frame.
 */
export function ParticleNetwork({
  nodeCount = 40, density = 1, origin = "center", spread = 0.95,
  seed = 1, paused = false, className, style,
}: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const count = Math.max(8, Math.round(nodeCount * density));
    const S = (i: number) => rnd(i * 1.7 + seed);

    let W = 1, H = 1, nodes: Node[] = [], raf = 0, running = false;

    const init = () => {
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bx = origin === "left" ? 0.34 : origin === "right" ? 0.68 : 0.5;
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.min(0.98, Math.max(0.02, bx + (S(i) - 0.5) * spread)) * W,
        y: Math.min(0.98, Math.max(0.02, 0.5 + (S(i + 50) - 0.5) * 0.96)) * H,
        vx: (S(i + 11) - 0.5) * 0.24, vy: (S(i + 23) - 0.5) * 0.24,
        s: 3 + 7 * S(i + 31), pts: 4 + Math.floor(3 * S(i + 41)),
        rot: S(i + 53) * 6.283, bright: S(i + 61) > 0.76, ph: S(i + 71) * 6.283,
      }));
    };

    const starPath = (n: Node) => {
      ctx.beginPath();
      const k = n.pts * 2;
      for (let i = 0; i < k; i++) {
        const a = n.rot + (i / k) * Math.PI * 2;
        const rr = (i % 2 ? n.s * 0.44 : n.s) * (0.82 + 0.3 * rnd(n.ph + i));
        const x = n.x + Math.cos(a) * rr;
        const y = n.y + Math.sin(a) * rr;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const maxD = Math.min(200, Math.max(90, W * 0.17));
      ctx.lineWidth = 0.7;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d >= maxD) continue;
          ctx.strokeStyle = `rgba(${tokens.accentRgb},${(0.3 * (1 - d / maxD)).toFixed(3)})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      for (const n of nodes) {
        if (n.bright) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.s * 3.6);
          g.addColorStop(0, "rgba(255,228,240,0.95)");
          g.addColorStop(0.34, `rgba(${tokens.accentRgb},0.5)`);
          g.addColorStop(1, `rgba(${tokens.accentRgb},0)`);
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(n.x, n.y, n.s * 3.6, 0, 6.283); ctx.fill();
          ctx.fillStyle = "rgba(255,245,250,0.95)";
          ctx.beginPath(); ctx.arc(n.x, n.y, Math.max(1, n.s * 0.3), 0, 6.283); ctx.fill();
        } else {
          starPath(n);
          ctx.fillStyle = "rgba(26,8,15,0.88)"; ctx.fill();
          ctx.strokeStyle = `rgba(${tokens.accentRgb},0.55)`;
          ctx.lineWidth = 0.9; ctx.stroke();
        }
      }
    };

    const step = () => {
      if (!running) return;
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy; n.rot += 0.0016;
        if (n.x < 4 || n.x > W - 4) n.vx *= -1;
        if (n.y < 4 || n.y > H - 4) n.vy *= -1;
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    const ro = new ResizeObserver(() => { init(); draw(); });
    ro.observe(canvas);
    init(); draw();

    if (!paused) { running = true; raf = requestAnimationFrame(step); }
    return () => { running = false; cancelAnimationFrame(raf); ro.disconnect(); };
  }, [nodeCount, density, origin, spread, seed, paused]);

  return <canvas ref={canvasRef} className={className} style={{ display: "block", ...style }} />;
}
