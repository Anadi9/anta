# ANTA website — system design

One principle governs every decision below: this is a solo-operator marketing
site with one genuinely hard feature (an AI-powered scoping tool), not a
product with users and accounts. Anything that adds operational surface
area — a separate backend service, a container orchestrator, a microservice
split, an ORM layer for two tables — is over-engineering at this stage and
is deliberately excluded. Revisit this document when ANTA has its first paid
delivery team, not before.

## 1. High-level architecture

```
                            ┌─────────────────────────┐
                            │        Browser           │
                            │  (visitor or AI crawler) │
                            └────────────┬─────────────┘
                                         │ HTTPS
                                         ▼
                            ┌─────────────────────────┐
                            │   Vercel Edge Network     │
                            │  (theanta.com, CDN, TLS) │
                            └────────────┬─────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    ▼                    ▼                    ▼
          ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
          │  Static / SSG     │ │  Server Component │ │  Route Handlers   │
          │  pages (/, /work, │ │  render (RSC)      │ │  (/api/scope,     │
          │  /build, /about)  │ │                    │ │   /api/contact)   │
          └──────────────────┘ └──────────────────┘ └────────┬─────────┘
                                                               │
                    ┌──────────────────────────────────────────┤
                    ▼                    ▼                    ▼
          ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
          │  Anthropic API    │ │  Upstash Redis    │ │  Supabase         │
          │  (Claude — scope  │ │  (rate limiting   │ │  (Postgres — lead │
          │  generation)      │ │  on public AI      │ │  + scope logging) │
          │                  │ │  endpoint)         │ │                  │
          └──────────────────┘ └──────────────────┘ └────────┬─────────┘
                                                               │
                                                               ▼
                                                     ┌──────────────────┐
                                                     │  Resend            │
                                                     │  (notify Anadi on  │
                                                     │  new lead)         │
                                                     └──────────────────┘

          Cross-cutting: Vercel Analytics + GA4 (traffic) · Sentry (errors)
          · PostHog (optional — Scope-it-live funnel detail)
```

Everything runs inside one Next.js app deployed to Vercel. There is no
separate backend to deploy, version, or keep in sync — route handlers under
`app/api/**` *are* the backend. This is the right call at one operator and
zero ops headcount: one deploy target, one set of env vars, one place
errors can occur.

## 2. Layers (clean architecture, Next.js-shaped)

Strict backend "ports and adapters" layering is overkill for a marketing
site, but the underlying discipline — **don't let framework/vendor code leak
into business logic** — still matters, especially for the scoping tool
where the "business logic" (how a scope gets generated, rate-limited, and
logged) is worth protecting from a future provider swap.

```
app/                     — routing + composition only. A page.tsx should
                            mostly import and arrange components; it
                            shouldn't contain business logic.
  api/scope/route.ts      — HTTP boundary for the scoping tool. Parses the
                            request, calls lib/scope/*, streams the result.
                            Contains no prompt text and no rate-limit logic
                            itself — delegates to lib/.

components/               — presentation. Pure UI, takes props, no direct
                            fetch()/Supabase/Anthropic calls.
  hero-background/        — the animated background system (see its own
                            README.md)
  home/, work/, build/,   — page-specific sections, one component per
  about/                    section, not one giant page file

lib/                       — business logic + integrations, framework-
                            agnostic where possible.
  seo/                     — site.ts (identity constants), jsonld.ts
                            (structured data builders)
  scope/                   — prompt template, provider selection + the two
                            model calls, response schema, rate-limit check
  leads/                   — Supabase client + typed insert helper for
                            scope_submissions
  email/                   — Resend client + templates

public/                    — static assets, design-reference/ previews,
                            llms.txt
```

