import { SCOPE_SYSTEM_PROMPT, scopeUserPrompt } from "@/lib/scope/prompt";
import { ScopeRefusedError, ScopeUnavailableError } from "@/lib/scope/errors";
import {
  SCOPE_JSON_SCHEMA,
  isGeneratedScope,
  type GeneratedScope,
} from "@/lib/scope/schema";

/**
 * The free-tier model provider behind "Scope it live".
 *
 * Google AI Studio's free tier, called over plain REST — no SDK. The whole
 * surface we need is one POST, and `@google/genai` would be a dependency
 * carrying an auth layer, a streaming layer and a file API for a single
 * request/response. `fetch` keeps package.json where it is.
 *
 * Chosen over Groq/OpenRouter free tiers because it is the only free option
 * that keeps what lib/scope/claude.ts already relied on: a real
 * schema-constrained response (`responseSchema`, not "please reply in JSON"),
 * and a refusal signal distinguishable from an outage.
 *
 * Two things the free tier costs you, both deliberate trade-offs:
 *   1. Prompts on the free tier may be used to improve Google's products. The
 *      payload here is a visitor's description of their own bottleneck. That's
 *      low-sensitivity, but it is not nothing — see the note in
 *      .env.local.example before pointing production at this.
 *   2. Flash-class output is a step down from Opus 5 on register. The prompt's
 *      two worked examples carry most of the voice, and the hand-written
 *      scopes in lib/scope/static-scopes.ts remain the floor.
 *
 * Thinking is disabled (`thinkingBudget: 0`) for the same reason claude.ts ran
 * at `effort: "low"`: one bounded generation against a schema, with a visitor
 * watching a cursor blink.
 */

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-2.5-flash";
const MAX_TOKENS = 4000;

/** Finish reasons that mean "the model declined", not "the model broke". */
const REFUSAL_REASONS = new Set([
  "SAFETY",
  "PROHIBITED_CONTENT",
  "BLOCKLIST",
  "SPII",
  "IMAGE_SAFETY",
]);

function model(): string {
  return process.env.GEMINI_MODEL ?? DEFAULT_MODEL;
}

/** Whether the route should attempt a live scope at all. */
export function isScopeConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

/**
 * Translate the JSON Schema in lib/scope/schema.ts into Gemini's OpenAPI
 * subset, so there is still exactly one definition of the scope shape.
 *
 * Two incompatibilities, both handled here rather than by forking the schema:
 * `additionalProperties` is rejected outright by the API, and the type names
 * are an uppercase enum. `propertyOrdering` is added because Gemini generates
 * fields in the order it's given — and `issue` first, `stack` last matches how
 * the prompt's examples are laid out.
 */
type GeminiSchema = {
  type: string;
  description?: string;
  properties?: Record<string, GeminiSchema>;
  required?: readonly string[];
  propertyOrdering?: readonly string[];
  items?: GeminiSchema;
};

function toGeminiSchema(node: unknown): GeminiSchema {
  const n = node as {
    type: string;
    description?: string;
    properties?: Record<string, unknown>;
    required?: readonly string[];
    items?: unknown;
  };

  const out: GeminiSchema = { type: n.type.toUpperCase() };
  if (n.description) out.description = n.description;

  if (n.properties) {
    const keys = Object.keys(n.properties);
    out.properties = Object.fromEntries(
      keys.map((k) => [k, toGeminiSchema(n.properties![k])]),
    );
    out.propertyOrdering = keys;
  }
  if (n.required) out.required = n.required;
  if (n.items) out.items = toGeminiSchema(n.items);

  return out;
}

const RESPONSE_SCHEMA = toGeminiSchema(SCOPE_JSON_SCHEMA);

type GeminiResponse = {
  candidates?: {
    content?: { parts?: { text?: string }[] };
    finishReason?: string;
  }[];
  promptFeedback?: { blockReason?: string };
};

/**
 * Generate one scope. Same contract as the Anthropic provider it replaces:
 * resolves with the parsed object, throws ScopeRefusedError on a decline and
 * ScopeUnavailableError when there's no credential.
 *
 * Non-streaming, unlike claude.ts. The route never consumed model tokens as
 * they arrived — its status events come from a heartbeat ticker — so streaming
 * bought nothing here except a second parser to maintain.
 */
export async function generateScope(
  query: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<GeneratedScope> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new ScopeUnavailableError("GEMINI_API_KEY is not set");

  const response = await fetch(`${ENDPOINT}/${model()}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": key },
    signal,
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SCOPE_SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: scopeUserPrompt(query) }] }],
      generationConfig: {
        maxOutputTokens: MAX_TOKENS,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    // 429 is the free tier's daily/minute cap. It reaches the client as
    // "failed", and the panel falls back to a static scope — which is the
    // right outcome: a real architecture beats a quota error.
    throw new Error(`Gemini ${response.status}: ${detail.slice(0, 300)}`);
  }

  const body = (await response.json()) as GeminiResponse;

  if (body.promptFeedback?.blockReason) {
    throw new ScopeRefusedError(body.promptFeedback.blockReason);
  }

  const candidate = body.candidates?.[0];
  const finish = candidate?.finishReason;
  if (finish && REFUSAL_REASONS.has(finish)) {
    throw new ScopeRefusedError(finish);
  }

  const text = (candidate?.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("");

  if (!text) throw new Error(`Gemini returned no text (finish: ${finish})`);

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Model returned unparseable JSON");
  }

  if (!isGeneratedScope(parsed)) {
    throw new Error("Model response did not match the scope schema");
  }

  return parsed;
}
