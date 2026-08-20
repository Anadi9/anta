/**
 * Hardcoded scope results for the "Scope it live" panel.
 *
 * Originally the Phase 1 stand-in for a real API call. Since BUILD_PLAN Phase 6
 * shipped `/api/scope`, this is the **fallback library** — what a visitor sees
 * when the live generation can't run: Gemini's free tier is capped at 20
 * requests/minute, the Upstash limiter allows 5/hour per IP, and either ceiling
 * lands a visitor here with no on-screen tell (by design — see the note in
 * components/home/ScopeSection.tsx).
 *
 * That makes coverage a real concern rather than a nicety. A thin library means
 * a burst of traffic — the exact situation a launch post creates — serves most
 * visitors a scope that doesn't match what they asked, which is worse than an
 * error because it looks like a considered answer. Hence a scope per bottleneck
 * ANTA actually sells against, not one per chip in the design.
 *
 * The four chip scopes (leads/ops/support/content) and `custom` are verbatim
 * from design-reference/ANTA Site.dc.html — don't reword those. The rest are
 * written to the same spec: three dated steps, a verdict that names the
 * mechanism rather than the benefit, and a stack that is honestly buildable in
 * TypeScript/Node, since that is what gets delivered.
 */

import { SITE } from "@/lib/seo/site";

export type ScopeStep = {
  day: string;
  text: string;
  /**
   * One line of detail, revealed when the visitor expands the step.
   *
   * Optional because the static library below doesn't carry it: these scopes
   * are a fallback, and writing three details for each of thirteen would be
   * copy nobody reads for a path that should be rare. The panel renders a step
   * as expandable only when this is present, so a fallback scope is a tighter
   * version of the same layout rather than a broken one.
   */
  detail?: string;
};

export type ScopeResult = {
  name: string;
  verdict: string;
  steps: ScopeStep[];
  stack: string[];
  /**
   * What the client has to supply for the sprint to start on day one. Present
   * on every scope, live or static — it's the most useful thing on the panel
   * for a visitor deciding whether to book a call, because it's the first
   * honest signal that this is a real engagement with obligations on both
   * sides rather than a quote generator.
   */
  needs: string[];
  /**
   * The bottleneck restated in the model's own words, shown above the result
   * so the visitor can check they were understood before reading the fix.
   *
   * Live-only: the static scopes are matched on a keyword, so they know the
   * category but not the situation, and inventing a restatement of something
   * that was never read would be the one genuinely dishonest thing on this
   * panel. Absent means the block simply isn't rendered.
   */
  issue?: string;
};

export type ScopeKey =
  // The four shown as chips in the approved design.
  | "leads"
  | "ops"
  | "support"
  | "content"
  // Reachable only by free-text match. Each maps to a vertical in the ICP doc.
  | "documents"
  | "recruiting"
  | "reporting"
  | "scheduling"
  | "finance"
  | "knowledge"
  | "meetings"
  | "proposals"
  // Fallback when nothing matches.
  | "custom";

/**
 * Pain-point chips shown in the panel's idle state.
 *
 * Four, matching the approved design — deliberately NOT one per scope. The
 * extra scopes below exist to catch free text, and adding chips for them would
 * change a design-reference layout that was signed off.
 */
export const PRESETS: { key: ScopeKey; label: string }[] = [
  { key: "leads", label: "Manual lead research" },
  { key: "ops", label: "Data stranded across tools" },
  { key: "support", label: "Tickets triaged by hand" },
  { key: "content", label: "Content that never ships" },
];

/** Status lines streamed during the fake "analyzing" state. */
export const THINKING_LINES = [
  "reading the bottleneck",
  "matching against shipped systems",
  "drafting the architecture",
  "estimating scope",
];

/**
 * Cycled on the last terminal line while the panel waits out a live
 * generation that outlasts THINKING_LINES (ScopeSection's hold window).
 *
 * Separate from THINKING_LINES because these are load-bearing differently:
 * those describe steps that complete and get a ✓, these are a single
 * unfinished step rephrasing itself. Same register — lowercase, present
 * participle, no adjectives — so the swap doesn't read as a different voice.
 */
export const HOLD_LINES = [
  "weighing the trade-offs",
  "cutting what isn't day one",
  "sequencing the build",
  "sanity-checking the estimate",
];

