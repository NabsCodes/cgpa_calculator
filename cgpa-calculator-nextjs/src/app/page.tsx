"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Award,
  Calculator,
  Target,
  ChevronRight,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Import modular components
import Footer from "@/components/footer";
import GPAGoalPlanner from "@/components/gpa-goal-planner";
import CGPACalculator from "@/components/cgpa-calculator/cgpa-calculator-main";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("cgpaCalculator");
  const [cgpaState, setCgpaState] = useState<{
    currentCGPA: number | string;
    creditsEarned: number | string;
  }>({
    currentCGPA: "",
    creditsEarned: "",
  });
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);

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
    <div className="relative min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-40 h-80 w-80 rounded-full bg-blue-50/50 blur-3xl dark:bg-blue-950/30"></div>
        <div className="absolute -left-20 top-1/3 h-60 w-60 rounded-full bg-indigo-50/50 blur-3xl dark:bg-indigo-950/30"></div>
        <div className="absolute bottom-20 right-10 h-40 w-40 rounded-full bg-cyan-50/50 blur-3xl dark:bg-cyan-950/30"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
        {/* Simple, elegant header without sticky behavior */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-8 flex flex-col border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="ml-2 bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              CGPA Calculator
            </h1>
            <div className="ml-5 hidden border-l border-slate-200 pl-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400 sm:block">
              Academic performance tracker
            </div>
          </div>

          <div className="mt-3 flex gap-2 sm:mt-0">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-700/30">
              <Award className="mr-1 h-3 w-3" />
              4.0 Scale
            </span>
            <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-700/10 dark:bg-slate-800/30 dark:text-slate-300 dark:ring-slate-700/30">
              <BarChart3 className="mr-1 h-3 w-3" />
              GPA Tracker
            </span>
          </div>
        </motion.header>

        {/* Page content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 md:text-base">
              Track your academic progress with precision. Calculate your
              current GPA, set goals, and plan your academic journey.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="mb-8"
          >
            <TabsList className="mx-auto flex w-full max-w-md border-b border-slate-200 bg-transparent dark:border-slate-700">
              <TabsTrigger
                value="cgpaCalculator"
                className="flex-1 border-b-2 border-transparent bg-transparent px-3 py-2 text-sm data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:border-blue-500 dark:data-[state=active]:text-blue-400"
              >
                <span className="flex items-center justify-center">
                  <Calculator className="mr-1.5 h-4 w-4" />
                  <span className="font-medium sm:inline">Calculator</span>
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="gpaGoalPlanner"
                className="flex-1 border-b-2 border-transparent bg-transparent px-3 py-2 text-sm data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:border-blue-500 dark:data-[state=active]:text-blue-400"
              >
                <span className="flex items-center justify-center">
                  <Target className="mr-1.5 h-4 w-4" />
                  <span className="font-medium sm:inline">Goal Planner</span>
                </span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <TabsContent value="cgpaCalculator" className="mt-0">
                    <CGPACalculator onCGPAChange={handleCGPAChange} />
                  </TabsContent>

                  <TabsContent value="gpaGoalPlanner" className="mt-0">
                    <GPAGoalPlanner
                      currentCGPA={cgpaState.currentCGPA}
                      creditsEarned={cgpaState.creditsEarned}
                      onSwitchCalculator={switchToCalculatorTab}
                    />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>

          <Footer />
        </motion.div>
      </div>
      <Toaster />
    </div>
  );
}
