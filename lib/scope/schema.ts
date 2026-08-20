import type { ScopeResult } from "@/lib/scope/static-scopes";

/**
 * The structured-output contract for /api/scope.
 *
 * Shape note vs ARCHITECTURE.md §3 step 4: that document sketches the response
 * as `{ issue, recommendedFix, alternativeApproach, timeline, budgetFraming }`.
 * The approved panel (components/home/ScopeSection.tsx) renders a system name,
 * a verdict, three dated steps and a stack — so the model is asked for exactly
 * that, plus `issue`. Generating fields nothing renders would only add latency
 * and tokens to a public, unauthenticated endpoint; timeline and budget framing
 * are already carried by the steps and by the panel's "estimate, not a quote"
 * line. `issue` is not rendered but is generated: it's the one-line restatement
 * of the visitor's bottleneck, and it's what makes a row in
 * `scope_submissions` readable as a lead without re-reading the raw query.
 *
 * `ScopeResult` (the render shape) stays the source of truth — `GeneratedScope`
 * extends it rather than redefining it, so a change to the panel's data shape
 * breaks this file at compile time instead of silently at runtime.
 */

export type GeneratedScope = ScopeResult & {
  /** One line: the real bottleneck, restated. Logged, not rendered. */
  issue: string;
};

/**
 * JSON Schema handed to the Anthropic structured-outputs API
 * (`output_config.format`). Constraints the API doesn't support — `minLength`,
 * `maxLength`, `minItems`, `maxItems` — are deliberately absent; length limits
 * are enforced in the prompt and re-checked by `isGeneratedScope` below.
 */
export const SCOPE_JSON_SCHEMA = {
  type: "object",
  properties: {
    issue: {
      type: "string",
      description:
        "One sentence naming the real bottleneck behind what the visitor described.",
    },
    name: {
      type: "string",
      description:
        "The proposed system's name, 2–4 words, title case. Names the system, not the problem — e.g. 'Lead Intelligence Agent'.",
    },
    verdict: {
      type: "string",
      description:
        "Two sentences on what the system does and what changes once it runs. Direct, technical, no hype, no adjectives standing in for specifics.",
    },
    steps: {
      type: "array",
      description:
        "Exactly three build phases spanning roughly two weeks, in order.",
      items: {
        type: "object",
        properties: {
          day: {
            type: "string",
            description: "Day range, e.g. 'D1–2', 'D3–9', 'D10–14'.",
          },
          text: {
            type: "string",
            description:
              "What ships in that window. One clause, under 70 characters, no trailing period.",
          },
        },
        required: ["day", "text"],
        additionalProperties: false,
      },
    },
    stack: {
      type: "array",
      description:
        "Four to six concrete technologies, each 1–2 words. Real product names only.",
      items: { type: "string" },
    },
  },
  required: ["issue", "name", "verdict", "steps", "stack"],
  additionalProperties: false,
} as const;

/**
 * Runtime guard. Structured outputs make the shape reliable, not guaranteed —
 * a refusal or a truncated stream can still land here — and the panel would
 * throw on a missing `steps` array. Cheap to check, so check.
 */
export function isGeneratedScope(value: unknown): value is GeneratedScope {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;

  const strings = ["issue", "name", "verdict"] as const;
  if (!strings.every((k) => typeof v[k] === "string" && v[k] !== "")) {
    return false;
  }

  if (!Array.isArray(v.steps) || v.steps.length === 0) return false;
  const stepsOk = v.steps.every(
    (s) =>
      s &&
      typeof s === "object" &&
      typeof (s as { day?: unknown }).day === "string" &&
      typeof (s as { text?: unknown }).text === "string",
  );
  if (!stepsOk) return false;

  return (
    Array.isArray(v.stack) &&
    v.stack.length > 0 &&
    v.stack.every((s) => typeof s === "string")
  );
}