The rule of thumb: if you're tempted to `import { createClient } from
"@supabase/supabase-js"` inside a `components/*.tsx` file, stop — put the
query in `lib/leads/` and call a typed function from the component instead.
That's the entire "clean architecture" lesson worth keeping here; anything
more layered (repositories, use-case classes, DI containers) is solving a
problem this codebase doesn't have.

## 3. Data flow — the two flows that matter

**Page render (every marketing page):** Next.js renders these as static or
server-rendered React (no client-side data fetching for content) so both
search crawlers and non-JS AI crawlers see full content on first response —
this is the single biggest lever for both classic SEO and GEO/AEO
crawlability. Interactive pieces (animated backgrounds, hover states) are
isolated `"use client"` leaf components (see `components/home/HeroSection.tsx`
for the pattern) so the page shell itself stays a server component and can
export real per-page `metadata`.

**"Scope it live" request:**

```
1. Visitor submits a problem description (chip or free text)
2. POST /api/scope
3. Route handler checks Upstash Redis rate limit by IP
   → over limit: return 429, UI shows a friendly "try again" state
4. Route handler calls the configured model provider
   (lib/scope/provider.ts) with a structured-output schema:
   { issue, name, verdict, steps[3], stack[] } — the panel's render
   shape, see lib/scope/schema.ts for why it isn't the sketch this
   document originally carried
   → provider declines: ScopeRefusedError; nothing configured:
     ScopeUnavailableError. Both end as an error event, and the client
     falls back to a hand-written scope rather than an error state
5. Route streams NDJSON it writes itself back to the client for the
   progressive "analyzing..." UI. Status events come from a server-side
   heartbeat, not from model tokens — which is why there is no
   Vercel AI SDK here and no token streaming from the provider
6. On completion, the route handler writes the submission (query +
   response + timestamp, no auth required) to Supabase
   `scope_submissions` — this is the lead, whether or not the visitor
   gives contact info
7. Optional: if the visitor provides an email to "send me this scope",
   fire a Resend email with the result attached
```

Steps 3 and 6 are what make this safe to run unauthenticated and public:
rate limiting bounds the cost of abuse, and logging every submission means
the tool generates pipeline visibility even when nobody fills out a
contact form.

## 4. Data model (Supabase / Postgres)

A fresh Supabase project with **one table**, because the site makes exactly
one server-side write:

- `scope_submissions` — id, query (text), response (jsonb — the
  `{ issue, name, verdict, steps[], stack[] }` object the panel renders and
  `lib/scope/schema.ts` defines), email (optional), ip_hash (for
  rate-limit/abuse review, not raw IP), created_at. This is the
  Scope-it-live lead log described above.

The old project's `contact_submissions` and `project_submissions` are **not**
carried forward. Nothing in this codebase reads or writes them: the contact
section is a `mailto:` link, not a form, and `/api/scope` is the only route
handler. Their schema is kept unapplied in `supabase/legacy/` as a record of
where the historical submissions still live. See §7 for why the project
itself is new.

No ORM. One table doesn't justify one — use the Supabase JS client with
hand-written, typed query functions in `lib/leads/`.

## 5. External integrations

| Integration | Purpose | Notes |
| --- | --- | --- |
| Vercel | Hosting, edge network, preview deploys | Already connected to this repo and `theanta.com` — no migration needed |
| Supabase | Postgres for the scope lead log | Fresh project (§7), one table, applied from `supabase/migrations/` |
| Anthropic API | Claude — powers Scope-it-live | Phase 6; needs its own rate limiting, see §3 |
| Upstash Redis | Rate limiting for `/api/scope` | Serverless-friendly, generous free tier |
| Resend | Transactional email (lead notifications, optional scope-to-email) | Replaces `nodemailer` from the old repo — HTTP API fits Vercel's serverless functions better than SMTP connection pooling |
| Cal.com | Booking embed (`cal.com/anta/intro`) | No integration work — iframe/embed only |
| GA4 | Traffic analytics | Existing property (`G-BF6M3EFFKH`) — port forward, don't recreate |
| Vercel Analytics + Speed Insights | Core Web Vitals, zero-config with Vercel hosting | New — the animation-heavy design makes this worth having |
| Sentry | Error tracking | New — a silent error in `/api/scope` is a silently lost lead |
| PostHog (optional) | Funnel analysis specifically for Scope-it-live conversion | Add only if GA4 funnel data proves insufficient — don't install day one |

## 6. Environments

- **Local** — `npm run dev`, `.env.local` (gitignored) for all secrets
- **Preview** — every PR/branch gets a Vercel preview deploy automatically;
  point preview-only Supabase/Upstash keys here if you want to keep
  preview traffic out of production data
- **Production** — `main` branch → `theanta.com`, via Vercel's existing
  git integration (no CI system to build/maintain separately)

Secrets (`ANTHROPIC_API_KEY` **or** `GEMINI_API_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `UPSTASH_REDIS_REST_URL/TOKEN`,
`RESEND_API_KEY`, optionally `IP_HASH_SALT`) live only in Vercel
project settings — never in the repo, never in `NEXT_PUBLIC_*` vars unless
a value is genuinely safe to expose to the browser.

## 7. Decisions worth recording (ADR-lite)

- **Two model providers behind one contract, selected by which API key
  is set** — the paid path (`claude-opus-5`) is the better answer on
  register: this endpoint is the site's proof that ANTA can architect, and
  a visitor reads the output as a work sample. The free path
  (`gemini-2.5-flash`, Google AI Studio) exists because pre-revenue a
  public unauthenticated endpoint calling a paid API is a bill with no
  ceiling, and the Upstash limiter caps abuse, not cost. Selection is by
  credential rather than a mode flag so switching is one Vercel env var
  with no deploy. Two trade-offs accepted on the free path, both recorded
  in `.env.local.example`: free-tier prompts may be used to improve
  Google's products, and flash-class output is looser on voice. The
  hand-written scopes in `lib/scope/static-scopes.ts` remain the floor
  under both.
- **Plain `fetch` over `@google/genai` for the free provider** — the whole
  surface needed is one POST. The SDK would add an auth layer, a streaming
  layer and a files API to carry it. The cost is a hand-written schema
  translation (`toGeminiSchema`) from the one JSON Schema in
  `lib/scope/schema.ts`, since Gemini rejects `additionalProperties` and
  uppercases its type names — a translation, deliberately, rather than a
  second copy of the schema that could drift.
- **Next.js App Router over a separate API service** — one operator, one
  deploy target beats a clean split that has to be run, versioned, and
  paid for separately.
- **Supabase over a custom Postgres + ORM setup** — usable JS client, no
  infra to manage, and the free tier covers a lead log comfortably.
- **A fresh Supabase project, reversing the original "port the old one
  forward" decision** — the earlier call assumed the rebuild inherited the
  old site's form tables. It doesn't. The rebuilt site's only server-side
  write is `scope_submissions`; its contact section is a `mailto:` link and
  `/api/scope` is its only route handler, so `contact_submissions` and
  `project_submissions` would arrive with no reader and no writer. A clean
  project means the schema of record is one file that has actually been
  applied, rather than a transcription of the old repo's migration that was
  never verified against the live database. The cost, accepted: historical
  form submissions stay in the old project. They are not deleted and remain
  exportable from its dashboard — see `supabase/README.md`. This does *not*
  extend to the domain, Vercel project, or GA4 property, which are still
  ported forward exactly as below.
- **No shadcn/Radix component library** — the design is fully custom
  (Dark Terminal system), not composed from a component kit. Pulling in
  the full Radix suite the old repo had (20+ packages) would be dead
  weight; add individual headless primitives only when a specific
  interaction (e.g. a dialog) genuinely needs one.
- **GSAP (free plugins only) + Framer Motion, not a 3D library** — the
  hero-background system achieves its effects with SVG, Canvas 2D, and CSS
  3D transforms specifically to avoid the bundle cost and complexity of
  Three.js. Don't introduce it later without a concrete reason.
- **Resend over nodemailer** — nodemailer's SMTP connections don't fit
  serverless functions well (cold starts, connection limits); Resend's
  HTTP API does.
- **npm, not bun** — the old repo had both `bun.lockb` and
  `package-lock.json` committed, which is a real hazard (two lockfiles can
  drift and produce different installs). Standardizing on npm matches
  Vercel's default and this scaffold; delete `bun.lockb` when merging.
