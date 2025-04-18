"use client";

import { JSX, useMemo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Award, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

// Define status types to ensure type safety
type StatusType = {
  label: string;
  color: string;
  icon: JSX.Element;
  description: string;
  themeColor: string;
};

interface ProgressBarProps {
  gpa: number;
  className?: string;
}

// GPA thresholds as constants
const GPA_THRESHOLDS = {
  PRESIDENTS_LIST: 3.8,
  DEANS_LIST: 3.5,
  GOOD_STANDING: 2.0,
  WARNING: 0.0,
} as const;

// Animations configuration
const ANIMATIONS = {
  bar: {
    duration: 0.8,
    ease: [0.34, 1.56, 0.64, 1], // Spring-like bounce effect
    delay: 0.1,
  },
  status: {
    duration: 0.3,
    delay: 0.5,
  },
} as const;

const ProgressBar: React.FC<ProgressBarProps> = ({ gpa, className = "" }) => {
  // Calculate status based on GPA - using useMemo for performance
  const status = useMemo<StatusType>(() => {
    if (gpa === undefined || gpa === null) {
      return {
        label: "",
        color: "",
        icon: <></>,
        description: "",
        themeColor: "",
      };
    }

    const validGpa = Math.max(0, Math.min(4, gpa)); // Ensure GPA is within valid range

    if (validGpa >= GPA_THRESHOLDS.PRESIDENTS_LIST) {
      return {
        label: "President's List",
        color: "bg-emerald-500",
        icon: <Trophy className="h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />,
        description:
          "Outstanding academic achievement. Keep up the excellent work!",
        themeColor: "text-emerald-600 dark:text-emerald-400",
      };
    } else if (validGpa >= GPA_THRESHOLDS.DEANS_LIST) {
      return {
        label: "Dean's List",
        color: "bg-blue-500",
        icon: <Award className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />,
        description:
          "Excellent academic performance. You're on the right track!",
        themeColor: "text-blue-600 dark:text-blue-400",
      };
    } else if (validGpa >= GPA_THRESHOLDS.GOOD_STANDING) {
      return {
        label: "Good Standing",
        color: "bg-amber-500",
        icon: <CheckCircle2 className="h-4 w-4 text-amber-500 sm:h-5 sm:w-5" />,
        description:
          "You're in good academic standing. Consider aiming higher!",
        themeColor: "text-amber-600 dark:text-amber-400",
      };
    } else {
      return {
        label: "Academic Warning",
        color: "bg-red-500",
        icon: <AlertTriangle className="h-4 w-4 text-red-500 sm:h-5 sm:w-5" />,
        description:
          "Your GPA is below the minimum requirement. Please see your academic advisor.",
        themeColor: "text-red-600 dark:text-red-400",
      };
    }
  }, [gpa]);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (gpa === undefined || gpa === null) return 0;
    return Math.min((Math.max(0, Math.min(4, gpa)) / 4) * 100, 100);
  }, [gpa]);

  // Render the GPA markers
  const renderGpaMarkers = () => {
    const markers = [0, 1, 2, 3, 4];

    return (
      <div className="flex justify-between px-1 text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
        {markers.map((mark) => (
          <div
            key={mark}
            className={cn(
              "flex flex-col items-center",
              mark === Math.floor(gpa) && `font-medium ${status.themeColor}`,
            )}
          >
            <div className="mb-0.5 h-1 w-px bg-slate-300 dark:bg-slate-600 sm:mb-1"></div>
            <span>{mark}.0</span>
          </div>
        ))}
      </div>
    );
  };

  // Progress bar stripe pattern definition
  const stripePattern =
    "absolute left-0 top-0 h-full w-full animate-[progress-move_2s_linear_infinite] bg-[linear-gradient(45deg,rgba(255,255,255,0)_25%,rgba(255,255,255,0.4)_25%,rgba(255,255,255,0.4)_50%,rgba(255,255,255,0)_50%,rgba(255,255,255,0)_75%,rgba(255,255,255,0.4)_75%,rgba(255,255,255,0.4)_100%)] bg-[length:10px_10px] opacity-20";

  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      {/* Progress bar container */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 sm:h-4">
        {/* Animated progress fill */}
        <motion.div
          className={cn(
            "absolute left-0 top-0 h-full rounded-full",
            status.color,
          )}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={ANIMATIONS.bar}
        >
          {/* Animated stripe pattern */}
          {progressPercentage > 0 && <div className={stripePattern} />}
        </motion.div>

        {/* Current GPA indicator */}
        {gpa > 0 && (
          <motion.div
            className="absolute top-0 h-full w-1 bg-white dark:bg-slate-900"
            style={{ left: `calc(${progressPercentage}% - 1px)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 1 }}
          />
        )}
      </div>

      {/* GPA markers with improved styling */}
      {renderGpaMarkers()}

      {/* Status message */}
      {status.label && (
        <motion.div
          className="flex items-start gap-2 rounded-lg border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-3 shadow-sm dark:border-slate-700 dark:from-slate-800 dark:to-slate-800/70 sm:gap-3 sm:p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={ANIMATIONS.status}
        >
          <div className="mt-0.5 rounded-full bg-slate-100 p-1 dark:bg-slate-700 sm:p-1.5">
            {status.icon}
          </div>
          <div>
            <h4
              className={cn(
                "text-base font-medium sm:text-lg",
                status.themeColor,
              )}
            >
              {status.label}{" "}
              {gpa !== undefined && gpa !== null && (
                <span className="ml-1">({gpa.toFixed(2)})</span>
              )}
            </h4>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 sm:mt-1 sm:text-sm">
              {status.description}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressBar;
