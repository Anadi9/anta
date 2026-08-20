import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og";

export const alt = "ANTA work — the Lead Intelligence Agent, in production.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: "Work · case study",
    headline: "The Lead Intelligence Agent, in production.",
    footer: "theanta.com/work",
  });
}
