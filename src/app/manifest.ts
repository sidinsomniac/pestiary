import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Pestiary — AI Pest Identification",
    short_name: "Pestiary",
    description:
      "Apex Pest Solutions operator console. Pick an inquiry, identify the pest, get a treatment recommendation and a ready-to-send reply.",
    start_url: "/",
    scope: "/",
    lang: "en",
    dir: "ltr",
    display: "standalone",
    orientation: "portrait",
    background_color: "#eef3ee",
    theme_color: "#1f9d57",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["business", "utilities"],
  };
}
