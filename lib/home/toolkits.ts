/**
 * "Industry toolkits" content — copy taken verbatim from
 * design-reference/ANTA Site.dc.html. Kept out of the component so the
 * section file stays layout-only.
 */

export type Toolkit = {
  key: string;
  num: string;
  label: string;
  tag: string;
  title: string;
  body: string;
  /** Tools the client already runs and keeps. */
  existing: string[];
  /** What ANTA adds on top. */
  layer: string[];
  changes: { k: string; v: string }[];
  window: string;
};

export const TOOLKITS: Toolkit[] = [
  {
    key: "sales",
    num: "01",
    label: "Sales & RevOps",
    tag: "Sales & RevOps · lead intelligence",
    title: "Research, scoring and first touch, running unattended.",
    body: "Your CRM stays the system of record. A pipeline in front of it sources, enriches and scores accounts, then drafts the first touch in your voice, queued for one operator to approve.",
    existing: ["HubSpot", "Apollo", "Lemlist"],
    layer: ["Claude API", "ICP scoring model", "Enrichment pipeline"],
    changes: [
      { k: "Before", v: "A rep builds the list, reads the site, writes the note, logs the activity." },
      { k: "After", v: "A scored, drafted queue is waiting each morning. Nothing sends unreviewed." },
    ],
    window: "typical build window · 10–14 days",
  },
  {
    key: "support",
    num: "02",
    label: "Customer Support",
    tag: "Support · triage & response",
    title: "Every ticket arrives classified, routed and drafted.",
    body: "Retrieval runs over your own resolution history, so drafts sound like your best agent on their best day. Agents move from authoring to approving, and escalation rules stay yours.",
    existing: ["Zendesk", "Intercom", "pgvector"],
    layer: ["Claude API", "Retrieval + evals", "Escalation rules"],
    changes: [
      { k: "Before", v: "Every ticket read cold, routed by hand, answered from scratch." },
      { k: "After", v: "Classified on arrival with a draft attached. Humans hold the approve seat." },
    ],
    window: "typical build window · 10–14 days",
  },
  {
    key: "marketing",
    num: "03",
    label: "Marketing & Content",
    tag: "Marketing · production line",
    title: "A publishing line measured on replies, not impressions.",
    body: "A voice spec and a source library feed a draft pipeline on a schedule. Everything lands in a review queue before it goes anywhere, and distribution is tracked back to pipeline.",
    existing: ["Webflow", "Buffer", "Playwright"],
    layer: ["Claude API", "Voice-tuned drafting", "Review queue"],
    changes: [
      { k: "Before", v: "Publishing depends on whoever has an hour that week." },
      { k: "After", v: "A steady queue in your voice, with a human sign-off step." },
    ],
    window: "typical build window · 9–14 days",
  },
  {
    key: "ops",
    num: "04",
    label: "Ops & Finance",
    tag: "Ops · data spine",
    title: "One service owns the record. Tools read and write through it.",
    body: "Instead of a person reconciling four tools in a spreadsheet, a sync service owns each field, logs every write, and surfaces the exceptions that actually need a human.",
    existing: ["QuickBooks", "Airtable", "Postgres"],
    layer: ["Claude API", "Reconciliation agents", "Audit trail"],
    changes: [
      { k: "Before", v: "Numbers agree only after someone spends an afternoon on them." },
      { k: "After", v: "Reconciled continuously, with exceptions raised instead of discovered." },
    ],
    window: "typical build window · 11–16 days",
  },
];
