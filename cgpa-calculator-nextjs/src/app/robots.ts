import { MetadataRoute } from "next";

// Central location for robots.txt generation using Next.js API
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // You can add disallow paths if needed
      // disallow: ['/admin', '/internal'],
    },
    sitemap: "https://cgpa-calculator-v2.vercel.app/sitemap.xml",
    // Add a crawl delay to avoid overloading your server
    host: "https://cgpa-calculator-v2.vercel.app",
  };
}
