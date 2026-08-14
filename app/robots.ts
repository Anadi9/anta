import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";

/**
 * Explicit AI-crawler policy — a bare `*: allow` misses the fact that AI
 * bots split into "training" crawlers (hoover content into model training
 * sets) and "retrieval" crawlers (fetch live pages to answer a real-time
 * query, e.g. ChatGPT/Perplexity search). Default here is full-allow: as a
 * growth-stage studio with zero inbound brand recognition, visibility in
 * AI answers is worth more than protecting content from training. Flip
 * `AI_TRAINING_BOTS` to disallow if that calculus changes.
 */
const AI_RETRIEVAL_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-User",
  "Claude-SearchBot",
  "Perplexity-User",
  "PerplexityBot",
];

const AI_TRAINING_BOTS = ["GPTBot", "ClaudeBot", "Google-Extended", "anthropic-ai"];

// Known low-value / non-compliant crawlers — block outright.
const BLOCKED_BOTS = ["CCBot", "Bytespider"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...[...AI_RETRIEVAL_BOTS, ...AI_TRAINING_BOTS].map((userAgent) => ({
        userAgent,
        allow: "/",
      })),
      ...BLOCKED_BOTS.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
