/**
 * Build page content — from design-reference/ANTA Build.dc.html.
 *
 * The five workflows, their nodes and their edges are verbatim from the
 * reference's `flows` array. They are illustrative architectures (what these
 * systems look like when ANTA builds them), not claims about delivered
 * client work — same distinction as lib/work/cases.ts. The stats attached to
 * each flow ("4h → 90s to first reply") come from the reference copy and
 * read as the outcome the design targets; they are shown next to the
 * workflow name in the rail exactly as written there.
 *
 * Geometry note: node coordinates are percentages of a fixed 1400 × 560
 * drawing surface. `edgeGeom` below converts them into orthogonal SVG paths
 * — that routing logic is ported from the reference rather than reinvented,
 * because the lane offsets are what keep the feedback edges (`up` / `down`)
 * from crossing the node cards.
 */

export type NodeKind = "trigger" | "step" | "gate" | "out";

export type FlowNode = {
  id: string;
  /** Column index 0–4. Drives the auto-advancing "live step" highlight. */
  col: number;
  /** Percentage position on the 1400 × 560 surface. */
  x: number;
  y: number;
  kind: NodeKind;
  label: string;
  desc: string;
  tools: string[];
};

export type FlowEdge = {
  from: string;
  to: string;
  label?: string;
  /** Feedback edges route through a lane above (`up`) or below (`down`). */
  route?: "up" | "down";
  /** Step at which the edge lights up. Defaults to the target node's column. */
  activateAt?: number;
};

export type Flow = {
  key: string;
  name: string;
  stat: string;
  trigger: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
};

/** Columns per flow — every flow is drawn across five stages. */
export const FLOW_STEPS = 5;

export const NODE_TAGS: Record<NodeKind, string> = {
  trigger: "Trigger",
  step: "Step",
  gate: "Gate",
  out: "Output",
};

