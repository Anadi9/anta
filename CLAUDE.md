@AGENTS.md

# ANTA website (theanta.com) — build project

You are building the real theanta.com marketing site for ANTA, an AI
development studio founded by Anadi (solo operator, no current clients,
targeting U.S. growth-stage companies). Full company context, vision, and
positioning rules live in `/Users/anadithakur/Documents/Claude/Projects/ANTA/CLAUDE.md`
— read that first if it's not already in context. The short version: be lean,
ship fast, never mention Adobe Experience Manager (AEM), and everything here
exists to help land the first U.S. client.

**Read `ARCHITECTURE.md` before making structural changes** — it documents
the system design, data flow, and the reasoning behind every stack choice
below. This file is the working-context summary; that one is the record of
*why*.

## Live repo status — this is a from-scratch rebuild, not greenfield

`github.com/Anadi9/anta` is a real, deployed repo (Next.js 14, Tailwind 3,
shadcn/Radix, Supabase, styled-components), live at `theanta.com` via
Vercel. Its content and design are being fully replaced — its copy frames
ANTA as a generic "AI Product Studio for MVPs," which conflicts with the
positioning above, and it carries two off-brand SEO pages
(`/services/web-development`, `/services/custom-websites`) that are being
dropped, not ported. Most of its **infrastructure is being kept**: the
`theanta.com` domain and Vercel project, and the GA4 property
(`G-BF6M3EFFKH`). Don't provision new versions of those — port them forward
per `BUILD_PLAN.md` Phase 0.

**Supabase is the exception.** The rebuild uses a **fresh Supabase project**
with a single table (`scope_submissions`), not the old one: this site's only
server-side write is `/api/scope`, its contact section is a `mailto:` link,
and the old project's `contact_submissions`/`project_submissions` have no
reader here. Setup steps in `supabase/README.md`, reasoning in
`ARCHITECTURE.md` §7.

## Finalized tech stack

- **Framework:** Next.js 16 (App Router), TypeScript, Tailwind v4
- **Animation:** GSAP (free plugins only — ScrollTrigger, MotionPathPlugin)
  for the background system, Framer Motion for foreground content
- **UI:** fully custom (Dark Terminal design system) — no shadcn/Radix
  component suite. Add individual headless primitives only when a specific
  interaction needs one; don't reintroduce the old repo's full Radix
  dependency list
- **Data:** Supabase (Postgres) — fresh project, one table, schema in
  `supabase/migrations/` and documented in `ARCHITECTURE.md` §4
- **AI:** two interchangeable providers behind one contract
  (`lib/scope/provider.ts`), for the "Scope it live" tool — **built**, see
  `BUILD_PLAN.md` Phase 6. Paid path: Anthropic SDK (`@anthropic-ai/sdk`),
  `claude-opus-5`. Free path: Google AI Studio (`gemini-2.5-flash`) over
  plain `fetch`, no SDK. Whichever API key is present wins,
  `ANTHROPIC_API_KEY` first; `SCOPE_PROVIDER` pins one explicitly. The
  Vercel AI SDK is **not** used and is not a dependency — the route streams
  NDJSON it builds itself, because its progress events come from a server
  heartbeat, not from model tokens
- **Rate limiting:** Upstash Redis, for the public unauthenticated AI
  endpoint
- **Email:** Resend, replacing the old repo's `nodemailer` (HTTP API fits
  serverless functions better than SMTP connection pooling)
- **Analytics:** GA4 (existing property, ported forward) + Vercel Analytics
  / Speed Insights (new — the animation-heavy design needs Core Web Vitals
  visibility). PostHog is optional, add only if GA4's funnel data on
  Scope-it-live proves insufficient — don't install it day one.
- **Error tracking:** Sentry (new — a silent failure in `/api/scope` is a
  silently lost lead)
- **Hosting/CI:** Vercel, existing project, git-integration deploys — no
  separate CI system
- **Package manager:** npm only. The old repo has both `bun.lockb` and
  `package-lock.json` committed — delete the former when porting, two
  lockfiles drift.

## SEO / GEO / AEO — what's already in place vs. what's still a gap

Already implemented in this scaffold (verify it stays intact as pages get
built):

- `app/robots.ts` with explicit AI-crawler policy (retrieval bots allowed,
  known bad actors blocked)
- `app/sitemap.ts`, `app/manifest.ts`
- `public/llms.txt` — a plain-factual summary separate from on-page brand
  voice, specifically for AI systems
- `lib/seo/site.ts` (identity constants) + `lib/seo/jsonld.ts`
  (Organization/WebSite/FAQPage/BreadcrumbList builders), wired into
  `app/layout.tsx` and stubbed into `app/about/page.tsx`
- Per-page `metadata` exports on all four routes (update the `description`
  as real copy replaces the stub content)

Still a gap — tracked in `BUILD_PLAN.md` Phases 5 and 5.5, don't let these
slip:

