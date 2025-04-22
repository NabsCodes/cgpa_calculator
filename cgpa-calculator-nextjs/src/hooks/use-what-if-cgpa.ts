import { useMemo } from "react";

// Type definitions
export interface SemesterCourse {
  id: number;
  creditHours: string;
  grade: string;
}

export interface Semester {
  id: number;
  name: string;
  courses: SemesterCourse[];
  isOpen: boolean;
}

// Grade point values for different letter grades
export const GRADE_POINTS: Record<string, number> = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  D: 1.0,
  F: 0.0,
};

interface UseCGPACalculatorProps {
  currentCGPA: number;
  creditsEarned: number;
  goalCGPA: number;
  semesters: Semester[];
}

interface CGPACalculationResult {
  projectedCGPA: number;
  isAchievable: boolean;
  totalNewCredits: number;
  isGoalBelowCurrent: boolean;
  isGoalEqualCurrent: boolean;
  isMaxGoal: boolean;
  isExactMatch: boolean;
}

/**
 * Custom hook to calculate projected CGPA based on current CGPA, credits earned,
 * goal CGPA, and planned future courses.
 *
 * This hook uses useMemo to prevent unnecessary recalculations and ensure
 * that the result is only recomputed when the inputs change.
 *
 * @param props - Object containing currentCGPA, creditsEarned, goalCGPA, and semesters
 * @returns Object with projectedCGPA, isAchievable, totalNewCredits, isGoalBelowCurrent, isExactMatch, isGoalEqualCurrent, and isMaxGoal
 */
export const useCGPACalculator = ({
  currentCGPA,
  creditsEarned,
  goalCGPA,
  semesters,
}: UseCGPACalculatorProps): CGPACalculationResult => {
  // Use useMemo to calculate all values at once and avoid re-renders
  return useMemo(() => {
    // Check if goal is equal to max CGPA (4.0)
    const isMaxGoal = Math.abs(goalCGPA - 4.0) < 0.001;

    // Check if goal is equal to or below current CGPA
    const isGoalEqualCurrent = Math.abs(goalCGPA - currentCGPA) < 0.001; // Using a small epsilon for floating point comparison
    const isGoalBelowCurrent = goalCGPA < currentCGPA && !isGoalEqualCurrent;

    // Calculate projected CGPA
    let totalPoints = currentCGPA * creditsEarned;
    let totalCredits = creditsEarned;
    let newCredits = 0;

    // Process each course in each semester
    semesters.forEach((semester) => {
      semester.courses.forEach((course) => {
        if (course.creditHours && course.grade) {
          const credits = parseFloat(course.creditHours);
          const gradePoints = GRADE_POINTS[course.grade] || 0;

          if (!isNaN(credits) && credits > 0) {
            totalPoints += credits * gradePoints;
            totalCredits += credits;
            newCredits += credits;
          }
        }
      });
    });

    // Calculate the new CGPA, capped at 4.0 (maximum possible)
    let projectedCGPA =
      totalCredits > 0 ? totalPoints / totalCredits : currentCGPA;
    projectedCGPA = Math.min(projectedCGPA, 4.0);

    // Handle potential NaN values from division by zero
    if (isNaN(projectedCGPA)) {
      projectedCGPA = currentCGPA;
    }

    // STEP 1: Round both values to 2 decimal places for display consistency
    // This is important to match what the user sees in the UI
    const roundedProjected = Math.round(projectedCGPA * 100) / 100;
    const roundedGoal = Math.round(goalCGPA * 100) / 100;

    // STEP 2: Check for exact match between rounded values
    // We use strict equality (===) because we want to check if they are EXACTLY the same
    const isExactMatch = roundedProjected === roundedGoal;

    // STEP 3: Determine if the goal is achievable
    // The goal is achievable if ANY of these conditions are met:
    // 1. Goal equals current CGPA (already achieved)
    // 2. Goal is below current CGPA (already surpassed)
    // 3. Projected CGPA exactly matches the goal
    // 4. Projected CGPA exceeds the goal
    // Special case: For 4.0 goal, we need to be very close to 4.0
    const isAchievable =
      isGoalEqualCurrent || // Already achieved
      isGoalBelowCurrent || // Already surpassed
      isExactMatch || // Will be exactly met
      (isMaxGoal // If goal is 4.0 (perfect)
        ? Math.abs(projectedCGPA - 4.0) < 0.001 // Need to be very close to 4.0
        : projectedCGPA > goalCGPA); // Normal case - just need to exceed

    // Debug logging (already handled in production)
    console.log("CGPA Calculation:", {
      projected: roundedProjected.toFixed(2),
      goal: roundedGoal.toFixed(2),
      isExactMatch,
      isAchievable,
    });

    return {
      projectedCGPA,
      isAchievable,
      totalNewCredits: newCredits,
      isGoalBelowCurrent,
      isGoalEqualCurrent,
      isMaxGoal,
      isExactMatch,
    };
    // Dependency array includes all inputs that should trigger a recalculation
  }, [semesters, currentCGPA, creditsEarned, goalCGPA]);
};
