-- New table for the "Scope it live" tool — see ARCHITECTURE.md §4 and the
-- data flow in §3, step 6. Every completed scope is logged here whether or
-- not the visitor ever fills out a contact form: this table IS the pipeline
-- visibility for a public, unauthenticated tool.
--
-- Not yet applied to the live Supabase project — apply during BUILD_PLAN
-- Phase 6, when /api/scope is actually built.

CREATE TABLE IF NOT EXISTS scope_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- What the visitor typed / which pain-point chip they picked.
  query TEXT NOT NULL,
  -- The structured Claude response:
  -- { issue, recommendedFix, alternativeApproach, timeline, budgetFraming }
  -- Stored as jsonb so the shape can evolve without a migration, and so
  -- individual fields stay queryable.
  response JSONB NOT NULL,
  -- Optional email, only present if the visitor asked us to send them the
  -- scope. Absent for most rows — the row is still a lead without it.
  email TEXT,
  -- Hashed IP, never the raw address: enough to review abuse patterns and
  -- correlate with rate-limit hits, not enough to be PII we have to manage.
  ip_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scope_submissions_created_at
  ON scope_submissions(created_at DESC);
-- Abuse review: "which hashes are generating the most scopes."
CREATE INDEX IF NOT EXISTS idx_scope_submissions_ip_hash
  ON scope_submissions(ip_hash);

-- Writes come only from app/api/scope/route.ts using the service role key,
-- which bypasses RLS. Enabling RLS with no policies therefore changes
-- nothing for the app while ensuring a leaked anon key can't read the lead
-- log. Add an explicit policy here if a client ever needs direct access.
ALTER TABLE scope_submissions ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE scope_submissions IS 'Lead log for the public "Scope it live" tool — one row per completed scope generation';
COMMENT ON COLUMN scope_submissions.query IS 'Visitor-supplied problem description or selected pain-point chip';
COMMENT ON COLUMN scope_submissions.response IS 'Structured Claude output: issue, recommendedFix, alternativeApproach, timeline, budgetFraming';
COMMENT ON COLUMN scope_submissions.email IS 'Optional — only set when the visitor asked to have the scope emailed';
COMMENT ON COLUMN scope_submissions.ip_hash IS 'Hashed client IP for rate-limit/abuse review — never the raw IP';
COMMENT ON COLUMN scope_submissions.created_at IS 'Timestamp when the scope was generated';
