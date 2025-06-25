"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Award,
  Calculator,
  Target,
  LightbulbIcon,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useTheme } from "next-themes";
import { HiSun, HiMoon } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

// Import modular components
import Footer from "@/components/footer";
import GPAGoalPlanner from "@/components/gpa-goal/gpa-goal-planner";
import CGPACalculator from "@/components/cgpa-calculator/cgpa-calculator-main";
import WhatIfSimulator from "@/components/what-if-simulator/what-if-simulator";
import PWAStatus from "@/components/pwa-status";
import InstallPrompt from "@/components/install-prompt";
import OnboardingDialog, { HelpButton } from "@/components/onboarding-dialog";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("cgpaCalculator");
  const [cgpaState, setCgpaState] = useState<{
    currentCGPA: number | string;
    creditsEarned: number | string;
  }>({
    currentCGPA: "",
    creditsEarned: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { toast } = useToast();
  const [_, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ensure theme toggle only appears after component has mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handler for tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Handler for switching to calculator tab
  const switchToCalculatorTab = () => {
    setActiveTab("cgpaCalculator");
  };

  // Handler to receive CGPA updates from the calculator
  const handleCGPAChange = (
    currentCGPA: number | string,
    creditsEarned: number | string,
  ) => {
    // Only update state if values have actually changed
    if (
      cgpaState.currentCGPA !== currentCGPA ||
      cgpaState.creditsEarned !== creditsEarned
    ) {
      setCgpaState({ currentCGPA, creditsEarned });
    }
  };

  return (
    <>
      {/* Simple, elegant header without sticky behavior */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800 md:px-6"
      >
        <div className="flex items-center">
          <GraduationCap
            className="h-6 w-6 text-blue-600 dark:text-blue-400"
            aria-hidden="true"
          />
          <h1 className="ml-2 bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-xl font-bold tracking-tight text-transparent">
            CGPA Calculator
          </h1>
          <div className="ml-5 hidden border-l border-slate-200 pl-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400 sm:block">
            Academic performance tracker
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-700/30">
            <Award className="mr-1 h-3 w-3" aria-hidden="true" />
            <span>4.0 Scale</span>
          </span>
          <HelpButton />
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                  aria-label="Theme selector"
                >
                  {theme === "system" && (
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
                  )}
                  {theme === "light" && <HiSun className="h-4 w-4" />}
                  {theme === "dark" && <HiMoon className="h-4 w-4" />}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
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
          )}
        </div>
      </motion.header>

      <main className="relative min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
        {/* Background decorative elements */}
        <div
          className="absolute inset-0 -z-10 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -right-20 -top-40 h-80 w-80 rounded-full bg-blue-50/50 blur-3xl dark:bg-blue-950/30"></div>
          <div className="absolute -left-20 top-1/3 h-60 w-60 rounded-full bg-indigo-50/50 blur-3xl dark:bg-indigo-950/30"></div>
          <div className="absolute bottom-20 right-10 h-40 w-40 rounded-full bg-cyan-50/50 blur-3xl dark:bg-cyan-950/30"></div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pt-6 md:px-6">
          {/* Page content */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10"
          >
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="pb-8"
            >
              <TabsList
                className="mx-auto flex w-full max-w-md border-b border-slate-200 bg-transparent dark:border-slate-700"
                role="tablist"
                aria-label="CGPA Calculator Tabs"
              >
                <TabsTrigger
                  value="cgpaCalculator"
                  className="flex-1 border-b-2 border-transparent bg-transparent px-3 py-2 text-sm data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:border-blue-500 dark:data-[state=active]:text-blue-400"
                  role="tab"
                  aria-selected={activeTab === "cgpaCalculator"}
                  aria-controls="cgpaCalculator-tab"
                >
                  <span className="flex items-center justify-center">
                    <Calculator className="mr-1.5 h-4 w-4" aria-hidden="true" />
                    <span className="font-medium sm:inline">Calculator</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="goalPlanner"
                  className="flex-1 border-b-2 border-transparent bg-transparent px-3 py-2 text-sm data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:border-blue-500 dark:data-[state=active]:text-blue-400"
                  role="tab"
                  aria-selected={activeTab === "goalPlanner"}
                  aria-controls="goalPlanner-tab"
                >
                  <span className="flex items-center justify-center">
                    <Target className="mr-2 h-4 w-4" />
                    Goal Planner
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="whatIfSimulator"
                  className="flex-1 border-b-2 border-transparent bg-transparent px-3 py-2 text-sm data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:border-blue-500 dark:data-[state=active]:text-blue-400"
                  role="tab"
                  aria-selected={activeTab === "whatIfSimulator"}
                  aria-controls="whatIfSimulator-tab"
                >
                  <span className="flex items-center justify-center">
                    <LightbulbIcon
                      className="mr-1.5 h-4 w-4"
                      aria-hidden="true"
                    />
                    <span className="font-medium sm:inline">What If</span>
                  </span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <AnimatePresence mode="wait">
                  {activeTab === "cgpaCalculator" && (
                    <motion.div
                      key="calculator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CGPACalculator
                        onCGPAChange={handleCGPAChange}
                        initialCGPA={cgpaState.currentCGPA}
                        initialCredits={cgpaState.creditsEarned}
                      />
                    </motion.div>
                  )}
                  {activeTab === "goalPlanner" && (
                    <motion.div
                      key="goalPlanner"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <GPAGoalPlanner
                        currentCGPA={cgpaState.currentCGPA}
                        creditsEarned={cgpaState.creditsEarned}
                        onSwitchCalculator={switchToCalculatorTab}
                      />
                    </motion.div>
                  )}
                  {activeTab === "whatIfSimulator" && (
                    <motion.div
                      key="whatIfSimulator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <WhatIfSimulator
                        currentCGPA={cgpaState.currentCGPA}
                        creditsEarned={cgpaState.creditsEarned}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Tabs>
          </motion.section>
        </div>
        <Toaster />
        <PWAStatus />
        <InstallPrompt />
        <OnboardingDialog />
      </main>
      <Footer />
    </>
  );
}
