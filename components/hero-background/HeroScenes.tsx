"use client";

import { useEffect, useRef } from "react";
import { createHeroScenes, type HeroScenesApi } from "./scenes";
import { useReducedMotion } from "./useReducedMotion";
import type { HeroVariant } from "./types";

/**
 * The hero's `Scenes` background — the mode `design-reference/ANTA Hero.html`
 * ships and selects (`heroMode()` returns `'Scenes'`, and its canvas is cleared
 * every frame in that mode). Five keyword worlds built from the art plates in
 * `public/scene/`, one per rotating headline verb, cross-fading as the word
 * changes.
 *
 * The heavy lifting is in `scenes.ts`; this component only owns the host
 * element, its layer styling, and the mount/variant/unmount lifecycle.
 *
 * LAYER STYLING (ANTA Hero.html, the scene `<div>` sibling of the canvas):
 * `opacity: .78` behind a centre ellipse mask, so the art thins out where the
 * headline sits and reads full-strength at the edges. The reference's
 * `--scene-filter: invert(1) hue-rotate(180deg)` is a *light-theme* correction
 * — its dark theme sets `none`, and this site is dark-only, so no filter is
 * applied.
 *
 * The host positions itself absolutely against its parent, so the parent needs
 * `position: relative` and `overflow: hidden`. It is `aria-hidden` and
 * `pointer-events: none` (pointer parallax listens on `window`, not here).
 */
export function HeroScenes({ word }: { word: HeroVariant }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<HeroScenesApi | null>(null);
  const reduced = useReducedMotion();

  // One instance per host. `reduced` is a dependency because it decides whether
  // tweens are created at all — flipping it has to rebuild the whole scene.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const accent =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-accent")
        .trim() || "#C20A62";
    const api = createHeroScenes(host, { accent, reduced, intensity: 0.8 });
    apiRef.current = api;
    return () => {
      api.destroy();
      apiRef.current = null;
    };
  }, [reduced]);

  // Drive the variant. Runs after the mount effect above on first render, so
  // the initial word lands on a freshly built instance.
  useEffect(() => {
    apiRef.current?.setVariant(word);
  }, [word, reduced]);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.78]"
      style={{
        maskImage:
          "radial-gradient(ellipse 46% 38% at 50% 50%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.5) 54%, #000 82%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 46% 38% at 50% 50%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.5) 54%, #000 82%)",
      }}
    />
  );
}
