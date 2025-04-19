import { MetadataRoute } from "next";

// Central location for sitemap.xml generation using Next.js API
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cgpa-calculator-v2.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    // Add more pages as needed
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
  ];
}
