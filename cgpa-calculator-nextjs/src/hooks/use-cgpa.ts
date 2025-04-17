import { useState, useEffect } from "react";

// Type definition for a Course
export interface Course {
  id: number;
  courseCode: string;
  creditHours: string | number;
  grade: string;
}

// Define the structure of our saved data
export interface SavedData {
  currentCGPA: number | string;
  creditsEarned: number | string;
  courses: Course[];
  lastUpdated: string;
}

// App Configuration
export const APP_CONFIG = {
  DEFAULT_ROWS: 3, // This will be overridden by localStorage if available
  STORAGE_KEY: "cgpaCalculatorData",
  SESSION_KEY: "cgpaDataNotified",
  CONFIG_KEY: "cgpaCalculatorConfig", // Key to store configuration
};

export function useCGPA() {
  const [currentCGPA, setCurrentCGPA] = useState<number | string>("");
  const [creditsEarned, setCreditsEarned] = useState<number | string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [results, setResults] = useState({
    totalCredits: 0,
    gpa: 0,
    cgpa: 0,
  });
  const [mounted, setMounted] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Helper function to get default courses
  const getDefaultCourses = (
    numRows: number = APP_CONFIG.DEFAULT_ROWS,
  ): Course[] => {
    return Array.from({ length: numRows }, (_, index) => ({
      id: index + 1,
      courseCode: "",
      creditHours: "",
      grade: "",
    }));
  };

  // Function to get grade points
  const getGradePoints = (grade: string): number => {
    switch (grade) {
      case "A":
        return 4.0;
      case "A-":
        return 3.7;
      case "B+":
        return 3.3;
      case "B":
        return 3.0;
      case "B-":
        return 2.7;
      case "C+":
        return 2.3;
      case "C":
        return 2.0;
      case "D":
        return 1.0;
      case "F":
      case "W":
      case "WP":
      case "WF":
      default:
        return 0.0;
    }
  };

  // Calculate CGPA based on courses and current CGPA
  const calculateCGPA = () => {
    let totalGradePoints = 0;
    let totalCreditHours = 0;

    courses.forEach((course) => {
      if (course.creditHours && course.grade) {
        const creditHours = parseInt(course.creditHours.toString());
        const gradePoints = getGradePoints(course.grade);

        if (!isNaN(creditHours) && !isNaN(gradePoints)) {
          totalGradePoints += gradePoints * creditHours;
          totalCreditHours += creditHours;
        }
      }
    });

    let newGPA = 0;
    let cgpa = 0;

    if (totalCreditHours > 0) {
      newGPA = totalGradePoints / totalCreditHours;

      const currentCGPAValue = parseFloat(currentCGPA.toString());
      const creditsEarnedValue = parseFloat(creditsEarned.toString());

      if (
        !isNaN(currentCGPAValue) &&
        !isNaN(creditsEarnedValue) &&
        currentCGPAValue > 0 &&
        creditsEarnedValue > 0
      ) {
        cgpa =
          (currentCGPAValue * creditsEarnedValue + totalGradePoints) /
          (creditsEarnedValue + totalCreditHours);

        // Cap CGPA at 4.0 instead of resetting to 0
        if (cgpa > 4.0) {
          cgpa = 4.0;
        }
      } else {
        cgpa = newGPA;
      }
    } else if (currentCGPA) {
      const currentCGPAValue = parseFloat(currentCGPA.toString());
      if (!isNaN(currentCGPAValue) && currentCGPAValue > 0) {
        cgpa = currentCGPAValue;
      }
    }

    // Ensure values are not NaN
    if (isNaN(cgpa)) cgpa = 0;
    if (isNaN(newGPA)) newGPA = 0;

    setResults({
      totalCredits: totalCreditHours,
      gpa: newGPA,
      cgpa: cgpa,
    });
  };

  // Add a new course row
  const addCourse = () => {
    const newId =
      courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1;
    setCourses([
      ...courses,
      { id: newId, courseCode: "", creditHours: "", grade: "" },
    ]);
  };

  // Delete a course row
  const deleteCourse = (id: number) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  // Update a course field
  const updateCourse = (
    id: number,
    field: keyof Course,
    value: string | number,
  ) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, [field]: value } : course,
      ),
    );
  };

  // Reset the form
  const resetForm = () => {
    if (typeof window !== "undefined") {
      // Clear localStorage data
      localStorage.removeItem(APP_CONFIG.STORAGE_KEY);
      sessionStorage.removeItem(APP_CONFIG.SESSION_KEY);
    }

    // Reset all state values
    setCurrentCGPA("");
    setCreditsEarned("");
    setCourses(getDefaultCourses(APP_CONFIG.DEFAULT_ROWS));
    setLastSaved(null);
  };

  // Set default row count
  const setDefaultRowCount = (count: number) => {
    if (typeof window !== "undefined") {
      // Update in memory
      APP_CONFIG.DEFAULT_ROWS = count;

      // Update in localStorage
      try {
        const savedConfig = localStorage.getItem(APP_CONFIG.CONFIG_KEY) || "{}";
        const parsedConfig = JSON.parse(savedConfig);
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
    }
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
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
        } else {
          // Initialize with default courses if no saved data
          setCourses(getDefaultCourses());
        }

        // Load default row count from localStorage if available
        const savedConfig = localStorage.getItem(APP_CONFIG.CONFIG_KEY);
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          if (parsedConfig.DEFAULT_ROWS) {
            APP_CONFIG.DEFAULT_ROWS = parsedConfig.DEFAULT_ROWS;
          }
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
        setCourses(getDefaultCourses());
      }
      setMounted(true);
    }
  }, []);

  // Auto-save data to localStorage whenever relevant state changes
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      const now = new Date().toISOString();

      // Try to get the previous saved data to compare
      let previousData: SavedData | null = null;
      try {
        const savedString = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
        if (savedString) {
          previousData = JSON.parse(savedString);
        }
      } catch (error) {
        console.error("Error reading previous data:", error);
      }

      // Check if anything has actually changed before saving
      const hasChanged =
        !previousData ||
        previousData.currentCGPA !== currentCGPA ||
        previousData.creditsEarned !== creditsEarned ||
        JSON.stringify(previousData.courses) !== JSON.stringify(courses);

      if (hasChanged) {
        const dataToSave: SavedData = {
          currentCGPA,
          creditsEarned,
          courses,
          lastUpdated: now,
        };
        localStorage.setItem(
          APP_CONFIG.STORAGE_KEY,
          JSON.stringify(dataToSave),
        );
        setLastSaved(now);
      }
    }
  }, [currentCGPA, creditsEarned, courses, mounted]);

  // Calculate CGPA when inputs change
  useEffect(() => {
    if (mounted) {
      // This function doesn't directly set state that would affect its own dependencies
      // so it's less likely to cause infinite loops, but we could add memoization here
      // if needed in the future
      calculateCGPA();
    }
  }, [courses, currentCGPA, creditsEarned, mounted]);

  return {
    currentCGPA,
    setCurrentCGPA,
    creditsEarned,
    setCreditsEarned,
    courses,
    results,
    lastSaved,
    addCourse,
    deleteCourse,
    updateCourse,
    resetForm,
    setDefaultRowCount,
    mounted,
  };
}
