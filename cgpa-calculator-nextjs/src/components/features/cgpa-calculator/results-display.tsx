"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Award, Calculator, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ResultsDisplayProps {
  totalCredits: number;
  gpa: number;
  cgpa: number;
  lastSaved?: string | null;
}

// Grade colors and labels as constants for DRY code
const GRADE_THRESHOLDS = {
  EXCELLENT: 3.7,
  VERY_GOOD: 3.0,
  GOOD: 2.0,
  NEEDS_IMPROVEMENT: 0,
} as const;

const getGradeColor = (value: number) => {
  if (value >= 3.5) return "text-blue-500";
  if (value >= 3.0) return "text-cyan-500";
  if (value >= 2.0) return "text-amber-500";
  return "text-red-500";
};

const getGradeLabel = (value: number) => {
  if (value >= GRADE_THRESHOLDS.EXCELLENT) return "Excellent";
  if (value >= GRADE_THRESHOLDS.VERY_GOOD) return "Very Good";
  if (value >= GRADE_THRESHOLDS.GOOD) return "Good";
  if (value > GRADE_THRESHOLDS.NEEDS_IMPROVEMENT) return "Needs Improvement";
  return "";
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  totalCredits,
  gpa,
  cgpa,
  lastSaved,
}) => {
  // Card component for consistent card styling across the application
  const MotionCard = ({
    icon,
    title,
    value,
    label,
    colorClass,
    delay,
  }: {
    icon: React.ReactNode;
    title: string;
    value: number | string;
    label?: string;
    colorClass?: string;
    delay: number;
  }) => (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-4">
      <div className="flex items-start justify-between">
        <div className="rounded-lg bg-slate-100 p-1.5 dark:bg-slate-700 sm:p-2">
          {icon}
        </div>
        <div className="text-right">
          <p className="mb-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            {title}
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={`value-${value}`}
              className={cn("text-xl font-bold sm:text-3xl", colorClass)}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{
                duration: 0.2,
                type: "tween",
                delay: delay,
              }}
            >
              {value}
            </motion.p>
          </AnimatePresence>
          {label && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {label}
            </p>
          )}
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute -bottom-4 -right-4 h-12 w-12 rounded-full bg-slate-100 opacity-20 dark:bg-slate-700 sm:h-16 sm:w-16"></div>
    </div>
  );

  // Grade reference data for the popover
  const gradeData = [
    { grade: "A", points: "4.0", color: "bg-emerald-500" },
    { grade: "A-", points: "3.7", color: "bg-emerald-400" },
    { grade: "B+", points: "3.3", color: "bg-blue-500" },
    { grade: "B", points: "3.0", color: "bg-blue-400" },
    { grade: "B-", points: "2.7", color: "bg-blue-300" },
    { grade: "C+", points: "2.3", color: "bg-amber-500" },
    { grade: "C", points: "2.0", color: "bg-amber-400" },
    { grade: "C-", points: "1.7", color: "bg-amber-300" },
    { grade: "D", points: "1.0", color: "bg-orange-400" },
    { grade: "F/W", points: "0.0", color: "bg-red-500" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col justify-between gap-y-2 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {/* <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Results Summary
          </h3> */}
          {lastSaved && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              Updated {lastSaved}
            </span>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 self-start text-xs sm:h-8 sm:self-auto"
            >
              <HelpCircle className="h-3 w-3" /> Grade Reference
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] sm:w-80" align="end">
            <div className="space-y-3">
              <div className="border-b border-slate-200 pb-2 dark:border-slate-700">
                <h4 className="font-medium">Grade Point Reference</h4>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-sm sm:grid-cols-3">
                {gradeData.map((item, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <span
                      className={cn("h-2 w-2 rounded-full", item.color)}
                    ></span>
                    <span>
                      {item.grade} = {item.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <MotionCard
          icon={
            <BookOpen className="h-4 w-4 text-slate-600 dark:text-slate-300 sm:h-5 sm:w-5" />
          }
          title="Total Credits"
          value={totalCredits}
          label="Credit Hours"
          delay={0}
        />

        <MotionCard
          icon={
            <Calculator className="h-4 w-4 text-slate-600 dark:text-slate-300 sm:h-5 sm:w-5" />
          }
          title="Current GPA"
          value={gpa > 0 ? gpa.toFixed(2) : "—"}
          label={getGradeLabel(gpa)}
          colorClass={getGradeColor(gpa)}
          delay={0.1}
        />

        <MotionCard
          icon={
            <Award className="h-4 w-4 text-slate-600 dark:text-slate-300 sm:h-5 sm:w-5" />
          }
          title="Cumulative GPA"
          value={cgpa > 0 ? cgpa.toFixed(2) : "—"}
          label={getGradeLabel(cgpa)}
          colorClass={getGradeColor(cgpa)}
          delay={0.2}
        />
      </div>
    </div>
  );
};

export default ResultsDisplay;
