import * as anthropic from "@/lib/scope/claude";
import * as gemini from "@/lib/scope/gemini";

/**
 * Which model answers /api/scope.
 *
 * Selection is by credential, not by a mode flag: whichever key is present
 * wins, and ANTHROPIC_API_KEY wins if both are. That means switching the site
 * between the paid and free provider is one env var in Vercel and no deploy —
 * useful, because the free tier has a daily cap and the paid one has a bill.
 *
 * SCOPE_PROVIDER overrides the order when you want to pin one explicitly.
 *
 * Both modules export the same three symbols against the same error classes
 * (lib/scope/errors.ts), so app/api/scope/route.ts never learns which ran.
 */

export { ScopeRefusedError, ScopeUnavailableError } from "@/lib/scope/errors";

function provider() {
  const pinned = process.env.SCOPE_PROVIDER;
  if (pinned === "anthropic") return anthropic;
  if (pinned === "gemini") return gemini;
  return anthropic.isScopeConfigured() ? anthropic : gemini;
}

/** Whether the route should attempt a live scope at all. */
export function isScopeConfigured(): boolean {
  return anthropic.isScopeConfigured() || gemini.isScopeConfigured();
}

export function generateScope(
  ...args: Parameters<typeof anthropic.generateScope>
) {
  return provider().generateScope(...args);
}
