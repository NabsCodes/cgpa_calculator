import {
  calculateSemesterGPA,
  calculateCGPA,
  getGradePoints,
  formatGPA,
  isValidCreditHours,
  isValidCGPA,
  calculateRequiredGrade,
} from "@/lib/calculations";
import type { Course } from "@/types/cgpa";

describe("CGPA Calculations", () => {
  // Mock courses for testing
  const mockCourses: Course[] = [
    { id: 1, courseCode: "CS101", creditHours: 3, grade: "A" },
    { id: 2, courseCode: "MATH201", creditHours: 4, grade: "B+" },
    { id: 3, courseCode: "ENG101", creditHours: 3, grade: "B" },
  ];

  // Mock courses with empty grades and credit hours
  const mockCoursesWithEmptyGrades: Course[] = [
    { id: 1, courseCode: "CS101", creditHours: 3, grade: "A" },
    { id: 2, courseCode: "MATH201", creditHours: "", grade: "" },
    { id: 3, courseCode: "", creditHours: "", grade: "" },
  ];

  describe("getGradePoints", () => {
    test("returns correct grade points for valid grades", () => {
      expect(getGradePoints("A")).toBe(4.0);
      expect(getGradePoints("A-")).toBe(3.7);
      expect(getGradePoints("B+")).toBe(3.3);
      expect(getGradePoints("B")).toBe(3.0);
      expect(getGradePoints("F")).toBe(0.0);
    });

    test("returns 0 for invalid grades", () => {
      expect(getGradePoints("X")).toBe(0);
      expect(getGradePoints("")).toBe(0);
      expect(getGradePoints("invalid")).toBe(0);
    });
  });

  describe("calculateSemesterGPA", () => {
    test("calculates GPA correctly for valid courses", () => {
      // Expected: (3*4.0 + 4*3.3 + 3*3.0) / (3+4+3) = (12 + 13.2 + 9) / 10 = 3.42
      const result = calculateSemesterGPA(mockCourses);
      expect(result).toBeCloseTo(3.42, 2);
    });

    test("handles empty courses array", () => {
      expect(calculateSemesterGPA([])).toBe(0);
    });

    test("ignores courses with empty grades or credit hours", () => {
      // Should only calculate for the first course: 3*4.0 / 3 = 4.0
      const result = calculateSemesterGPA(mockCoursesWithEmptyGrades);
      expect(result).toBe(4.0);
    });

    test("handles courses with invalid credit hours", () => {
      const coursesWithInvalidCredits: Course[] = [
        { id: 1, courseCode: "CS101", creditHours: "invalid", grade: "A" },
        { id: 2, courseCode: "MATH201", creditHours: 3, grade: "B" },
      ];
      // Should only calculate for valid course: 3*3.0 / 3 = 3.0
      const result = calculateSemesterGPA(coursesWithInvalidCredits);
      expect(result).toBe(3.0);
    });
  });

  describe("calculateCGPA", () => {
    test("calculates CGPA correctly with existing CGPA", () => {
      const result = calculateCGPA(mockCourses, 3.5, 30);
      expect(result.totalCredits).toBe(10); // 3 + 4 + 3
      expect(result.gpa).toBeCloseTo(3.42, 2);
      expect(result.cgpa).toBeCloseTo(3.48, 2); // Weighted average
    });

    test("returns semester GPA as CGPA when no existing CGPA", () => {
      const result = calculateCGPA(mockCourses, "", "");
      expect(result.cgpa).toBeCloseTo(3.42, 2);
      expect(result.gpa).toBeCloseTo(3.42, 2);
    });

    test("handles empty courses with existing CGPA", () => {
      const result = calculateCGPA([], 3.5, 30);
      expect(result.totalCredits).toBe(0);
      expect(result.gpa).toBe(0);
      expect(result.cgpa).toBe(3.5); // Should use existing CGPA
    });

    test("caps CGPA at 4.0", () => {
      const perfectCourses: Course[] = [
        { id: 1, courseCode: "CS101", creditHours: 3, grade: "A" },
      ];
      const result = calculateCGPA(perfectCourses, 4.0, 30);
      expect(result.cgpa).toBeLessThanOrEqual(4.0);
    });
  });

  describe("formatGPA", () => {
    test("formats GPA to 2 decimal places", () => {
      expect(formatGPA(3.14159)).toBe("3.14");
      expect(formatGPA(4.0)).toBe("4.00");
      expect(formatGPA(2.555)).toBe("2.56");
    });
  });

  describe("isValidCreditHours", () => {
    test("validates credit hours correctly", () => {
      expect(isValidCreditHours(3)).toBe(true);
      expect(isValidCreditHours("4")).toBe(true);
      expect(isValidCreditHours(1)).toBe(true);
      expect(isValidCreditHours(6)).toBe(true);

      expect(isValidCreditHours(0)).toBe(false);
      expect(isValidCreditHours(-1)).toBe(false);
      expect(isValidCreditHours(7)).toBe(false);
      expect(isValidCreditHours("invalid")).toBe(false);
      expect(isValidCreditHours("")).toBe(false);
    });
  });

  describe("isValidCGPA", () => {
    test("validates CGPA correctly", () => {
      expect(isValidCGPA(3.5)).toBe(true);
      expect(isValidCGPA("4.0")).toBe(true);
      expect(isValidCGPA(0)).toBe(true);
      expect(isValidCGPA(4.0)).toBe(true);

      expect(isValidCGPA(-0.1)).toBe(false);
      expect(isValidCGPA(4.1)).toBe(false);
      expect(isValidCGPA("invalid")).toBe(false);
      expect(isValidCGPA("")).toBe(false);
    });
  });

  describe("calculateRequiredGrade", () => {
    test("calculates required grade correctly", () => {
      // To get 3.5 CGPA with current 3.0 CGPA and 30 credits, taking 10 more credits
      // Required: (3.0*30 + X*10) / 40 = 3.5
      // X = (3.5*40 - 3.0*30) / 10 = (140 - 90) / 10 = 5.0, but capped at 4.0
      const result = calculateRequiredGrade(3.5, 3.0, 30, 10);
      expect(result).toBe(4.0);
    });

    test("returns 0 for invalid planned credits", () => {
      expect(calculateRequiredGrade(3.5, 3.0, 30, 0)).toBe(0);
      expect(calculateRequiredGrade(3.5, 3.0, 30, -5)).toBe(0);
    });

    test("handles achievable target grades", () => {
      // More realistic scenario
      const result = calculateRequiredGrade(3.2, 3.0, 30, 10);
      expect(result).toBeCloseTo(3.8, 1);
    });
  });
});
