import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.fullName,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    lang: "es-PE",
    categories: ["shopping"],
    icons: [
      {
        src: "/brand/isk-logo-on-black.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/brand/isk-logo.jpg",
        sizes: "985x1000",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}
