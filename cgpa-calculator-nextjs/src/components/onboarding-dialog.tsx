"use client";

import { useState, useEffect } from "react";
import {
  Calculator,
  Target,
  LightbulbIcon,
  Info,
  X,
  HelpCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Main dialog component
const OnboardingDialog = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("calculator");

  useEffect(() => {
    // Check if this is the first visit
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");

    // Only show dialog if user hasn't seen it before
    if (!hasSeenOnboarding) {
      // Add a small delay so it doesn't appear immediately on page load
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    // Mark as seen in localStorage
    localStorage.setItem("hasSeenOnboarding", "true");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-[460px] overflow-y-auto p-4 sm:max-w-[600px] sm:p-6">
        <DialogHeader className="pb-0">
          <DialogTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 sm:text-xl">
            Welcome to CGPA Calculator
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Learn how to use this app to track your academic progress
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid h-fit w-full grid-cols-3">
            <TabsTrigger
              value="calculator"
              className="px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm"
            >
              <Calculator className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Calculator</span>
              <span className="sm:hidden">Calc</span>
            </TabsTrigger>
            <TabsTrigger
              value="goal"
              className="px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm"
            >
              <Target className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Goal Planner</span>
              <span className="sm:hidden">Goal</span>
            </TabsTrigger>
            <TabsTrigger
              value="whatif"
              className="px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm"
            >
              <LightbulbIcon className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">What If</span>
              <span className="sm:hidden">What If</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="calculator"
            className="mt-3 space-y-3 sm:mt-4 sm:space-y-4"
          >
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50 sm:p-4">
              <h3 className="mb-1 text-sm font-medium text-slate-800 dark:text-slate-200 sm:mb-2 sm:text-base">
                CGPA Calculator Tab
              </h3>
              <ul className="mt-1 space-y-1 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                <li className="flex items-start">
                  <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">•</span>
                  Input your current CGPA and total credits earned
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">•</span>
                  Add courses with their credit hours and grades
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">•</span>
                  Calculate your updated CGPA automatically
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">•</span>
                  Export your results for future reference
                </li>
              </ul>
            </div>
            <div className="relative rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-blue-900/30 dark:bg-blue-900/20 sm:p-4">
              <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                <Info className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
              </div>
              <div className="ml-6 sm:ml-7">
                <p className="text-xs text-blue-700 dark:text-blue-300 sm:text-sm">
                  Start by entering your current CGPA and credits earned. Then
                  add your courses to see how they'll affect your overall CGPA.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="goal"
            className="mt-3 space-y-3 sm:mt-4 sm:space-y-4"
          >
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50 sm:p-4">
              <h3 className="mb-1 text-sm font-medium text-slate-800 dark:text-slate-200 sm:mb-2 sm:text-base">
                Goal Planner Tab
              </h3>
              <ul className="mt-1 space-y-1 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                <li className="flex items-start">
                  <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">•</span>
                  Set a target CGPA you want to achieve
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">•</span>
                  Specify how many more credit hours you plan to take
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">•</span>
                  Calculate the required GPA needed in future courses
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">•</span>
                  See alternative paths to reach your goal
                </li>
              </ul>
            </div>
            <div className="relative rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-blue-900/30 dark:bg-blue-900/20 sm:p-4">
              <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                <Info className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
              </div>
              <div className="ml-6 sm:ml-7">
                <p className="text-xs text-blue-700 dark:text-blue-300 sm:text-sm">
                  The Goal Planner helps you determine what grades you need in
                  future courses to reach your desired CGPA.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="whatif"
            className="mt-3 space-y-3 sm:mt-4 sm:space-y-4"
          >
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50 sm:p-4">
              <h3 className="mb-1 text-sm font-medium text-slate-800 dark:text-slate-200 sm:mb-2 sm:text-base">
                What If Simulator Tab
              </h3>
              <ul className="mt-1 space-y-1 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                <li className="flex items-start">
                  <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">•</span>
                  Set a goal CGPA to aim for
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">•</span>
                  Add hypothetical future courses with different grades
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">•</span>
                  Simulate how these courses would affect your CGPA
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">•</span>
                  Experiment with different scenarios to plan your path
                </li>
              </ul>
            </div>
            <div className="relative rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-blue-900/30 dark:bg-blue-900/20 sm:p-4">
              <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                <Info className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
              </div>
              <div className="ml-6 sm:ml-7">
                <p className="text-xs text-blue-700 dark:text-blue-300 sm:text-sm">
                  The What If Simulator lets you test different scenarios to see
                  how future courses might impact your CGPA before you actually
                  take them.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-row justify-between gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="h-8 flex-1 px-2 py-1 text-xs sm:h-10 sm:flex-initial sm:px-3 sm:py-2 sm:text-sm"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
            Close
          </Button>
          <Button
            onClick={handleClose}
            className="h-8 flex-1 px-2 py-1 text-xs sm:h-10 sm:flex-initial sm:px-3 sm:py-2 sm:text-sm"
          >
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Help button component that can open the dialog
export const HelpButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(true)}
              className="h-8 w-8 rounded-full"
              aria-label="Help"
              tabIndex={0}
            >
              <HelpCircle className="h-5 w-5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">App Help & Guide</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-[460px] overflow-y-auto p-4 sm:max-w-[600px] sm:p-6">
          <DialogHeader className="pb-0">
            <DialogTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 sm:text-xl">
              CGPA Calculator Guide
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Learn how to use this app to track your academic progress
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="calculator">
            <TabsList className="grid h-fit w-full grid-cols-3">
              <TabsTrigger
                value="calculator"
                className="px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm"
              >
                <Calculator className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Calculator</span>
                <span className="sm:hidden">Calc</span>
              </TabsTrigger>
              <TabsTrigger
                value="goal"
                className="px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm"
              >
                <Target className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Goal Planner</span>
                <span className="sm:hidden">Goal</span>
              </TabsTrigger>
              <TabsTrigger
                value="whatif"
                className="px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm"
              >
                <LightbulbIcon className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">What If</span>
                <span className="sm:hidden">What If</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="mt-3 sm:mt-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50 sm:p-4">
                <h3 className="mb-1 text-sm font-medium text-slate-800 dark:text-slate-200 sm:mb-2 sm:text-base">
                  CGPA Calculator Tab
                </h3>
                <ul className="mt-1 space-y-0.5 text-xs text-slate-600 dark:text-slate-400 sm:space-y-1 sm:text-sm">
                  <li className="flex items-start">
                    <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">
                      •
                    </span>
                    Input your current CGPA and total credits earned
                  </li>
                  <li className="flex items-start">
                    <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">
                      •
                    </span>
                    Add courses with their credit hours and grades
                  </li>
                  <li className="flex items-start">
                    <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">
                      •
                    </span>
                    Calculate your updated CGPA automatically
                  </li>
                  <li className="flex items-start">
                    <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">
                      •
                    </span>
                    Export your results for future reference
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="goal" className="mt-3 sm:mt-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50 sm:p-4">
                <h3 className="mb-1 text-sm font-medium text-slate-800 dark:text-slate-200 sm:mb-2 sm:text-base">
                  Goal Planner Tab
                </h3>
                <ul className="mt-1 space-y-0.5 text-xs text-slate-600 dark:text-slate-400 sm:space-y-1 sm:text-sm">
                  <li className="flex items-start">
                    <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">
                      •
                    </span>
                    Set a target CGPA you want to achieve
                  </li>
                  <li className="flex items-start">
                    <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">
                      •
                    </span>
                    Specify how many more credit hours you plan to take
                  </li>
                  <li className="flex items-start">
                    <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">
                      •
                    </span>
                    Calculate the required GPA needed in future courses
                  </li>
                  <li className="flex items-start">
                    <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">
                      •
                    </span>
                    See alternative paths to reach your goal
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="whatif" className="mt-3 sm:mt-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50 sm:p-4">
                <h3 className="mb-1 text-sm font-medium text-slate-800 dark:text-slate-200 sm:mb-2 sm:text-base">
                  What If Simulator Tab
                </h3>
                <ul className="mt-1 space-y-0.5 text-xs text-slate-600 dark:text-slate-400 sm:space-y-1 sm:text-sm">
                  <li className="flex items-start">
                    <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">
                      •
                    </span>
                    Set a goal CGPA to aim for
                  </li>
                  <li className="flex items-start">
                    <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">
                      •
                    </span>
                    Add hypothetical future courses with different grades
                  </li>
                  <li className="flex items-start">
                    <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">
                      •
                    </span>
                    Simulate how these courses would affect your CGPA
                  </li>
                  <li className="flex items-start">
                    <span className="mr-1.5 mt-0.5 text-blue-500 sm:mr-2">
                      •
                    </span>
                    Experiment with different scenarios to plan your path
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              onClick={() => setOpen(false)}
              className="h-8 w-full px-2 py-1 text-xs sm:h-10 sm:w-auto sm:px-4 sm:py-2 sm:text-sm"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OnboardingDialog;
