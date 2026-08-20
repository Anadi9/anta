import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { GeneratedScope } from "@/lib/scope/schema";

/**
 * Lead log for "Scope it live" — one row per completed scope, whether or not
 * the visitor ever writes an email. That's the whole point of the table: the
 * tool generates pipeline visibility without a contact form
 * (ARCHITECTURE.md §3 step 6, §4; schema in
 * supabase/migrations/0002_scope_submissions.sql).
 *
 * Service-role key, server-side only. It bypasses row-level security by
 * design, which is why this module must never be imported from a client
 * component — the `server-only` import makes that a build error rather than a
 * leaked key.
 */

import "server-only";

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  client ??= createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );
  return client;
}

export type ScopeSubmission = {
  query: string;
  response: GeneratedScope;
  /** Present only if the visitor asked for the scope by email. */
  email?: string | null;
  ipHash: string;
};

/**
 * Write one submission. Never throws: a logging failure must not cost the
 * visitor the scope they already waited for. Failures are reported to the
 * caller so the route can surface them to Sentry rather than swallowing them
 * silently — a silent failure here is a silently lost lead.
 */
export async function logScopeSubmission(
  submission: ScopeSubmission,
): Promise<{ logged: boolean; error?: string }> {
  const supabase = getClient();
  if (!supabase) return { logged: false, error: "Supabase is not configured" };

  const { error } = await supabase.from("scope_submissions").insert({
    query: submission.query,
    response: submission.response,
    email: submission.email ?? null,
    ip_hash: submission.ipHash,
  });

  return error ? { logged: false, error: error.message } : { logged: true };
}
