"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { HeroScenes } from "@/components/hero-background/HeroScenes";
import type { HeroVariant } from "@/components/hero-background/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/**
 * The rotating verb in the headline. These strings are also what the hero
 * background reads — that's not a coincidence, it's the reference's
 * behaviour (ANTA Site.dc.html:637-645, which on every word change calls
 * `triggerBurst()`, `assignLayout(word)` and `assignBlueprintShape(word)`):
 * the word and the background change together, so "We architect" scatters
 * the particles into a structural grid and "We ship" into an arrow.
 */
const HERO_WORDS: HeroVariant[] = [
  "design",
  "architect",
  "build",
  "ship",
  "automate",
];

const ROTATE_MS = 4200;
const FADE_MS = 300;

/**
 * Hero, built against design-reference/ANTA Site.dc.html (lines 114–160).
 *
 * Client component: the word rotation, the animated background, and Framer
 * Motion all need the browser. app/page.tsx stays a server component so it
 * can export real per-page metadata.
 */
export function HeroSection() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Fade the word out, swap it (and the background variant) while it's
  // invisible, fade back in — matching the reference's 300ms/4200ms timing.
  // Under prefers-reduced-motion nothing rotates; the hero rests on "design".
  useEffect(() => {
    if (reduced) return;
    const tick = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % HERO_WORDS.length);
        setVisible(true);
      }, FADE_MS);
    }, ROTATE_MS);
    return () => clearInterval(tick);
  }, [reduced]);

  const word = reduced ? HERO_WORDS[0] : HERO_WORDS[index];

  return (
    <>
      <Nav />
      <section className="relative flex min-h-[calc(100svh-64px)] flex-col justify-center overflow-hidden border-b border-line-2 bg-bg-deep px-[clamp(18px,4vw,56px)] pb-[clamp(56px,7vw,84px)] pt-[calc(64px+clamp(56px,8vw,120px))] text-center">
        {/*
          Hero background, design-reference/ANTA Hero.html — the masked scene
          layer at .78 opacity, driven by the `Scenes` mode. That mode was the
          one gap in the earlier ANTA Site.dc.html port: it `import()`ed a
          `hero-scenes.js` that export didn't ship. ANTA Hero.html does ship it,
          and selects it (`heroMode()` returns 'Scenes'), so this is the target
          hero art — five composited worlds, one per rotating verb.

          In that mode the reference's <canvas> is cleared every frame, so the
          network/blueprint canvas is not rendered here. `HeroCanvas` stays in
          the repo as the fallback art it always was.
        */}
        <HeroScenes word={word} />

        {/*
          Centre bloom, ANTA Site.dc.html:117 — a sibling of the canvas, not a
          child, so it is neither dimmed nor clipped by the layer above it.
          It lifts the middle of the hero behind the headline.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[30%] left-1/2 z-0 h-[70vw] w-[70vw] -translate-x-1/2 opacity-[0.10] [background:radial-gradient(circle,var(--color-accent-deep)_0%,transparent_62%)]"
        />

        <motion.div
          className="relative z-10 mx-auto max-w-[980px]"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.09 } } }}
        >

          <h1 className="sr-only">
            Custom AI development studio growth-stage teams
          </h1>

          <motion.p
            variants={fadeUp}
            className="m-0 text-balance text-[clamp(32px,5.4vw,68px)] font-bold leading-[1.06] tracking-[-0.03em]"
          >
            <span className="flex items-baseline justify-center gap-[0.28em] whitespace-nowrap text-t7">
              We{" "}
              <span
                className="inline-block rounded-[0.06em] bg-accent px-[0.16em] py-[0.02em] text-[#FBFAF8] transition-opacity duration-300"
                style={{ opacity: visible ? 1 : 0 }}
              >
                {word}
              </span>
            </span>
            <span className="block text-t7">the future with</span>
            <HumanAndAi />
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-[clamp(22px,3vw,32px)] max-w-[54ch] text-pretty text-[clamp(15px,1.4vw,18px)] leading-[1.65] text-t4"
          >
            We design and build the AI systems your team needs, so you scale
            without adding headcount.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-[clamp(32px,4.5vw,48px)] flex justify-center"
          >
            <motion.a
              href="#contact"
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              /*
                Outlined, not the cream chip ANTA Site.dc.html's dark theme
                specifies (--cta-bg #F5F4F1 / --cta-fg #0A0A0B). The approved
                hero concept shows a transparent button with an accent border
                and light text; that image wins for the hero. The cta-bg /
                cta-fg tokens are untouched, so the Scope submit and About
                closing CTA keep the chip treatment.
              */
              className="inline-flex items-center gap-3 border border-accent bg-transparent px-7 py-4 font-mono text-[13px] font-bold uppercase tracking-[0.06em] text-ink shadow-[0_0_0_1px_rgba(236,26,99,0.18)] transition-shadow duration-[250ms] hover:shadow-[0_0_0_1px_var(--color-accent),0_0_26px_rgba(236,26,99,0.28)]"
            >
              Start a conversation
              <motion.span variants={{ hover: { x: 5 } }} className="text-[15px]">
                →
              </motion.span>
            </motion.a>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

/**
 * The third headline line: fingerprint-heart mark + script "Human" + accent
 * plus + pixel matrix + display "AI". This is the one place all three
 * decorative fonts appear, and it's why they're loaded at all.
 */
function HumanAndAi() {
  return (
    <span className="inline-flex flex-nowrap items-center justify-center gap-[0.13em] whitespace-nowrap font-mono text-[0.9em] font-bold tracking-[-0.05em] text-ink-max">
      <span
        aria-hidden
        className="relative inline-block h-[0.9em] w-[0.9em] bg-accent"
        style={{
          filter: "drop-shadow(0 0 12px rgba(236,26,99,0.45))",
          maskImage: "url('/fingerprint-heart.png')",
          WebkitMaskImage: "url('/fingerprint-heart.png')",
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
      <span className="font-script text-[1.65em] font-bold tracking-[-0.02em]">
        Human
      </span>
      <span className="mx-[0.22em] text-[0.7em] font-bold text-accent-ink">+</span>
      <PixelMatrix />
      <span className="font-display text-[1.95em] font-bold tracking-[-0.02em]">
        AI
      </span>
    </span>
  );
}

/**
 * 4x4 accent grid, cell opacities and animation delays copied cell-for-cell
 * from the reference so the shimmer pattern reads the same.
 */
const PIXELS: { opacity: number; delay?: number }[] = [
  { opacity: 1, delay: 0 },
  { opacity: 0.9 },
  { opacity: 0.5, delay: 0.5 },
  { opacity: 0.16 },
  { opacity: 0.92 },
  { opacity: 1, delay: 0.2 },
  { opacity: 0.28 },
  { opacity: 0.5, delay: 0.9 },
  { opacity: 0.62 },
  { opacity: 0.34 },
  { opacity: 0.74, delay: 0.35 },
  { opacity: 0.12 },
  { opacity: 0.3, delay: 1.1 },
  { opacity: 0.5 },
  { opacity: 0.14 },
  { opacity: 0.06 },
];

function PixelMatrix() {
  return (
    <span
      aria-hidden
      className="mr-[0.13em] grid h-[0.7em] w-[0.7em] grid-cols-4 grid-rows-4 gap-[0.022em]"
    >
      {PIXELS.map((px, i) => (
        <span
          key={i}
          className="bg-accent motion-reduce:!animate-none"
          style={{
            opacity: px.opacity,
            animation:
              px.delay === undefined
                ? undefined
                : `anta-px 2.4s ease-in-out ${px.delay}s infinite`,
          }}
        />
      ))}
    </span>
  );
}
