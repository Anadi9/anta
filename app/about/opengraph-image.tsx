import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og";

export const alt = "ANTA studio — why ANTA exists: the market doesn't wait for you to catch up.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: "Why ANTA exists",
    headline: "The market doesn't wait for you to catch up.",
    footer: "theanta.com/about",
  });
}
