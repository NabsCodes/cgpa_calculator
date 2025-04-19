import { Metadata } from "next";

// Base metadata - single source of truth
const BASE_URL = "https://cgpa-calculator-v2.vercel.app";
const APP_NAME = "CGPA Calculator";
const BASE_TITLE = "CGPA Calculator | GPA Goal Planner Tool";
const BASE_DESCRIPTION =
  "Free online CGPA calculator and GPA goal planner with academic honors tracking. Plan your semester grades and achieve your academic goals.";

// Keywords for the application
const KEYWORDS = [
  "CGPA calculator",
  "GPA calculator",
  "GPA goal planner",
  "college GPA tracker",
  "university grade calculator",
  "academic honors calculator",
  "semester GPA planner",
  "academic performance tool",
  "grade point average calculator",
  "cumulative GPA tracker",
];

// Shared metadata configuration that can be imported in layout.tsx
export const sharedMetadata: Metadata = {
  title: BASE_TITLE,
  description: BASE_DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: "NabsCodes", url: "https://github.com/NabsCodes" }],
  creator: "NabsCodes",
  publisher: "NabsCodes",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Education",
  applicationName: APP_NAME,
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    title: `${APP_NAME} | Free GPA Goal Planner & Academic Tracker`,
    description: BASE_DESCRIPTION,
    siteName: APP_NAME,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: `${APP_NAME} Preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} | GPA Goal Planner`,
    description:
      "Calculate your GPA, plan your academic goals, and track your progress with our free CGPA calculator tool.",
    images: ["/opengraph-image.png"],
    creator: "@nabeelhassan_",
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-US": BASE_URL,
    },
  },
};

// Generate structured data for the app
export const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: APP_NAME,
  description: BASE_DESCRIPTION,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "CGPA calculation",
    "GPA goal planning",
    "Academic honors tracking",
    "Semester planning",
    "Credit hour tracking",
  ],
};

// Helper function to generate page-specific metadata
export function generatePageMetadata(
  title: string,
  description: string = BASE_DESCRIPTION,
): Metadata {
  return {
    title: `${title} | ${APP_NAME}`,
    description,
    openGraph: {
      title: `${title} | ${APP_NAME}`,
      description,
    },
    twitter: {
      title: `${title} | ${APP_NAME}`,
      description,
    },
  };
}
