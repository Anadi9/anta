/**
 * Work page content — from design-reference/ANTA Work.dc.html.
 *
 * IMPORTANT, read before editing `status` or the section copy that wraps
 * this data: the reference exports these six entries as `status: 'shipped'`
 * / `'in production'`, framed as "the rest of the log". ANTA has exactly one
 * system that has actually shipped — the Lead Intelligence Agent, the
 * featured case below — so presenting six more as delivered work is a claim
 * the studio can't back. They ship here as `scoped`: architecture, sequence
 * and stack worked out, not yet built for anyone. Everything else (summary,
 * mechanics, stack, before/after) is verbatim from the reference, because
 * none of it asserts a delivery history.
 *
 * When one of these becomes real, change its `status` to `shipped` and
 * update the counts in components/work/SystemLog.tsx — that's the only
 * place they're derived.
 */

export type CaseCategory = "Sales" | "Support" | "Ops" | "Marketing";

export type CaseEntry = {
  key: string;
  num: string;
  title: string;
  cat: CaseCategory;
  status: string;
  summary: string;
  mechanics: { n: string; t: string }[];
  stack: string[];
  before: string;
  after: string;
};

export const CASE_CATEGORIES = [
  "All",
  "Sales",
  "Support",
  "Ops",
  "Marketing",
] as const;

export type CaseFilter = (typeof CASE_CATEGORIES)[number];

export const CASES: CaseEntry[] = [
  {
    key: "triage",
    num: "02",
    title: "Triage & Response Agent",
    cat: "Support",
    status: "scoped",
    summary:
      "Every inbound ticket is classified on arrival, routed by your own escalation rules, and answered with a draft written against your resolution history. Agents move from authoring to approving.",
    mechanics: [
      { n: "01", t: "Taxonomy and escalation rules derived from historical tickets" },
      { n: "02", t: "Retrieval over past resolutions, with an eval suite per intent" },
      { n: "03", t: "Draft attached to the ticket; agent approves, edits or escalates" },
    ],
    stack: ["Claude API", "Next.js", "Postgres", "pgvector", "Zendesk API"],
    before: "Every ticket read cold, routed by hand, answered from scratch.",
    after: "Classified and drafted on arrival. Humans hold the approve seat.",
  },
  {
    key: "spine",
    num: "03",
    title: "Operations Data Spine",
    cat: "Ops",
    status: "scoped",
    summary:
      "One service owns the record. The tools around it read and write through an API instead of through a person and a spreadsheet, and every write leaves an audit trail.",
    mechanics: [
      { n: "01", t: "Field ownership mapped: who writes what, and when" },
      { n: "02", t: "Sync service with reconciliation, retries and audit log" },
      { n: "03", t: "Cutover with monitoring and a runbook handed to your team" },
    ],
    stack: ["Node", "Postgres", "Next.js", "Webhooks", "Vercel"],
    before: "Four tools disagreed until someone spent an afternoon on them.",
    after: "Reconciled continuously; exceptions raised instead of discovered.",
  },
  {
    key: "content",
    num: "04",
    title: "Content Production Line",
    cat: "Marketing",
    status: "scoped",
    summary:
      "A voice spec and a source library feed a scheduled draft pipeline. Nothing publishes without a human sign-off, and distribution is tracked back to replies rather than impressions.",
    mechanics: [
      { n: "01", t: "Voice spec written from your best existing material" },
      { n: "02", t: "Retrieval-backed drafting into a review queue" },
      { n: "03", t: "Scheduling, distribution and reply tracking wired together" },
    ],
    stack: ["Claude API", "Node", "Postgres", "Playwright", "Vercel"],
    before: "Publishing happened whenever someone found a spare hour.",
    after: "A steady queue in your voice, with a sign-off step that takes minutes.",
  },
  {
    key: "intake",
    num: "05",
    title: "Contract Intake & Review",
    cat: "Ops",
    status: "scoped",
    summary:
      "Inbound agreements are parsed into a structured record, checked against your standard positions, and summarised with the exact clauses that deviate, so review starts at the exceptions.",
    mechanics: [
      { n: "01", t: "Clause library and standard positions encoded once" },
      { n: "02", t: "Extraction and deviation check on every inbound document" },
      { n: "03", t: "Reviewer sees a diff, not a PDF, with links to source text" },
    ],
    stack: ["Claude API", "Node", "Postgres", "S3"],
    before: "Every agreement read end to end to find three changed clauses.",
    after: "A deviation list on arrival, sourced to the paragraph it came from.",
  },
  {
    key: "recon",
    num: "06",
    title: "Inventory Reconciliation Agent",
    cat: "Ops",
    status: "scoped",
    summary:
      "Counts from the warehouse, the storefront and the ledger are compared continuously. Where they disagree, the agent proposes the correction and the evidence behind it.",
    mechanics: [
      { n: "01", t: "Nightly ingest from each source of truth" },
      { n: "02", t: "Variance detection with a confidence threshold per SKU class" },
      { n: "03", t: "Proposed corrections queued for a human, with evidence attached" },
    ],
    stack: ["Node", "Postgres", "Claude API", "Airtable"],
    before: "Stock discrepancies surfaced at month end, if at all.",
    after: "Variances surfaced the next morning with a proposed fix.",
  },
  {
    key: "onboard",
    num: "07",
    title: "Onboarding Concierge",
    cat: "Support",
    status: "scoped",
    summary:
      "New accounts are walked through setup by an agent that can read their configuration, answer in context, and open a ticket the moment something needs a human.",
    mechanics: [
      { n: "01", t: "Setup checklist modelled per plan and integration" },
      { n: "02", t: "Agent reads live account state before it answers" },
      { n: "03", t: "Clean hand-off to support with full context attached" },
    ],
    stack: ["Claude API", "Next.js", "Postgres", "Intercom API"],
    before: "Onboarding calls booked for questions the docs already answered.",
    after: "Self-serve setup, with humans pulled in only where it matters.",
  },
];

