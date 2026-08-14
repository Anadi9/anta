"use client";

import { motion } from "framer-motion";
import { Nav } from "@/components/Nav";
import { HeroBackground } from "@/components/hero-background/HeroBackground";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// Client component: Framer Motion + the animated background both need the
// browser. Kept separate from app/page.tsx so that file can stay a server
// component and export real per-page metadata (client components can't
// export `metadata`).
export function HeroSection() {
  return (
    <>
      <Nav />
      <section className="relative min-h-screen overflow-hidden bg-bg">
        <HeroBackground variant="design" />

        <motion.div
          className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 text-center"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.09 } } }}
        >
          <motion.h1
            variants={fadeUp}
            className="text-5xl font-bold text-white md:text-7xl"
          >
            You already know what to build.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-xl text-fg-muted"
          >
            An AI studio for teams that would rather ship the system than
            manage another hire.
          </motion.p>
          <motion.a
            href="#scope"
            variants={fadeUp}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            className="mx-auto mt-10 inline-flex items-center gap-3 border border-accent/75 px-6 py-4 font-mono text-xs uppercase tracking-widest text-white"
          >
            Scope it live
            <motion.span variants={{ hover: { x: 5 } }}>→</motion.span>
          </motion.a>
        </motion.div>
      </section>
    </>
  );
}
