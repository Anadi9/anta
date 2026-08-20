import { sendScopeEmail, isEmailConfigured } from "@/lib/email/send-scope";
import { logScopeSubmission } from "@/lib/leads/scope-submissions";
import type { ScopeAsk } from "@/lib/scope/prompt";
import {
  ScopeRefusedError,
  ScopeUnavailableError,
  generateScope,
  isScopeConfigured,
} from "@/lib/scope/provider";
import {
  checkRateLimit,
  clientIp,
  hashIp,
  isRateLimitConfigured,
} from "@/lib/scope/ratelimit";

/**
 * POST /api/scope — the HTTP boundary for "Scope it live".
 *
 * Thin by design (ARCHITECTURE.md §2): parse, rate-limit, delegate, log. Every
 * decision that isn't about HTTP lives under lib/ — the Claude call in
 * lib/scope/, the lead write in lib/leads/, the mail in lib/email/.
 *
 * The response is a newline-delimited JSON stream rather than a single body:
 * the panel's "analyzing" state is real progress, not an animation, and a
 * generation that takes a few seconds shows something the whole time. Events:
 *
 *   {"type":"status","step":n}    — progress, n indexes THINKING_LINES
 *   {"type":"result","scope":{…}} — the finished scope
 *   {"type":"error","code":"…"}   — terminal; the client falls back to static
 *
 * Errors are streamed as events rather than returned as HTTP status codes once
 * the stream is open — the status line is already sent by then. Pre-stream
 * failures (rate limit, bad input) do use real status codes.
 */

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_QUERY = 600;
/** A correction is a sentence, not a second brief — anything longer is abuse. */
const MAX_INSTRUCTION = 240;
/** Enough for a real stack, short enough that the list can't become a payload. */
const MAX_TOOLS = 8;
const MAX_TOOL_LEN = 32;
const MAX_SIZE_LEN = 16;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type ScopeRequest = {
  query?: unknown;
  email?: unknown;
  context?: unknown;
  refine?: unknown;
};

/**
 * Everything below arrives from a public, unauthenticated form and is
 * interpolated into a model prompt, so each field is length-capped and
 * type-checked here rather than trusted. Anything malformed is dropped, not
 * rejected: a visitor with a broken client should still get a scope.
 */
function parseContext(raw: unknown): ScopeAsk["context"] {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as { size?: unknown; tools?: unknown };

  const size =
    typeof r.size === "string" && r.size.trim().length <= MAX_SIZE_LEN
      ? r.size.trim() || undefined
      : undefined;

  const tools = Array.isArray(r.tools)
    ? r.tools
        .filter(
          (t): t is string =>
            typeof t === "string" && t.trim().length > 0 && t.length <= MAX_TOOL_LEN,
        )
        .map((t) => t.trim())
        .slice(0, MAX_TOOLS)
    : undefined;

  if (!size && !tools?.length) return undefined;
  return { size, tools: tools?.length ? tools : undefined };
}

function parseRefine(raw: unknown): ScopeAsk["refine"] {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as { previous?: unknown; instruction?: unknown };

  const instruction =
    typeof r.instruction === "string" ? r.instruction.trim().slice(0, MAX_INSTRUCTION) : "";
  if (!instruction) return undefined;

  const prev = r.previous as
    | { name?: unknown; verdict?: unknown; stack?: unknown }
    | undefined;
  if (!prev || typeof prev !== "object") return undefined;
  if (typeof prev.name !== "string" || typeof prev.verdict !== "string") {
    return undefined;
  }

  return {
    previous: {
      name: prev.name.slice(0, 80),
      verdict: prev.verdict.slice(0, 400),
      stack: Array.isArray(prev.stack)
        ? prev.stack
            .filter((t): t is string => typeof t === "string")
            .slice(0, 8)
            .map((t) => t.slice(0, MAX_TOOL_LEN))
        : [],
    },
    instruction,
  };
}

function event(payload: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(`${JSON.stringify(payload)}\n`);
}

function json(body: Record<string, unknown>, status: number, headers?: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

export async function POST(request: Request) {
  let payload: ScopeRequest;
  try {
    payload = (await request.json()) as ScopeRequest;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const query = typeof payload.query === "string" ? payload.query.trim() : "";
  if (!query) return json({ error: "empty_query" }, 400);
  if (query.length > MAX_QUERY) return json({ error: "query_too_long" }, 413);

  const email =
    typeof payload.email === "string" && EMAIL_RE.test(payload.email.trim())
      ? payload.email.trim()
      : null;

  const ask: ScopeAsk = {
    query,
    context: parseContext(payload.context),
    refine: parseRefine(payload.refine),
  };

  if (!isScopeConfigured()) {
    // No API key: the client keeps its hardcoded scopes, which still work.
    return json({ error: "unconfigured" }, 503);
  }

  /*
    Refuse to run uncapped in production. A public endpoint calling a paid API
    with no rate limiter is an unbounded bill, so a missing Upstash config is
    a deployment error, not a degraded mode — locally it just runs uncapped.
  */
  if (process.env.NODE_ENV === "production" && !isRateLimitConfigured()) {
    return json({ error: "unconfigured" }, 503);
  }

  const ipHash = hashIp(clientIp(request.headers));
  const { allowed, retryAfter } = await checkRateLimit(ipHash);
  if (!allowed) {
    return json({ error: "rate_limited", retryAfter }, 429, {
      "retry-after": String(retryAfter),
    });
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // Heartbeat: advance the panel's status lines while the model works.
      let step = 0;
      const ticker = setInterval(() => {
        step += 1;
        controller.enqueue(event({ type: "status", step }));
      }, 900);

      try {
        controller.enqueue(event({ type: "status", step: 0 }));

        const scope = await generateScope(ask, { signal: request.signal });
        clearInterval(ticker);
        controller.enqueue(event({ type: "result", scope }));

        /*
          Logging and mail happen after the visitor has their answer, and
          neither can fail the request. Errors are surfaced in the server log
          (and, once Sentry lands in Phase 7, as captured exceptions) because a
          silent failure here is a silently lost lead.
        */
        const logged = await logScopeSubmission({
          query,
          response: scope,
          email,
          ipHash,
        });
        if (!logged.logged) {
          console.error("[scope] lead not logged:", logged.error);
        }

        if (email && isEmailConfigured()) {
          const sent = await sendScopeEmail(email, query, scope);
          controller.enqueue(event({ type: "emailed", ok: sent.sent }));
          if (!sent.sent) console.error("[scope] email failed:", sent.error);
        }
      } catch (error) {
        clearInterval(ticker);
        const code =
          error instanceof ScopeRefusedError
            ? "refused"
            : error instanceof ScopeUnavailableError
              ? "unconfigured"
              : "failed";
        if (code === "failed") console.error("[scope] generation failed:", error);
        controller.enqueue(event({ type: "error", code }));
      } finally {
        clearInterval(ticker);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store",
      // Defeats proxy buffering, which would hold the status events back.
      "x-accel-buffering": "no",
    },
  });
}
