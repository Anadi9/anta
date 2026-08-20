# Supabase

A **fresh Supabase project**, provisioned for the rebuilt site — not the one
behind the old `github.com/Anadi9/anta` deployment. That reverses what
`ARCHITECTURE.md` §7 originally decided; the reasoning for the reversal is
recorded there.

The short version: the rebuild's only server-side write is
`scope_submissions`. Its contact section is a `mailto:` link, not a form, so
the old project's `contact_submissions` / `project_submissions` have no
reader and no writer in this codebase. Carrying an entire project forward to
inherit two tables nothing touches buys nothing.

## What's here

| File | Status |
| --- | --- |
| `migrations/0001_scope_submissions.sql` | The whole schema. Apply to the new project before `/api/scope` serves traffic. |
| `legacy/old-project-schema.sql` | **Do not run.** The old project's two tables, for reference only — see below. |

## Setting up the project

1. Create a new project at [supabase.com/dashboard](https://supabase.com/dashboard).
   Pick a region close to your Vercel deployment region — every
   `/api/scope` call makes one insert, and cross-continent adds latency to
   a request a visitor is already watching.
2. SQL Editor → paste `migrations/0001_scope_submissions.sql` → Run.
3. Project Settings → API → copy **Project URL** and the **`service_role`**
   key into `.env.local` as `SUPABASE_URL` and
   `SUPABASE_SERVICE_ROLE_KEY`. Not the `anon` key: the table has RLS
   enabled with no policies, so an anon key produces inserts that fail
   rather than error loudly, and leads disappear silently.
4. Set the same two in Vercel project settings, for **Production**, not
   just Preview.

No Supabase CLI is wired up. One table doesn't justify one — paste and run.

## The old project

It still exists, still holds the historical form submissions, and is still
readable from its own dashboard. Nothing here deletes it. If you want that
data, export it from there; `legacy/old-project-schema.sql` documents its
shape. Don't apply that file to the new project — it would create two tables
with no reader.

## Access pattern

Server-side only, via the service role key, from route handlers under
`app/api/**` — never from a component. `lib/leads/scope-submissions.ts`
imports `server-only`, which turns a client-side import into a build error
rather than a leaked key. Queries belong in typed helpers under `lib/leads/`
(`ARCHITECTURE.md` §2).

`scope_submissions` has RLS enabled with no policies: the service role
bypasses RLS, so the app is unaffected, but a leaked anon key can't read the
lead log.
