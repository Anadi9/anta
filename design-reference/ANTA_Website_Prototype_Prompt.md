# Prompt: theanta.com Prototype Build

Copy everything below into Claude (Artifacts / Claude Code) to generate the prototype.

---

## Role

You are a senior product designer and front-end engineer building a marketing site prototype for **ANTA** — an AI development studio. Build a single, fully working, production-quality prototype (React + Tailwind, single file, no external UI kits). This is a design/UX prototype, not a CMS — hardcode the content below.

## Who ANTA is

ANTA (**A**utomating **N**ext **T**ime-less **A**rchitecture) is an AI development studio run by a solo senior engineer (Anadi, MERN/React background, now building AI-native products), operating with access to a partner's Detroit LLC for U.S. market presence. ANTA is not a tooling vendor or an "AI automation agency" doing generic Zapier work — it's a founder-to-founder technical partner that designs and ships custom AI systems: internal tools, lead-gen engines, content pipelines, workflow automation, and full product builds for U.S. growth-stage companies. Proof of work over pitch decks. No client roster yet — this site has to earn trust on craft alone.

Do not mention Adobe Experience Manager (AEM) anywhere.

## What the name should do to the design

"Time-less Architecture" is the design brief, not just the tagline. The site should feel like it was engineered to last, not trend-chased. Translate that into:
- Structural, engineered layouts — visible grid logic, not decorative whitespace
- A sense of systems and permanence: modular components, exposed "architecture" motifs (blueprint lines, node/connection graphics, monospace annotations) used sparingly as a technical signature, not gimmick
- "Automating Next" = motion and momentum — subtle kinetic type, scroll-triggered reveals, live/animated elements (e.g., a terminal-style typing sequence, an animated pipeline diagram) that signal the site itself is a piece of software, not a template

## Tone & visual direction

Bold, dark, technical, confident — closer to a well-funded AI infra startup (Vercel, Linear, Anthropic, Modal) than a typical dev-agency template. Specifically:
- **Theme:** dark-mode-first (near-black base, off-white text), one sharp accent color (electric/signal color — pick one: acid green, electric blue, or amber — used surgically for CTAs and highlights)
- **Type:** a bold geometric sans for headlines paired with a monospace face for labels, nav, code-style annotations, and stats (e.g., JetBrains Mono / Space Mono pairing)
- **Layout:** asymmetric, grid-visible, generous negative space, oversized headline type, no centered-everything corporate layout
- **Motion:** scroll-triggered fades/slides, hover states with intent (magnetic buttons, code-line reveals), the hero's signature interaction is the AI Solution Engineer panel itself (see spec below) rather than a passive animation
- **Texture:** subtle grid-line background, faint scanline/noise texture, thin 1px borders instead of heavy shadows or rounded-everything cards
- Avoid: gradients-as-crutch, stock-photo people, generic rocket/lightbulb iconography, SaaS-pastel palettes, anything that reads "template"

## Information architecture (single-page prototype, scroll-driven)

1. **Nav** — fixed, minimal: logo mark "ANTA", 3–4 anchor links, one CTA ("Start a conversation" / "Book a call")
2. **Hero** — bold headline built around the "automating next, time-less architecture" idea (write 2-3 headline options), one-line positioning, interactive "AI Solution Engineer" panel (see standalone spec below, replaces the earlier animated-element idea), single primary CTA
3. **Proof of work** — feature the ANTA Lead Intelligence Agent (B2B lead scoring + cold email generation + outreach sequencing dashboard) as a real, shipped artifact — screenshots/mock UI panel, not a stock image, with a short "what it does / stack used" callout
4. **What we build** — 3-4 service pillars: custom AI application development, workflow automation & system integration, fragmented stack consolidation, lead-gen & content tooling. Each with a sharp one-liner, not marketing fluff
5. **How we work / approach** — the engineering philosophy: lean, shippable, founder-to-founder, no bloated discovery phases. Consider a numbered "process as architecture" visual (01 → 04)
6. **Stack / credibility strip** — logos or monospace list of the real stack (Claude API, React/Next.js, Node, Vercel, Apollo, HubSpot, Lemlist) framed as "what we build with," not a badge wall
7. **Founder note** — short, direct paragraph in first person from Anadi: senior engineer background, why ANTA exists, why AI-native now. No stock "our story" copy
8. **CTA / contact** — direct, low-friction: email or short form, one confident closing line (no "let's connect!" energy)
9. **Footer** — minimal, monospace, U.S. presence line (Detroit) handled subtly, no clutter

## Copywriting rules

Write all copy — do not leave placeholder lorem ipsum. Voice: direct, technical, confident, zero fluff, no exclamation points, no "revolutionize/unlock/supercharge" AI-marketing clichés. Every headline should sound like an engineer wrote it, not a growth marketer.

## Hero element spec: "AI Solution Engineer" panel

Replace the passive animated hero graphic with a real interactive tool. This is the site's proof point — it should feel like the visitor is getting a genuine engineering read on their problem, not a chatbot toy.

- **Input:** a short list of common pain-point prompts as clickable chips (e.g., "Our lead pipeline is manual," "Our stack doesn't talk to itself," "We need a custom internal tool," "Content production doesn't scale") plus a free-text field for the visitor to type their own problem in one line.
- **On submit:** a brief "analyzing" state (monospace status lines incrementing, terminal-style — e.g., `> scoping constraints...`, `> mapping stack...`, `> pricing complexity...`) lasting 1-2 seconds, then reveal a structured output panel styled like an engineering diagnostic, with these fields:
  - **Issue identified** — one sharp sentence naming the real underlying problem, not the surface complaint
  - **Recommended fix** — the direct, lean solution ANTA would build
  - **Alternative approach** — a lower-cost or faster-scoped alternative, showing range of thinking rather than one-size pitch
  - **Timeline** — a realistic range (e.g., "2-4 weeks to first working version")
  - **Budget** — framed as negotiable/scoped, not a fixed number (e.g., "Scoped to complexity — negotiable based on stack and timeline")
- **Output CTA:** below the panel, a low-friction next step ("Get this scoped for real →") linking to the contact section — this is the lead-gen hook.
- **Data handling for the prototype:** hardcode 4-5 realistic issue/fix/alternative/timeline/budget sets, one per pain-point chip, and a reasonable generic fallback for free-text input (pattern-match on keywords or just show the fallback set) — no real API call needed for the prototype.
- **Visual treatment:** styled as a bordered panel/terminal window (not a chat bubble UI) — thin 1px border, monospace labels, the accent color used only for the field labels or a blinking cursor, consistent with the rest of the technical aesthetic. It should read as "diagnostic tool," not "AI chatbot."

## Build requirements

- Single-file React component, default export, no required props
- Tailwind core utility classes only
- Fully responsive (mobile-first breakpoints)
- Real scroll/hover interactions implemented in the code (CSS transitions/animations or React state), not just described
- Accessible: semantic HTML, sufficient contrast on the dark theme, focus states
- No external image dependencies — build visual interest with CSS/SVG/gradients/typography, not `<img>` placeholders
- Include inline comments marking each section for easy handoff

## Deliverable

Output the full working component code, then a short design-rationale note (5-6 lines max) explaining the key visual decisions and how they tie back to "Automating Next Time-less Architecture."
