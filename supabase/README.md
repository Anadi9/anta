# Supabase

There is **one** Supabase project, already provisioned for the live site at
`theanta.com`. Don't create a second one — see `ARCHITECTURE.md` §7.

## What's here

| File | Status |
| --- | --- |
| `migrations/0001_contact_and_project_submissions.sql` | **Already applied** in the live project. Ported forward from `github.com/Anadi9/anta/supabase-migration.sql` as the schema of record. |
| `migrations/0002_scope_submissions.sql` | **Not applied yet.** Apply during BUILD_PLAN Phase 6, when `/api/scope` is built. |

## Applying a migration

No Supabase CLI is wired up — three tables doesn't justify one. Paste the
file into the SQL Editor in the Supabase dashboard and run it.

Both files are idempotent (`CREATE TABLE IF NOT EXISTS`,
`DROP TRIGGER IF EXISTS` before `CREATE TRIGGER`), so re-running one against
the live project is a no-op rather than an error. The upstream original was
not — it used bare `CREATE TRIGGER`, which fails on a second run.

## Access pattern

Server-side only, via the service role key (`SUPABASE_SERVICE_ROLE_KEY`),
from route handlers under `app/api/**` — never from a component. Queries
belong in typed helpers under `lib/leads/` (`ARCHITECTURE.md` §2).

`scope_submissions` has RLS enabled with no policies: the service role
bypasses RLS, so the app is unaffected, but a leaked anon key can't read the
lead log. The two older tables are left exactly as they are in production —
review their RLS settings in the dashboard separately rather than changing
live behavior as a side effect of this rebuild.
