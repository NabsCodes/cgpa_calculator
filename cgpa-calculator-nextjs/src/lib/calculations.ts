import { GRADE_POINTS } from "@/data/grades";
import type { Course, CGPAResults, GradeValue } from "@/types/cgpa";

// Get grade points for a specific grade
export function getGradePoints(grade: string): number {
  return GRADE_POINTS[grade as GradeValue] || 0;
}

// Calculate semester GPA from courses
export function calculateSemesterGPA(courses: Course[]): number {
  let totalGradePoints = 0;
  let totalCreditHours = 0;

  courses.forEach((course) => {
    if (course.creditHours && course.grade) {
      const creditHours = Number(course.creditHours);
      const gradePoints = getGradePoints(course.grade);

      if (!isNaN(creditHours) && creditHours > 0) {
        totalGradePoints += gradePoints * creditHours;
        totalCreditHours += creditHours;
      }
    }
  });

  return totalCreditHours > 0 ? totalGradePoints / totalCreditHours : 0;
}

// Calculate CGPA based on current courses and existing CGPA
export function calculateCGPA(
  courses: Course[],
  currentCGPA: number | string,
  creditsEarned: number | string,
): CGPAResults {
  // Calculate current semester data
  const semesterGPA = calculateSemesterGPA(courses);

  let totalCredits = 0;
  courses.forEach((course) => {
    const creditHours = Number(course.creditHours);
    if (!isNaN(creditHours) && creditHours > 0 && course.grade) {
      totalCredits += creditHours;
    }
  });

  // Calculate CGPA
  let cgpa = semesterGPA;

  const currentCGPAValue = Number(currentCGPA);
  const creditsEarnedValue = Number(creditsEarned);

  if (
    !isNaN(currentCGPAValue) &&
    !isNaN(creditsEarnedValue) &&
    currentCGPAValue > 0 &&
    creditsEarnedValue > 0 &&
    totalCredits > 0
  ) {
    // Weight the CGPA by credits
    const totalGradePoints = semesterGPA * totalCredits;
    cgpa = Math.min(
      (currentCGPAValue * creditsEarnedValue + totalGradePoints) /
        (creditsEarnedValue + totalCredits),
      4.0,
    );
  } else if (currentCGPAValue > 0 && totalCredits === 0) {
    // If no new courses with grades, use existing CGPA
    cgpa = currentCGPAValue;
  }

  return {
    totalCredits,
    gpa: isNaN(semesterGPA) ? 0 : semesterGPA,
    cgpa: isNaN(cgpa) ? 0 : cgpa,
  };
}

// Format GPA/CGPA for display
export function formatGPA(gpa: number): string {
  return gpa.toFixed(2);
}

// Validate credit hours
export function isValidCreditHours(creditHours: string | number): boolean {
  const credits = Number(creditHours);
  return !isNaN(credits) && credits > 0 && credits <= 6;
}

// Validate CGPA value
export function isValidCGPA(cgpa: string | number): boolean {
  if (cgpa === "" || cgpa === null || cgpa === undefined) return false;
  const gpaValue = Number(cgpa);
  return !isNaN(gpaValue) && gpaValue >= 0 && gpaValue <= 4.0;
}

// Calculate what grade is needed to achieve target CGPA
export function calculateRequiredGrade(
  targetCGPA: number,
  currentCGPA: number,
  creditsEarned: number,
  plannedCredits: number,
): number {
  if (plannedCredits <= 0) return 0;

  const totalCreditsAfter = creditsEarned + plannedCredits;
  const requiredTotalGradePoints = targetCGPA * totalCreditsAfter;
  const currentGradePoints = currentCGPA * creditsEarned;
  const requiredNewGradePoints = requiredTotalGradePoints - currentGradePoints;

  return Math.min(requiredNewGradePoints / plannedCredits, 4.0);
}
