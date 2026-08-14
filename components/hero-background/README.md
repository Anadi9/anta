# Hero background system

Animated, non-interactive background layer for hero sections. Five variants —
`design`, `build`, `architect`, `automate`, `ship` — sharing one token set and
one technical foundation. No paid GSAP plugins.

## Install

```bash
npm i gsap framer-motion
```

Only free plugins are used: `ScrollTrigger` and `MotionPathPlugin` (both
registered inside the components that need them).

## Drop-in

```tsx
import { motion } from "framer-motion";
import { HeroBackground } from "@/components/hero-background/HeroBackground";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0508]">
      <HeroBackground variant="design" />

      {/* Foreground stays on its own layer — Framer Motion only, z-10 */}
      <motion.div
        className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col justify-center text-center"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.09 } } }}
      >
        <motion.h1 variants={fadeUp} className="text-5xl font-bold text-white">…</motion.h1>
        <motion.p  variants={fadeUp} className="mt-6 text-neutral-400">…</motion.p>
        <motion.a
          variants={fadeUp}
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
          className="mx-auto mt-10 inline-flex items-center gap-3 border border-[#ec1a63]/75 px-6 py-4 font-mono text-xs uppercase tracking-widest text-white"
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          animate=""
        >
          Start a conversation
          <motion.span variants={{ hover: { x: 5 } }}>→</motion.span>
        </motion.a>
      </motion.div>
    </section>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};
```

The parent **must** be `position: relative` and `overflow: hidden`; the
background pins itself to `inset-0 z-0 pointer-events-none`, so put content at
`z-10`.

## Files

| File | Role |
| --- | --- |
| `HeroBackground.tsx` | variant switch, shared wrapper, ScrollTrigger crossfade |
| `useBlobPath.ts` | Catmull-Rom→Bezier blob path + radii tween (the MorphSVG replacement) |
| `GlossyBlob.tsx` | `BlobDefs`, `GlossyBlob`, `Bubble`, `BubbleField` |
| `ParticleNetwork.tsx` | canvas 2D node field + distance-faded links |
| `CubeCluster.tsx` | CSS-3D lattice, stagger assembly, connector lines |
| `BlueprintGrid.tsx` | self-drawing grid, coordinate labels, scan line |
| `RadiatingRays.tsx` | pulsing ray burst from a focal point |
| `CometTrail.tsx` | rocket arrow, MotionPath particle stream, speed lines |
| `tokens.ts` | colors + deterministic `rnd()` |
| `useReducedMotion.ts` | OS motion preference |

## Variant composition

- **design** — four liquid blobs (upper-left / lower-right anchors) + seven drifting bubbles.
- **build** — `ParticleNetwork` left half, `CubeCluster` right half assembling on mount with connector lines from glowing input nodes.
- **architect** — full-bleed blueprint grid, coordinate labels, 8s scan sweep. No blobs.
- **automate** — `RadiatingRays` just left of center terminating into a blob cluster + dense `ParticleNetwork` on the right.
- **ship** — comet blob and bubble scatter far left, speed-line streaks across the middle, rocket arrow with MotionPath trail on the right.

## How the blob morph works (no MorphSVGPlugin)

`useBlobPath` keeps a fixed-length array of radius multipliers around a ring.
GSAP tweens **that array of numbers**, and `onUpdate` rebuilds the path string
through a Catmull-Rom→cubic-Bezier conversion. Because the point count never
changes, every keyframe is topologically identical, so interpolation is stable
and free. `gsap.to(radii, { 0: …, 1: …, ease: "sine.inOut", repeat: -1, yoyo: true })`.

Drift and rotation live on a separate infinite timeline attached to the `<g>`,
so parallax and morph never fight.

## Legibility

The whole layer carries a radial mask that drops shapes to ~20% opacity across
the center ellipse (roughly the middle 60% width) and full strength at the
edges. Tune `TEXT_SAFE_MASK` in `HeroBackground.tsx` if your headline block is
wider or off-center.

## Reduced motion

`useReducedMotion` feeds a `paused` prop into every child. When set, loops are
skipped and shapes render on their first frame; the ScrollTrigger entrance
still runs at duration 0 so nothing stays invisible.

## Performance notes

- Particle fields are canvas + rAF, never GSAP — one draw call per frame.
- Blob morphs are `setState` on a path string; keep `points` at 8–10.
- Everything scoped through `gsap.context()` and killed on unmount.
- Pass `density={0.6}` on mobile breakpoints to thin the node/ray counts.
