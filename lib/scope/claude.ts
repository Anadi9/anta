import Anthropic from "@anthropic-ai/sdk";
import { ScopeRefusedError, ScopeUnavailableError } from "@/lib/scope/errors";
import {
  SCOPE_SYSTEM_PROMPT,
  buildUserPrompt,
  type ScopeAsk,
} from "@/lib/scope/prompt";
import {
  SCOPE_JSON_SCHEMA,
  isGeneratedScope,
  type GeneratedScope,
} from "@/lib/scope/schema";

/**
 * The Claude call behind "Scope it live".
 *
 * Model choice: Claude Opus 5 (`claude-opus-5`). This endpoint is the site's
 * single proof-of-work argument — a visitor's first read of whether ANTA can
 * architect — so it runs on the strongest model rather than the cheapest.
 *
 * Effort is `low`: the task is one bounded generation against a schema, not
 * agentic work, and this is a public widget where a visitor is watching a
 * cursor blink. Thinking is left at the Opus 5 default (on) rather than
 * disabled — with thinking disabled the model can leak `<thinking>` tags into
 * output, and lowering effort already buys back most of the latency.
 *
 * Structured outputs (`output_config.format`) rather than tool use: there is
 * exactly one shape to return and nothing to execute, so a schema-constrained
 * response is the smaller, more reliable mechanism. Streaming, because a
 * non-streaming call at this max_tokens risks the SDK's HTTP timeout — and the
 * stream is also what feeds the panel's live "analyzing" state.
 */

const MODEL = "claude-opus-5";
const MAX_TOKENS = 4000;

/*
  The error classes live in lib/scope/errors.ts so this provider and the free
  Gemini one throw the same objects — the route discriminates with `instanceof`.
*/
export { ScopeRefusedError, ScopeUnavailableError };

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new ScopeUnavailableError("ANTHROPIC_API_KEY is not set");
  }
  client ??= new Anthropic();
  return client;
}

/** Whether the route should attempt a live scope at all. */
export function isScopeConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/**
 * Generate one scope. Resolves with the parsed object; the `onProgress`
 * callback fires as text arrives so the caller can push real progress to the
 * client instead of a canned animation. The partial JSON is deliberately not
 * forwarded — the panel renders fields, not a half-written object.
 */
export async function generateScope(
  ask: ScopeAsk,
  { signal }: { signal?: AbortSignal } = {},
): Promise<GeneratedScope> {
  const stream = getClient().messages.stream(
    {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SCOPE_SYSTEM_PROMPT,
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema: SCOPE_JSON_SCHEMA },
      },
      messages: [{ role: "user", content: buildUserPrompt(ask) }],
    },
    { signal },
  );

  const message = await stream.finalMessage();

  if (message.stop_reason === "refusal") {
    throw new ScopeRefusedError(message.stop_details?.category ?? null);
  }

  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

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
