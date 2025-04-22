"use client";

import React from "react";
import { Award, Info, GraduationCap, Calculator } from "lucide-react";

interface AcademicHonorsGuideProps {
  currentCGPA?: number | string;
  creditsEarned?: number | string;
  className?: string;
}

const AcademicHonorsGuide: React.FC<AcademicHonorsGuideProps> = ({
  currentCGPA,
  creditsEarned,
  className = "",
}) => {
  // Define honors data
  const honorsData = [
    { name: "Summa Cum Laude", range: "3.9 - 4.0", color: "bg-green-400" },
    { name: "Magna Cum Laude", range: "3.8 - 3.89", color: "bg-amber-400" },
    { name: "Cum Laude", range: "3.7 - 3.79", color: "bg-yellow-400" },
    { name: "University Honors", range: "3.5 - 3.69", color: "bg-red-400" },
    { name: "President's List", range: "3.8+", color: "bg-purple-400" },
    { name: "Dean's List", range: "3.5+", color: "bg-blue-400" },
  ];

  return (
    <div
      className={`overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm dark:from-slate-800/70 dark:to-slate-800/40 ${className}`}
    >
      {/* Current Status Section - Only shown if props are provided */}
      {(currentCGPA !== undefined || creditsEarned !== undefined) && (
        <>
          <div className="flex items-center justify-between border-b border-slate-200 bg-white/50 px-4 py-3 dark:border-slate-700/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-2">
              <h4 className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Current Status
              </h4>
            </div>
          </div>
          <div className="border-b border-slate-200 bg-white/50 px-4 py-3 dark:border-slate-700/50 dark:bg-slate-800/30">
            <div className="flex flex-wrap gap-2">
              {currentCGPA !== undefined && (
                <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
                  <Calculator className="mr-1.5 h-4 w-4 text-blue-500" />
                  Current CGPA:{" "}
                  <span className="ml-1 font-semibold">{currentCGPA}</span>
                </div>
              )}
              {creditsEarned !== undefined && (
                <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
                  <span className="mr-1.5 flex h-4 w-4 items-center justify-center text-sm font-bold text-blue-500">
                    Σ
                  </span>
                  Credits Earned:{" "}
                  <span className="ml-1 font-semibold">{creditsEarned}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Honors Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white/50 px-4 py-3 dark:border-slate-700/50 dark:bg-slate-800/30">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h4 className="text-sm font-medium text-slate-800 dark:text-slate-100">
            Common Academic Honors
          </h4>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Honors grid - shifts to single column on smallest screens */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2">
          {honorsData.map((honor, index) => (
            <div
              key={index}
              className="flex items-center rounded-lg bg-white/70 px-3 py-2 shadow-sm dark:bg-slate-800/30"
            >
              <div className={`mr-2 h-2.5 w-2.5 rounded-full ${honor.color}`} />
              <div>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {honor.name}
                </span>
                <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
                  {honor.range}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-3 flex items-center gap-1.5 rounded-md bg-slate-100/70 p-2 text-xs dark:bg-slate-700/30">
          <Info className="h-3 w-3 flex-shrink-0 text-slate-500 dark:text-slate-400" />
          <p className="italic text-slate-500 dark:text-slate-400">
            Honors shown are for American University of Nigeria (AUN).
            Requirements may vary for other institutions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AcademicHonorsGuide;
