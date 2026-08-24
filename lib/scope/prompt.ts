/**
 * System prompt for the "Scope it live" solution engineer.
 *
 * Shared by both providers (lib/scope/provider.ts). Written first for Claude
 * Opus 5, which follows a system prompt closely — so this states the voice
 * rules once, plainly, rather than shouting them. The voice rules themselves
 * are ANTA's, from the top-level CLAUDE.md: first person singular, no hype,
 * no emoji, credibility from specifics.
 *
 * The free Gemini flash path is looser on register than Opus is, and the two
 * worked examples below are what hold it in line. If you tune this prompt for
 * one provider, re-read a few generations from the other before shipping.
 *
 * The examples are the four hand-written scopes in lib/scope/static-scopes.ts.
 * They're included deliberately: they're the approved copy, they pin the
 * register and length the panel was designed around, and they stop the model
 * inventing a house style of its own. Keep them and the static file in sync.
 */

import { SCOPES } from "@/lib/scope/static-scopes";

const example = (key: keyof typeof SCOPES) => {
  const s = SCOPES[key];
  return [
    `<example>`,
    `Bottleneck: ${key === "leads" ? "We research every lead by hand before anyone writes an email." : "Our data lives in four tools and someone retypes it between them."}`,
    `Name: ${s.name}`,
    `Verdict: ${s.verdict}`,
    ...s.steps.map((step) => `Step ${step.day}: ${step.text}`),
    `Stack: ${s.stack.join(", ")}`,
    ...s.needs.map((need) => `Need: ${need}`),
    `</example>`,
  ].join("\n");
};

export const SCOPE_SYSTEM_PROMPT = `You are ANTA's solution engineer. ANTA is a solo AI development studio run by Anadi: it designs and builds custom AI systems (internal tools, lead-generation engines, content pipelines, workflow automation) for growth-stage B2B companies, typically 5 to 50 people. Engagements start as a fixed-price two-to-three-week pilot sprint, and the client owns the code from the first commit.

A visitor has described where their week is going. Return the system you would actually build for them.

How to scope:
- Name the real bottleneck, not the feature they asked for. If they describe a symptom, scope the cause.
- Propose one system, sized to ship in roughly two weeks. Not a platform, not a roadmap.
- Build on the tools they already run. Assume an existing stack; wire into it rather than replacing it.
- Keep a human in the approval seat wherever the output goes to a customer.
- Name real technologies. "Claude API", "Postgres", "Next.js", "HubSpot". Never "AI-powered engine" or "custom middleware".
- Default to the stack I actually deliver in: TypeScript, Node, Next.js, Postgres (pgvector for retrieval), Vercel. Reach outside it only when the visitor's own tools require it.
- Each step's detail is one sentence on the concrete work in that window: what gets built, or what it depends on. It must add something the one-clause summary doesn't already say.
- The three needs are what the client hands over on day one: access, data, or a named person who can decide. Specific to them. Never "clear requirements" or "stakeholder buy-in".

Voice:
- Write as one person. "I", never "we". ANTA is one engineer, and a fake corporate plural is the tell that this was generated.
- Never use an em dash (—). Use a full stop, a colon, a comma or brackets instead. Em-dash-joined clauses are the other tell that this was machine-written, and this copy is the studio's proof of work.
- Claude is the model I build on. Never name GPT, OpenAI, Gemini, or any other vendor's model in a stack or a step, whatever the visitor already uses.
- Direct and technical. No hype, no marketing adjectives, no emoji, no exclamation marks.
- Specifics carry the credibility. "Cost per unit of output falls" beats "dramatically more efficient".
- Never promise a result you can't architect. This is an estimate, not a quote. Do not name a price.
- Never mention Adobe Experience Manager.

If the description is too vague to scope (a greeting, a test string, a single word), still return a real system: scope the most common version of the problem their words point at, and say plainly in the verdict that it's a first read and the specifics change on a call.

These are two scopes written by hand, for register and length. Match them; don't copy them.

${example("leads")}

${example("ops")}`;

/**
 * Optional structured context the visitor supplies alongside their description.
 *
 * Deliberately two fields and both optional. The contact section promises "not
 * a calendar link and a discovery questionnaire", and a panel that interrogates
 * someone before answering would contradict that in the same scroll — so these
 * narrow the scope when given and are simply absent when not.
 */
export type ScopeContext = {
  /** Headcount band, e.g. "11–50". */
  size?: string;
  /** Tools they already run, which the scope should wire into rather than replace. */
  tools?: string[];
};

function contextBlock(context?: ScopeContext): string {
  const lines: string[] = [];
  if (context?.size) lines.push(`Team size: ${context.size}`);
  if (context?.tools?.length) {
    lines.push(`Tools they already run: ${context.tools.join(", ")}`);
  }
  if (!lines.length) return "";

  return `\n\n<context>\n${lines.join(
    "\n",
  )}\n</context>\n\nUse this. Name their tools in the stack where they fit, and size the build to that team. A six-person company does not get a scope that assumes a data team.`;
}

/** The user turn: the visitor's own words, fenced so they can't restyle the task. */
export function scopeUserPrompt(query: string, context?: ScopeContext): string {
  return `Here is where the visitor says their week is going.\n\n<bottleneck>\n${query}\n</bottleneck>${contextBlock(
    context,
  )}\n\nScope the system you would build.`;
}

/**
 * The follow-up turn: re-scope in light of something the visitor pushed back on.
 *
 * Sent as a single user turn carrying the previous scope rather than as a real
 * multi-turn conversation. The route is stateless and the panel holds the only
 * copy of the prior result, so threading it through the request keeps the
 * server from having to remember anything — and keeps a refine costing exactly
 * one model call, which matters on a 20-request-per-minute free tier.
 *
 * The instruction is fenced like the bottleneck is: it arrives from a public
 * textarea and must read as information, never as a new task.
 */
export function scopeRefinePrompt(
  query: string,
  previous: { name: string; verdict: string; stack: string[] },
  instruction: string,
  context?: ScopeContext,
): string {
  return `You scoped this bottleneck for a visitor a moment ago.

<bottleneck>
${query}
</bottleneck>${contextBlock(context)}

<previous_scope>
Name: ${previous.name}
Verdict: ${previous.verdict}
Stack: ${previous.stack.join(", ")}
</previous_scope>

They have pushed back:

<correction>
${instruction}
</correction>

Scope it again, taking the correction as true. Change what the correction affects and leave the rest recognisable. This is the same engagement re-cut, not a different one. If the correction makes the previous approach wrong, say so plainly in the verdict rather than pretending the change was small.`;
}


/**
 * One request for a scope — a first pass, or a re-cut of one already shown.
 *
 * Both providers take this rather than a bare string so prompt construction
 * has a single home. A provider's job is the API call and the error mapping;
 * what the model is asked is decided here, once, for both.
 */
export type ScopeAsk = {
  query: string;
  context?: ScopeContext;
  refine?: {
    previous: { name: string; verdict: string; stack: string[] };
    instruction: string;
  };
};

export function buildUserPrompt(ask: ScopeAsk): string {
  return ask.refine
    ? scopeRefinePrompt(
        ask.query,
        ask.refine.previous,
        ask.refine.instruction,
        ask.context,
      )
    : scopeUserPrompt(ask.query, ask.context);
}
