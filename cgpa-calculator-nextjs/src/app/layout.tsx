import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { Outfit } from "next/font/google";
import Script from "next/script";

// Initialize the Outfit font with Next.js font system
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "CGPA Calculator | GPA Goal Planner Tool",
  description:
    "Free online CGPA calculator and GPA goal planner with academic honors tracking. Plan your semester grades and achieve your academic goals.",
  keywords: [
    "CGPA calculator",
    "GPA calculator",
    "GPA goal planner",
    "college GPA tracker",
    "university grade calculator",
  ],
  authors: [{ name: "NabsCodes", url: "https://github.com/NabsCodes" }],
  robots: "index, follow",
  category: "Education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={outfit.variable}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
