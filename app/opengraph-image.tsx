import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og";

export const alt = "ANTA: an AI studio for teams that would rather ship the system than manage another hire.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: "AI dev studio",
    headline: "We design and build the AI systems your team needs.",
  });
}
