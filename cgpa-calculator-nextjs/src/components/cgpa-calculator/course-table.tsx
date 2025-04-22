/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from "react";
import { Trash2, InfoIcon, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

interface CourseTableProps {
  courses: Array<{
    id: number;
    courseCode: string;
    creditHours: string | number;
    grade: string;
  }>;
  updateCourse: (
    id: number,
    field: "courseCode" | "creditHours" | "grade",
    value: string | number,
  ) => void;
  deleteCourse: (id: number) => void;
}

// Grade point mapping - moved outside component to avoid recreation
const GRADE_POINTS: Record<string, string> = {
  A: "4.0",
  "A-": "3.7",
  "B+": "3.3",
  B: "3.0",
  "B-": "2.7",
  "C+": "2.3",
  C: "2.0",
  "C-": "1.7",
  D: "1.0",
  F: "0.0",
  W: "0.0",
  WP: "0.0",
  WF: "0.0",
};

// Animation variants - defined outside component to prevent recreation
const contentAnimationVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1 },
};

// Memoized empty state component
const EmptyState = memo(() => (
  <div className="flex h-24 flex-col items-center justify-center text-sm text-slate-500 dark:text-slate-400">
    <p>No courses added yet.</p>
    <p className="mt-1">Click "Add Course" to add your first course.</p>
  </div>
));
EmptyState.displayName = "EmptyState";