/* ---------------------------------------------------------------------- */
/* Featured case — the Lead Intelligence Agent. This one is real.          */
/* Figures match components/home/ProofSection.tsx; change both together.   */
/* ---------------------------------------------------------------------- */

export const FEATURED = {
  slug: "lead-intelligence-agent",
  title: "Lead Intelligence Agent",
  version: "shipped · v1.4",
  deploys: "internal + client deploys",
  processId: "lead-intelligence-agent",
  runLine: "run #2,417 · 312 accounts scored · 41s",
  whatItDoes:
    "Pulls accounts from Apollo, enriches them against firmographic and hiring signals, scores fit with a Claude-driven rubric tuned per ICP, writes a first-touch email in the founder's own voice, and pushes the sequence to Lemlist with replies synced back to HubSpot. One operator reviews; nothing sends unreviewed.",
  stack: [
    "Claude API",
    "Next.js",
    "Node",
    "Postgres",
    "Apollo",
    "Lemlist",
    "HubSpot",
    "Vercel",
  ],
  replyRate: "11.4%",
} as const;

/**
 * Example rows from a scoring run. The prospect companies are illustrative,
 * not real accounts — same four names used in the design reference.
 */
export type ScoredAccount = {
  name: string;
  signal: string;
  score: number;
  stage: "SENT" | "QUEUED" | "DRAFT" | "SKIP";
  /** How the score bar and stage read — hot rows use the accent. */
  tone: "hot" | "warm" | "cold";
};

export const SCORED_ACCOUNTS: ScoredAccount[] = [
  {
    name: "Harborline Logistics",
    signal: "hiring 3 ops eng · series B · 140 hc",
    score: 94,
    stage: "SENT",
    tone: "hot",
  },
  {
    name: "Cedarpoint Health",
    signal: "4 CRM tools detected · manual intake",
    score: 88,
    stage: "QUEUED",
    tone: "hot",
  },
  {
    name: "Northgate Supply Co.",
    signal: "new RevOps lead · 60d in seat",
    score: 71,
    stage: "DRAFT",
    tone: "warm",
  },
  {
    name: "Vantage Print Group",
    signal: "no buying signal · below threshold",
    score: 28,
    stage: "SKIP",
    tone: "cold",
  },
];

