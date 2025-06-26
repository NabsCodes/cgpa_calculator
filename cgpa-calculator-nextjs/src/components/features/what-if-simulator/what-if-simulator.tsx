"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  LightbulbIcon,
  Info,
  AlertCircle,
  GraduationCap,
  Calculator,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ScenarioSimulator from "./scenario-simulator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface WhatIfSimulatorProps {
  currentCGPA: number | string;
  creditsEarned: number | string;
}

const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  currentCGPA,
  creditsEarned,
}) => {
  const [simulationResult, setSimulationResult] = useState<{
    achievable: boolean;
    projectedCGPA: number;
    isExactMatch: boolean;
    totalCredits: number;
  } | null>(null);

  // Parse current CGPA to number for comparisons
  const currentCGPANum = parseFloat(currentCGPA.toString());

  // Allow users to set their goal CGPA
  const [goalCGPA, setGoalCGPA] = useState<string>(
    currentCGPANum > 0 ? Math.max(currentCGPANum, 3.5).toFixed(2) : "3.5",
  );

  // Track if goal is below, equal to current CGPA, or max possible
  const [isGoalBelowCurrent, setIsGoalBelowCurrent] = useState<boolean>(false);
  const [isGoalEqualCurrent, setIsGoalEqualCurrent] = useState<boolean>(false);
  const [isMaxGoal, setIsMaxGoal] = useState<boolean>(false);

  // Update goal CGPA when current CGPA changes, but only on initial load
  useEffect(() => {
    // Only set initial value, don't override user's input after that
    if (currentCGPANum > 0) {
      const parsedGoal = parseFloat(goalCGPA);
      if (!isNaN(parsedGoal)) {
        // Check if goal is max CGPA (4.0)
        const isMax = Math.abs(parsedGoal - 4.0) < 0.001;
        setIsMaxGoal(isMax);

        // Check if goal is equal to current CGPA (within a small epsilon for floating point comparison)
        const isEqual = Math.abs(parsedGoal - currentCGPANum) < 0.001;
        setIsGoalEqualCurrent(isEqual);

        // Check if goal is below current and update the warning flag
        setIsGoalBelowCurrent(parsedGoal < currentCGPANum && !isEqual);
      }
    }
  }, [currentCGPA, currentCGPANum, goalCGPA]);

  // Check if we have the required data
  const hasRequiredData = () => {
    return (
      currentCGPA !== undefined &&
      currentCGPA !== "" &&
      creditsEarned !== undefined &&
      creditsEarned !== ""
    );
  };

  // Check if goal CGPA is valid
  const isGoalCGPAValid = () => {
    return goalCGPA !== "" && !isNaN(parseFloat(goalCGPA));
  };

  // Format helper function for consistent display
  const formatCGPA = (value: string | number): string => {
    const parsedValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(parsedValue)) return "0.00";
    return parsedValue.toFixed(2);
  };

  // Update CGPA input to always show 2 decimal places when losing focus
  const handleGoalBlur = () => {
    if (goalCGPA !== "" && !isNaN(parseFloat(goalCGPA))) {
      setGoalCGPA(formatCGPA(goalCGPA));
    }
  };

  // Handle goal CGPA change
  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Regex to allow only numbers with up to 2 decimal places between 0 and 4
    const regex = /^(([0-3](\.\d{0,2})?)|4(\.0{0,2})?)$/;

    // Allow empty string or values that match our pattern
    if (value === "" || regex.test(value)) {
      setGoalCGPA(value);

      // Check if goal is max, equal to, or below current CGPA
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue)) {
        // Round to 2 decimal places for consistency
        const roundedValue = Math.round(parsedValue * 100) / 100;

        // Check if goal is max (4.0)
        const isMax = Math.abs(roundedValue - 4.0) < 0.001;
        setIsMaxGoal(isMax);

        // Check for equality (within a small epsilon for floating point comparison)
        const isEqual = Math.abs(roundedValue - currentCGPANum) < 0.001;
        setIsGoalEqualCurrent(isEqual);

        // Check if below (but not equal)
        setIsGoalBelowCurrent(roundedValue < currentCGPANum && !isEqual);
      } else {
        // Reset flags if input is invalid
        setIsMaxGoal(false);
        setIsGoalEqualCurrent(false);
        setIsGoalBelowCurrent(false);
      }
    }
  };

  // Get the appropriate notification based on goal and current CGPA
  return (
    <div className="space-y-5">
      <Card className="overflow-hidden border-slate-200 shadow-md dark:border-slate-700">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-4 dark:from-indigo-900/20 dark:to-purple-900/20 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-indigo-500/10 p-2 dark:bg-indigo-500/20">
              <LightbulbIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 sm:text-xl">
                "What If" Simulator
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Explore how future courses affect your CGPA
              </p>
            </div>
          </div>
        </div>

        <CardContent className="px-4 py-5 sm:px-6">
          {!hasRequiredData() ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-md bg-amber-50 p-4 dark:bg-amber-900/20">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                      Missing Information
                    </h3>
                    <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                      <p>
                        Please enter your current CGPA and credits earned in the
                        Calculator tab before using the What If Simulator.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-5">
              {/* Main content layout restructured for better UX */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
                {/* Left column: Input and status area */}
                <div className="md:col-span-4">
                  <div className="space-y-4">
                    {/* Current CGPA and credits info card */}
                    <div className="rounded-md bg-slate-50 p-4 dark:bg-slate-800/50">
                      <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                        Your Current Status
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-blue-500" />
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Current CGPA
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {currentCGPANum.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calculator className="h-4 w-4 text-blue-500" />
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Credits Earned
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {creditsEarned}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Goal CGPA input and status */}
                    <div className="rounded-md bg-slate-50 p-4 dark:bg-slate-800/50">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="goalCGPA" className="text-xs">
                              Goal CGPA
                            </Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3.5 w-3.5 cursor-help text-slate-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs text-center">
                                    Set your target CGPA to see if your plan can
                                    help you achieve it
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          {currentCGPANum > 0 && (
                            <Badge
                              variant="outline"
                              className="h-5 bg-slate-50 px-1.5 py-0 text-[10px] font-normal dark:bg-slate-800/50"
                            >
                              {currentCGPANum < 3.5 ? (
                                <>Suggested: 3.5</>
                              ) : (
                                <>
                                  Based on current: {currentCGPANum.toFixed(2)}
                                </>
                              )}
                            </Badge>
                          )}
                        </div>

                        <Input
                          id="goalCGPA"
                          type="number"
                          min="0"
                          max="4"
                          step="0.01"
                          value={goalCGPA}
                          onChange={handleGoalChange}
                          onBlur={handleGoalBlur}
                          className={`h-9 ${
                            isGoalBelowCurrent ||
                            isGoalEqualCurrent ||
                            !isGoalCGPAValid() ||
                            isMaxGoal
                              ? "border-amber-500 focus-visible:ring-amber-500"
                              : ""
                          }`}
                        />

                        {/* Goal status message - integrated directly below input */}
                        {isGoalCGPAValid() && (
                          <div
                            className={`mt-2 rounded-md px-3 py-2 text-xs ${
                              isGoalEqualCurrent
                                ? "bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                                : isGoalBelowCurrent
                                  ? "bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                                  : isMaxGoal && currentCGPANum < 4.0
                                    ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                                    : "hidden"
                            }`}
                          >
                            <div className="flex items-start gap-1.5">
                              {isGoalEqualCurrent || isGoalBelowCurrent ? (
                                <Check className="mt-0.5 h-3 w-3 flex-shrink-0" />
                              ) : (
                                <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
                              )}
                              <p>
                                {isGoalEqualCurrent
                                  ? "You've already achieved this goal!"
                                  : isGoalBelowCurrent
                                    ? "Your current CGPA already exceeds this goal!"
                                    : isMaxGoal && currentCGPANum < 4.0
                                      ? "Achieving a perfect 4.0 CGPA requires all A's."
                                      : ""}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side - Result panel on desktop */}
                    {simulationResult && isGoalCGPAValid() && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hidden md:block"
                      >
                        <div className="mt-1 rounded-md border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                                  isMaxGoal && !simulationResult.achievable
                                    ? "bg-amber-100 text-amber-600 dark:bg-amber-800/30 dark:text-amber-400"
                                    : isGoalEqualCurrent ||
                                        isGoalBelowCurrent ||
                                        simulationResult.isExactMatch ||
                                        simulationResult.achievable
                                      ? "bg-green-100 text-green-600 dark:bg-green-800/30 dark:text-green-400"
                                      : "bg-amber-100 text-amber-600 dark:bg-amber-800/30 dark:text-amber-400"
                                }`}
                              >
                                {isMaxGoal && !simulationResult.achievable ? (
                                  <AlertTriangle className="h-4 w-4" />
                                ) : isGoalEqualCurrent ||
                                  isGoalBelowCurrent ||
                                  simulationResult.isExactMatch ||
                                  simulationResult.achievable ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4" />
                                )}
                              </div>
                              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {isMaxGoal && !simulationResult.achievable
                                  ? "Perfect 4.0 Not Achievable"
                                  : isGoalEqualCurrent
                                    ? "Goal Already Met"
                                    : isGoalBelowCurrent
                                      ? "Goal Already Exceeded"
                                      : simulationResult.isExactMatch
                                        ? "Goal Exactly Met"
                                        : simulationResult.achievable
                                          ? "Goal Achievable"
                                          : "Goal Not Yet Achievable"}
                              </h3>
                            </div>
                          </div>

                          {/* CGPA Details Grid */}
                          <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                            <div className="flex flex-col rounded-md border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800">
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                Current
                              </span>
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {currentCGPANum.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex flex-col rounded-md border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800">
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                Goal
                              </span>
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {formatCGPA(goalCGPA)}
                              </span>
                            </div>
                            <div className="flex flex-col rounded-md border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800">
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                Credits
                              </span>
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {simulationResult.totalCredits || 0}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              Projected CGPA:
                            </span>
                            <span className="font-medium">
                              {simulationResult.projectedCGPA.toFixed(2)}
                              {simulationResult.projectedCGPA !==
                                currentCGPANum && (
                                <span
                                  className={`ml-1 ${simulationResult.projectedCGPA > currentCGPANum ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}
                                >
                                  {simulationResult.projectedCGPA >
                                  currentCGPANum
                                    ? `(+${(simulationResult.projectedCGPA - currentCGPANum).toFixed(2)})`
                                    : `(${(simulationResult.projectedCGPA - currentCGPANum).toFixed(2)})`}
                                </span>
                              )}
                            </span>
                          </div>

                          {/* Hint text */}
                          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                            {isMaxGoal && !simulationResult.achievable
                              ? "You would need all A's in your remaining courses to reach a 4.0."
                              : isGoalEqualCurrent || isGoalBelowCurrent
                                ? "Your current CGPA already satisfies your goal."
                                : simulationResult.isExactMatch
                                  ? "Your plan will result in a CGPA that exactly matches your goal."
                                  : simulationResult.achievable
                                    ? "Your plan will exceed your goal CGPA requirement."
                                    : "Try adding more courses or improving grades to reach your goal."}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Right column: Simulation area - make content scrollable */}
                <div className="md:col-span-8">
                  {/* Simulator */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="md:scrollbar-thin md:scrollbar-thumb-slate-200 md:scrollbar-track-transparent dark:md:scrollbar-thumb-slate-700 pr-1 md:max-h-[70vh] md:overflow-y-auto"
                  >
                    {isGoalCGPAValid() ? (
                      <ScenarioSimulator
                        currentCGPA={currentCGPANum}
                        creditsEarned={
                          parseFloat(creditsEarned.toString()) || 0
                        }
                        goalCGPA={parseFloat(goalCGPA) || currentCGPANum}
                        onSimulationResult={(
                          achievable,
                          projectedCGPA,
                          isExactMatch,
                          totalCredits,
                        ) => {
                          // Only update if values actually changed to avoid loops
                          if (
                            !simulationResult ||
                            simulationResult.achievable !== achievable ||
                            simulationResult.projectedCGPA !== projectedCGPA ||
                            simulationResult.isExactMatch !== isExactMatch ||
                            simulationResult.totalCredits !== totalCredits
                          ) {
                            setSimulationResult({
                              achievable,
                              projectedCGPA: isNaN(projectedCGPA)
                                ? currentCGPANum
                                : projectedCGPA,
                              isExactMatch,
                              totalCredits,
                            });
                          }
                        }}
                      />
                    ) : (
                      <Alert
                        variant="destructive"
                        className="border-red-200 bg-red-50 text-red-800 dark:border-red-800/30 dark:bg-red-900/20 dark:text-red-300"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Please enter a valid goal CGPA to use the simulator.
                        </AlertDescription>
                      </Alert>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatIfSimulator;
