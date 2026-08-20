# Build plan — theanta.com

Read `ARCHITECTURE.md` first if you haven't — it explains why the stack is
shaped the way it is. This document is the execution order.

Status: `github.com/Anadi9/anta` already exists and is live at `theanta.com`
via Vercel (Next.js 14, generic "AI Product Studio for MVPs" positioning,
Supabase-backed contact forms). This is a **from-scratch rebuild**, not an
incremental patch: the design and copy in `design-reference/` replace the
live site's content entirely, but the live repo's infrastructure (domain,
Vercel project, Supabase schema, GA4 property) gets ported forward, not
recreated. Phase 0 below covers exactly what to keep and what to drop.

Everything else is already scaffolded in this repo: Next.js 16 + Tailwind +
GSAP + Framer Motion installed, `hero-background` wired into the homepage
hero, fonts and color tokens loaded, SEO/GEO/AEO foundation in place
(`robots.ts`, `sitemap.ts`, `manifest.ts`, `llms.txt`, JSON-LD helpers,
per-page metadata stubs), and the approved design/copy sitting in
`design-reference/`. What's left is turning each `.dc.html` reference into a
real page, then porting the old repo's working infrastructure into this one.
Work through the phases in order — each one should compile and look right
before you start the next.

## Setup (do this once)

```bash
cd website        # or wherever this folder ends up
npm install
npm run dev
```

Open `http://localhost:3000` — you should see the homepage hero with an
animated blob background and "You already know what to build." If that
doesn't render, fix it before doing anything else; everything downstream
assumes the hero-background system works.

Open the `.dc.html` files directly in a browser tab alongside `localhost:3000`
as you build — they're self-contained, no server needed. That's your visual
source of truth, not this document.

---

## Phase 0 — Reconcile with the live repo

Do this before writing new page content, so you're not building on top of a
codebase that's about to be partly discarded.

**Prompt:**

> This repo is a from-scratch rebuild of the site currently live at
> `github.com/Anadi9/anta`. Do the following:
>
> 1. Supabase — **done, and it landed differently than this step assumed.**
>    The old project is not ported forward; the rebuild uses a fresh
>    project with one table, `scope_submissions`
>    (`supabase/migrations/0001_scope_submissions.sql`). The old site's two
>    form tables have no reader here — `/api/scope` is the only route
>    handler and the contact section is a `mailto:` link — so they sit
>    unapplied in `supabase/legacy/` as a record of where the historical
>    submissions still live. Setup steps in `supabase/README.md`, reasoning
>    in `ARCHITECTURE.md` §7. This exception applies to Supabase only: the
>    domain, Vercel project, and GA4 property are still ported forward per
>    the steps below.
> 2. Port the real GA4 measurement ID `G-BF6M3EFFKH` into this repo via
>    `@next/third-parties`'s `<GoogleAnalytics>` in `app/layout.tsx` — don't
>    create a new GA property.
> 3. Do **not** port over `/services/web-development` or
>    `/services/custom-websites` — those pages target generic "custom
>    website development" positioning that conflicts with ANTA's actual
>    positioning and are being dropped. If they're indexed, add redirects
>    for both to `/` in `next.config.ts` so any existing backlinks/search
>    equity don't just 404.
> 4. Delete `bun.lockb` if it exists here — this project uses npm only, and
>    two lockfiles is how installs silently drift.
> 5. Confirm `.env.local.example` lists every secret referenced in
>    `ARCHITECTURE.md` §6 (`ANTHROPIC_API_KEY` or `GEMINI_API_KEY`,
>    `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`,
>    `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`,
>    `RESEND_API_KEY`) even before each is wired up, so nothing gets
>    hardcoded later out of convenience.

Once this is done, the old repo's `main` branch can eventually be replaced
by this one (same repo, same Vercel project, same domain) — don't stand up
a second Vercel project.

---

