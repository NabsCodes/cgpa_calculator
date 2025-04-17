"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Award,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface GoalResultDisplayProps {
  neededGPA: number | null;
  creditsNeeded: string;
  onShowAlternatives: () => void;
}

const GoalResultDisplay: React.FC<GoalResultDisplayProps> = ({
  neededGPA,
  creditsNeeded,
  onShowAlternatives,
}) => {
  if (neededGPA === null) return null;

  // Status constants
  const isUnachievable = neededGPA > 4.0;
  const isAlreadyAchieved = neededGPA < 0;

  // Theme config object
  const themeConfig = {
    unachievable: {
      bg: "bg-gradient-to-r from-red-500 to-red-600",
      textColor: "text-red-600 dark:text-red-400",
      badgeBg: "bg-red-100 dark:bg-red-900/30",
      badgeText: "text-red-700 dark:text-red-300",
      icon: <AlertCircle className="h-4 w-4" />,
      status: "Not achievable",
      message:
        "The required GPA exceeds the maximum of 4.0. Consider exploring alternative paths or extending your timeline.",
    },
    achieved: {
      bg: "bg-gradient-to-r from-green-500 to-green-600",
      textColor: "text-green-600 dark:text-green-400",
      badgeBg: "bg-green-100 dark:bg-green-900/30",
      badgeText: "text-green-700 dark:text-green-300",
      icon: <CheckCircle2 className="h-4 w-4" />,
      status: "Already achieved!",
      message:
        "Congratulations! Your current cumulative GPA already exceeds your target. You're on track for success.",
    },
    achievable: {
      bg: "bg-gradient-to-r from-blue-500 to-blue-600",
      textColor: "text-blue-600 dark:text-blue-400",
      badgeBg: "bg-blue-100 dark:bg-blue-900/30",
      badgeText: "text-blue-700 dark:text-blue-300",
      icon: <Award className="h-4 w-4" />,
      getDifficulty: (gpa: number) => {
        if (gpa >= 3.7)
          return {
            level: "Challenging",
            message:
              "This is challenging but achievable. You'll need to aim for mostly A's in your courses this semester.",
          };
        if (gpa >= 3.0)
          return {
            level: "Moderate",
            message:
              "This is a realistic goal with consistent effort. A mix of A's and B's should help you reach this target.",
          };
        return {
          level: "Achievable",
          message:
            "This is an achievable goal for your upcoming semester. Maintain regular study habits to succeed.",
        };
      },
    },
  };

  // Get current theme based on status
  const getTheme = () => {
    if (isUnachievable) return themeConfig.unachievable;
    if (isAlreadyAchieved) return themeConfig.achieved;

    const theme = themeConfig.achievable;
    const { level, message } = theme.getDifficulty(neededGPA);
    return { ...theme, status: level, message };
  };

  const theme = getTheme();

  // Format GPA display value
  const displayGPA = isAlreadyAchieved ? "0.00" : neededGPA.toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="mt-4 overflow-hidden border-2 shadow-md">
        <div className={`px-3 py-2 text-white ${theme.bg}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium">GPA Goal Results</h3>
            <div className="hidden items-center rounded-full bg-white/20 px-2 py-0.5 text-xs sm:flex">
              <Target className="mr-1 h-3 w-3" />
              <span>{creditsNeeded} credits</span>
            </div>
          </div>
        </div>

        <CardContent className="p-3">
          {/* Mobile status badges */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-md bg-white/80 px-2 py-0.5 text-xs dark:bg-slate-800/80 sm:hidden">
              <Target className="mr-1 h-3 w-3 text-slate-500" />
              <span>{creditsNeeded} credits</span>
            </div>

            <div
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${theme.badgeBg} ${theme.badgeText}`}
            >
              {theme.icon}
              <span>{theme.status}</span>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col">
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Required GPA:
              </div>
              <div className="mt-1 flex items-baseline">
                <span className={`text-3xl font-bold ${theme.textColor}`}>
                  {displayGPA}
                </span>
                <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                  / 4.00
                </span>
              </div>
            </div>

            {/* Explanation card */}
            <div className="rounded-lg bg-slate-50 p-3 shadow-sm dark:bg-slate-800/50">
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {theme.message}
              </p>
            </div>
          </div>

          {/* Action button - only show when needed */}
          {isUnachievable && (
            <div className="mt-3">
              <Button
                onClick={onShowAlternatives}
                variant="outline"
                size="sm"
                className="w-full border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 sm:w-auto"
              >
                <TrendingUp className="mr-1 h-3 w-3" />
                <span className="text-xs">Explore Alternatives</span>
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GoalResultDisplay;
