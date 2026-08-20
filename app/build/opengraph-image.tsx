import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og";

export const alt = "ANTA build — what we build, and how it actually runs.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: "What we build",
    headline: "What we build — and how it actually runs.",
    footer: "theanta.com/build",
  });
}
