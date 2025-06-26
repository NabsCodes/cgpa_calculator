"use client";

import React, { useEffect, useRef } from "react";
import {
  RefreshCw,
  PlusCircle,
  BookOpen,
  Calculator,
  BarChart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Import the hook that contains all the calculator logic
import { useCGPA } from "@/hooks/use-cgpa";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { formatLastSaved } from "@/services/storage";
import { APP_CONFIG } from "@/data/constants";

// Import modular components
import CGPAForm from "./cgpa-form";
import CourseTable from "./course-table";
import ResultsDisplay from "./results-display";
import ProgressBar from "./progress-bar";
import ExportCSV from "./export-csv";

// Add props type for onCGPAChange
interface CGPACalculatorProps {
  onCGPAChange?: (
    currentCGPA: string | number,
    creditsEarned: string | number,
  ) => void;
  initialCGPA?: string | number;
  initialCredits?: string | number;
}

const CGPACalculator: React.FC<CGPACalculatorProps> = ({
  onCGPAChange,
  initialCGPA,
  initialCredits,
}) => {
  const { toast } = useToast();

  // Refs for keyboard shortcuts
  const currentCGPARef = useRef<HTMLInputElement>(null);
  const creditsEarnedRef = useRef<HTMLInputElement>(null);

  // Use our custom hook for all the calculator logic
  const {
    // State
    currentCGPA,
    setCurrentCGPA,
    creditsEarned,
    setCreditsEarned,
    courses,
    results,
    lastSaved,
    mounted,
    restoredFromStorage,
    isResetting,

    // Actions
    addCourse,
    deleteCourse,
    updateCourse,
    resetForm,
    setDefaultRowCount,
  } = useCGPA();

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onAddCourse: addCourse,
    onReset: resetForm,
    onFocusCurrentCGPA: () => currentCGPARef.current?.focus(),
    onFocusCreditsEarned: () => creditsEarnedRef.current?.focus(),
  });

  // Use initialCGPA and initialCredits when provided to prevent flashing
  useEffect(() => {
    if (mounted && initialCGPA !== undefined && initialCGPA !== "") {
      setCurrentCGPA(initialCGPA);
    }
    if (mounted && initialCredits !== undefined && initialCredits !== "") {
      setCreditsEarned(initialCredits);
    }
  }, [mounted, initialCGPA, initialCredits, setCurrentCGPA, setCreditsEarned]);

  // Use the utility function for formatting last saved time
  const formattedLastSaved = formatLastSaved(lastSaved);

  // Effect to show notification for restored data (on first load)
  useEffect(() => {
    if (
      mounted &&
      typeof window !== "undefined" &&
      restoredFromStorage &&
      !sessionStorage.getItem(APP_CONFIG.SESSION_KEY) &&
      (currentCGPA ||
        creditsEarned ||
        courses.some((c) => c.courseCode || c.creditHours || c.grade))
    ) {
      // toast({
      //   title: "Welcome back",
      //   description: "Your previous calculation data has been restored.",
      // });

      // Set flag in sessionStorage to prevent showing toast on refreshes
      sessionStorage.setItem(APP_CONFIG.SESSION_KEY, "true");
    }
  }, [
    mounted,
    toast,
    restoredFromStorage,
    currentCGPA,
    creditsEarned,
    courses,
  ]);

  // Call onCGPAChange when currentCGPA or creditsEarned change
  useEffect(() => {
    if (onCGPAChange && mounted) {
      onCGPAChange(currentCGPA, creditsEarned);
    }
  }, [currentCGPA, creditsEarned, onCGPAChange, mounted]);

  // Handle template row count changes with visual feedback
  const handleRowCountChange = (count: number) => {
    setDefaultRowCount(count);
    toast({
      title: "Template rows updated",
      description: `Default number of rows set to ${count}`,
    });
  };

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden border-slate-200 shadow-lg dark:border-slate-700">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-500/10 p-2 dark:bg-blue-500/20">
                <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  CGPA Calculator
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Calculate your current GPA and CGPA
                </p>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Current CGPA Section */}
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                  Current Academic Standing
                </h3>
              </div>
              <CGPAForm
                currentCGPA={currentCGPA}
                creditsEarned={creditsEarned}
                setCurrentCGPA={setCurrentCGPA}
                setCreditsEarned={setCreditsEarned}
                currentCGPARef={currentCGPARef}
                creditsEarnedRef={creditsEarnedRef}
                calculateCGPA={() => {}} // This is a no-op since calculation happens automatically through effects
              />
            </div>

            {/* Course table Section */}
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <div className="mb-3 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                  Current Semester Courses
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Add your courses for this semester to calculate your GPA
                  </p>
                </div>

                <CourseTable
                  courses={courses}
                  updateCourse={updateCourse}
                  deleteCourse={deleteCourse}
                />

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Reset rows:
                    </span>
                    {[3, 4, 5, 6].map((count) => (
                      <Button
                        key={count}
                        variant={
                          APP_CONFIG.DEFAULT_ROWS === count
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleRowCountChange(count)}
                        className="h-7 w-7 p-0 text-xs"
                      >
                        {count}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                      onClick={addCourse}
                    >
                      <PlusCircle className="mr-1 h-3.5 w-3.5" />
                      Add Course
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                      onClick={resetForm}
                      disabled={isResetting}
                    >
                      <RefreshCw
                        className={`mr-1 h-3.5 w-3.5 ${isResetting ? "animate-spin" : ""}`}
                      />
                      {isResetting ? "Resetting..." : "Reset"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <div className="mb-3 flex items-center gap-2">
                <BarChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                  Results Summary
                </h3>
              </div>

              <div className="space-y-4">
                {/* Results Display */}
                <ResultsDisplay
                  totalCredits={results.totalCredits}
                  gpa={results.gpa}
                  cgpa={results.cgpa}
                  lastSaved={formattedLastSaved}
                />

                {/* Progress Bar */}
                <ProgressBar gpa={results.gpa} />

                {/* Export Button */}
                <div className="flex justify-end border-t border-slate-100 pt-3 dark:border-slate-800">
                  <ExportCSV
                    currentCGPA={currentCGPA}
                    creditsEarned={creditsEarned}
                    courses={courses}
                    results={results}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CGPACalculator;
