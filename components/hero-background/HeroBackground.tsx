import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BlobDefs, Bubble, GlossyBlob } from "./GlossyBlob";
import { ParticleNetwork } from "./ParticleNetwork";
import { CubeCluster } from "./CubeCluster";
import { BlueprintGrid } from "./BlueprintGrid";
import { RadiatingRays } from "./RadiatingRays";
import { CometTrail } from "./CometTrail";
import { useReducedMotion } from "./useReducedMotion";
import { tokens } from "./tokens";

gsap.registerPlugin(ScrollTrigger);

export type HeroVariant = "design" | "build" | "architect" | "automate" | "ship";

export type HeroBackgroundProps = {
  variant: HeroVariant;
  /** Scales node/ray counts. 1 = as designed. */
  density?: number;
  className?: string;
};

const VIEWBOX = "0 0 1440 900";

/** Keeps the center ~60% legible: shapes fade toward the headline. */
const TEXT_SAFE_MASK =
  "radial-gradient(ellipse 44% 36% at 50% 52%, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.52) 54%, #000 82%)";

const Svg = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox={VIEWBOX} preserveAspectRatio="xMidYMid slice"
    className="absolute inset-0 block h-full w-full">
    {children}
  </svg>
);

const Glow = ({ style }: { style: React.CSSProperties }) => (
  <div aria-hidden className="pointer-events-none absolute" style={style} />
);

export function HeroBackground({ variant, density = 1, className = "" }: HeroBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const uid = useId().replace(/[:]/g, "");
  const p = `hb-${uid}-${variant}`;

  // Crossfade the whole layer when the parent hero enters/leaves the viewport.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { opacity: 0, scale: 1.05 }, {
        opacity: 1, scale: 1, duration: reduced ? 0 : 1.1, ease: "power2.out",
        scrollTrigger: {
          trigger: el.parentElement!, start: "top 80%", end: "bottom 20%",
          toggleActions: "play reverse play reverse",
        },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced, variant]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
      style={{ opacity: 0, maskImage: TEXT_SAFE_MASK, WebkitMaskImage: TEXT_SAFE_MASK }}
    >
      {variant === "design" && (
        <>
          <Glow style={{ left: "-14%", top: "-24%", width: "56%", height: "80%", background: `radial-gradient(circle,rgba(${tokens.accentRgb},0.20),transparent 62%)` }} />
          <Glow style={{ right: "-16%", bottom: "-26%", width: "60%", height: "82%", background: `radial-gradient(circle,rgba(${tokens.accentRgb},0.17),transparent 62%)` }} />
          <Svg>
            <BlobDefs idPrefix={p} />
            <GlossyBlob idPrefix={p} cx={210} cy={130} rx={300} ry={250} points={9} seed={3} duration={9} driftX={26} driftY={20} spin={5} paused={reduced} />
            <GlossyBlob idPrefix={p} cx={300} cy={470} rx={130} ry={400} points={10} seed={17} duration={11} driftX={-18} driftY={14} spin={-4} opacity={0.92} paused={reduced} />
            <GlossyBlob idPrefix={p} cx={1210} cy={720} rx={400} ry={320} points={9} seed={29} duration={10} driftX={-24} driftY={-20} spin={-6} paused={reduced} />
            <GlossyBlob idPrefix={p} cx={1290} cy={190} rx={180} ry={160} points={8} seed={41} duration={7} driftX={16} driftY={22} spin={7} opacity={0.85} paused={reduced} />
            {([[560, 70, 26], [640, 300, 14], [250, 760, 30], [430, 690, 18], [1050, 470, 12], [980, 820, 22], [1390, 470, 16]] as const)
              .map(([cx, cy, r], i) => <Bubble key={i} idPrefix={p} cx={cx} cy={cy} r={r} seed={i * 9 + 2} paused={reduced} />)}
          </Svg>
        </>
      )}

      {variant === "build" && (
        <>
          <Glow style={{ right: "2%", top: "8%", width: "52%", height: "84%", background: `radial-gradient(circle,rgba(${tokens.accentRgb},0.16),transparent 62%)` }} />
          <ParticleNetwork nodeCount={34} density={density} origin="left" seed={5} paused={reduced}
            style={{ position: "absolute", left: 0, top: 0, width: "56%", height: "100%" }} />
          <Svg>
            <BlobDefs idPrefix={p} />
            {([[190, 190, 46, 3], [330, 700, 38, 11], [640, 800, 30, 23], [560, 150, 26, 37], [1180, 120, 34, 47]] as const)
              .map(([cx, cy, r, seed], i) => (
                <GlossyBlob key={i} idPrefix={p} cx={cx} cy={cy} rx={r} ry={r} points={10} star seed={seed}
                  duration={6 + i} driftX={12} driftY={-14} spin={12} rimWidth={1.1} paused={reduced} />
              ))}
          </Svg>
          <CubeCluster paused={reduced} style={{ left: "76%", top: "52%", transform: "translate(-50%,-50%)" }} />
        </>
      )}

      {variant === "architect" && <BlueprintGrid paused={reduced} />}

      {variant === "automate" && (
        <>
          <Glow style={{ left: "28%", top: "32%", width: "22%", height: "36%", transform: "translate(-50%,-50%)", background: `radial-gradient(circle,rgba(255,215,232,0.4),rgba(${tokens.accentRgb},0.20) 32%,transparent 66%)` }} />
          <ParticleNetwork nodeCount={30} density={density} origin="right" seed={13} paused={reduced}
            style={{ position: "absolute", left: "52%", top: "6%", width: "48%", height: "88%" }} />
          <Svg>
            <BlobDefs idPrefix={p} />
            <RadiatingRays originX={590} originY={470} count={Math.round(38 * density)} paused={reduced} />
            {([[1215, 500, 96, 7], [1310, 590, 62, 19], [1140, 620, 58, 31], [1268, 420, 48, 43], [1180, 452, 40, 57]] as const)
              .map(([cx, cy, r, seed], i) => (
                <GlossyBlob key={i} idPrefix={p} cx={cx} cy={cy} rx={r} ry={r * 0.92} points={9} seed={seed}
                  duration={7 + i} driftX={14} driftY={-12} spin={5} opacity={0.95} paused={reduced} />
              ))}
          </Svg>
        </>
      )}

      {variant === "ship" && (
        <>
          <Glow style={{ left: "6%", top: "16%", width: "44%", height: "72%", background: `radial-gradient(circle,rgba(${tokens.accentRgb},0.20),transparent 62%)` }} />
          <Glow style={{ right: "2%", top: "22%", width: "40%", height: "60%", background: `radial-gradient(circle,rgba(${tokens.accentRgb},0.17),transparent 64%)` }} />
          <Svg>
            <BlobDefs idPrefix={p} />
            <GlossyBlob idPrefix={p} cx={210} cy={450} rx={300} ry={290} points={9} seed={5} duration={9} driftX={18} driftY={-16} spin={4} paused={reduced} />
            {([[470, 300, 26], [520, 620, 34], [640, 470, 18], [700, 250, 14], [760, 700, 22], [880, 560, 16]] as const)
              .map(([cx, cy, r], i) => <Bubble key={i} idPrefix={p} cx={cx} cy={cy} r={r} seed={i * 7 + 5} paused={reduced} />)}
            <CometTrail idPrefix={p} paused={reduced} />
          </Svg>
        </>
      )}
    </div>
  );
}

export default HeroBackground;