export const FLOWS: Flow[] = [
  {
    key: "lead-routing",
    name: "Inbound lead routing",
    stat: "4h → 90s to first reply",
    trigger: "Trigger · form submit, ad click, or DM",
    nodes: [
      { id: "a", col: 0, x: 10.5, y: 50, kind: "trigger", label: "New enquiry", desc: "Site form, ads, and inbound DMs", tools: ["Next.js", "Webhooks"] },
      { id: "b", col: 1, x: 30, y: 50, kind: "step", label: "Enrich", desc: "Company, headcount, and stack signals", tools: ["Python", "Sheets"] },
      { id: "c", col: 2, x: 50, y: 50, kind: "gate", label: "Qualify", desc: "Claude scores fit against your ICP", tools: ["Claude", "FastAPI"] },
      { id: "d", col: 3, x: 70, y: 19, kind: "out", label: "Founder ping", desc: "WhatsApp alert with a booking link", tools: ["WhatsApp API", "Mail"] },
      { id: "e", col: 3, x: 70, y: 81, kind: "step", label: "Nurture", desc: "Sequenced email, re-scored weekly", tools: ["Mail", "Python"] },
      { id: "f", col: 4, x: 89.5, y: 50, kind: "out", label: "CRM record", desc: "Deduped, attributed, owner assigned", tools: ["MongoDB", "Sheets"] },
    ],
    edges: [
      { from: "a", to: "b" },
      { from: "b", to: "c" },
      { from: "c", to: "d", label: "fit ≥ 70" },
      { from: "c", to: "e", label: "below" },
      { from: "d", to: "f" },
      { from: "e", to: "f" },
    ],
  },
  {
    key: "inbox-triage",
    name: "Inbox triage",
    stat: "68% closed without a human",
    trigger: "Trigger · new ticket in any channel",
    nodes: [
      { id: "a", col: 0, x: 10.5, y: 50, kind: "trigger", label: "New ticket", desc: "Mail, WhatsApp, and the web widget", tools: ["Mail", "WhatsApp API"] },
      { id: "b", col: 1, x: 30, y: 50, kind: "step", label: "Classify", desc: "Intent, urgency, and account tier", tools: ["Claude", "Python"] },
      { id: "c", col: 2, x: 50, y: 50, kind: "gate", label: "Answerable?", desc: "Checked against docs and past threads", tools: ["Supabase", "FastAPI"] },
      { id: "d", col: 3, x: 70, y: 19, kind: "out", label: "Auto-reply", desc: "Drafted, cited, and sent in seconds", tools: ["Claude", "Mail"] },
      { id: "e", col: 3, x: 70, y: 81, kind: "out", label: "Escalate", desc: "Threaded to Slack with full context", tools: ["Slack"] },
      { id: "f", col: 4, x: 89.5, y: 50, kind: "step", label: "Log + learn", desc: "Outcome written back to the index", tools: ["Supabase", "Sheets"] },
    ],
    edges: [
      { from: "a", to: "b" },
      { from: "b", to: "c" },
      { from: "c", to: "d", label: "confident" },
      { from: "c", to: "e", label: "unclear" },
      { from: "d", to: "f" },
      { from: "e", to: "f" },
    ],
  },
  {
    key: "ops-reporting",
    name: "Ops reporting",
    stat: "6 hrs/week back to the team",
    trigger: "Trigger · every weekday, 07:45",
    nodes: [
      { id: "a", col: 0, x: 10.5, y: 19, kind: "trigger", label: "Database pull", desc: "Orders, refunds, and churn", tools: ["MongoDB", "Python"] },
      { id: "b", col: 0, x: 10.5, y: 81, kind: "trigger", label: "Sheets + billing", desc: "Whatever ops still keeps by hand", tools: ["Sheets", "Node"] },
      { id: "c", col: 1, x: 30, y: 50, kind: "step", label: "Normalize", desc: "One schema, deduped and typed", tools: ["FastAPI", "Python"] },
      { id: "d", col: 2, x: 50, y: 50, kind: "step", label: "Summarize", desc: "Claude writes the narrative, not the numbers", tools: ["Claude"] },
      { id: "e", col: 3, x: 70, y: 50, kind: "gate", label: "Variance check", desc: "Anything off pace against target", tools: ["Python"] },
      { id: "f", col: 4, x: 89.5, y: 19, kind: "out", label: "Slack digest", desc: "One post, owners tagged", tools: ["Slack"] },
      { id: "g", col: 4, x: 89.5, y: 81, kind: "out", label: "Owner alert", desc: "Only when something actually broke", tools: ["Slack", "Mail"] },
    ],
    edges: [
      { from: "a", to: "c" },
      { from: "b", to: "c" },
      { from: "c", to: "d" },
      { from: "d", to: "e" },
      { from: "e", to: "f", label: "daily" },
      { from: "e", to: "g", label: "off pace" },
    ],
  },
  {
    key: "content-pipeline",
    name: "Content pipeline",
    stat: "3× output, same editor",
    trigger: "Trigger · brief added to the queue",
    nodes: [
      { id: "a", col: 0, x: 10.5, y: 50, kind: "trigger", label: "Brief intake", desc: "Topic, angle, and audience in one form", tools: ["Next.js", "Sheets"] },
      { id: "b", col: 1, x: 30, y: 50, kind: "step", label: "Draft", desc: "Claude writes against your voice guide", tools: ["Claude"] },
      { id: "c", col: 2, x: 50, y: 50, kind: "gate", label: "Editor review", desc: "One human approves or sends notes", tools: ["Slack"] },
      { id: "d", col: 3, x: 70, y: 19, kind: "out", label: "Publish", desc: "CMS, newsletter, and social variants", tools: ["Node", "Mail"] },
      { id: "e", col: 3, x: 70, y: 81, kind: "step", label: "Revise", desc: "Notes fold back into the next draft", tools: ["Claude", "Python"] },
      { id: "f", col: 4, x: 89.5, y: 50, kind: "out", label: "Track", desc: "Opens, replies, and pipeline touched", tools: ["MongoDB", "Sheets"] },
    ],
    edges: [
      { from: "a", to: "b" },
      { from: "b", to: "c" },
      { from: "c", to: "d", label: "approved" },
      { from: "c", to: "e", label: "changes" },
      { from: "d", to: "f" },
      { from: "e", to: "b", label: "re-draft", route: "down", activateAt: 4 },
    ],
  },
  {
    key: "invoice-chasing",
    name: "Invoice chasing",
    stat: "22 days off average DSO",
    trigger: "Trigger · hourly ledger sync",
    nodes: [
      { id: "a", col: 0, x: 10.5, y: 50, kind: "trigger", label: "Ledger sync", desc: "Invoices and payments, hourly", tools: ["Node", "Sheets"] },
      { id: "b", col: 1, x: 30, y: 50, kind: "step", label: "Aging scan", desc: "Buckets by client and payment terms", tools: ["Python"] },
      { id: "c", col: 2, x: 50, y: 50, kind: "gate", label: "Reminder ladder", desc: "Tone escalates with days overdue", tools: ["Claude"] },
      { id: "d", col: 3, x: 70, y: 19, kind: "step", label: "Nudge", desc: "Polite mail at +3, +7, and +14", tools: ["Mail", "WhatsApp API"] },
      { id: "e", col: 3, x: 70, y: 81, kind: "out", label: "Escalate", desc: "Owner pinged in Slack at +30", tools: ["Slack"] },
      { id: "f", col: 4, x: 89.5, y: 50, kind: "out", label: "Paid: close", desc: "Thread archived, ledger reconciled", tools: ["MongoDB"] },
    ],
    edges: [
      { from: "a", to: "b" },
      { from: "b", to: "c" },
      { from: "c", to: "d", label: "≤ 30 days" },
      { from: "c", to: "e", label: "+30 days" },
      { from: "d", to: "f", label: "paid" },
      { from: "e", to: "f" },
      { from: "d", to: "b", label: "still unpaid", route: "up", activateAt: 4 },
    ],
  },
];

