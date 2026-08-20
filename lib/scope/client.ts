import type { ScopeResult } from "@/lib/scope/static-scopes";

/**
 * Browser-side transport for POST /api/scope.
 *
 * The route answers with newline-delimited JSON (see app/api/scope/route.ts),
 * so this reads the body incrementally and hands each event to the panel:
 * status ticks advance the terminal feed, the result ends it. Kept out of the
 * component so ScopeSection stays about rendering — ARCHITECTURE.md §2.
 *
 * Every failure path resolves rather than throws. The panel always has the
 * hand-written scope in lib/scope/static-scopes.ts to fall back to, and a
 * visitor seeing a real architecture from the static set is a far better
 * outcome than an error state.
 */

export type ScopeStreamEvent =
  | { type: "status"; step: number }
  | { type: "result"; scope: ScopeResult }
  | { type: "emailed"; ok: boolean }
  | { type: "error"; code: string };

export type ScopeOutcome =
  | { ok: true; scope: ScopeResult }
  | { ok: false; reason: "unconfigured" | "rate_limited" | "refused" | "failed" };

export type ScopeSend = {
  /** Optional context from the panel's chips, folded into the prompt server-side. */
  context?: { size?: string; tools?: string[] };
  /** Set on a follow-up: the scope on screen plus what the visitor corrected. */
  refine?: {
    previous: { name: string; verdict: string; stack: string[] };
    instruction: string;
  };
};

export async function streamScope(
  query: string,
  {
    signal,
    onStatus,
    context,
    refine,
  }: {
    signal?: AbortSignal;
    onStatus?: (step: number) => void;
  } & ScopeSend = {},
): Promise<ScopeOutcome> {
  let response: Response;
  try {
    response = await fetch("/api/scope", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query, context, refine }),
      signal,
    });
  } catch {
    return { ok: false, reason: "failed" };
  }

  if (!response.ok || !response.body) {
    if (response.status === 429) return { ok: false, reason: "rate_limited" };
    if (response.status === 503) return { ok: false, reason: "unconfigured" };
    return { ok: false, reason: "failed" };
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  let outcome: ScopeOutcome = { ok: false, reason: "failed" };

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += value;

      // Everything before the last newline is a complete event; the tail may
      // be a partial line, so it stays in the buffer for the next chunk.
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.trim()) continue;
        let evt: ScopeStreamEvent;
        try {
          evt = JSON.parse(line) as ScopeStreamEvent;
        } catch {
          continue;
        }

        if (evt.type === "status") onStatus?.(evt.step);
        else if (evt.type === "result") outcome = { ok: true, scope: evt.scope };
        else if (evt.type === "error") {
          outcome = {
            ok: false,
            reason:
              evt.code === "unconfigured" || evt.code === "refused"
                ? evt.code
                : "failed",
          };
        }
      }
    }
  } catch {
    // Aborted or the connection dropped — fall through to whatever we have.
  } finally {
    reader.releaseLock();
  }

  return outcome;
}
