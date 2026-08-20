import Link from "next/link";
import type { TocEntry } from "@/lib/blog/toc";
import { SITE } from "@/lib/seo/site";

/**
 * The sticky right-hand rail on an article.
 *
 * It exists because the prose holds a ~68ch measure for readability, which
 * inside the site's 1280px shell left roughly 580px of dead column on every
 * post. Widening the measure would have been the wrong fix (long lines are
 * harder to read, and the rest of the site is built on this grid), and
 * centring the prose would have been worse: the article's own h1 and
 * breadcrumb sit left-aligned in the header band above, so a centred body
 * would visibly detach from its own heading.
 *
 * So the column gets a job instead. "On this page" is the same idiom the
 * footer already uses, which is why it reads as part of the system rather
 * than as a blog widget bolted on.
 *
 * Hidden below `lg` — at that width the prose already fills the container and
 * a stacked duplicate nav above the article is noise.
 *
 * No "Answers" block here on purpose: the target query is already stated in
 * the band at the foot of the article header, a couple of hundred pixels
 * above this rail's first item. Repeating it that close reads as a rendering
 * bug rather than as emphasis.
 */
export function ArticleRail({
  toc,
  tags,
}: {
  toc: TocEntry[];
  tags: string[];
}) {
  return (
    <aside
      aria-label="Article details"
      className="hidden lg:block"
      // top clears the fixed 64px nav; the rail scrolls with the page until
      // it reaches that offset and then holds.
    >
      <div className="sticky top-[88px] flex flex-col gap-[clamp(24px,3vw,34px)] border-l border-line-2 pl-[clamp(20px,2.2vw,32px)]">
        {toc.length > 0 ? (
          <nav aria-labelledby="toc-heading">
            <h2
              id="toc-heading"
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-t-dimmer"
            >
              On this page
            </h2>
            <ul className="mt-3.5 flex flex-col gap-2.5">
              {toc.map((entry) => (
                <li key={entry.id}>
                  <a
                    href={`#${entry.id}`}
                    className="block text-pretty text-[13.5px] leading-[1.45] text-t4 transition-colors hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {entry.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-t-dimmer">
            Filed under
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="border border-line-2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-t-dim"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        {/* The rail is the one piece of persistent screen real estate on a
            long read, so it carries the conversion path rather than relying
            on the reader making it to the contact section at the bottom. */}
        <div className="border-t border-line-2 pt-[clamp(18px,2vw,26px)]">
          <p className="text-pretty text-[13.5px] leading-[1.55] text-t4">
            Got this problem right now?
          </p>
          <Link
            href="/#scope"
            className="mt-3 inline-block border border-line bg-surface px-3.5 py-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-t-bright transition-colors hover:border-accent hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Scope it live&nbsp;→
          </Link>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-3 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-t-dimmer transition-colors hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Or email me&nbsp;→
          </a>
        </div>
      </div>
    </aside>
  );
}
