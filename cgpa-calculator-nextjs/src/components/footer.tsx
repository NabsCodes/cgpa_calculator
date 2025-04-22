"use client";

import React from "react";
import Link from "next/link";
import { SiGithub } from "react-icons/si";
import { HiMail, HiArrowUp } from "react-icons/hi";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative z-10 border-t border-slate-200 bg-white py-6 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-center">
          {/* Left side - copyright */}
          <div className="text-center text-sm sm:text-left">
            © {currentYear} Developed by{" "}
            <Link
              href="https://nabeelhassan.dev"
              className="text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hassan Umar Hassan
            </Link>
            . All rights reserved.
          </div>

          {/* Right side - links & theme toggle */}
          <div className="flex flex-wrap items-center justify-center gap-4 py-2 sm:justify-end sm:py-0">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="https://github.com/NabsCodes/cgpa-calculator"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 sm:h-8 sm:w-8"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View source code on GitHub"
                  >
                    <SiGithub className="h-4 w-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>View on GitHub</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="mailto:hassanhauda@gmail.com"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 sm:h-8 sm:w-8"
                    aria-label="Contact via email"
                  >
                    <HiMail className="h-4 w-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Contact</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={scrollToTop}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 sm:h-8 sm:w-8"
                    aria-label="Scroll to top"
                  >
                    <HiArrowUp className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Top</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