## Phase 0.5 — SEO/GEO/AEO foundation (already done, verify it)

Already implemented in this scaffold — confirm it still holds as you build:

- `app/robots.ts` — explicit allow rules for AI retrieval bots
  (ChatGPT-User, Claude-User, PerplexityBot, etc.) and training bots, blocks
  known non-compliant crawlers (Bytespider, CCBot)
- `app/sitemap.ts` — lists all four routes; **add new routes here as you
  build them**, this doesn't auto-discover pages
- `app/manifest.ts` — points at `anta-mark.png` as a placeholder icon; swap
  for a real 192/512 PNG set + `favicon.ico` + `apple-touch-icon` before
  launch (see Phase 5)
- `public/llms.txt` — plain-text factual summary for AI systems, separate
  from the on-page brand copy
- `lib/seo/site.ts` — single source of truth for name/description/URL;
  `lib/seo/jsonld.ts` — Organization, WebSite, FAQPage, BreadcrumbList
  builders; wired into `app/layout.tsx` (Organization + WebSite on every
  page) and stubbed into `app/about/page.tsx` (FAQPage, empty until the FAQ
  section is built)
- Every page (`/`, `/about`, `/work`, `/build`) exports real per-page
  `metadata` — as you write each page's actual copy, update its
  `description` to match, don't leave the placeholder from the stub

**What's still missing — pick these up in the phases below, not now:**