/* ---------------------------------------------------------------- geometry */

/** Drawing surface the node percentages and SVG paths are expressed in. */
export const SURFACE = { w: 1400, h: 560 } as const;

/** Half-width / vertical clearance of a node card in surface units. */
const HALF_W = 105;
const CLEAR_Y = 84;

export type EdgeGeometry = {
  /** Orthogonal connector path. */
  d: string;
  /** Three-point arrowhead at the target end. */
  arrow: string;
  /** Path length, used to drive the stroke-dashoffset draw-on. */
  length: number;
  /** Label anchor, as a percentage of the surface. */
  labelX: number;
  labelY: number;
};

/**
 * Orthogonal routing between two nodes. Forward edges leave the right face
 * of `a`, jog at the horizontal midpoint, and arrive at the left face of
 * `b`. Feedback edges (`route`) drop into a lane at the top or bottom of the
 * surface so they never cross a card. Ported from the reference's
 * `edgeGeom`.
 */
export function edgeGeom(
  a: FlowNode,
  b: FlowNode,
  route?: "up" | "down",
): EdgeGeometry {
  const ux = (v: number) => (v / 100) * SURFACE.w;
  const uy = (v: number) => (v / 100) * SURFACE.h;
  const ax = ux(a.x);
  const ay = uy(a.y);
  const bx = ux(b.x);
  const by = uy(b.y);

  let pts: [number, number][];
  let arrow: string;

  if (route) {
    const lane = route === "down" ? SURFACE.h - 14 : 14;
    const dir = route === "down" ? 1 : -1;
    const aEdge = ay + CLEAR_Y * dir;
    const bEdge = by + CLEAR_Y * dir;
    pts = [
      [ax, aEdge],
      [ax, lane],
      [bx, lane],
      [bx, bEdge],
    ];
    arrow = `M ${bx - 6} ${bEdge + 10 * dir} L ${bx} ${bEdge} L ${bx + 6} ${bEdge + 10 * dir}`;
  } else {
    const x1 = ax + HALF_W;
    const x2 = bx - HALF_W;
    const mid = (x1 + x2) / 2;
    pts = [
      [x1, ay],
      [mid, ay],
      [mid, by],
      [x2, by],
    ];
    arrow = `M ${x2 - 10} ${by - 6} L ${x2} ${by} L ${x2 - 10} ${by + 6}`;
  }

  let length = 0;
  for (let i = 1; i < pts.length; i++) {
    length += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }

  return {
    d: `M ${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")}`,
    arrow,
    length: Math.round(length),
    labelX: (((pts[1][0] + pts[2][0]) / 2) / SURFACE.w) * 100,
    labelY:
      (route ? pts[1][1] : (pts[0][1] + pts[3][1]) / 2) / SURFACE.h * 100,
  };
}

/* ------------------------------------------------------- static page copy */

export type Card = { num: string; title: string; body: string };

/**
 * "01 / What we build". Note: BUILD_PLAN Phase 4 lists the fourth category
 * as "team enablement"; the approved design reference says "Lead-gen &
 * content tooling", which is also what the top-level strategy doc treats as
 * a core service. The reference wins — copy is verbatim from it.
 */
export const SYSTEMS: Card[] = [
  {
    num: "01",
    title: "Custom AI applications",
    body: "Product-grade systems with a model at the core: retrieval, evals, guardrails, UI. Not a chatbot bolted onto a CRUD app.",
  },
  {
    num: "02",
    title: "Workflow automation",
    body: "Your tools already hold the data. We make them act on it with API-level integrations, not brittle no-code chains someone has to babysit.",
  },
  {
    num: "03",
    title: "Stack consolidation",
    body: "Seven subscriptions doing one job, joined by spreadsheets. We replace the seams with one system you own outright.",
  },
  {
    num: "04",
    title: "Lead-gen & content tooling",
    body: "Pipelines that source, score, write, and send. Measured on replies and pipeline, never on impressions.",
  },
];

/** "03 / Process" — process as architecture. */
export const PROCESS: Card[] = [
  {
    num: "01",
    title: "Map the system",
    body: "Every input, owner, and failure point documented before a line of code exists.",
  },
  {
    num: "02",
    title: "Design the seams",
    body: "Where systems connect matters more than what's inside them. We design those joints first.",
  },
  {
    num: "03",
    title: "Build load-bearing pieces",
    body: "Nothing ships that can't take real traffic on day one. No throwaway prototypes disguised as product.",
  },
];
