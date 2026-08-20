import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createHash } from "node:crypto";

/**
 * IP rate limiting for /api/scope.
 *
 * This is the cost ceiling on a public, unauthenticated endpoint that calls a
 * paid API — without it, one script is an unbounded bill (ARCHITECTURE.md §3,
 * step 3). A sliding window rather than a fixed one so a visitor can't burst
 * the whole allowance at the boundary of every window.
 *
 * The limit is deliberately generous per visitor and cheap to abuse past:
 * five scopes an hour is far more than an honest visitor needs, and stops a
 * loop dead.
 */

const LIMIT = 5;
const WINDOW = "1 h";

let limiter: Ratelimit | null = null;

/**
 * Rate limiting is only wired when Upstash credentials exist. In local dev
 * that means no limiter — which is fine, and is why `isRateLimitConfigured`
 * exists: the route refuses to serve a production request without one rather
 * than silently running uncapped.
 */
function getLimiter(): Ratelimit | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  limiter ??= new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(LIMIT, WINDOW),
    analytics: true,
    prefix: "anta:scope",
  });
  return limiter;
}

export function isRateLimitConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

/**
 * Hash the IP before it touches Redis or Postgres. We need to correlate
 * requests from one source; we don't need to hold the address itself, and
 * storing raw IPs makes this table PII we'd have to manage (ARCHITECTURE §4).
 * Salted with a server-side secret so the hash isn't reversible by rainbow
 * table over the small IPv4 space — falls back to the Supabase service key,
 * which is already required for this route to log anything.
 */
export function hashIp(ip: string): string {
  const salt =
    process.env.IP_HASH_SALT ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "anta";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

/** Best-effort client IP. Vercel sets `x-forwarded-for`; first entry is the client. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip")?.trim() || "unknown";
}

export type RateLimitVerdict = {
  allowed: boolean;
  /** Seconds until the visitor may try again — only meaningful when blocked. */
  retryAfter: number;
};

/**
 * Local development bypasses the limiter entirely.
 *
 * Not a convenience — a correctness fix for testing. The window is keyed on a
 * hash of the client IP, and every request from a dev machine (browser, curl,
 * an agent probing the endpoint) collapses to one identity, so five requests
 * exhaust the hour. Worse, the panel's failure mode is a silent one: it falls
 * back to a static scope from lib/scope/static-scopes.ts with no on-screen
 * tell, so a rate-limited developer sees a plausible canned answer and
 * concludes the model is broken. That happened.
 *
 * Gated on NODE_ENV rather than the request IP: in dev there is no
 * `x-forwarded-for`, so `clientIp` returns "unknown" and a loopback check
 * would never match. Vercel sets NODE_ENV=production for preview deployments
 * as well as production, so neither is affected — the public endpoint is
 * never uncapped by this.
 */
function bypassForDevelopment(): boolean {
  return process.env.NODE_ENV !== "production";
}

export async function checkRateLimit(ipHash: string): Promise<RateLimitVerdict> {
  // Checked before getLimiter() so dev traffic costs no Upstash commands
  // either — the free tier meters requests, not just rejections.
  if (bypassForDevelopment()) return { allowed: true, retryAfter: 0 };

  const rl = getLimiter();
  if (!rl) return { allowed: true, retryAfter: 0 };

  const { success, reset } = await rl.limit(ipHash);
  return {
    allowed: success,
    retryAfter: Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
  };
}