- OG images (currently point at `/og/default.png`, which doesn't exist yet)
- Structured data beyond Organization/WebSite/FAQPage — Article/CaseStudy
  markup for `/work` once it's built (Phase 2)
- A content/blog engine — see Phase 5.5, this is the biggest standing SEO
  gap and isn't solved by any of the phases above
- Google Search Console verification (real code, not the placeholder) and
  submitting the sitemap — an account action, not code (Phase 5)

---

## Phase 1 — Fix a real lint error, then finish the homepage

`npx eslint .` currently fails on `components/hero-background/useBlobPath.ts`
(2 errors): it reads and writes a ref's `.current` during render
(`react-hooks/refs`), invalid under React 19's stricter rules. Fix this
first — it's a real bug, not a style nit.

**Prompt:**

> Run `npx eslint .` and fix the two `react-hooks/refs` errors in
> `components/hero-background/useBlobPath.ts` — a ref's `.current` is being
> read inside a `useState` initializer and written directly in the render
> body. Move both into `useEffect`/`useLayoutEffect` or restructure so refs
> are only touched outside render, without changing the visual behavior of
> the blob morph. Verify by running the dev server and confirming the
> `design` variant hero background on the homepage still animates correctly,
> then re-run `npx eslint .` clean.

(TypeScript itself is clean — `npx tsc --noEmit` passes with zero errors.)

The hero is already built (`components/home/HeroSection.tsx`, rendered from
`app/page.tsx`). Missing: proof-of-work strip, the "how the studio
operates" process section, the "Scope it live" tool, and contact/footer.

**Prompt:**

> Open `design-reference/ANTA Site.dc.html` and `app/page.tsx`. Build out the
> rest of the homepage below the hero, matching that reference exactly:
> a proof-of-work strip referencing the Lead Intelligence Agent, a "how the
> studio operates" section ("Every input, owner, and failure point mapped
> before a line of code exists" / "Deploy, monitor, iterate" / "Continuous
> feedback loop"), the "Scope it live" panel, and a contact/footer section
> with the cal.com/antaconsulting/intro link and "replies in 24h". Use Framer Motion
> for scroll-triggered reveals consistent with the hero. Pull real copy from
> the reference file — don't paraphrase it. Put each major section in its
> own file under `components/home/` (following the `HeroSection.tsx`
> pattern) rather than growing `app/page.tsx` into one long file. Add
> descriptive `alt` text to every image — this is both an accessibility and
> an SEO requirement, not optional.

**For "Scope it live" specifically — build it exactly like the original spec
first, no live AI call yet:**

> Read `design-reference/ANTA_Website_Prototype_Prompt.md`, the "Hero element
> spec: AI Solution Engineer panel" section. Build the Scope it live panel as
> a client component: pain-point chips + free-text input, a 1-2s fake
> "analyzing" state with incrementing monospace status lines
> (`> scoping constraints...`, `> mapping stack...`, `> pricing
> complexity...`), then a result panel with Issue identified / Recommended
> fix / Alternative approach / Timeline / Budget. Hardcode 4-5 realistic
> issue/fix/alternative sets keyed to the chips, plus one generic fallback
> for free text. No API call — this stays static until Phase 6.

Shipping the hardcoded version first gets the whole site live fast. The real
Claude-API-backed version is Phase 6, once the rest of the site exists.

---

## Phase 2 — Work page

**Prompt:**

> Open `design-reference/ANTA Work.dc.html` and build `app/work/page.tsx`
> to match it. This is a real case study of the ANTA Lead Intelligence Agent
> — B2B lead scoring, cold email generation, outreach sequencing. Stack used:
> Next.js, Postgres, Vercel, Claude API, Apollo, HubSpot, Lemlist — use these
> exact names, don't invent others. Build the "System log" terminal-feed
> component (referenced in the design as showing things like "subj: your 3
> ops eng reqs", "tone: peer", a "QUEUED" state, fit score and reply rate
> stats) as its own component in `components/work/SystemLog.tsx`. Match the
> "Before" framing and the fictional prospect company names shown in the
> reference (Cedarpoint Health, Harborline Logistics, Northgate Supply Co.,
> Vantage Print Group) if they appear as example rows. Add `Article` JSON-LD
> for the case study using `lib/seo/jsonld.ts` as a pattern (add a new
> builder there rather than hand-rolling the schema inline).

Once there's a second case study, split this into `/work` (index) and
`/work/[slug]` and add `BreadcrumbList` schema — don't do it preemptively
for one case study.

---

## Phase 3 — About / Studio page

**Prompt:**

> Open `design-reference/ANTA About.dc.html` (and `ANTA About Options.dc.html`
> for the alternate layout — pick whichever reads stronger, or ask me if
> unclear) and build `app/about/page.tsx`. Cover: "the shift" (why the market
> doesn't wait, adopt-or-get-dragged-out framing), "how we help" (design,
> architect, build, automate — one process, no handoffs), and the FAQ
> ("questions that come up before the first call" — including objections
> like "we're not big enough to need this yet" and ecosystem lock-in
> concerns). Keep the tone direct and technical, zero fluff — match the
> voice already in the reference copy exactly. **Fill in the `faqItems`
> array already stubbed in this file with the real Q&A pairs** so the
> `FAQPage` JSON-LD (already wired, currently empty) actually populates —
> this is one of the highest-value schema types for both search snippets
> and AI answer engines, don't skip it. Also add one or two plain,
> unambiguous factual sentences near the top of the page — who ANTA is,
> what it does, for whom — separate from the brand-voice copy. AI systems
> extract facts far more reliably from direct statements than from stylized
> headlines like "the shift"; both can coexist on the same page.

---

## Phase 4 — Build page

**Prompt:**

> Open `design-reference/ANTA Build.dc.html` and
> `design-reference/Workflow Section Concepts.dc.html`, then build
> `app/build/page.tsx`. Centerpiece is the "Workflow explorer" — hovering a
> process step reveals the tool stack it runs on. Build this as
> `components/build/WorkflowExplorer.tsx` with real hover state (not just
> CSS `:hover`, since it needs to update a details panel elsewhere on
> screen). Cover the four system categories: custom AI applications,
> workflow automation, stack consolidation, team enablement. Include the
> "process as architecture" numbered sequence and "design the seams" framing
> from the reference.

---

## Phase 5 — Cross-page polish + SEO/AEO close-out

Do this after all four pages exist and roughly match their references.

**Prompt:**

> Do a pass across all four pages (`app/page.tsx`, `app/about/page.tsx`,
> `app/work/page.tsx`, `app/build/page.tsx`) for: mobile responsiveness
> (check 375px, 768px, 1440px), the `useReducedMotion` hook is respected
> everywhere motion is used (not just in hero-background), focus states are
> visible on all interactive elements (nav links, chips, CTA buttons), and
> color contrast holds against the dark background per WCAG AA. Fix issues
> directly; list anything ambiguous instead of guessing.

**Then, SEO/AEO close-out — do this before Phase 7, not after:**

> Generate real Open Graph images (one per page, not just the shared
> default) using `next/og`'s `ImageResponse` at `app/**/opengraph-image.tsx`
> — dark background, ANTA wordmark, page-specific headline, matching the
> Dark Terminal palette in `app/globals.css`. Replace the placeholder icon
> in `app/manifest.ts` with a proper icon set (`app/icon.png` at 512x512,
> `app/apple-icon.png`, `favicon.ico`) generated from `public/anta-mark.png`.
> Run every page through Google's Rich Results Test and the schema.org
> validator to confirm the JSON-LD is valid, not just present.

If you want a second opinion on anything architectural mid-build, your
`cto-architect` subagent (already configured at the ANTA project root) is
built for exactly this — stack calls, code review, scoping tradeoffs.

---

## Phase 5.5 — Decide on a content engine (don't skip this silently)

None of the phases above add a blog, resource library, or any indexable
long-form content beyond the four marketing pages and one case study. That's
the single biggest standing SEO gap: no target-keyword strategy, nothing new
for search or AI engines to crawl after launch week, and it directly
contradicts the "content creation" pillar in the top-level `CLAUDE.md`
strategy. This phase is a decision, not a build task — resolve it before
declaring the SEO work done:

- Minimum viable version: an MDX-based `/writing` or `/notes` section (files
  in the repo, no CMS) for short technical write-ups — the kind of content
  that doubles as both SEO surface area and LinkedIn-repurposable material.
- If content cadence isn't realistic right now, say so explicitly and
  revisit in a month — don't scaffold an empty `/blog` route that sits
  unused, that's worse than not having one (thin/abandoned sections are a
  quality signal search engines penalize).

