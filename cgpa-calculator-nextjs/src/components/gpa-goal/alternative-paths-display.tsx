"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlternativePathResult } from "@/hooks/use-gpa-goal";

interface AlternativePathsDisplayProps {
  alternativePaths: AlternativePathResult[];
  currentCGPA: number | string;
  creditsEarned: number | string;
  goalGPA: string;
  creditsNeeded: string;
  onBackToCalculator: () => void;
}

const AlternativePathsDisplay: React.FC<AlternativePathsDisplayProps> = ({
  alternativePaths,
  currentCGPA,
  creditsEarned,
  goalGPA,
  creditsNeeded,
  onBackToCalculator,
}) => {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="px-6 py-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="mt-0.5 h-6 w-6 flex-shrink-0 text-amber-500 dark:text-amber-400" />
            <div>
              <h3 className="font-medium text-slate-800 dark:text-slate-200">
                Your Path to {goalGPA} CGPA
              </h3>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                To reach your goal, we've calculated several alternative paths
                based on your current {currentCGPA} CGPA and {creditsEarned}{" "}
                completed credits.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-optimized view (shown on small screens) */}
      <div className="block md:hidden">
        <div className="space-y-4">
          {alternativePaths.map((path, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-lg border p-4 shadow-sm ${
                path.isAchievable
                  ? "border-green-200 bg-green-50/50 dark:border-green-900/30 dark:bg-green-900/10"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Credits:
                  </span>{" "}
                  <span className="font-semibold">{path.creditsNeeded}</span>
                  {index === 0 && (
                    <span className="ml-1.5 text-xs text-slate-500 dark:text-slate-400">
                      (planned)
                    </span>
                  )}
                  {index > 0 && (
                    <span className="ml-1.5 text-xs text-slate-500 dark:text-slate-400">
                      (+{path.creditsNeeded - parseFloat(creditsNeeded)})
                    </span>
                  )}
                </div>
                {path.isAchievable ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Achievable
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                    <XCircle className="mr-1 h-3 w-3" /> Not Achievable
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Required GPA
                  </div>
                  <div
                    className={`font-semibold ${
                      path.isAchievable
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {path.requiredGPA.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Timeline
                  </div>
                  <div className="font-semibold text-slate-700 dark:text-slate-300">
                    {path.semestersEstimate === 1
                      ? "1 semester"
                      : `~${path.semestersEstimate} semesters`}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 text-xs italic text-slate-500 dark:text-slate-400">
          Note: Semester estimates are based on an average of{" "}
          {Math.min(parseInt(creditsNeeded.toString()) || 15, 15)} credits per
          term.
        </div>
      </div>

      {/* Desktop view (hidden on small screens) */}
      <div className="hidden md:block">
        <Card className="border-slate-200 shadow-md dark:border-slate-700">
          <CardContent className="px-0 pt-6">
            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
                    <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">
                      Credits Needed
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">
                      Required GPA
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">
                      Est. Timeline
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">
                      Achievable?
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {alternativePaths.map((path, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border-b border-slate-100 dark:border-slate-800 ${
                        path.isAchievable
                          ? "bg-green-50 dark:bg-green-900/10"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-3 font-medium">
                        {path.creditsNeeded}
                        {index === 0 && (
                          <span className="ml-1.5 text-xs text-slate-500 dark:text-slate-400">
                            (planned)
                          </span>
                        )}
                        {index > 0 && (
                          <span className="ml-1.5 text-xs text-slate-500 dark:text-slate-400">
                            (+
                            {path.creditsNeeded - parseFloat(creditsNeeded)})
                          </span>
                        )}
                      </td>
                      <td
                        className={`px-6 py-3 font-medium ${
                          path.isAchievable
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {path.requiredGPA.toFixed(2)}
                      </td>
                      <td className="px-6 py-3 text-slate-700 dark:text-slate-300">
                        {path.semestersEstimate === 1
                          ? "1 semester"
                          : `~${path.semestersEstimate} semesters`}
                      </td>
                      <td className="px-6 py-3">
                        {path.isAchievable ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                            <XCircle className="mr-1 h-3 w-3" /> No
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mx-6 mt-4 text-xs italic text-slate-500 dark:text-slate-400">
              Note: Semester estimates are based on an average of{" "}
              {Math.min(parseInt(creditsNeeded.toString()))} credits per term.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-100 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-900/10">
        <CardContent className="pt-6">
          <h3 className="mb-3 flex items-center gap-2 text-base text-amber-800 dark:text-amber-400 md:text-lg">
            <Lightbulb className="h-4 w-4 flex-shrink-0 text-amber-500 md:h-5 md:w-5" />
            <span className="font-semibold">Strategic Approaches</span>
          </h3>
          <ul className="space-y-2 text-sm text-amber-900 dark:text-amber-200 md:text-base">
            {parseFloat(currentCGPA.toString()) < 3.0 && (
              <li className="flex items-start gap-2">
                <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500"></div>
                <span>
                  Consider setting an intermediate goal first (like 3.3 or 3.5)
                  before aiming for {goalGPA}
                </span>
              </li>
            )}
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500"></div>
              <span>Take more credit hours if your schedule allows it</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500"></div>
              <span>
                Prioritize courses where you're confident you can earn high
                grades
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500"></div>
              <span>
                Consider summer or winter terms to accumulate credits faster
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500"></div>
              <span>
                Speak with your academic advisor about realistic pathways to
                your goal
              </span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col border-t border-amber-100 bg-amber-50 px-4 py-3 dark:border-amber-900/20 dark:bg-amber-900/20 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="mb-3 text-xs text-amber-700 dark:text-amber-300 sm:mb-0">
            Remember: The journey to academic success is a marathon, not a
            sprint!
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-800 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/30"
            onClick={onBackToCalculator}
          >
            <span className="mr-1">←</span> Back to Calculator
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AlternativePathsDisplay;
