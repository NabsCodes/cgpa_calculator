"use client";

import React, { useState } from "react";
import {
  Calculator,
  Info,
  ChevronDown,
  ChevronUp,
  Award,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import AcademicHonorsGuide from "./academic-honors-guide";

interface GoalInputFormProps {
  currentCGPA: number | string;
  creditsEarned: number | string;
  goalGPA: string;
  creditsNeeded: string;
  academicGoal: string;
  disabled: boolean;
  onGoalGPAChange: (value: string) => void;
  onCreditsNeededChange: (value: string) => void;
  onCalculate: () => void;
  onReset: () => void;
}

const GoalInputForm: React.FC<GoalInputFormProps> = ({
  currentCGPA,
  creditsEarned,
  goalGPA,
  creditsNeeded,
  academicGoal,
  disabled,
  onGoalGPAChange,
  onCreditsNeededChange,
  onCalculate,
  onReset,
}) => {
  const [isHonorsOpen, setIsHonorsOpen] = useState(false);

  return (
    <div className="space-y-4 lg:[&:first-child]:space-y-0">
      {/* Current Status Badges - Only visible on mobile */}
      <div className="flex flex-wrap items-center gap-2 lg:hidden">
        <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
          <GraduationCap className="mr-1.5 h-4 w-4 text-blue-500" />
          Current CGPA:{" "}
          <span className="ml-1 font-semibold">{currentCGPA}</span>
        </div>
        <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
          <span className="mr-1.5 flex h-4 w-4 items-center justify-center text-sm font-bold text-blue-500">
            Σ
          </span>
          Credits Earned:{" "}
          <span className="ml-1 font-semibold">{creditsEarned}</span>
        </div>
      </div>

      {/* Mobile Honors Guide (Collapsible) - Only visible on mobile */}
      <div className="lg:hidden">
        <Collapsible
          open={isHonorsOpen}
          onOpenChange={setIsHonorsOpen}
          className="w-full rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-auto w-full items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <span className="flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="font-medium">View Academic Honors Guide</span>
              </span>
              {isHonorsOpen ? (
                <ChevronUp className="h-4 w-4 text-slate-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-500" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-t border-slate-200 p-4 dark:border-slate-700">
              <AcademicHonorsGuide className="shadow-none" />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Desktop Honors Guide - Only visible on desktop */}
        <div className="hidden lg:block">
          <AcademicHonorsGuide
            currentCGPA={currentCGPA}
            creditsEarned={creditsEarned}
          />
        </div>

        {/* Input Form */}
        <Card className="h-full border-slate-200 dark:border-slate-700">
          <CardContent className="flex h-full flex-col p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-full bg-blue-500/10 p-2 dark:bg-blue-500/20">
                <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  Goal Calculator
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Set your target CGPA and credits
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Target CGPA Input */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="goalGPA"
                    className="text-slate-700 dark:text-slate-200"
                  >
                    Target CGPA
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="max-w-xs">
                          The final CGPA you want to achieve
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <Input
                    id="goalGPA"
                    type="number"
                    min="0"
                    max="4"
                    step="0.01"
                    placeholder="e.g., 3.5"
                    value={goalGPA}
                    onChange={(e) => onGoalGPAChange(e.target.value)}
                    disabled={disabled}
                    className={academicGoal ? "pr-32" : ""}
                  />
                  {academicGoal && (
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <span className="mr-3 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {academicGoal}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Credits Planning to Take Input */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="creditsNeeded"
                    className="text-slate-700 dark:text-slate-200"
                  >
                    Credits Planning to Take
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="max-w-xs">
                          How many credit hours you plan to take in your
                          upcoming semester
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="creditsNeeded"
                  type="number"
                  min="1"
                  placeholder="e.g., 15"
                  value={creditsNeeded}
                  onChange={(e) => onCreditsNeededChange(e.target.value)}
                  disabled={disabled}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto pt-6">
              <div className="flex gap-3">
                <Button
                  onClick={onCalculate}
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  disabled={disabled}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate
                </Button>
                <Button
                  variant="outline"
                  onClick={onReset}
                  disabled={disabled}
                  className="px-6"
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoalInputForm;
