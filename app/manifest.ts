import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.title,
    short_name: SITE.name,
    description: SITE.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0c",
    theme_color: "#0b0b0c",
    /*
      Real icon set, generated from public/anta-mark.png onto the
      --color-bg ground (the source mark is a wide transparent lemniscate,
      so it needs the dark square behind it to read as an app icon).

      `any` and `maskable` are separate files by design: Android crops a
      maskable icon to whatever shape the launcher uses, so that one is
      drawn with a wider inset to keep the mark inside the safe zone. The
      <link rel="icon"> / apple-touch-icon tags come from app/icon.png,
      app/apple-icon.png and app/favicon.ico via Next's file convention,
      not from here.
    */
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
