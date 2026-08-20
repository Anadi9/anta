/**
 * About / Studio page content — from design-reference/ANTA About.dc.html,
 * with the "01 / The adoption curve" section taken from option 5a ("Market
 * ledger") in design-reference/ANTA About Options.dc.html.
 *
 * Why 5a over the base file's four-column stage cards: the options export is
 * the later exploration, its turn 5 is explicitly "in the site's voice — spec
 * sheet, readout panel, diagnostic grid (no charts)", and 5a reuses the spec-
 * row table already built for the homepage toolkits section. Its copy is also
 * tighter than the base file's. The other two candidates were passed over —
 * 5b is a terminal readout panel, and /work already carries the site's one
 * terminal (components/work/SystemLog.tsx); 5c splits into a two-column
 * diagnostic grid that collapses badly on the stage list's row copy.
 *
 * All copy below is verbatim from the references.
 */

import type { Card } from "@/lib/build/workflows";

export type Stage = {
  num: string;
  name: string;
  body: string;
  /** Right-hand status column: past stages read `closed`, stage 04 `ahead`. */
  status: string;
  current?: boolean;
};

/** "01 / The adoption curve" — the market ledger rows (option 5a). */
export const STAGES: Stage[] = [
  {
    num: "01",
    name: "Denial",
    body: "“It's a toy.” Pilots die in committee; nobody's job changes.",
    status: "closed",
  },
  {
    num: "02",
    name: "Experiment",
    body: "Demos, not systems. Impressive in the room, absent from the P&L.",
    status: "closed",
  },
  {
    num: "03",
    name: "Adoption",
    body: "Competitors ship AI-native workflows to production. Their cost per unit of output falls. Yours doesn't.",
    status: "now",
    current: true,
  },
  {
    num: "04",
    name: "Lock-in",
    body: "The gap stops being a project and starts being an acquisition price.",
    status: "ahead",
  },
];

/** "02 / How we help" — rendered through components/CardGrid.tsx. */
export const HOW_WE_HELP: Card[] = [
  {
    num: "01",
    title: "Custom AI software",
    body: "Purpose-built tools and applications, not a wrapper on an off-the-shelf model.",
  },
  {
    num: "02",
    title: "Workflow redesign",
    body: "We map how work actually moves through your team, then rebuild the slow parts around AI.",
  },
  {
    num: "03",
    title: "Automation",
    body: "The repetitive, mechanical work your team already agrees shouldn't be manual.",
  },
  {
    num: "04",
    title: "Team enablement",
    body: "Your people learn the systems as we build them, so you're not dependent on us to run them.",
  },
];

/** "03 / Why ANTA" — one process, five steps, no handoffs. */
export const PROCESS: Card[] = [
  {
    num: "01",
    title: "Design",
    body: "Scope the real bottleneck, not the requested feature.",
  },
  {
    num: "02",
    title: "Architect",
    body: "A system that still stands after the tooling under it changes twice.",
  },
  {
    num: "03",
    title: "Build",
    body: "The same team that scoped it writes it. No handoff, no drift.",
  },
  {
    num: "04",
    title: "Ship",
    body: "First deploy in weeks. Yours from the first commit.",
  },
  {
    num: "05",
    title: "Automate",
    body: "Every deploy feeds the next one. The system keeps compounding after we leave.",
  },
];

/**
 * "04 / FAQ". Also the source for the FAQPage JSON-LD on /about — the page
 * renders both from this one array so the schema can never drift from what's
 * actually on screen (BUILD_PLAN Phase 3).
 */
export const FAQ: { question: string; answer: string }[] = [
  {
    question: "We're not big enough to need this yet.",
    answer:
      "Size isn't the trigger — repetition is. If work is repeating manually somewhere in your team, it's already worth automating. Waiting for scale just means automating a bigger mess later.",
  },
  {
    question: "How is this different from hiring an agency?",
    answer:
      "No account manager translating your problem into a statement of work. You talk directly to the people building it, scope moves in days, and the repository is yours from day one.",
  },
  {
    question: "What if we're locked into legacy tools?",
    answer:
      "We build around your existing stack, not against it. Most engagements start by wiring AI into tools you already use — the legacy layer is the constraint, not the blocker.",
  },
  {
    question: "Will our team actually use it?",
    answer:
      "We train your team as we build, not after. Nobody inherits a system they don't understand.",
  },
  {
    question: "How fast can we actually start?",
    answer:
      "Scope is written in days. First deploy typically lands in weeks, not quarters.",
  },
];
