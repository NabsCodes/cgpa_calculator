"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Plus,
  Trash2,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
  GraduationCap,
  AlertTriangle,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useCGPACalculator,
  Semester,
  SemesterCourse,
  GRADE_POINTS,
} from "@/hooks/use-what-if-cgpa";

interface ScenarioSimulatorProps {
  currentCGPA: number;
  creditsEarned: number;
  goalCGPA: number;
  onSimulationResult: (
    achievable: boolean,
    projectedCGPA: number,
    isExactMatch: boolean,
    totalCredits: number,
  ) => void;
}

const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  currentCGPA,
  creditsEarned,
  goalCGPA,
  onSimulationResult,
}) => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isAllSemestersExpanded, setIsAllSemestersExpanded] =
    useState<boolean>(true);

  // Check if any courses have been filled out
  const hasEnteredCourses = useMemo(() => {
    return semesters.some((semester) =>
      semester.courses.some((course) => course.creditHours && course.grade),
    );
  }, [semesters]);

  // Check if any semesters have courses (for displaying preset buttons)
  const hasSemestersWithCourses = useMemo(() => {
    return semesters.some((semester) => semester.courses.length > 0);
  }, [semesters]);

  // Update all semesters expanded state whenever semesters change
  useEffect(() => {
    if (semesters.length > 1) {
      const allExpanded = semesters.every((semester) => semester.isOpen);
      setIsAllSemestersExpanded(allExpanded);
    }
  }, [semesters]);

  // Use the custom hook for CGPA calculations
  const {
    projectedCGPA,
    isAchievable,
    totalNewCredits,
    isGoalBelowCurrent,
    isGoalEqualCurrent,
    isMaxGoal,
    isExactMatch,
  } = useCGPACalculator({
    currentCGPA,
    creditsEarned,
    goalCGPA,
    semesters,
  });

  // Generate the next semester name based on current date
  const generateNextSemesterName = useCallback((offset = 0) => {
    const now = new Date();
    let year = now.getFullYear();
    const month = now.getMonth(); // 0-11 (Jan-Dec)

    // Determine current term
    let currentTerm;
    if (month >= 0 && month <= 3) {
      // Jan-Apr
      currentTerm = "Spring";
    } else if (month >= 4 && month <= 7) {
      // May-Aug
      currentTerm = "Summer";
    } else {
      // Sep-Dec
      currentTerm = "Fall";
    }

    // Calculate subsequent terms based on offset
    const termSequence = ["Spring", "Summer", "Fall"];
    let termIndex = termSequence.indexOf(currentTerm);

    // If offset is 0, return current term and year
    if (offset === 0) {
      return `${currentTerm} ${year}`;
    }

    // Calculate future term and year
    for (let i = 0; i < offset; i++) {
      termIndex = (termIndex + 1) % 3;
      // Increment year when we cycle back to Spring
      if (termIndex === 0) {
        year++;
      }
    }

    return `${termSequence[termIndex]} ${year}`;
  }, []);

  // Create a component for the empty state message
  const EmptyStateMessage = () => (
    <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center dark:border-slate-700 dark:bg-slate-800/20">
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="rounded-full bg-slate-100 p-2 dark:bg-slate-800">
          <GraduationCap className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </div>
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          No Course Data Yet
        </h3>
        <p className="max-w-sm text-xs text-slate-500 dark:text-slate-400">
          Add courses to see how they'll affect your CGPA.
        </p>
        <Button
          variant="default"
          size="sm"
          onClick={() => handleAddFirstSemester()}
          className="mt-1"
        >
          <Plus className="mr-1 h-3 w-3" /> Add Courses
        </Button>
      </div>
    </div>
  );

  // Call the parent callback with simulation results using a ref to store the last values
  const lastValuesRef = React.useRef({
    projectedCGPA,
    isAchievable,
    isExactMatch,
    totalNewCredits,
  });

  React.useEffect(() => {
    // Only call if values changed to avoid unnecessary renders
    if (
      lastValuesRef.current.projectedCGPA !== projectedCGPA ||
      lastValuesRef.current.isAchievable !== isAchievable ||
      lastValuesRef.current.isExactMatch !== isExactMatch ||
      lastValuesRef.current.totalNewCredits !== totalNewCredits
    ) {
      lastValuesRef.current = {
        projectedCGPA,
        isAchievable,
        isExactMatch,
        totalNewCredits,
      };
      onSimulationResult(
        isAchievable,
        projectedCGPA,
        isExactMatch,
        totalNewCredits,
      );
    }
  }, [
    projectedCGPA,
    isAchievable,
    isExactMatch,
    totalNewCredits,
    onSimulationResult,
  ]);

  // Add the first semester with 3 default courses
  const handleAddFirstSemester = useCallback(() => {
    // Create 3 default course rows
    const defaultCourses: SemesterCourse[] = [
      { id: 1, creditHours: "", grade: "" },
      { id: 2, creditHours: "", grade: "" },
      { id: 3, creditHours: "", grade: "" },
      { id: 4, creditHours: "", grade: "" },
      { id: 5, creditHours: "", grade: "" },
      { id: 6, creditHours: "", grade: "" },
    ];

    setSemesters([
      {
        id: 1,
        name: generateNextSemesterName(0), // Use current term
        courses: defaultCourses,
        isOpen: true,
      },
    ]);
  }, [generateNextSemesterName]);

  // Memoize event handlers to prevent unnecessary re-renders
  const addSemester = useCallback(() => {
    const newId =
      semesters.length > 0 ? Math.max(...semesters.map((s) => s.id)) + 1 : 1;

    // Create 6 default course rows for the new semester
    const defaultCourses: SemesterCourse[] = [
      { id: 1, creditHours: "", grade: "" },
      { id: 2, creditHours: "", grade: "" },
      { id: 3, creditHours: "", grade: "" },
      { id: 4, creditHours: "", grade: "" },
      { id: 5, creditHours: "", grade: "" },
      { id: 6, creditHours: "", grade: "" },
    ];

    setSemesters((prevSemesters) => [
      ...prevSemesters,
      {
        id: newId,
        name: generateNextSemesterName(newId), // Generate next semester name based on position
        courses: defaultCourses,
        isOpen: true,
      },
    ]);
  }, [semesters, generateNextSemesterName]);

  const removeSemester = useCallback((semesterId: number) => {
    setSemesters((prevSemesters) =>
      prevSemesters.filter((s) => s.id !== semesterId),
    );
  }, []);

  const addCourse = useCallback((semesterId: number) => {
    setSemesters((prevSemesters) =>
      prevSemesters.map((semester) => {
        if (semester.id === semesterId) {
          const newCourseId =
            semester.courses.length > 0
              ? Math.max(...semester.courses.map((c) => c.id)) + 1
              : 1;

          return {
            ...semester,
            courses: [
              ...semester.courses,
              { id: newCourseId, creditHours: "", grade: "" },
            ],
          };
        }
        return semester;
      }),
    );
  }, []);

  const removeCourse = useCallback((semesterId: number, courseId: number) => {
    setSemesters((prevSemesters) =>
      prevSemesters.map((semester) => {
        if (semester.id === semesterId) {
          return {
            ...semester,
            courses: semester.courses.filter((c) => c.id !== courseId),
          };
        }
        return semester;
      }),
    );
  }, []);

  const updateCourse = useCallback(
    (
      semesterId: number,
      courseId: number,
      field: keyof SemesterCourse,
      value: string,
    ) => {
      setSemesters((prevSemesters) =>
        prevSemesters.map((semester) => {
          if (semester.id === semesterId) {
            return {
              ...semester,
              courses: semester.courses.map((course) => {
                if (course.id === courseId) {
                  return { ...course, [field]: value };
                }
                return course;
              }),
            };
          }
          return semester;
        }),
      );
    },
    [],
  );

  const updateSemesterName = useCallback((semesterId: number, name: string) => {
    setSemesters((prevSemesters) =>
      prevSemesters.map((semester) => {
        if (semester.id === semesterId) {
          return { ...semester, name };
        }
        return semester;
      }),
    );
  }, []);

  const toggleSemester = useCallback((semesterId: number) => {
    setSemesters((prevSemesters) => {
      const updatedSemesters = prevSemesters.map((semester) => {
        if (semester.id === semesterId) {
          return { ...semester, isOpen: !semester.isOpen };
        }
        return semester;
      });

      // Let the useEffect handle updating the isAllSemestersExpanded state
      // This avoids state update conflicts
      return updatedSemesters;
    });
  }, []);

  // Function to toggle all semesters expand/collapse state with performance optimization
  const toggleAllSemesters = useCallback(() => {
    const newExpandedState = !isAllSemestersExpanded;
    setIsAllSemestersExpanded(newExpandedState);

    // Use a single state update to improve performance
    setSemesters((prevSemesters) =>
      prevSemesters.map((semester) => ({
        ...semester,
        isOpen: newExpandedState,
      })),
    );
  }, [isAllSemestersExpanded]);

  // Get status color based on goal, current, and projected CGPA
  const getStatusColorClass = useCallback(() => {
    if (isMaxGoal && !isAchievable) {
      return "text-amber-600 dark:text-amber-400";
    } else if (isGoalEqualCurrent) {
      return "text-blue-600 dark:text-blue-400";
    } else if (isGoalBelowCurrent) {
      return "text-blue-600 dark:text-blue-400";
    } else if (isAchievable) {
      return "text-green-600 dark:text-green-400";
    } else {
      return "text-amber-600 dark:text-amber-400";
    }
  }, [isGoalEqualCurrent, isGoalBelowCurrent, isAchievable, isMaxGoal]);

  // Function to apply grade presets to all courses
  const applyGradePreset = useCallback((preset: string) => {
    setSemesters((prevSemesters) =>
      prevSemesters.map((semester) => ({
        ...semester,
        courses: semester.courses.map((course) => {
          let gradeValue = "";

          switch (preset) {
            case "allAs":
              gradeValue = "A";
              break;
            case "allBs":
              gradeValue = "B+";
              break;
            case "bAverage": {
              // Randomly assign B+, B, or B- for a B average
              const bGrades = ["B+", "B", "B-"];
              gradeValue = bGrades[Math.floor(Math.random() * bGrades.length)];
              break;
            }
            case "cAverage": {
              // Randomly assign C+, C, or C- for a C average
              const cGrades = ["C+", "C", "C-"];
              gradeValue = cGrades[Math.floor(Math.random() * cGrades.length)];
              break;
            }
            default:
              gradeValue = course.grade;
          }

          return {
            ...course,
            grade: gradeValue,
          };
        }),
      })),
    );
  }, []);

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Left side - Title and info */}
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Plan Your Future Courses
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 cursor-help text-slate-400" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="max-w-[250px] text-center text-xs">
                    Add courses and select grades to see how they would affect
                    your CGPA
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Right side - Stats in a row */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-3">
            <Badge
              variant="outline"
              className="h-6 border-slate-200 bg-white px-2 py-0 dark:border-slate-700 dark:bg-slate-800"
            >
              <span className="text-slate-500 dark:text-slate-400">
                Credits:
              </span>
              <span className="ml-1 font-medium text-slate-700 dark:text-slate-300">
                {totalNewCredits}
              </span>
            </Badge>

            <div className="flex h-6 items-center rounded-md border border-slate-200 bg-white px-2 py-0 dark:border-slate-700 dark:bg-slate-800">
              <span className="text-slate-500 dark:text-slate-400">CGPA:</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1 flex cursor-help items-center">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {currentCGPA.toFixed(2)}
                      </span>
                      <span className="mx-1 text-slate-400">→</span>
                      <span
                        className={`font-medium ${hasEnteredCourses ? getStatusColorClass() : "text-slate-500"}`}
                      >
                        {projectedCGPA.toFixed(2)}
                      </span>
                      {hasEnteredCourses && projectedCGPA > currentCGPA ? (
                        <span className="ml-1 text-green-500 dark:text-green-400">
                          (+{(projectedCGPA - currentCGPA).toFixed(2)})
                        </span>
                      ) : hasEnteredCourses && projectedCGPA < currentCGPA ? (
                        <span className="ml-1 text-red-500 dark:text-red-400">
                          ({(projectedCGPA - currentCGPA).toFixed(2)})
                        </span>
                      ) : (
                        <span className="ml-1 text-slate-400">(=)</span>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      From <strong>{currentCGPA.toFixed(2)}</strong> to{" "}
                      <strong>{projectedCGPA.toFixed(2)}</strong> with the added
                      courses
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* CGPA status indicator - simplified design */}
            {hasEnteredCourses && (
              <div className="flex h-6 items-center">
                <Badge
                  variant="outline"
                  className={`h-6 px-2 py-0 ${
                    isMaxGoal && !isAchievable
                      ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/30 dark:bg-amber-900/20 dark:text-amber-300"
                      : isGoalEqualCurrent || isGoalBelowCurrent
                        ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/30 dark:bg-blue-900/20 dark:text-blue-300"
                        : isExactMatch
                          ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800/30 dark:bg-green-900/20 dark:text-green-300"
                          : isAchievable
                            ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800/30 dark:bg-green-900/20 dark:text-green-300"
                            : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/30 dark:bg-amber-900/20 dark:text-amber-300"
                  }`}
                >
                  {isMaxGoal && !isAchievable ? (
                    <span className="flex items-center">
                      <AlertTriangle className="mr-1 h-3 w-3" /> Need All A's
                    </span>
                  ) : isGoalEqualCurrent ? (
                    <span className="flex items-center">
                      <Check className="mr-1 h-3 w-3" /> Goal Met
                    </span>
                  ) : isGoalBelowCurrent ? (
                    <span className="flex items-center">
                      <Check className="mr-1 h-3 w-3" /> Exceeded
                    </span>
                  ) : isExactMatch ? (
                    <span className="flex items-center">
                      <Check className="mr-1 h-3 w-3" /> Exact Match
                    </span>
                  ) : isAchievable ? (
                    <span className="flex items-center">
                      <Check className="mr-1 h-3 w-3" /> Achievable
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <AlertTriangle className="mr-1 h-3 w-3" /> Need Higher
                      Grades
                    </span>
                  )}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preset Templates and Collapse/Expand All - only show when semesters exist */}
      {hasSemestersWithCourses && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="flex items-center text-xs text-slate-500">
              <Wand2 className="mr-1 h-3 w-3" /> Presets:
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyGradePreset("allAs")}
                className="h-7 rounded-sm px-2 text-xs"
              >
                All A's
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyGradePreset("allBs")}
                className="h-7 rounded-sm px-2 text-xs"
              >
                All B's
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyGradePreset("bAverage")}
                className="h-7 rounded-sm px-2 text-xs"
              >
                B Average
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyGradePreset("cAverage")}
                className="h-7 rounded-sm px-2 text-xs"
              >
                C Average
              </Button>
            </div>
          </div>

          {/* Collapse/Expand button - only show when multiple semesters exist */}
          {semesters.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAllSemesters}
              className="h-7 rounded-sm px-2 text-xs text-slate-600"
            >
              {isAllSemestersExpanded ? (
                <span className="flex items-center">
                  <ChevronUp className="mr-1 h-3 w-3" /> Collapse All
                </span>
              ) : (
                <span className="flex items-center">
                  <ChevronDown className="mr-1 h-3 w-3" /> Expand All
                </span>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Show empty state message if no semesters have been added */}
      {semesters.length === 0 ? (
        <EmptyStateMessage />
      ) : (
        /* Course listing area */
        <div className="space-y-3">
          {semesters.map((semester) => (
            <motion.div
              key={semester.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={`border-slate-200 shadow-sm dark:border-slate-700 ${
                  !semester.isOpen ? "rounded-lg" : "rounded-t-lg"
                }`}
              >
                <div
                  className={`flex cursor-pointer items-center justify-between border-b border-slate-200 p-3 dark:border-slate-700 ${
                    !semester.isOpen ? "rounded-lg" : "rounded-t-lg"
                  }`}
                  onClick={() => toggleSemester(semester.id)}
                >
                  <div className="flex items-center gap-2">
                    {semester.isOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <Input
                      value={semester.name}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateSemesterName(semester.id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="h-8 w-40 text-sm font-medium sm:w-48 md:w-56"
                      aria-label={`Semester name for semester ${semester.id}`}
                      placeholder="Semester Name"
                    />
                    <span className="text-xs text-slate-500">
                      ({semester.courses.length}{" "}
                      {semester.courses.length === 1 ? "course" : "courses"})
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSemester(semester.id);
                    }}
                    disabled={semesters.length === 1}
                    className="h-8 px-2 text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950/20 dark:hover:text-red-300"
                    aria-label={`Remove ${semester.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <AnimatePresence>
                  {semester.isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent className="rounded-b-lg p-3">
                        <div className="space-y-2">
                          {/* Helper text for course headers */}
                          <div className="mb-2 grid grid-cols-12 gap-2 px-2 text-xs text-slate-500">
                            <div className="col-span-5 sm:col-span-6">
                              Course Grade
                            </div>
                            <div className="col-span-5 sm:col-span-4">
                              Credit Hours
                            </div>
                            <div className="col-span-2"></div>
                          </div>

                          {/* Course rows */}
                          {semester.courses.map((course) => (
                            <div
                              key={course.id}
                              className="grid grid-cols-12 gap-2"
                            >
                              <div className="col-span-5 sm:col-span-6">
                                <Select
                                  value={course.grade}
                                  onValueChange={(value) =>
                                    updateCourse(
                                      semester.id,
                                      course.id,
                                      "grade",
                                      value,
                                    )
                                  }
                                >
                                  <SelectTrigger
                                    className={`h-9 text-sm ${!course.grade ? "border-slate-300 dark:border-slate-600" : "bg-slate-50 dark:bg-slate-800"}`}
                                  >
                                    <SelectValue placeholder="Select Grade" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.keys(GRADE_POINTS).map((grade) => (
                                      <SelectItem key={grade} value={grade}>
                                        {grade} (
                                        {GRADE_POINTS[grade].toFixed(1)})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="col-span-5 sm:col-span-4">
                                <Select
                                  value={course.creditHours}
                                  onValueChange={(value) =>
                                    updateCourse(
                                      semester.id,
                                      course.id,
                                      "creditHours",
                                      value,
                                    )
                                  }
                                >
                                  <SelectTrigger
                                    className={`h-9 text-sm ${!course.creditHours ? "border-slate-300 dark:border-slate-600" : "bg-slate-50 dark:bg-slate-800"}`}
                                  >
                                    <SelectValue placeholder="Credits" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[1, 2, 3, 4]
                                      .map((credit) => (
                                        <SelectItem
                                          key={credit}
                                          value={credit.toString()}
                                        >
                                          {credit} credit
                                          {credit !== 1 ? "s" : ""}
                                        </SelectItem>
                                      ))
                                      .reverse()}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="col-span-2 flex justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeCourse(semester.id, course.id)
                                  }
                                  className="h-9 w-9 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950/20 dark:hover:text-red-300"
                                  aria-label="Remove course"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}

                          {/* Add course button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addCourse(semester.id)}
                            className="mt-3 w-full transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/70"
                          >
                            <Plus className="mr-1 h-3 w-3" /> Add Course
                          </Button>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Semester Button - only show if at least one semester exists */}
      {semesters.length > 0 && (
        <Button
          variant="outline"
          onClick={addSemester}
          className="mb-2 w-full bg-white shadow-sm transition-colors hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/70"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Semester
        </Button>
      )}

      {/* Tip Area - Simplified for mobile */}
      <div className="flex items-start gap-2 rounded-md bg-slate-50 p-3 dark:bg-slate-800/50">
        <Lightbulb className="h-4 w-4 flex-shrink-0 text-amber-500 dark:text-amber-400" />
        <p className="text-xs text-slate-600 dark:text-slate-400">
          <strong>Tip:</strong> Try different grades to see how they affect your
          CGPA.
        </p>
      </div>
    </div>
  );
};

export default ScenarioSimulator;
