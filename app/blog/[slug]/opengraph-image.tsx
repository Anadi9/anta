import { getPost, publishedPosts } from "@/lib/blog/posts";
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * Per-post OG card. Needs its own generateStaticParams: an image route in a
 * dynamic segment doesn't inherit the page's, so without this the cards would
 * be rendered on demand rather than at build.
 */
export function generateStaticParams() {
  return publishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return [
    {
      id: "post",
      size: OG_SIZE,
      contentType: OG_CONTENT_TYPE,
      alt: getPost(slug)?.title ?? "ANTA notes",
    },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  return ogImage({
    eyebrow: "Notes",
    headline: post?.title ?? "Notes from inside the build.",
    footer: `theanta.com/blog/${slug}`,
  });
}
