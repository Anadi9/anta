/**
 * Hardcoded scope results for the "Scope it live" panel.
 *
 * This is the Phase 1 version: no API call, no Claude, no network. Copy and
 * data are lifted verbatim from design-reference/ANTA Site.dc.html so the
 * shipped panel matches the approved design. BUILD_PLAN Phase 6 replaces
 * `resolveScope` with a real `/api/scope` call — keep the return shape
 * (`ScopeResult`) stable so only the transport changes.
 */

export type ScopeStep = { day: string; text: string };

export type ScopeResult = {
  name: string;
  verdict: string;
  steps: ScopeStep[];
  stack: string[];
};

export type ScopeKey = "leads" | "ops" | "support" | "content" | "custom";

/** Pain-point chips shown in the panel's idle state. */
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
  },
  ops: {
    name: "Operations Data Spine",
    verdict:
      "One service owns the record. Your tools read and write through it instead of through a person and a spreadsheet.",
    steps: [
      { day: "D1–2", text: "Map the seams — who owns which field, and when" },
      { day: "D3–10", text: "API-level sync service with reconciliation and audit trail" },
      { day: "D11–16", text: "Cutover, monitoring, runbook handed to your team" },
    ],
    stack: ["Node", "Postgres", "Next.js", "Webhooks", "HubSpot", "Vercel"],
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
  },
  content: {
    name: "Content Production Line",
    verdict:
      "Research, draft and repurpose in your voice on a schedule — measured on replies and pipeline, never on impressions.",
    steps: [
      { day: "D1–2", text: "Voice spec and source library assembled" },
      { day: "D3–8", text: "Draft pipeline with retrieval and a review queue" },
      { day: "D9–14", text: "Scheduling, distribution and reply tracking wired" },
    ],
    stack: ["Claude API", "Node", "Postgres", "Playwright", "Vercel"],
  },
  custom: {
    name: "Scoped in one call",
    verdict:
      "No template match — which is normal, and fine. Describe it in two paragraphs and you get a real architecture back, not a discovery questionnaire.",
    steps: [
      { day: "D0", text: "One call. No deck, no discovery phase" },
      { day: "D1–2", text: "Written spec with a fixed surface area you approve" },
      { day: "D3–14", text: "Built in the open, deployed to your infrastructure" },
    ],
    stack: ["Claude API", "Next.js", "Node", "Postgres", "Vercel"],
  },
};

const MATCHERS: { key: ScopeKey; words: string[] }[] = [
  {
    key: "leads",
    words: ["lead", "prospect", "outbound", "sales", "pipeline", "crm list", "cold", "icp", "research"],
  },
  {
    key: "ops",
    words: ["tool", "spreadsheet", "data", "sync", "integrat", "ops", "manual entry", "copy", "excel", "airtable"],
  },
  {
    key: "support",
    words: ["support", "ticket", "inbox", "customer", "helpdesk", "triage", "zendesk", "intercom"],
  },
  {
    key: "content",
    words: ["content", "blog", "social", "newsletter", "marketing", "post", "seo", "writing"],
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
    ...result.steps.map((s) => `${s.day} — ${s.text}`),
    "",
    `Stack: ${result.stack.join(", ")}`,
    "",
    "—",
    "Scoped at theanta.com. Estimate, not a quote.",
  ].join("\n");

  return `mailto:anadi@theanta.com?subject=${encodeURIComponent(
    `ANTA — ${result.name}`,
  )}&body=${encodeURIComponent(body)}`;
}
