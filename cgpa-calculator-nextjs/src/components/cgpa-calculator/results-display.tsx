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

interface ResultsDisplayProps {
  totalCredits: number;
  gpa: number;
  cgpa: number;
  lastSaved?: string | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  totalCredits,
  gpa,
  cgpa,
  lastSaved,
}) => {
  const getGradeColor = (value: number) => {
    if (value >= 3.5) return "text-blue-500";
    if (value >= 3.0) return "text-cyan-500";
    if (value >= 2.0) return "text-amber-500";
    return "text-red-500";
  };

  const getGradeLabel = (value: number) => {
    if (value >= 3.7) return "Excellent";
    if (value >= 3.0) return "Very Good";
    if (value >= 2.0) return "Good";
    if (value > 0) return "Needs Improvement";
    return "";
  };

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
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-700">
          {icon}
        </div>
        <div className="text-right">
          <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={`value-${value}`}
              className={`text-3xl font-bold ${colorClass}`}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{
                duration: 0.2,
                type: "tween",
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
      <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-slate-100 opacity-20 dark:bg-slate-700"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-y-2 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {/* <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Results Summary
          </h3> */}
          {lastSaved && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              Updated {lastSaved}
            </span>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 self-start text-xs sm:self-auto"
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
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span>A = 4.0</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  <span>A- = 3.7</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  <span>B+ = 3.3</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                  <span>B = 3.0</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-300"></span>
                  <span>B- = 2.7</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  <span>C+ = 2.3</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                  <span>C = 2.0</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-orange-400"></span>
                  <span>D = 1.0</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  <span>F/W = 0.0</span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MotionCard
          icon={
            <BookOpen className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          }
          title="Total Credits"
          value={totalCredits}
          label="Credit Hours"
          delay={0}
        />

        <MotionCard
          icon={
            <Calculator className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          }
          title="Current GPA"
          value={gpa > 0 ? gpa.toFixed(2) : "—"}
          label={getGradeLabel(gpa)}
          colorClass={getGradeColor(gpa)}
          delay={0.1}
        />

        <MotionCard
          icon={
            <Award className="h-5 w-5 text-slate-600 dark:text-slate-300" />
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
