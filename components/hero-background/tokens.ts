/** Shared design tokens for the hero background system. */
export const tokens = {
  bg: "#0b0b0c",
  accent: "#ec1a63",
  accentRgb: "236,26,99",
  accentHot: "#ff3d81",
  accentHotRgb: "255,150,190",
  blobGradient: "linear-gradient(135deg, #ff3d81, #7a0e35, #1a0509)",
  line: "rgba(255,255,255,0.7)",
  glow: "drop-shadow(0 0 40px rgba(236,26,99,0.5))",
} as const;

/** Deterministic pseudo-random so SSR and client agree (no hydration flicker). */
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
};
