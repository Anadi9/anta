import "server-only";
import { Resend } from "resend";
import type { GeneratedScope } from "@/lib/scope/schema";
import { SITE } from "@/lib/seo/site";

/**
 * "Send me this scope" — the optional email step (ARCHITECTURE.md §3, step 7).
 *
 * Resend rather than nodemailer: an HTTP API fits a serverless function, where
 * SMTP connection pooling does not (ARCHITECTURE.md §5). Plain text rather than
 * an HTML template — the scope is four short blocks, the brand voice is plain,
 * and a text email lands in the inbox instead of the promotions tab.
 */

const FROM = process.env.RESEND_FROM ?? `ANTA <${SITE.email}>`;
const REPLY_TO = SITE.email;

let client: Resend | null = null;

function getClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  client ??= new Resend(process.env.RESEND_API_KEY);
  return client;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function body(query: string, scope: GeneratedScope): string {
  return [
    "Here's the scope you generated on theanta.com.",
    "",
    `What you described: ${query}`,
    "",
    `The bottleneck: ${scope.issue}`,
    "",
    `Proposed system: ${scope.name}`,
    scope.verdict,
    "",
    "Build sequence:",
    ...scope.steps.map((s) => `  ${s.day}  ${s.text}`),
    "",
    `Stack: ${scope.stack.join(", ")}`,
    "",
    "What you'd need to bring:",
    ...scope.needs.map((n) => `  - ${n}`),
    "",
    "This is an estimate, not a quote. The specifics move once I've seen how",
    "your team actually works. Reply to this email with the two-paragraph",
    "version of the problem and you'll get a real technical response.",
    "",
    "— Anadi, ANTA",
    `theanta.com · ${SITE.bookingLabel}`,
  ].join("\n");
}

/**
 * Never throws: the visitor already has their scope on screen, so a mail
 * failure is a degraded outcome, not a failed request. The result is returned
 * so the route can report it rather than swallow it.
 */
export async function sendScopeEmail(
  to: string,
  query: string,
  scope: GeneratedScope,
): Promise<{ sent: boolean; error?: string }> {
  const resend = getClient();
  if (!resend) return { sent: false, error: "Resend is not configured" };

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: `Your scope: ${scope.name}`,
    text: body(query, scope),
  });

  return error ? { sent: false, error: error.message } : { sent: true };
}
