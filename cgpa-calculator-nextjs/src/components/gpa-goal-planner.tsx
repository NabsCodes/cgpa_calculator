"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, ArrowRight, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

// Import custom hook
import { useGPAGoal } from "@/hooks/use-gpa-goal";

// Import modular components
import GoalInputForm from "@/components/gpa-goal/goal-input-form";
import GoalResultDisplay from "@/components/gpa-goal/goal-result-display";
import AlternativePathsDisplay from "@/components/gpa-goal/alternative-paths-display";
import GPAEducationalInfo from "@/components/gpa-goal/gpa-educational-info";

interface GPAGoalPlannerProps {
  currentCGPA: number | string;
  creditsEarned: number | string;
  onSwitchCalculator?: () => void; // Optional callback to switch to calculator tab
}

const GPAGoalPlanner: React.FC<GPAGoalPlannerProps> = ({
  currentCGPA,
  creditsEarned,
  onSwitchCalculator,
}) => {
  const [activeTab, setActiveTab] = useState<string>("calculator");

  // Use custom hook for GPA goal calculations
  const {
    state,
    hasInitialData,
    calculateGoalGPA,
    resetCalculator,
    setGoalGPA,
    setCreditsNeeded,
  } = useGPAGoal(currentCGPA, creditsEarned);

  // Add effect to log tab changes for debugging
  useEffect(() => {
    console.log("GPAGoalPlanner: Internal tab changed to:", activeTab);
  }, [activeTab]);

  // Handle the calculation and tab switching if needed
  const handleCalculate = () => {
    const result = calculateGoalGPA();
    if (result?.success && result.shouldShowAlternatives) {
      setActiveTab("alternatives");
    }
  };

  // Explicitly handle tab switching
  const handleTabChange = (value: string) => {
    console.log("GPAGoalPlanner: Setting internal tab to:", value);
    setActiveTab(value);
  };

  // Handle back to calculator button click
  const handleBackToCalculator = () => {
    console.log("GPAGoalPlanner: Back to calculator clicked");
    setActiveTab("calculator");
  };

  // Function to handle navigating to the main calculator
  const handleMainCalculator = () => {
    console.log("GPAGoalPlanner: Switch to main calculator tab requested");
    if (onSwitchCalculator) {
      onSwitchCalculator();
    }
  };

  return (
    <div className="space-y-6">
      {!hasInitialData() && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-900/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 flex-shrink-0 text-amber-600 dark:text-amber-500" />
                <div>
                  <h3 className="mb-1 font-medium text-amber-800 dark:text-amber-400">
                    Complete Current Academic Status First
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Please enter your current CGPA and credits earned in the
                    CGPA Calculator tab before using the Goal Planner.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-800/40"
                    onClick={handleMainCalculator}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Go to Calculator
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card className="overflow-hidden border-slate-200 shadow-lg dark:border-slate-700">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-500/10 p-2 dark:bg-blue-500/20">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Academic Goal Planner
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Plan your path to academic success
                </p>
              </div>
            </div>

            {/* {hasInitialData() && (
              <div className="mt-2 flex w-fit items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 md:mt-0">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                Currently at {currentCGPA} CGPA with {creditsEarned} credits
              </div>
            )} */}
          </div>
        </div>

        <CardContent className="px-6 pt-6">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calculator">Goal Calculator</TabsTrigger>
              <TabsTrigger
                value="alternatives"
                disabled={state.alternativePaths.length === 0}
              >
                Path Options
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="space-y-4 pt-3">
              <GoalInputForm
                currentCGPA={currentCGPA}
                creditsEarned={creditsEarned}
                goalGPA={state.goalGPA}
                creditsNeeded={state.creditsNeeded}
                academicGoal={state.academicGoal}
                disabled={!hasInitialData()}
                onGoalGPAChange={setGoalGPA}
                onCreditsNeededChange={setCreditsNeeded}
                onCalculate={handleCalculate}
                onReset={resetCalculator}
              />

              <GoalResultDisplay
                neededGPA={state.neededGPA}
                creditsNeeded={state.creditsNeeded}
                onShowAlternatives={() => handleTabChange("alternatives")}
              />
            </TabsContent>

            <TabsContent value="alternatives" className="pt-5">
              <AlternativePathsDisplay
                alternativePaths={state.alternativePaths}
                currentCGPA={currentCGPA}
                creditsEarned={creditsEarned}
                goalGPA={state.goalGPA}
                creditsNeeded={state.creditsNeeded}
                onBackToCalculator={handleBackToCalculator}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* <GPAEducationalInfo /> */}
    </div>
  );
};

export default GPAGoalPlanner;
