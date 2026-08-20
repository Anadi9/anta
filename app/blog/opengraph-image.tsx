import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og";

export const alt = "ANTA notes: what things cost, what breaks, what to ask.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: "Notes",
    headline: "Notes from inside the build.",
    footer: "theanta.com/blog",
  });
}
