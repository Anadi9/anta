# Hero background

Two independent background systems live here:

| File | What it is | Source |
| --- | --- | --- |
| `HeroScenes.tsx` + `scenes.ts` | **The hero's actual background.** Five composited art worlds, one per rotating verb. | `design-reference/ANTA Hero.html` |
| `HeroCanvas.tsx` | The canvas fallback art — `network` / `blueprint` particle modes. Not currently mounted anywhere. | `design-reference/ANTA Site.dc.html` |

## Why there are two

`ANTA Site.dc.html` exposed the hero background as an enum (line 493):
`Scenes | Network | Blueprint | None`. It defaulted to `Scenes`, but that mode
dynamically `import()`ed a `hero-scenes.js` that the export did not ship — so
the original port covered only the two inlined canvas modes and defaulted to
`Network`.

**`ANTA Hero.html` ships that module.** Its `heroMode()` returns `'Scenes'`
unconditionally, and in that mode its `drawFrame` clears the canvas every frame
— the canvas contributes nothing. So `Scenes` is the approved hero art, and
`HeroCanvas` is kept as the fallback it always was, not as the target.

## Scenes

`createHeroScenes(root, { accent, reduced, intensity })` → `{ setVariant, destroy }`.

Each of the five `HeroVariant` words maps to a scene of three parts:

1. **Glows** — 2–3 absolutely-positioned radial gradients in the accent.
2. **Art plates** — PNGs from `public/scene/` (19 files, byte-identical to the
   export's bundled assets). Each is placed by `cx`/`cy`/`w` as a % of the hero
   box, edge-feathered with a two-axis gradient mask so no crop rectangle
   prints, and given a slow yoyo float (`fx`/`fy`/`rot` over `dur` seconds) plus
   a one-shot entry tween. `z` sets how hard it reacts to pointer parallax.
3. **A procedural accent layer** built in SVG, one per word:
   - `design` → `orbs` (glass spheres) + `twinkle`
   - `build` → `links` (dashed circuit runs between the node clusters) + `twinkle`
   - `architect` → `blueprint` (drafting grid, brackets, crosshairs, call-outs,
     with a self-drawing stroke-dash entry and a travelling scan bar)
   - `automate` → `flow` (packet comets along the intake fan and out of the
     core, plus the INPUTS / LEARNING LOOP HUD) + `orbs` on a second spot set
   - `ship` → `streaks` (slipstream lines fanning back from the arrow) + `twinkle`

`setVariant` cross-fades: the new scene builds at `opacity: 0` and tweens in
over 900ms while the outgoing one tweens out over 700ms and is then torn down
(with a 1400ms belt-and-braces timer behind the `onComplete`).

### Layering

`ANTA Hero.html` stacks three things inside the hero section, all at `z-0`:

1. the `<canvas>` — full-bleed and unmasked, and **blank in Scenes mode**;
2. the scene `<div>` at `opacity: .78` behind a centre ellipse mask — this is
   `HeroScenes`, and the opacity and mask belong to *it*;
3. an accent radial bloom, `top: -30%`, `70vw` square, `opacity: .10` — this
   lives in `HeroSection`, as a sibling.

The reference's `--scene-filter: invert(1) hue-rotate(180deg)` is a
**light-theme** correction. Its dark theme sets `--scene-filter: none`
(line 41), and this site is dark-only, so no filter applies.

### Deliberate deviations

- Art is served from `/scene/*.png` rather than the export's bundled
  `assets/scene/*.png?v=6` + `window.__resources` lookup.
- The accent is read from the `--color-accent` CSS variable instead of the
  reference's hardcoded `#C20A62`, so the art tracks `tokens.ts` /
  `app/globals.css`. `HeroCanvas` follows the same rule.
- The reference's unused `out.loops` bucket is dropped.

### Reduced motion

Under `prefers-reduced-motion: reduce` no tween is created: plates render at
their resting position, `blueprint`'s strokes and `flow`'s HUD are `set` to
their finished state, and the cross-fade runs at `duration: 0`. Pointer
parallax is not wired up at all. The composition is fully legible — it just
doesn't move.

## Usage

```tsx
import { HeroScenes } from "@/components/hero-background/HeroScenes";

<section className="relative overflow-hidden">
  <HeroScenes word={word} />
  <div className="relative z-10">…</div>
</section>
```

`word` is a `HeroVariant` (`design | build | architect | automate | ship`) — the
same five strings as the rotating headline verb, in the reference's rotation
order. That coupling is the reference's own (`ANTA Hero.html`, `componentDidMount`):
every word change calls `scenes.setVariant(word)` in the same tick that swaps
the word, so the art and the word move as one.

The host positions itself absolutely against its parent and sizes off the
parent's box, so the parent needs `position: relative` and `overflow: hidden`.
It is `aria-hidden` and `pointer-events: none` — the parallax listener is on
`window`.

## HeroCanvas (fallback)

```tsx
<HeroCanvas word={word} mode="network" />   {/* "network" | "blueprint" | "none" */}
```

**`network`** — 16-42 particles (count scales with hero area), joined by accent
lines under a 210px / 22vw-wide distance threshold, with a pulse travelling a
random edge every ~850ms. On each word change the particles ease toward a new
target layout: concentric rings for `build`, a structural grid for `architect`,
three sine-displaced conveyor lines for `automate`, a radial burst for
`design`, an arrow for `ship`.

**`blueprint`** — three exploded isometric plates with bolt holes, explode axes,
a dash-dot centre axis, and a dimension stack. One plate is the focus per word,
and a per-word annotation layer (sheet number, revision, title block, leader
labels) cross-fades over 420ms. Annotations measure the hero's real text nodes
(`h1, h2, p, a, button, span[data-copy]`, cached 500ms) and skip any label that
would collide with the copy.

It parks its RAF loop with an `IntersectionObserver` while the hero is
off-screen; the reference runs unconditionally.

## No GSAP in the canvas

`HeroCanvas` is pure canvas 2D. `scenes.ts` is the one place GSAP is used (core
only — no plugins; the reference registers `MotionPathPlugin` but the scenes
module never calls it). Foreground content keeps using Framer Motion on its own
`z-10` layer.
