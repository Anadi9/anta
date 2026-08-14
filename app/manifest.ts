import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.title,
    short_name: SITE.name,
    description: SITE.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0508",
    theme_color: "#0a0508",
    // anta-mark.png is the source design asset (not sized as a proper
    // icon set yet) — replace with real 192/512 PNGs + favicon.ico /
    // apple-touch-icon before launch. See BUILD_PLAN.md.
    icons: [{ src: "/anta-mark.png", sizes: "512x512", type: "image/png" }],
  };
}
