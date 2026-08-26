import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { PostBanner } from "@/components/blog/PostBanner";
import { ArticleRail } from "@/components/blog/ArticleRail";
import { ContactSection } from "@/components/home/ContactSection";
import { bannerFor } from "@/lib/blog/banners";
import { assertBody, bodyFor } from "@/lib/blog/bodies";
import { formatPostDate, getPost, publishedPosts } from "@/lib/blog/posts";
import { getToc } from "@/lib/blog/toc";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { SITE } from "@/lib/seo/site";

/**
 * The single article route. Every post's chrome — nav, header, JSON-LD,
 * canonical, contact CTA, footer — is written once here; the MDX files under
 * content/blog/ carry prose only. See the note in next.config.ts for why the
 * posts aren't MDX *pages* routed by file convention.
 *
 * Fully static: generateStaticParams enumerates the published slugs, and
 * dynamicParams = false means an unknown or draft slug 404s at the edge
 * instead of attempting a render.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  // assertBody throws synchronously on a registry entry with no MDX file,
  // and this runs at build time — so that mismatch fails `next build` rather
  // than shipping a route that 500s on first request.
  return publishedPosts().map((post) => {
    assertBody(post.slug);
    return { slug: post.slug };
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    keywords: post.tags,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${SITE.url}/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [SITE.founder],
    },
  };
}

export default async function BlogPost({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const Body = await bodyFor(post.slug);
  const banner = bannerFor(post.slug);
  const toc = getToc(post.slug);
  const others = publishedPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: post.title,
          description: post.description,
          url: `${SITE.url}/blog/${post.slug}`,
          datePublished: post.date,
          query: post.query,
          keywords: post.tags,
          wordCountMinutes: post.minutes,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "Briefs", url: `${SITE.url}/blog` },
          { name: post.title, url: `${SITE.url}/blog/${post.slug}` },
        ])}
      />

      <Nav />
      <main>
        <article>
          {/* Header band, on the same bg-deep ground as the page heroes. */}
          <header className="relative overflow-hidden border-b border-line-2 bg-bg-deep">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(90deg,rgba(245,244,241,0.055)_0_1px,transparent_1px_104px)] [mask-image:linear-gradient(to_bottom,#000,transparent_82%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-[38%] left-[4%] h-[42vw] w-[42vw] opacity-[0.12] [background:radial-gradient(circle,var(--color-accent-deep)_0%,transparent_62%)]"
            />

            <div className="relative mx-auto max-w-[1280px] px-[clamp(18px,4vw,56px)] pb-[clamp(34px,4.5vw,56px)] pt-[calc(64px+clamp(44px,6vw,80px))]">
              <nav
                aria-label="Breadcrumb"
                className="mb-[clamp(24px,3.4vw,38px)] flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-t-dim"
              >
                <Link
                  href="/"
                  className="transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Home
                </Link>
                <span aria-hidden className="text-t9">
                  /
                </span>
                <Link
                  href="/blog"
                  className="transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Briefs
                </Link>
              </nav>

              <h1 className="max-w-[20ch] text-balance text-[clamp(31px,5.4vw,64px)] font-bold leading-[1.02] tracking-[-0.035em] text-ink-max">
                {post.title}
              </h1>
              <p className="mt-[clamp(18px,2.2vw,26px)] max-w-[58ch] text-pretty text-[clamp(15px,1.5vw,18.5px)] leading-[1.65] text-t7">
                {post.dek}
              </p>

              <div className="mt-[clamp(24px,3vw,36px)] flex flex-wrap items-center gap-x-5 gap-y-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-t-dimmer">
                <span className="text-t-bright">{SITE.founder}</span>
                <span aria-hidden className="text-t9">
                  /
                </span>
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                <span aria-hidden className="text-t9">
                  /
                </span>
                <span>{post.minutes} min read</span>
              </div>
            </div>

            {/* Art band between the title block and the question strip, so
                the strip stays adjacent to the prose it introduces. A post
                with no composition registered renders the header exactly as
                it did before banners existed — see bannerFor(). */}
            {banner ? <PostBanner banner={banner} slug={post.slug} /> : null}

            {/* The question this post answers, stated on the page rather than
                only in JSON-LD — see the note in components/blog/PostList. */}
            <div className="relative border-t border-line-2">
              <div className="mx-auto max-w-[1280px] px-[clamp(18px,4vw,56px)] py-4">
                <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-t-dimmer">
                  <span className="text-accent-ink">Answers</span>
                  <span className="text-t-bright normal-case tracking-[0.06em]">
                    &ldquo;{post.query}&rdquo;
                  </span>
                </p>
              </div>
            </div>
          </header>

          {/* Prose plus the sticky rail. The prose column holds its ~68ch
              measure and the rail takes the space that measure leaves over,
              rather than the article sitting in a 1280px shell with 580px of
              empty column beside it. Single column below lg, where there is
              no leftover space to reclaim. */}
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-x-[clamp(32px,4vw,64px)] px-[clamp(18px,4vw,56px)] py-[clamp(40px,6vw,80px)] lg:grid-cols-[minmax(0,74ch)_minmax(210px,1fr)]">
            <div className="min-w-0">
              <Body />
            </div>
            <ArticleRail toc={toc} tags={post.tags} />
          </div>
        </article>

        {others.length > 0 ? (
          <section
            aria-labelledby="more-heading"
            className="border-t border-line-2"
          >
            <div className="mx-auto max-w-[1280px] px-[clamp(18px,4vw,56px)] py-[clamp(40px,5vw,72px)]">
              <h2
                id="more-heading"
                className="mb-[clamp(22px,3vw,34px)] font-mono text-[11px] uppercase tracking-[0.18em] text-t-dim"
              >
                More briefs
              </h2>
              <ul className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[clamp(18px,2.4vw,32px)]">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/blog/${other.slug}`}
                      className="group flex h-full flex-col gap-2.5 border border-line-2 bg-surface/40 p-[clamp(16px,2vw,22px)] transition-colors hover:border-line hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-t-dimmer">
                        {formatPostDate(other.date)}
                      </span>
                      <span className="text-balance text-[16.5px] font-semibold leading-[1.3] text-ink transition-colors group-hover:text-accent-ink">
                        {other.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <ContactSection label={"02 / Contact"} />
      </main>
      <Footer
        onThisPage={[
          { href: "/blog", label: "All briefs" },
          { href: "#contact", label: "Contact" },
          { href: "/#scope", label: "Scope it live" },
        ]}
      />
    </>
  );
}
