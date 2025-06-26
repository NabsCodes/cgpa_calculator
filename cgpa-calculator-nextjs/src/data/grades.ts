import type { GradeValue, GradeOption } from "@/types/cgpa";

// Grade points mapping
export const GRADE_POINTS: Record<GradeValue, number> = {
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
  W: 0.0,
  WP: 0.0,
  WF: 0.0,
} as const;

// Grade options for dropdowns
export const GRADE_OPTIONS: GradeOption[] = [
  { value: "A", label: "A (4.0)", points: 4.0 },
  { value: "A-", label: "A- (3.7)", points: 3.7 },
  { value: "B+", label: "B+ (3.3)", points: 3.3 },
  { value: "B", label: "B (3.0)", points: 3.0 },
  { value: "B-", label: "B- (2.7)", points: 2.7 },
  { value: "C+", label: "C+ (2.3)", points: 2.3 },
  { value: "C", label: "C (2.0)", points: 2.0 },
  { value: "C-", label: "C- (1.7)", points: 1.7 },
  { value: "D", label: "D (1.0)", points: 1.0 },
  { value: "F", label: "F (0.0)", points: 0.0 },
  { value: "W", label: "W (0.0)", points: 0.0 },
  { value: "WP", label: "WP (0.0)", points: 0.0 },
  { value: "WF", label: "WF (0.0)", points: 0.0 },
] as const;

// Common grade scales
export const GRADE_SCALES = {
  FOUR_POINT: {
    name: "4.0 Scale",
    maxPoints: 4.0,
    grades: GRADE_OPTIONS,
  },
} as const;