export const GENERATED_DRAFT = {
  account: "Harborline",
  subject: "subj: your 3 ops eng reqs",
  body: "Saw you're hiring three ops engineers. Half that scope is routing and status chasing. We've automated it before in 9 days. Worth 20 minutes?",
  tags: ["tone: peer", "42 words"],
} as const;

export const SEQUENCE = [
  { step: "01  opener", when: "sent d0", active: true },
  { step: "02  proof link", when: "d3", active: false },
  { step: "03  teardown", when: "d7", active: false },
  { step: "04  close loop", when: "d12", active: false },
] as const;

/* -------------------------------------------------------------------- faq */

/**
 * "03 / FAQ" on /work. Also the source for the FAQPage JSON-LD there —
 * app/work/page.tsx renders both from this one array.
 *
 * The job of this FAQ is different from the ones on /about (positioning and
 * objections) and /build (scope and mechanics): this page is the evidence
 * page, so these answer the questions a sceptical buyer asks about the
 * evidence itself. That includes the uncomfortable one — how much has
 * actually shipped — answered with the real number rather than around it.
 *
 * Read the header comment at the top of this file before editing: exactly
 * one system has shipped, the other six entries in CASES are `scoped`. If
 * that changes, the first answer here changes with the `status` fields and
 * the counts in components/work/SystemLog.tsx.
 */
export const WORK_FAQ: { question: string; answer: string }[] = [
  {
    question: "How many systems has ANTA actually shipped?",
    answer:
      "One is in production: the Lead Intelligence Agent, built for ANTA's own pipeline first and since deployed for client use. The six other entries in the system log are marked scoped, which means the architecture, sequence and stack are worked out but they have not been built for anyone yet. The studio is new and would rather say that than dress up seven case studies it can't stand behind.",
  },
  {
    question: "What does the Lead Intelligence Agent do?",
    answer:
      "It pulls accounts from Apollo, enriches them against firmographic and hiring signals, scores fit with a Claude-driven rubric tuned per ICP, writes a first-touch email in the founder's own voice, and pushes the sequence to Lemlist with replies synced back to HubSpot. One operator reviews before anything goes out; nothing sends unreviewed. It runs on Claude API, Next.js, Node, Postgres and Vercel.",
  },
  {
    question: "What does “scoped” mean in the system log?",
    answer:
      "Scoped means designed but not delivered: the inputs, the sequence of steps, the failure points and the stack are all worked out, and none of it has been built for a paying client. It is an architecture ANTA is ready to build, not a claim about work already done. Anything that has actually shipped is labelled shipped and named.",
  },
  {
    question: "Where does the 11.4% reply rate come from?",
    answer:
      "From ANTA's own outbound, run through the agent across roughly 2,400 runs and a few hundred scored accounts. Treat it as one sender's number against one ICP, not an industry benchmark — the honest teardown of what worked and what broke, including three named failure modes, is in the note on scoring B2B leads with an LLM.",
  },
  {
    question: "Can you build the same system for us?",
    answer:
      "Yes, and it gets rebuilt against your ICP, your data and your CRM rather than cloned. The scoring rubric is the part that has to be yours: a rubric tuned for someone else's buyer is the reason most off-the-shelf lead scores are unusable. The repository ends up in your account like every other build.",
  },
  {
    question: "Can we see it running before we commit?",
    answer:
      "Yes — ask for a walkthrough on the intro call and you'll see the real system score live accounts rather than a recorded demo. That call is also where the first scope gets sketched, so it doubles as the cheapest way to find out whether there's a pilot worth doing.",
  },
];
