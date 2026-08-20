import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import Link from "next/link";
import { slugifyHeading } from "@/lib/blog/toc";

/**
 * Global MDX element mapping — required by @next/mdx with the App Router
 * (the build fails without this file, even empty).
 *
 * This is the entire "prose stylesheet" for /blog. It's done as an element
 * map rather than a Tailwind typography plugin on purpose: the site already
 * carries a full token scale in app/globals.css (t1–t9, line, accent-ink,
 * the warm mono greys), and @tailwindcss/typography would arrive with its
 * own opinionated ramp that would then need overriding token by token.
 * Mapping ~12 elements by hand is less code than fighting that, and it keeps
 * blog prose visually identical to the hand-built page sections.
 *
 * Measure is capped at 68ch on the body copy rather than on a wrapper, so
 * full-bleed children (code blocks, tables) can break the measure while the
 * paragraphs hold it.
 *
 * Note the signature: in this version of Next, `useMDXComponents` takes no
 * arguments — it does not receive and merge a caller-supplied map.
 */

/**
 * Flatten a heading's children back to plain text so it can be slugified.
 * Headings here are plain strings today; this handles the nested case rather
 * than silently producing an empty id if one ever contains inline markup.
 */
function toText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return toText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

const components: MDXComponents = {
  // The id is derived with the same function the TOC uses (lib/blog/toc.ts),
  // not a local copy — if the two ever computed slugs differently the rail's
  // links would quietly scroll nowhere. scroll-mt clears the fixed 64px nav.
  h2: ({ children, ...props }) => (
    <h2
      id={slugifyHeading(toText(children))}
      className="mt-[clamp(48px,6vw,76px)] max-w-[24ch] scroll-mt-[88px] text-balance text-[clamp(24px,3vw,34px)] font-bold leading-[1.15] tracking-[-0.03em] text-ink-max"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="mt-[clamp(32px,4vw,46px)] max-w-[34ch] text-balance text-[clamp(17px,1.9vw,21px)] font-semibold leading-[1.3] tracking-[-0.01em] text-ink"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      className="mt-[clamp(26px,3vw,34px)] font-mono text-[11px] uppercase tracking-[0.16em] text-t-dim"
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p
      className="mt-[1.15em] max-w-[68ch] text-pretty text-[clamp(15.5px,1.5vw,17.5px)] leading-[1.75] text-t2"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul
      className="mt-[1.15em] flex max-w-[68ch] list-none flex-col gap-2.5 pl-0"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="mt-[1.15em] flex max-w-[68ch] list-decimal flex-col gap-2.5 pl-[1.4em] marker:font-mono marker:text-[13px] marker:text-accent-ink"
      {...props}
    >
      {children}
    </ol>
  ),
  // The bullet is a square accent mark rather than a disc, matching the
  // indicator squares used across the built pages. `before:` only lands on
  // the <ul> children; the <ol> above keeps real numeric markers.
  li: ({ children, ...props }) => (
    <li
      className="relative text-[clamp(15px,1.45vw,17px)] leading-[1.7] text-t2 [ul>&]:pl-[1.4em] [ul>&]:before:absolute [ul>&]:before:left-0 [ul>&]:before:top-[0.72em] [ul>&]:before:h-[5px] [ul>&]:before:w-[5px] [ul>&]:before:bg-accent [ul>&]:before:content-['']"
      {...props}
    >
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-ink" {...props}>
      {children}
    </strong>
  ),
  // Internal links go through next/link so /blog → /work navigation is
  // client-side; external ones get the usual rel guard.
  a: ({ children, href = "", ...props }) => {
    const internal = href.startsWith("/") || href.startsWith("#");
    const className =
      "text-accent-ink underline decoration-accent/40 underline-offset-[3px] transition-colors hover:text-accent-hot hover:decoration-accent-hot focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
    return internal ? (
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    ) : (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  },
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mt-[1.6em] max-w-[62ch] border-l-2 border-accent bg-surface/60 py-3 pl-[clamp(16px,2vw,24px)] pr-4 text-[clamp(15px,1.5vw,17px)] italic leading-[1.7] text-t1"
      {...props}
    >
      {children}
    </blockquote>
  ),
  // Inline code. Fenced blocks arrive as <pre><code>, and the <pre> below
  // owns their styling — so this stays visually light or nested code would
  // get chip styling inside an already-panelled block.
  code: ({ children, ...props }) => (
    <code
      className="rounded-[3px] bg-surface-2 px-[0.4em] py-[0.15em] font-mono text-[0.88em] text-t-bright [pre_&]:bg-transparent [pre_&]:p-0 [pre_&]:text-inherit"
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ children, ...props }) => (
    <pre
      className="mt-[1.5em] overflow-x-auto border border-line bg-[#0b0c0e] p-[clamp(14px,2vw,20px)] font-mono text-[13px] leading-[1.65] text-t1"
      {...props}
    >
      {children}
    </pre>
  ),
  hr: (props) => <hr className="mt-[clamp(40px,5vw,64px)] border-line-2" {...props} />,
  // Tables can exceed the 68ch measure, so the scroll container is the
  // wrapper, not the page — the body must never scroll horizontally.
  table: ({ children, ...props }) => (
    <div className="mt-[1.6em] overflow-x-auto border border-line">
      <table className="w-full border-collapse text-left text-[14px]" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th
      className="border-b border-line bg-surface px-4 py-2.5 font-mono text-[10.5px] font-normal uppercase tracking-[0.14em] text-t-dim"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className="border-b border-line-2 px-4 py-2.5 align-top leading-[1.6] text-t2"
      {...props}
    >
      {children}
    </td>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