export const SCOPES: Record<ScopeKey, ScopeResult> = {
  leads: {
    name: "Lead Intelligence Agent",
    verdict:
      "Sourcing, scoring and first-touch drafting run without a human in the loop. One operator reviews; nothing sends unreviewed.",
    steps: [
      { day: "D1–2", text: "Spec + ICP scoring rubric written and approved" },
      { day: "D3–9", text: "Enrichment, scoring and drafting pipeline built" },
      { day: "D10–14", text: "Sequenced, synced to your CRM, live in production" },
    ],
    stack: ["Claude API", "Apollo", "Node", "Postgres", "Lemlist", "HubSpot"],
    needs: [
      "Your ICP in writing: who is a fit and who is not",
      "CRM access, or an export of what you have already worked",
      "One person who can approve outbound copy",
    ],
  },
  ops: {
    name: "Operations Data Spine",
    verdict:
      "One service owns the record. Your tools read and write through it instead of through a person and a spreadsheet.",
    steps: [
      { day: "D1–2", text: "Map the seams: who owns which field, and when" },
      { day: "D3–10", text: "API-level sync service with reconciliation and audit trail" },
      { day: "D11–16", text: "Cutover, monitoring, runbook handed to your team" },
    ],
    stack: ["Node", "Postgres", "Next.js", "Webhooks", "HubSpot", "Vercel"],
    needs: [
      "A list of the tools involved and who owns each one",
      "API access or admin on each of them",
      "The fields that must never silently disagree",
    ],
  },
  support: {
    name: "Triage & Response Agent",
    verdict:
      "Every ticket arrives classified, routed and drafted against your own resolution history. Agents approve instead of author.",
    steps: [
      { day: "D1–2", text: "Taxonomy and escalation rules from your ticket history" },
      { day: "D3–9", text: "Retrieval, classifier and draft generation, with evals" },
      { day: "D10–14", text: "Live behind your helpdesk, humans in the approve seat" },
    ],
    stack: ["Claude API", "Next.js", "Postgres", "pgvector", "Zendesk API"],
    needs: [
      "Twelve months of resolved tickets",
      "Your escalation rules, even if they live in someone's head",
      "An agent who can tell a good draft from a bad one",
    ],
  },
  content: {
    name: "Content Production Line",
    verdict:
      "Research, draft and repurpose in your voice on a schedule, measured on replies and pipeline, never on impressions.",
    steps: [
      { day: "D1–2", text: "Voice spec and source library assembled" },
      { day: "D3–8", text: "Draft pipeline with retrieval and a review queue" },
      { day: "D9–14", text: "Scheduling, distribution and reply tracking wired" },
    ],
    stack: ["Claude API", "Node", "Postgres", "Playwright", "Vercel"],
    needs: [
      "Anything you have published that sounded like you",
      "The topics you will not write about",
      "One reviewer with sign-off",
    ],
  },
  documents: {
    name: "Document Ingestion Engine",
    verdict:
      "Paperwork arriving as email attachments is read, extracted and staged against your system of record. Your admins approve exceptions instead of retyping every field.",
    steps: [
      { day: "D1–3", text: "Field map per document type, pulled from real samples" },
      { day: "D4–10", text: "Extraction pipeline with a confidence threshold and review queue" },
      { day: "D11–16", text: "Writes into your system of record, exceptions routed to a human" },
    ],
    stack: ["Claude API", "Node", "Postgres", "Next.js", "S3", "Vercel"],
    needs: [
      "Twenty real documents per type, including the messy ones",
      "API access to your system of record",
      "The fields that must be right, and who checks them today",
    ],
  },
  recruiting: {
    name: "Candidate Screening Agent",
    verdict:
      "Every inbound resume is parsed and ranked against the actual requirements of the req, with the reasoning attached. Recruiters open a shortlist, not an inbox.",
    steps: [
      { day: "D1–2", text: "Scoring rubric built from reqs you have already filled" },
      { day: "D3–9", text: "Parsing, ranking and rationale generation, checked against past hires" },
      { day: "D10–14", text: "Synced back to your ATS, live on new applicants" },
    ],
    stack: ["Claude API", "Node", "Postgres", "pgvector", "ATS API", "Vercel"],
    needs: [
      "Reqs you have filled, with the hires attached",
      "ATS API access",
      "A recruiter who can say why a shortlist was wrong",
    ],
  },
  reporting: {
    name: "Client Reporting Pipeline",
    verdict:
      "Numbers are pulled from every platform on a schedule and assembled into the deck you already send, with the narrative drafted, not just the charts. You edit and send.",
    steps: [
      { day: "D1–3", text: "Metric definitions agreed and template mapped field by field" },
      { day: "D4–10", text: "Connectors, aggregation and narrative generation built" },
      { day: "D11–14", text: "Scheduled runs, review UI, output landing in your drive" },
    ],
    stack: ["Node", "Next.js", "Postgres", "Claude API", "Platform APIs", "Vercel"],
    needs: [
      "One report you have already sent, as the target",
      "Read access to each platform",
      "The metric definitions you actually defend to clients",
    ],
  },
  scheduling: {
    name: "Intake & Scheduling Desk",
    verdict:
      "Inbound requests are qualified, matched to real availability and booked without a back-and-forth thread. Reminders and reschedules run themselves.",
    steps: [
      { day: "D1–2", text: "Intake questions, routing rules and availability logic specced" },
      { day: "D3–9", text: "Booking engine wired to your calendar and system of record" },
      { day: "D10–14", text: "Reminder and no-show flows live, staff dashboard handed over" },
    ],
    stack: ["Node", "Next.js", "Postgres", "Calendar APIs", "Twilio", "Vercel"],
    needs: [
      "Your real availability rules, exceptions included",
      "Calendar and system-of-record access",
      "What a qualified request looks like",
    ],
  },
  finance: {
    name: "Billing & Receivables Runner",
    verdict:
      "Invoices are raised from the work record instead of from memory, and chased on a schedule until they clear. You see what is outstanding without asking anyone.",
    steps: [
      { day: "D1–3", text: "Billing rules and dunning schedule written down and approved" },
      { day: "D4–10", text: "Invoice generation, reconciliation and chase sequence built" },
      { day: "D11–16", text: "Synced to your accounting system, AR dashboard live" },
    ],
    stack: ["Node", "Postgres", "Next.js", "Accounting API", "Resend", "Vercel"],
    needs: [
      "Your billing rules, including the ones you bend",
      "Accounting system access",
      "A dunning schedule you are willing to enforce",
    ],
  },
  knowledge: {
    name: "Internal Answer Layer",
    verdict:
      "One retrieval service over the documentation you already have, answering in your own wording and citing the source. Stops the same question being asked in Slack every week.",
    steps: [
      { day: "D1–2", text: "Sources inventoried, ownership and freshness rules set" },
      { day: "D3–9", text: "Ingestion, retrieval and answer generation with citations and evals" },
      { day: "D10–14", text: "Live in Slack and in-app, with a gap report on what it can't answer" },
    ],
    stack: ["Claude API", "Next.js", "Postgres", "pgvector", "Slack API", "Vercel"],
    needs: [
      "The docs, wherever they are: Notion, Drive, Slack",
      "An owner per source who can mark it stale",
      "Twenty questions people actually ask",
    ],
  },
  meetings: {
    name: "Call-to-CRM Pipeline",
    verdict:
      "Every call is transcribed, summarised against your own qualification framework, and written to the record with the follow-up already drafted. Nothing depends on someone remembering.",
    steps: [
      { day: "D1–2", text: "Qualification fields and summary shape mapped to your CRM" },
      { day: "D3–9", text: "Transcription, extraction and follow-up drafting built" },
      { day: "D10–14", text: "Writing to the CRM automatically, drafts queued for approval" },
    ],
    stack: ["Claude API", "Node", "Postgres", "Whisper API", "CRM API", "Vercel"],
    needs: [
      "Recordings or transcripts from past calls",
      "CRM field map and access",
      "The qualification framework you use, not the one you bought",
    ],
  },
  proposals: {
    name: "Proposal & Quote Builder",
    verdict:
      "Scope, pricing and terms assembled from your own past work rather than from a blank document. What used to be an evening becomes a review pass.",
    steps: [
      { day: "D1–2", text: "Pricing logic and clause library extracted from proposals you have sent" },
      { day: "D3–9", text: "Generation against your template, with margin guardrails" },
      { day: "D10–14", text: "Approval flow, versioning and send tracking wired up" },
    ],
    stack: ["Claude API", "Next.js", "Node", "Postgres", "Resend", "Vercel"],
    needs: [
      "Ten proposals you have sent, won and lost",
      "Your pricing floor and the discounts you allow",
      "Who signs off before anything goes out",
    ],
  },
  custom: {
    name: "Scoped in one call",
    verdict:
      "No template match, which is normal, and fine. Describe it in two paragraphs and you get a real architecture back, not a discovery questionnaire.",
    steps: [
      { day: "D0", text: "One call. No deck, no discovery phase" },
      { day: "D1–2", text: "Written spec with a fixed surface area you approve" },
      { day: "D3–14", text: "Built in the open, deployed to your infrastructure" },
    ],
    stack: ["Claude API", "Next.js", "Node", "Postgres", "Vercel"],
    needs: [
      "Two paragraphs on where the time actually goes",
      "Access to whatever system holds the work today",
      "One person who can make decisions without a committee",
    ],
  },
};

