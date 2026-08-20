/**
 * Errors shared by every "Scope it live" model provider.
 *
 * Lifted out of lib/scope/claude.ts when the Gemini provider landed: the route
 * discriminates on these classes, so they have to be identical objects across
 * providers, not two look-alike definitions that fail `instanceof`.
 */

/** Fail fast and loudly rather than constructing a client with no credential. */
export class ScopeUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScopeUnavailableError";
  }
}

/** A model-side decline, distinct from an outage. */
export class ScopeRefusedError extends Error {
  constructor(readonly category: string | null) {
    super("The model declined to scope this request.");
    this.name = "ScopeRefusedError";
  }
}
