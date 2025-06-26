"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { HiSun, HiMoon } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { HelpButton } from "@/components/shared/onboarding-dialog";
import KeyboardShortcutsModal from "@/components/shared/keyboard-shortcuts-modal";
import { useIsDesktop } from "@/hooks/use-is-desktop";

export function AppHeader() {
  const isDesktop = useIsDesktop();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render theme-dependent content after mounting to prevent hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  const renderThemeIcon = () => {
    if (!mounted) {
      // Return a default icon while mounting to prevent hydration mismatch
      return (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.07l-.71.71m16.97-16.97l-.71.71M4.05 4.93l-.71-.71M21 12h1M3 12H2"
          />
        </svg>
      );
    }

    if (theme === "system") {
      return (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.07l-.71.71m16.97-16.97l-.71.71M4.05 4.93l-.71-.71M21 12h1M3 12H2"
          />
        </svg>
      );
    }
    if (theme === "light") {
      return <HiSun className="h-4 w-4" />;
    }
    if (theme === "dark") {
      return <HiMoon className="h-4 w-4" />;
    }

    // Fallback to system icon
    return (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.07l-.71.71m16.97-16.97l-.71.71M4.05 4.93l-.71-.71M21 12h1M3 12H2"
        />
      </svg>
    );
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <div className="flex flex-col">
            <span className="font-bold">CGPA Calculator</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-700/30">
            <Award className="mr-1 h-3 w-3" aria-hidden="true" />
            <span>4.0 Scale</span>
          </span>

          {isDesktop && <KeyboardShortcutsModal />}
          <HelpButton />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Theme selector"
              >
                {renderThemeIcon()}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={mounted ? theme : "system"}
                onValueChange={setTheme}
              >
                <DropdownMenuRadioItem value="system">
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.07l-.71.71m16.97-16.97l-.71.71M4.05 4.93l-.71-.71M21 12h1M3 12H2"
                      />
                    </svg>
                    System
                  </span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="light">
                  <span className="flex items-center gap-2">
                    <HiSun className="h-4 w-4" /> Light
                  </span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <span className="flex items-center gap-2">
                    <HiMoon className="h-4 w-4" /> Dark
                  </span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
