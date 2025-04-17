"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SiGithub } from "react-icons/si";
import { HiMoon, HiSun, HiGlobeAlt, HiMail, HiArrowUp } from "react-icons/hi";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { theme, setTheme } = useTheme();
  // Use state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  // Only show theme toggle after component has mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <footer className="mt-12 border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-6xl py-6">
        <div className="flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          {/* Copyright and attribution */}
          <div className="text-sm text-slate-500 dark:text-slate-400">
            © {currentYear} Developed by{" "}
            <Link
              href="https://nabeelhassan.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Hassan Umar
              <HiGlobeAlt className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Links section */}
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="https://github.com/NabsCodes/cgpa_calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              <SiGithub className="mr-1.5 h-4 w-4" />
              GitHub
            </Link>
            <Link
              href="mailto:hassanhauda@gmail.com"
              className="inline-flex items-center text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              <HiMail className="mr-1.5 h-4 w-4" />
              Contact
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex cursor-pointer items-center text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              <HiArrowUp className="mr-1.5 h-4 w-4" />
              Top
            </button>

            {/* Theme toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="h-8 w-8 rounded-md p-0"
                  >
                    {mounted && (
                      <>
                        {theme === "dark" ? (
                          <HiSun className="h-4 w-4" />
                        ) : (
                          <HiMoon className="h-4 w-4" />
                        )}
                      </>
                    )}
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"}
                  </p>
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
