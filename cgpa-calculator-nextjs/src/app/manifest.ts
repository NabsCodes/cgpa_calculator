import { MetadataRoute } from "next";

// Central location for manifest.json generation using Next.js API
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CGPA Calculator",
    short_name: "CGPA Calc",
    description: "Calculate your CGPA and plan your academic goals",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
