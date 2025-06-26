"use client";

import type React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CGPAFormProps } from "@/types/cgpa";

const CGPAForm: React.FC<CGPAFormProps> = ({
  currentCGPA,
  creditsEarned,
  setCurrentCGPA,
  setCreditsEarned,
  calculateCGPA,
  currentCGPARef,
  creditsEarnedRef,
}) => {
  const handleCGPAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cgpaInput = e.target.value;
    // Allow empty string or valid CGPA values
    if (cgpaInput === "") {
      setCurrentCGPA("");
      return;
    }

    const numValue = parseFloat(cgpaInput);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 4) {
      setCurrentCGPA(cgpaInput);
    }
  };

  const handleCreditsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const creditsInput = e.target.value;
    // Allow empty string or valid credits values
    if (creditsInput === "") {
      setCreditsEarned("");
      return;
    }

    const numValue = parseInt(creditsInput);
    if (!isNaN(numValue) && numValue >= 0) {
      setCreditsEarned(creditsInput);
    }
  };

  // Format CGPA on blur to ensure proper decimal places
  const handleCGPABlur = () => {
    if (currentCGPA !== "") {
      const numValue = parseFloat(currentCGPA.toString());
      if (!isNaN(numValue)) {
        // Format to 2 decimal places
        setCurrentCGPA(Math.min(Math.max(numValue, 0), 4).toFixed(2));
      }
    }
    // Trigger calculation on blur
    calculateCGPA();
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="currentCGPA" className="text-sm font-medium">
            Current CGPA
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 cursor-help text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-center">
                  Enter your current Cumulative GPA (0.00 - 4.00)
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          ref={currentCGPARef}
          type="number"
          id="currentCGPA"
          value={currentCGPA}
          onChange={handleCGPAChange}
          onBlur={handleCGPABlur}
          placeholder="Eg: 3.5"
          min="0"
          max="4"
          step="0.01"
          className="w-full"
          aria-label="Current CGPA, leave blank if this is your first semester"
          aria-describedby="cgpa-hint"
        />
        <p
          id="cgpa-hint"
          className="text-xs text-slate-500 dark:text-slate-400"
        >
          Leave blank if this is your first semester
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="creditsEarned" className="text-sm font-medium">
            Credits Earned
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 cursor-help text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-center">
                  Enter the total number of credit hours you've completed so far
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          ref={creditsEarnedRef}
          type="number"
          id="creditsEarned"
          value={creditsEarned}
          onChange={handleCreditsChange}
          placeholder="Eg: 30"
          min="0"
          className="w-full"
          aria-label="Credits earned in previous semesters"
          aria-describedby="credits-hint"
        />
        <p
          id="credits-hint"
          className="text-xs text-slate-500 dark:text-slate-400"
        >
          Total credits completed in previous semesters
        </p>
      </div>
    </div>
  );
};

export default CGPAForm;
