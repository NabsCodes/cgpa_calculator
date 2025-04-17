"use client";

import React, { useRef } from "react";
import { Trash2, InfoIcon } from "lucide-react";
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

const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  updateCourse,
  deleteCourse,
}) => {
  // Use refs for handling keyboard navigation
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  // Handle keyboard navigation between rows
  const handleKeyDown = (
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
  };

  return (
    <div className="overflow-x-auto">
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
                      <p className="max-w-xs">
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
                      <p className="max-w-xs">
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
                      <p className="max-w-xs">Select the grade you received</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableHead>
            <TableHead className="w-[10%] text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                  <p>No courses added yet.</p>
                  <p className="mt-1">
                    Click "Add Course" to add your first course.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            courses.map((course, index) => (
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
                      onKeyDown={(e) =>
                        handleKeyDown(e as any, index, "creditHours")
                      }
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
                    onValueChange={(value) =>
                      updateCourse(course.id, "grade", value)
                    }
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
                    className="h-8 w-8 opacity-70 hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900/30"
                    onClick={() => deleteCourse(course.id)}
                    onKeyDown={(e) => handleKeyDown(e, index, "delete")}
                    aria-label={`Delete row ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;
