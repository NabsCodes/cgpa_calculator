// Core CGPA types
export interface Course {
  id: number;
  courseCode: string;
  creditHours: string | number;
  grade: string;
}

export interface CGPAResults {
  totalCredits: number;
  gpa: number;
  cgpa: number;
}

export interface CGPAState {
  currentCGPA: number | string;
  creditsEarned: number | string;
  courses: Course[];
  results: CGPAResults;
}

// Grade types
export type GradeValue =
  | "A"
  | "A-"
  | "B+"
  | "B"
  | "B-"
  | "C+"
  | "C"
  | "C-"
  | "D"
  | "F"
  | "W"
  | "WP"
  | "WF";

export interface GradeOption {
  value: GradeValue;
  label: string;
  points: number;
}

// Calculator form props
export interface CGPAFormProps {
  currentCGPA: number | string;
  creditsEarned: number | string;
  setCurrentCGPA: (value: number | string) => void;
  setCreditsEarned: (value: number | string) => void;
  calculateCGPA: () => void;
  currentCGPARef?: React.RefObject<HTMLInputElement | null>;
  creditsEarnedRef?: React.RefObject<HTMLInputElement | null>;
}

export interface CourseTableProps {
  courses: Course[];
  updateCourse: (
    id: number,
    field: keyof Course,
    value: string | number,
  ) => void;
  deleteCourse: (id: number) => void;
}

export interface ResultsDisplayProps {
  results: CGPAResults;
  lastSaved?: string | null;
}