**Decision (17 Aug 2026): deferred, not dropped.** No `/writing` section at
launch. Pre-revenue, writing time competes directly with outreach time, and
a thin abandoned section is a worse signal than no section — so this ships
as four pages plus one case study, and content lead-gen runs through
LinkedIn in the meantime.

Revisit ~mid-September 2026, at the same checkpoint as the ICP review in the
top-level `CLAUDE.md`. Two things make it a yes: two or three write-ups
already drafted (not planned), and a repeatable weekly slot to publish. The
build itself is small — MDX files in the repo, an index route, a
`/writing/[slug]` route, `Article` JSON-LD reusing `caseStudyJsonLd`'s
shape, and the slugs added to `app/sitemap.ts`. Don't scaffold any of it
until the drafts exist.

---

## Phase 6 — Wire a real model into "Scope it live" — **shipped**

This is the one part of the build with real engineering risk (cost control,
abuse, latency), and it is done. What follows is the record of what landed,
not a prompt to run. Where it diverges from `ARCHITECTURE.md` §3 as
originally written, the code carries the reasoning in a header comment.

**What was built:**

- `app/api/scope/route.ts` — thin HTTP boundary. Parses, rate-limits,
  delegates, logs. Responds with newline-delimited JSON
  (`status` / `result` / `emailed` / `error` events) that it writes itself.
  No Vercel AI SDK: the panel's progress comes from a 900ms server-side
  heartbeat, so there were never model tokens to stream.