- No OG images yet (`next/og` generation, one per page)
- No real icon set (favicon.ico, apple-touch-icon, sized PNGs)
- No content/blog engine — zero indexable long-form content beyond four
  pages and one case study, which directly undercuts the "content creation"
  lead-gen pillar in the top-level strategy doc. This is a decision to make
  explicitly, not an oversight to let ride.
- Google Search Console verification not completed (real code, not a
  placeholder) and sitemap not submitted
- FAQPage schema is wired but empty until the About page's FAQ is written
- No third-party presence (Crunchbase, LinkedIn company page, founder
  posts) feeding AI engines beyond the owned site — a distribution/GTM gap,
  not a code gap, but it materially affects how AI systems describe ANTA

## What this repo already has

- Next.js 16 (App Router) + TypeScript + Tailwind v4, scaffolded and working.
- GSAP + Framer Motion installed.
- `components/hero-background/` — the hero background. Two systems: the
  `Scenes` art (`HeroScenes.tsx` + `scenes.ts`), ported from
  `design-reference/ANTA Hero.html`, which is what the hero actually renders;
  and the canvas fallback (`HeroCanvas.tsx`, `Network` / `Blueprint` modes),
  ported from `ANTA Site.dc.html` and currently unmounted. **Read
  `components/hero-background/README.md` before touching it** — it explains why
  there are two and which one wins. `HeroScenes` is wired into the homepage
  hero (`components/home/HeroSection.tsx`, rendered from `app/page.tsx`) —
  don't rebuild it, extend/reuse it. Those two exports are the *only*
  references for the hero background; don't reintroduce art from others.
- `design-reference/` — the actual approved visual design and copy, exported
  as self-contained HTML previews from the design tool. **These are the
  source of truth for layout, copy, and visual treatment.** Open them in a
  browser to see the real design before building each page:
  - `ANTA Site.dc.html` — homepage (hero, proof of work, "how the studio
    operates", the "Scope it live" interactive tool, contact)
  - `ANTA Hero.html` — the approved hero, and the only export that ships the
    `hero-scenes.js` module plus its 19 art plates (now `public/scene/`).
    Source of truth for the hero background; supersedes `ANTA Site.dc.html`
    for that layer only.
  - `ANTA About.dc.html` / `ANTA About Options.dc.html` — Studio/About page
  - `ANTA Work.dc.html` — Work page (real case study: Lead Intelligence
    Agent, with a "System log" terminal feed and stack callouts)
  - `ANTA Build.dc.html` / `Workflow Section Concepts.dc.html` — Build page
    (hover-to-reveal "Workflow explorer")
  - `Hero Mark Options.dc.html`, `ANTA Loader.dc.html` — loader/wordmark
    exploration, reference only, not standalone pages
  - `ANTA_Website_Prototype_Prompt.md` — the original brief this design was
    built from (tone, voice, "Time-less Architecture" concept)
- Design tokens live in `components/hero-background/tokens.ts` and are
  mirrored into `app/globals.css` as CSS variables (`--color-bg`,
  `--color-accent`, etc. → Tailwind `bg-bg`, `text-accent`, etc.). Add new
  tokens there, don't hardcode hex values in components.
- Fonts already loaded via `next/font/google` in `app/layout.tsx`: Space
  Grotesk (`font-sans`), JetBrains Mono (`font-mono`), plus three decorative
  fonts used sparingly — Dancing Script (`font-script`), Silkscreen
  (`font-pixel`), Bitcount Prop Single (`font-display`). Check the
  `.dc.html` files to see exactly where the decorative fonts are used before
  reaching for them.
- `app/page.tsx` is a server component (exports real `metadata`) that
  renders `HeroSection`. `app/about/page.tsx`, `app/work/page.tsx`,
  `app/build/page.tsx` are stubs with real per-page `metadata` already set
  and TODO comments pointing at their `.dc.html` reference — keep this
  server-component-renders-client-leaf pattern as you build out each page,
  don't collapse everything into one `"use client"` file (see
  `ARCHITECTURE.md` §2).
- `lib/seo/` — identity constants and JSON-LD builders, see the SEO/GEO/AEO
  section above.

## How to work in this repo

- Build one page at a time, against its `.dc.html` reference, and get it
  compiling and visually close before moving to the next. Don't try to build
  all four pages in one pass.
- Match the reference's copy exactly — it's already written and approved.
  Don't paraphrase or improve it.
- Reuse `components/hero-background` (its `network` / `blueprint` modes)
  rather than building new background art from scratch.
- Keep components in `components/`, one file per component, colocated by
  feature if a page grows complex (e.g. `components/work/SystemLog.tsx`).
- Keep business logic (Supabase queries, Claude calls, email sends) in
  `lib/`, not inside components — see `ARCHITECTURE.md` §2 for the exact
  rule.
- This is a lean solo build, not an enterprise app — don't add a CMS
  (beyond plain MDX if Phase 5.5's content engine happens), a state
  management library, or a component library. Hardcode content from the
  `.dc.html` references directly into the page components.
- See `BUILD_PLAN.md` for the page-by-page build order and ready-to-paste
  prompts, and `ARCHITECTURE.md` for the system design those prompts
  assume.
