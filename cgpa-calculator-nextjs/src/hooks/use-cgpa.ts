import { useState, useEffect, useCallback } from "react";
import { calculateCGPA } from "@/lib/calculations";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearStorageData,
  shouldShowRestoredDataNotification,
  markNotificationShown,
} from "@/services/storage";
import {
  createDefaultCourses,
  DEFAULT_CGPA_RESULTS,
} from "@/data/default-values";
import { APP_CONFIG } from "@/data/constants";
import type { Course, CGPAResults } from "@/types/cgpa";

export function useCGPA() {
  // State definitions
  const [currentCGPA, setCurrentCGPA] = useState<number | string>("");
  const [creditsEarned, setCreditsEarned] = useState<number | string>("");
  const [courses, setCourses] = useState<Course[]>(() =>
    createDefaultCourses(),
  );
  const [results, setResults] = useState<CGPAResults>(DEFAULT_CGPA_RESULTS);
  const [mounted, setMounted] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [restoredFromStorage, setRestoredFromStorage] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [defaultRowCount, setDefaultRowCountState] = useState(
    APP_CONFIG.DEFAULT_ROWS,
  );

  // Calculate CGPA effect
  useEffect(() => {
    if (!mounted) return;

    const newResults = calculateCGPA(courses, currentCGPA, creditsEarned);
    setResults(newResults);

    // Auto-save data (only save courses with data)
    const coursesWithData = courses.filter(
      (course) => course.courseCode || course.creditHours || course.grade,
    );

    const saveResult = saveToLocalStorage({
      currentCGPA,
      creditsEarned,
      courses: coursesWithData,
    });

    if (saveResult.success) {
      setLastSaved(new Date().toISOString());
    }
  }, [courses, currentCGPA, creditsEarned, mounted]);

  // Load saved data on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadResult = loadFromLocalStorage();

    if (loadResult.success && loadResult.data) {
      const savedData = loadResult.data;

      setCurrentCGPA(savedData.currentCGPA || "");
      setCreditsEarned(savedData.creditsEarned || "");

      if (savedData.courses && savedData.courses.length > 0) {
        const restoredCourses = [...savedData.courses];

        // Ensure we have at least the default number of rows
        while (restoredCourses.length < APP_CONFIG.DEFAULT_ROWS) {
          restoredCourses.push({
            id: Math.max(...restoredCourses.map((c) => c.id), 0) + 1,
            courseCode: "",
            creditHours: "",
            grade: "",
          });
        }

        setCourses(restoredCourses);
      }

      setLastSaved(savedData.lastUpdated || null);
      setRestoredFromStorage(true);
    }

    setMounted(true);
  }, []);

  // Course management functions
  const addCourse = useCallback(() => {
    const newId =
      courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1;
    setCourses((prev) => [
      ...prev,
      {
        id: newId,
        courseCode: "",
        creditHours: "",
        grade: "",
      },
    ]);
  }, [courses]);

  const deleteCourse = useCallback((id: number) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  }, []);

  const updateCourse = useCallback(
    (id: number, field: keyof Course, value: string | number) => {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === id ? { ...course, [field]: value } : course,
        ),
      );
    },
    [],
  );

  const resetForm = useCallback(async () => {
    setIsResetting(true);

    // Add a small delay to show the loading state
    await new Promise((resolve) => setTimeout(resolve, 300));

    const clearResult = clearStorageData();

    if (clearResult.success) {
      setCurrentCGPA("");
      setCreditsEarned("");
      setCourses(createDefaultCourses());
      setLastSaved(null);
      setRestoredFromStorage(false);
      setResults(DEFAULT_CGPA_RESULTS);
      setDefaultRowCountState(APP_CONFIG.DEFAULT_ROWS); // Reset row count to default (3)
    }

    setIsResetting(false);
  }, []);

  const setDefaultRowCount = useCallback((count: number) => {
    // Update default row count and save to user preferences
    // This could be extended to save user preferences
    if (count > 0 && count <= 20) {
      const newCourses = createDefaultCourses(count);
      setCourses(newCourses);
      setDefaultRowCountState(count);
    }
  }, []);

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
    isResetting,
    defaultRowCount,

    // Actions
    addCourse,
    deleteCourse,
    updateCourse,
    resetForm,
    setDefaultRowCount,

    // Utilities
    shouldShowNotification: shouldShowRestoredDataNotification,
    markNotificationShown,
  };
}