- `lib/scope/provider.ts` — picks the model by which API key is set.
  `ANTHROPIC_API_KEY` wins if both are; `SCOPE_PROVIDER=anthropic|gemini`
  pins one. Switching paid ↔ free is one Vercel env var, no deploy.
- `lib/scope/claude.ts` — paid path. `@anthropic-ai/sdk`, `claude-opus-5`,
  `effort: "low"`, structured outputs (`output_config.format`), streamed to
  `finalMessage()`, `stop_reason: "refusal"` handled as its own class.
- `lib/scope/gemini.ts` — free path. Google AI Studio `gemini-3.6-flash`
  over plain `fetch`, no SDK, `responseSchema` translated from the same
  JSON Schema, `thinkingBudget: 0`, safety finish reasons mapped to a
  refusal. Read the free-tier caveats in `.env.local.example` before
  pointing production at it.
- `lib/scope/errors.ts` — the two error classes both providers throw, so
  the route's `instanceof` checks hold whichever one ran.
- `lib/scope/schema.ts` — the response contract, generating
  `{ issue, name, verdict, steps, stack }` rather than §3's original
  `{ issue, recommendedFix, alternativeApproach, timeline, budgetFraming }`.
  The approved panel renders the former; generating fields nothing renders
  would only add latency and tokens.
- `lib/scope/ratelimit.ts` — Upstash sliding window, 5/hour/IP, SHA-256
  IP hashing salted with `IP_HASH_SALT`. Production **refuses to serve**
  if Upstash is unconfigured — an uncapped public endpoint on a paid API
  is a deployment error, not a degraded mode.
- `lib/leads/scope-submissions.ts` — every completed scope is a row,
  contact info or not. `import "server-only"` guards the service-role key.
- `lib/email/send-scope.ts` — Resend, plain text, optional.

**The invariant to preserve:** every failure path in `lib/scope/client.ts`
resolves rather than throws, and the panel falls back to the hand-written
scopes in `lib/scope/static-scopes.ts`. Unconfigured, rate-limited, refused,
quota-exhausted or down — the visitor still sees a real architecture. This
widget is the site's proof of work and is never allowed to look broken.

---

## Phase 7 — Ship it

The domain and Vercel project already exist (`theanta.com`, connected to
`github.com/Anadi9/anta`) — this is a cutover, not a fresh setup.

```bash
git add -A && git commit -m "ANTA site rebuild — Dark Terminal design system"
git push origin main   # or open a PR first if you want a review pass
```

Before merging to `main` (which triggers the production deploy), confirm in
Vercel project settings:

- `ANTHROPIC_API_KEY` **or** `GEMINI_API_KEY` (one model provider must be
  reachable, or every scope silently serves a static fallback),
  `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `UPSTASH_REDIS_REST_URL`,
  `UPSTASH_REDIS_REST_TOKEN`, `RESEND_API_KEY` are all set for the
  Production environment (not just Preview). Upstash is not optional in
  production — `/api/scope` returns 503 without it.
- the GA4 property (`G-BF6M3EFFKH`) is receiving data from a preview deploy
  before you cut production over
- Google Search Console verification is completed with a real code (see
  Phase 5) and the sitemap is submitted post-launch

---

## Notes on driving Claude Code through this

- One phase per session (or per few commits) — don't ask it to build all
  four pages in one prompt. Smaller diffs are easier to check against the
  `.dc.html` reference and easier to back out if a section goes sideways.
- Always name the specific `.dc.html` file in the prompt. Claude Code will
  guess at content and layout if you don't point it at the reference — the
  copy is already written, there's no reason to let it improvise.
- After each phase, actually look at `localhost:3000` yourself before moving
  on. Nothing in this plan replaces you checking it looks right.
- If you want automated visual diffing against the `.dc.html` references
  instead of eyeballing it, a Playwright MCP server can screenshot both and
  hand the diff back to Claude Code directly — worth setting up if Phase 5
  polish turns into a slog.