// Memoized course card component to prevent unnecessary re-renders
const CourseCard = memo(
  ({
    course,
    index,
    isExpanded,
    toggleExpansion,
    updateCourse,
    deleteCourse,
    setCardRef,
  }: {
    course: {
      id: number;
      courseCode: string;
      creditHours: string | number;
      grade: string;
    };
    index: number;
    isExpanded: boolean;
    toggleExpansion: (id: number) => void;
    updateCourse: (
      id: number,
      field: "courseCode" | "creditHours" | "grade",
      value: string | number,
    ) => void;
    deleteCourse: (id: number) => void;
    setCardRef: (el: HTMLDivElement | null) => void;
  }) => {
    // Get grade point for display
    const gradePoint = GRADE_POINTS[course.grade] || "";

    // Handler for card header keydown
    const handleCardKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleExpansion(course.id);
      }
    };

    // Handler for delete button click
    const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteCourse(course.id);
    };

    return (
      <div
        ref={setCardRef}
        className={`overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/60 ${!isExpanded ? "rounded-b-lg" : ""}`}
      >
        {/* Clickable card header */}
        <div
          className="flex cursor-pointer items-center justify-between bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-800/90 dark:hover:bg-slate-700/70"
          onClick={() => toggleExpansion(course.id)}
          tabIndex={0}
          onKeyDown={handleCardKeyDown}
          aria-expanded={isExpanded}
          role="button"
          aria-label={`Course ${index + 1}: ${course.courseCode || "No code"}, ${
            course.creditHours || "0"
          } credits, Grade: ${course.grade || "None"}`}
        >
          <div className="flex items-center">
            {isExpanded ? (
              <ChevronUp className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
            ) : (
              <ChevronDown className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
            )}
            <h3 className="text-xs font-medium text-slate-900 dark:text-slate-100">
              Course {index + 1}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Course summary (visible when collapsed) */}
            {!isExpanded && (
              <div className="mr-2 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <span className="max-w-[80px] truncate font-medium">
                  {course.courseCode || "—"}
                </span>
                <span className="text-slate-400">|</span>
                <span className="whitespace-nowrap">
                  {course.creditHours || "—"} cr
                </span>
                <span className="text-slate-400">|</span>
                <span className="whitespace-nowrap">
                  {course.grade || "—"}
                  {course.grade ? ` (${gradePoint})` : ""}
                </span>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="-mr-1 h-6 w-6 text-slate-500 transition-colors hover:bg-red-100 hover:text-red-600 focus-visible:bg-red-100 focus-visible:text-red-600 focus-visible:ring-1 focus-visible:ring-red-400 focus-visible:ring-offset-1 dark:text-slate-400 dark:hover:bg-red-900/30 dark:focus-visible:bg-red-900/30"
              onClick={handleDeleteClick}
              aria-label={`Delete course ${index + 1}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Collapsible content */}
        <AnimatePresence initial={false} mode="wait">
          {isExpanded && (
            <motion.div
              variants={contentAnimationVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="overflow-hidden border-t border-slate-200 dark:border-slate-700"
            >
              <div className="space-y-2 bg-white p-3 pt-2 dark:bg-slate-800/60">
                <div className="space-y-1">
                  <Label
                    htmlFor={`mobile-course-code-${course.id}`}
                    className="text-xs"
                  >
                    Course Code
                  </Label>
                  <Input
                    id={`mobile-course-code-${course.id}`}
                    value={course.courseCode}
                    onChange={(e) =>
                      updateCourse(course.id, "courseCode", e.target.value)
                    }
                    placeholder="Eg: AUN 101"
                    className="h-8 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label
                      htmlFor={`mobile-credit-hours-${course.id}`}
                      className="text-xs"
                    >
                      Credits
                    </Label>
                    <Select
                      value={course.creditHours.toString()}
                      onValueChange={(value) =>
                        updateCourse(course.id, "creditHours", value)
                      }
                    >
                      <SelectTrigger
                        id={`mobile-credit-hours-${course.id}`}
                        className="h-8 text-sm"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label
                      htmlFor={`mobile-grade-${course.id}`}
                      className="text-xs"
                    >
                      Grade
                    </Label>
                    <Select
                      value={course.grade.toString()}
                      onValueChange={(value) =>
                        updateCourse(course.id, "grade", value)
                      }
                    >
                      <SelectTrigger
                        id={`mobile-grade-${course.id}`}
                        className="h-8 text-sm"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A (4.0)</SelectItem>
                        <SelectItem value="A-">A- (3.7)</SelectItem>
                        <SelectItem value="B+">B+ (3.3)</SelectItem>
                        <SelectItem value="B">B (3.0)</SelectItem>
                        <SelectItem value="B-">B- (2.7)</SelectItem>
                        <SelectItem value="C+">C+ (2.3)</SelectItem>
                        <SelectItem value="C">C (2.0)</SelectItem>
                        <SelectItem value="C-">C- (1.7)</SelectItem>
                        <SelectItem value="D">D (1.0)</SelectItem>
                        <SelectItem value="F">F (0.0)</SelectItem>
                        <SelectItem value="W">W (0.0)</SelectItem>
                        <SelectItem value="WP">WP (0.0)</SelectItem>
                        <SelectItem value="WF">WF (0.0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);
CourseCard.displayName = "CourseCard";

// Main component
const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  updateCourse,
  deleteCourse,
}) => {
  // Track expanded state for each course card (default to expanded)
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>(
    courses.reduce((acc, course) => ({ ...acc, [course.id]: true }), {}),
  );

  // Global expand/collapse all state
  const [allExpanded, setAllExpanded] = useState(true);

  // Use refs for handling keyboard navigation
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Memoize the course IDs for dependency checking
  const courseIds = useMemo(
    () => courses.map((course) => course.id),
    [courses],
  );

  // Update expandedCards when courses change (new courses added)
  useEffect(() => {
    // Find any course IDs that are not in the expandedCards state
    const newCourseIds = courseIds.filter(
      (id) => expandedCards[id] === undefined,
    );

    // If we have new courses, update the expandedCards state
    if (newCourseIds.length > 0) {
      setExpandedCards((prev) => {
        const updatedCards = { ...prev };

        // Set new courses to the current global expanded state
        newCourseIds.forEach((id) => {
          updatedCards[id] = allExpanded;
        });

        return updatedCards;
      });
    }

    // Clean up removed courses from expandedCards state
    const currentIdSet = new Set(courseIds);
    const existingIds = Object.keys(expandedCards).map(Number);
    const removedIds = existingIds.filter((id) => !currentIdSet.has(id));

    if (removedIds.length > 0) {
      setExpandedCards((prev) => {
        const cleanedCards = { ...prev };
        removedIds.forEach((id) => {
          delete cleanedCards[id];
        });
        return cleanedCards;
      });
    }
  }, [courseIds, expandedCards, allExpanded]);

  // Automatically update the allExpanded state based on the current card states
  useEffect(() => {
    if (courses.length > 1) {
      const allCardsExpanded = courseIds.every((id) => expandedCards[id]);
      const allCardsCollapsed = courseIds.every((id) => !expandedCards[id]);

      if (allCardsExpanded && !allExpanded) {
        setAllExpanded(true);
      } else if (allCardsCollapsed && allExpanded) {
        setAllExpanded(false);
      }
    }
  }, [expandedCards, courseIds, courses.length, allExpanded]);

  // Toggle expansion state for a single card (memoized)
  const toggleCardExpansion = useCallback((id: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  // Toggle all cards expansion state (memoized)
  const toggleAllCards = useCallback(() => {
    const newExpandedState = !allExpanded;
    setAllExpanded(newExpandedState);

    // Update all individual cards in a single state update for better performance
    setExpandedCards(
      courses.reduce(
        (acc, course) => ({ ...acc, [course.id]: newExpandedState }),
        {},
      ),
    );
  }, [courses, allExpanded]);

  // Handle keyboard navigation between rows (memoized)
  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>,
      index: number,
      field: string,
    ) => {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault();
        // Focus next row same field
        const nextRowIndex = index + 1;
        if (nextRowIndex < courses.length) {
          const nextRowInputs = rowRefs.current[nextRowIndex]?.querySelectorAll(
            'input, button, [role="combobox"]',
          );

          if (nextRowInputs) {
            // Find the corresponding field in the next row
            let targetIndex = 0;
            if (field === "courseCode") targetIndex = 0;
            else if (field === "creditHours") targetIndex = 1;
            else if (field === "grade") targetIndex = 2;
            else if (field === "delete") targetIndex = 3;

            if (nextRowInputs[targetIndex]) {
              (nextRowInputs[targetIndex] as HTMLElement).focus();
            }
          }
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        // Focus previous row same field
        const prevRowIndex = index - 1;
        if (prevRowIndex >= 0) {
          const prevRowInputs = rowRefs.current[prevRowIndex]?.querySelectorAll(
            'input, button, [role="combobox"]',
          );

          if (prevRowInputs) {
            // Find the corresponding field in the prev row
            let targetIndex = 0;
            if (field === "courseCode") targetIndex = 0;
            else if (field === "creditHours") targetIndex = 1;
            else if (field === "grade") targetIndex = 2;
            else if (field === "delete") targetIndex = 3;

            if (prevRowInputs[targetIndex]) {
              (prevRowInputs[targetIndex] as HTMLElement).focus();
            }
          }
        }
      }
    },
    [courses.length],
  );

  // Memoized desktop table rows for better performance
  const tableRows = useMemo(() => {
    if (courses.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="h-24 text-center">
            <EmptyState />
          </TableCell>
        </TableRow>
      );
    }

    return courses.map((course, index) => (
      <TableRow
        key={course.id}
        ref={(el) => {
          rowRefs.current[index] = el;
        }}
        className="group"
      >
        <TableCell>
          <Input
            value={course.courseCode}
            onChange={(e) =>
              updateCourse(course.id, "courseCode", e.target.value)
            }
            placeholder="Eg: AUN 101"
            className="w-full"
            onKeyDown={(e) => handleKeyDown(e, index, "courseCode")}
            aria-label={`Course code for row ${index + 1}`}
          />
        </TableCell>
        <TableCell>
          <Select
            value={course.creditHours.toString()}
            onValueChange={(value) =>
              updateCourse(course.id, "creditHours", value)
            }
          >
            <SelectTrigger
              className="w-full"
              onKeyDown={(e) => handleKeyDown(e as any, index, "creditHours")}
              aria-label={`Credit hours for row ${index + 1}`}
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="1">1</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Select
            value={course.grade.toString()}
            onValueChange={(value) => updateCourse(course.id, "grade", value)}
          >
            <SelectTrigger
              className="w-full"
              onKeyDown={(e) => handleKeyDown(e as any, index, "grade")}
              aria-label={`Grade for row ${index + 1}`}
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A (4.0)</SelectItem>
              <SelectItem value="A-">A- (3.7)</SelectItem>
              <SelectItem value="B+">B+ (3.3)</SelectItem>
              <SelectItem value="B">B (3.0)</SelectItem>
              <SelectItem value="B-">B- (2.7)</SelectItem>
              <SelectItem value="C+">C+ (2.3)</SelectItem>
              <SelectItem value="C">C (2.0)</SelectItem>
              <SelectItem value="C-">C- (1.7)</SelectItem>
              <SelectItem value="D">D (1.0)</SelectItem>
              <SelectItem value="F">F (0.0)</SelectItem>
              <SelectItem value="W">W (0.0)</SelectItem>
              <SelectItem value="WP">WP (0.0)</SelectItem>
              <SelectItem value="WF">WF (0.0)</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell className="text-right">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-70 transition-colors hover:bg-red-100 hover:text-red-600 focus-visible:bg-red-100 focus-visible:text-red-600 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 group-hover:opacity-100 dark:hover:bg-red-900/30"
            onClick={() => deleteCourse(course.id)}
            onKeyDown={(e) => handleKeyDown(e, index, "delete")}
            aria-label={`Delete row ${index + 1}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ));
  }, [courses, updateCourse, deleteCourse, handleKeyDown]);

  return (
    <>
      {/* Mobile view - Collapsible Card layout */}
      <div className="space-y-4 sm:hidden">
        {courses.length > 1 && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAllCards}
              className="h-8 rounded-md text-xs font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-700/70"
            >
              {allExpanded ? (
                <>
                  <ChevronUp className="mr-1 h-3.5 w-3.5" />
                  Collapse All
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 h-3.5 w-3.5" />
                  Expand All
                </>
              )}
            </Button>
          </div>
        )}

        {courses.length === 0 ? (
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <EmptyState />
          </div>
        ) : (
          courses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              index={index}
              isExpanded={expandedCards[course.id]}
              toggleExpansion={toggleCardExpansion}
              updateCourse={updateCourse}
              deleteCourse={deleteCourse}
              setCardRef={(el) => {
                cardRefs.current[index] = el;
              }}
            />
          ))
        )}
      </div>

      {/* Desktop view - Table layout */}
      <div className="hidden overflow-x-auto sm:block">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">
                <div className="flex items-center gap-1">
                  Course Code
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-3.5 w-3.5 cursor-help text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="max-w-xs text-center">
                          Enter your course code (e.g., CSC101)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead className="w-[20%]">
                <div className="flex items-center gap-1">
                  Credits
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-3.5 w-3.5 cursor-help text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="max-w-xs text-center">
                          Select the credit hours for this course
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead className="w-[30%]">
                <div className="flex items-center gap-1">
                  Grade
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-3.5 w-3.5 cursor-help text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="max-w-xs text-center">
                          Select the grade you received
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead className="w-[10%] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{tableRows}</TableBody>
        </Table>
      </div>
    </>
  );
};

export default CourseTable;
