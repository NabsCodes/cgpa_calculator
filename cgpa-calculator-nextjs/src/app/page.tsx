"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Target, LightbulbIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Layout components
import { AppHeader } from "@/components/layout/app-header";
import Footer from "@/components/layout/footer";

// Feature components
import CGPACalculator from "@/components/features/cgpa-calculator/cgpa-calculator-main";
import GPAGoalPlanner from "@/components/features/gpa-planner/gpa-goal-planner";
import WhatIfSimulator from "@/components/features/what-if-simulator/what-if-simulator";

// Shared components
import PWAStatus from "@/components/shared/pwa-status";
import InstallPrompt from "@/components/shared/install-prompt";
import OnboardingDialog from "@/components/shared/onboarding-dialog";

// Types
import type { AppTab } from "@/types/common";

export default function Home() {
  const [activeTab, setActiveTab] = useState<AppTab>("cgpaCalculator");
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

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handler for tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value as AppTab);
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
      <AppHeader />

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
