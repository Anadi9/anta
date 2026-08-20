import Link from "next/link";
import { formatPostDate, type Post } from "@/lib/blog/posts";

/**
 * The /blog index list. Rows, not cards: these posts are chosen by the
 * question they answer, so the scannable unit is the title plus the query
 * beneath it, and a card grid would spend most of its area on whitespace
 * around four items.
 *
 * The `query` line is shown to the reader, not just emitted in JSON-LD, and
 * that's deliberate on two fronts. A visitor scanning for their own problem
 * matches on the question faster than on a headline; and an answer engine
 * reading the index gets the question/answer pairing in the visible text,
 * not only in a script tag it may or may not weigh.
 */
export function PostList({ posts }: { posts: Post[] }) {
  return (
    <section
      id="index"
      aria-labelledby="index-heading"
      className="scroll-mt-[64px] border-b border-line-2"
    >
      <div className="mx-auto max-w-[1280px] px-[clamp(18px,4vw,56px)] py-[clamp(48px,7vw,96px)]">
        <h2
          id="index-heading"
          className="mb-[clamp(28px,4vw,44px)] font-mono text-[11px] uppercase tracking-[0.18em] text-t-dim"
        >
          01 / Index
        </h2>

        <ul className="flex flex-col border-t border-line-2">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-line-2">
              <Link
                href={`/blog/${post.slug}`}
                className="group grid grid-cols-1 items-baseline gap-x-[clamp(20px,3vw,44px)] gap-y-3 py-[clamp(24px,3vw,34px)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:grid-cols-[1fr_auto]"
              >
                <div className="max-w-[62ch]">
                  <h3 className="text-balance text-[clamp(20px,2.4vw,27px)] font-semibold leading-[1.22] tracking-[-0.02em] text-ink transition-colors group-hover:text-accent-ink">
                    {post.title}
                  </h3>
                  {/* The target query, shown verbatim. */}
                  <p className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-t-dimmer">
                    <span aria-hidden className="text-accent-ink">
                      ?&nbsp;
                    </span>
                    {post.query}
                  </p>
                  <p className="mt-3.5 text-pretty text-[clamp(14.5px,1.4vw,16px)] leading-[1.7] text-t4">
                    {post.description}
                  </p>
                </div>

                <div className="flex shrink-0 flex-row items-center gap-x-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-t-dimmer md:flex-col md:items-end md:gap-y-2">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                  <span aria-hidden className="text-t9 md:hidden">
                    /
                  </span>
                  <span>{post.minutes} min</span>
                  <span
                    aria-hidden
                    className="hidden text-accent-ink opacity-0 transition-opacity group-hover:opacity-100 md:block"
                  >
                    Read&nbsp;→
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
