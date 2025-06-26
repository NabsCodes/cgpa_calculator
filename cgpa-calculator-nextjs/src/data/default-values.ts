import type { Course, CGPAResults } from "@/types/cgpa";
import { APP_CONFIG } from "./constants";

// Default course structure
export function createDefaultCourse(id: number): Course {
  return {
    id,
    courseCode: "",
    creditHours: "",
    grade: "",
  };
}

// Create default courses array
export function createDefaultCourses(
  numRows = APP_CONFIG.DEFAULT_ROWS,
): Course[] {
  return Array.from({ length: numRows }, (_, index) =>
    createDefaultCourse(index + 1),
  );
}

// Default CGPA results
export const DEFAULT_CGPA_RESULTS: CGPAResults = {
  totalCredits: 0,
  gpa: 0,
  cgpa: 0,
};

// Default form values
export const DEFAULT_FORM_VALUES = {
  currentCGPA: "",
  creditsEarned: "",
} as const;

// Common credit hour options
export const CREDIT_HOUR_OPTIONS = [
  { value: "1", label: "1 Credit" },
  { value: "2", label: "2 Credits" },
  { value: "3", label: "3 Credits" },
  { value: "4", label: "4 Credits" },
  { value: "5", label: "5 Credits" },
  { value: "6", label: "6 Credits" },
] as const;
