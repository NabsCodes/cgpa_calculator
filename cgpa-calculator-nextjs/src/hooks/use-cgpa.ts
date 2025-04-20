import { useState, useEffect, useCallback } from "react";

// Type definitions for better code organization
export interface Course {
  id: number;
  courseCode: string;
  creditHours: string | number;
  grade: string;
}

interface Results {
  totalCredits: number;
  gpa: number;
  cgpa: number;
}

interface SavedData {
  currentCGPA: number | string;
  creditsEarned: number | string;
  courses: Course[];
  lastUpdated: string;
}

// Constants in one place
export const APP_CONFIG = {
  DEFAULT_ROWS: 3,
  STORAGE_KEY: "cgpaCalculatorData",
  SESSION_KEY: "cgpaDataNotified",
  CONFIG_KEY: "cgpaCalculatorConfig",
};

// Grade points mapping for cleaner code
const GRADE_POINTS: Record<string, number> = {
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
};

export function useCGPA() {
  // State definitions
  const [currentCGPA, setCurrentCGPA] = useState<number | string>("");
  const [creditsEarned, setCreditsEarned] = useState<number | string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [results, setResults] = useState<Results>({
    totalCredits: 0,
    gpa: 0,
    cgpa: 0,
  });
  const [mounted, setMounted] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [restoredFromStorage, setRestoredFromStorage] = useState(false);

  // Create default course rows
  const getDefaultCourses = useCallback(
    (numRows = APP_CONFIG.DEFAULT_ROWS): Course[] => {
      return Array.from({ length: numRows }, (_, index) => ({
        id: index + 1,
        courseCode: "",
        creditHours: "",
        grade: "",
      }));
    },
    [],
  );

  // Get grade points with simpler syntax
  const getGradePoints = useCallback((grade: string): number => {
    return GRADE_POINTS[grade] || 0;
  }, []);

  // Calculate CGPA based on current data
  const calculateCGPA = useCallback(() => {
    // Calculate current semester GPA
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

    // Initialize result values
    let semesterGPA = 0;
    let cgpa = 0;

    // Calculate semester GPA if we have credits
    if (totalCreditHours > 0) {
      semesterGPA = totalGradePoints / totalCreditHours;

      // Calculate CGPA if we have prior CGPA and credits
      const currentCGPAValue = Number(currentCGPA);
      const creditsEarnedValue = Number(creditsEarned);

      if (
        !isNaN(currentCGPAValue) &&
        !isNaN(creditsEarnedValue) &&
        currentCGPAValue > 0 &&
        creditsEarnedValue > 0
      ) {
        // Weight the CGPA by credits
        cgpa =
          (currentCGPAValue * creditsEarnedValue + totalGradePoints) /
          (creditsEarnedValue + totalCreditHours);

        // Cap CGPA at 4.0
        cgpa = Math.min(cgpa, 4.0);
      } else {
        // If no prior CGPA, new GPA becomes CGPA
        cgpa = semesterGPA;
      }
    } else if (currentCGPA) {
      // If no new courses with grades, use existing CGPA
      const currentCGPAValue = Number(currentCGPA);
      if (!isNaN(currentCGPAValue) && currentCGPAValue > 0) {
        cgpa = currentCGPAValue;
      }
    }

    // Ensure values are not NaN
    semesterGPA = isNaN(semesterGPA) ? 0 : semesterGPA;
    cgpa = isNaN(cgpa) ? 0 : cgpa;

    setResults({
      totalCredits: totalCreditHours,
      gpa: semesterGPA,
      cgpa: cgpa,
    });
  }, [courses, currentCGPA, creditsEarned, getGradePoints]);

  // Add a new course row
  const addCourse = useCallback(() => {
    const newId =
      courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1;

    setCourses((prevCourses) => [
      ...prevCourses,
      { id: newId, courseCode: "", creditHours: "", grade: "" },
    ]);
  }, [courses]);

  // Delete a course row
  const deleteCourse = useCallback((id: number) => {
    setCourses((prevCourses) =>
      prevCourses.filter((course) => course.id !== id),
    );
  }, []);

  // Update a course field
  const updateCourse = useCallback(
    (id: number, field: keyof Course, value: string | number) => {
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === id ? { ...course, [field]: value } : course,
        ),
      );
    },
    [],
  );

  // Reset the form
  const resetForm = useCallback(() => {
    if (typeof window === "undefined") return;

    // Clear localStorage and sessionStorage
    localStorage.removeItem(APP_CONFIG.STORAGE_KEY);
    sessionStorage.removeItem(APP_CONFIG.SESSION_KEY);

    // Reset all state values
    setCurrentCGPA("");
    setCreditsEarned("");
    setCourses(getDefaultCourses());
    setLastSaved(null);
    setRestoredFromStorage(false);
  }, [getDefaultCourses]);

  // Set default row count
  const setDefaultRowCount = useCallback(
    (count: number) => {
      if (typeof window === "undefined") return;

      // Update in memory
      APP_CONFIG.DEFAULT_ROWS = count;

      // Update in localStorage
      try {
        const parsedConfig = JSON.parse(
          localStorage.getItem(APP_CONFIG.CONFIG_KEY) || "{}",
        );
        parsedConfig.DEFAULT_ROWS = count;
        localStorage.setItem(
          APP_CONFIG.CONFIG_KEY,
          JSON.stringify(parsedConfig),
        );
      } catch (error) {
        console.error("Error saving default row count:", error);
      }

      // Reset the form with the new row count
      resetForm();
    },
    [resetForm],
  );

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Load configuration first
      const savedConfig = localStorage.getItem(APP_CONFIG.CONFIG_KEY);
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        if (parsedConfig.DEFAULT_ROWS) {
          APP_CONFIG.DEFAULT_ROWS = parsedConfig.DEFAULT_ROWS;
        }
      }

      // Load saved calculation data
      const savedData = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
      if (savedData) {
        const parsedData: SavedData = JSON.parse(savedData);
        setCurrentCGPA(parsedData.currentCGPA);
        setCreditsEarned(parsedData.creditsEarned);
        setCourses(
          parsedData.courses.length > 0
            ? parsedData.courses
            : getDefaultCourses(),
        );
        setLastSaved(parsedData.lastUpdated);
        // Only set restoredFromStorage to true if there's meaningful data
        if (
          (parsedData.currentCGPA && parsedData.currentCGPA !== "") ||
          (parsedData.creditsEarned && parsedData.creditsEarned !== "") ||
          (parsedData.courses &&
            parsedData.courses.length > 0 &&
            parsedData.courses.some(
              (c) => c.courseCode || c.creditHours || c.grade,
            ))
        ) {
          setRestoredFromStorage(true);
        }
      } else {
        // Initialize with default courses if no saved data
        setCourses(getDefaultCourses());
        setRestoredFromStorage(false);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setCourses(getDefaultCourses());
      setRestoredFromStorage(false);
    }

    setMounted(true);
  }, [getDefaultCourses]);

  // Calculate CGPA whenever relevant state changes
  useEffect(() => {
    if (mounted) {
      calculateCGPA();
    }
  }, [calculateCGPA, courses, currentCGPA, creditsEarned, mounted]);

  // Save data to localStorage when relevant state changes
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const data: SavedData = {
      currentCGPA,
      creditsEarned,
      courses,
      lastUpdated: new Date().toISOString(),
    };

    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(data));
      setLastSaved(data.lastUpdated);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [courses, currentCGPA, creditsEarned, mounted]);

  return {
    // State
    currentCGPA,
    setCurrentCGPA,
    creditsEarned,
    setCreditsEarned,
    courses,
    results,
    lastSaved,
    mounted,
    restoredFromStorage,

    // Actions
    addCourse,
    deleteCourse,
    updateCourse,
    resetForm,
    setDefaultRowCount,
  };
}
