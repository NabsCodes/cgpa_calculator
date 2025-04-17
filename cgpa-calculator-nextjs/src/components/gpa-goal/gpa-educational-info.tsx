"use client";

import React from "react";
import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const GPAEducationalInfo: React.FC = () => {
  return (
    <Card className="overflow-hidden border-slate-200 shadow-lg dark:border-slate-700">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 dark:from-slate-800/70 dark:to-slate-800/40">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">
            Understanding GPA Calculations
          </h3>
        </div>
      </div>
      <CardContent className="pt-5">
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p>
            Setting realistic GPA goals requires understanding the mathematical
            realities of grade calculations. The more credits you've already
            earned, the harder it becomes to significantly change your CGPA in a
            single semester.
          </p>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/50">
            <h4 className="mb-3 font-medium text-slate-800 dark:text-slate-200">
              Factors That Impact Your CGPA Goals
            </h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-md bg-white p-3 shadow-sm dark:bg-slate-800">
                <h5 className="mb-2 font-medium text-blue-700 dark:text-blue-400">
                  Credit Momentum
                </h5>
                <p className="text-sm">
                  The more credits you've earned, the harder it is to change
                  your CGPA dramatically, similar to turning a large ship.
                </p>
              </div>
              <div className="rounded-md bg-white p-3 shadow-sm dark:bg-slate-800">
                <h5 className="mb-2 font-medium text-amber-700 dark:text-amber-400">
                  Goal Distance
                </h5>
                <p className="text-sm">
                  A large gap between your current and target CGPA requires more
                  credits or exceptionally high grades.
                </p>
              </div>
              <div className="rounded-md bg-white p-3 shadow-sm dark:bg-slate-800">
                <h5 className="mb-2 font-medium text-green-700 dark:text-green-400">
                  Time Frame
                </h5>
                <p className="text-sm">
                  Significant improvements often require a multi-semester
                  approach rather than a single term solution.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
              <div className="mt-0.5 text-blue-600 dark:text-blue-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-medium">Pro tip:</span> For large CGPA
                improvements, break your goal into smaller milestones spread
                across multiple semesters.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GPAEducationalInfo;