/**
 * Free-text → scope. **Order is the specificity ranking**: the first matcher
 * with any hit wins, so narrow verticals must sit above broad ones. "data",
 * "tool" and "copy" match almost any description of a bottleneck, which is why
 * `ops` is last of the real matchers rather than second — before that, a 3PL
 * describing scanned paperwork matched `ops` on the word "data" and got a data
 * spine instead of a document pipeline.
 *
 * Substrings, not words, so "integrat" covers integrate/integration and
 * "schedul" covers schedule/scheduling.
 */
const MATCHERS: { key: ScopeKey; words: string[] }[] = [
  {
    key: "recruiting",
    words: ["resume", "cv ", "candidate", "recruit", "applicant", "hiring", "staffing", "ats", "bullhorn", "job req", "shortlist"],
  },
  {
    key: "documents",
    words: ["pdf", "scan", "bill of lading", "proof of delivery", "paperwork", "ocr", "retype", "re-type", "attachment", "form entry", "data entry"],
  },
  {
    key: "finance",
    words: ["invoic", "billing", "receivable", "collections", "quickbooks", "chasing payment", "unpaid", "reconcil", "bookkeep"],
  },
  {
    key: "reporting",
    words: ["report", "dashboard", "analytics", "ga4", "metrics", "slide", "deck", "kpi"],
  },
  {
    key: "scheduling",
    // "scheduling", not "schedul": the shorter stem also matches "on schedule",
    // which is how people describe a content cadence problem, not a booking one.
    words: ["scheduling", "appointment", "booking", "no-show", "intake", "calendar", "reschedul", "waitlist"],
  },
  {
    key: "meetings",
    words: ["transcript", "call notes", "meeting notes", "note-taking", "gong", "zoom call", "discovery call", "recap"],
  },
  {
    key: "proposals",
    words: ["proposal", "quote", "quoting", "statement of work", "sow", "rfp", "bid ", "estimate for"],
  },
  {
    key: "support",
    words: ["support", "ticket", "inbox", "customer", "helpdesk", "triage", "zendesk", "intercom"],
  },
  {
    key: "knowledge",
    words: ["knowledge base", "documentation", "help doc", "wiki", "sop", "handbook", "onboarding", "same question", "internal search"],
  },
  {
    key: "leads",
    words: ["lead", "prospect", "outbound", "sales", "pipeline", "crm list", "cold", "icp", "research"],
  },
  {
    key: "content",
    words: ["content", "blog", "social", "newsletter", "marketing", "post", "seo", "writing"],
  },
  {
    key: "ops",
    words: ["tool", "spreadsheet", "data", "sync", "integrat", "ops", "manual entry", "copy", "excel", "airtable"],
  },
];

/** Keyword-match free text onto a scope, falling back to the generic one. */
export function resolveScopeKey(text: string): ScopeKey {
  const t = text.toLowerCase();
  return MATCHERS.find((m) => m.words.some((w) => t.includes(w)))?.key ?? "custom";
}

/** `mailto:` link that carries the generated scope into the visitor's client. */
export function scopeMailHref(asked: string, result: ScopeResult): string {
  const body = [
    `Bottleneck: ${asked}`,
    "",
    `Proposed system: ${result.name}`,
    result.verdict,
    "",
    ...result.steps.map((s) => `${s.day}: ${s.text}`),
    "",
    `Stack: ${result.stack.join(", ")}`,
    "",
    "What you'd need to bring:",
    ...result.needs.map((n) => `- ${n}`),
    "",
    "---",
    "Scoped at theanta.com. Estimate, not a quote.",
  ].join("\n");

  return `mailto:${SITE.email}?subject=${encodeURIComponent(
    `ANTA: ${result.name}`,
  )}&body=${encodeURIComponent(body)}`;
}
