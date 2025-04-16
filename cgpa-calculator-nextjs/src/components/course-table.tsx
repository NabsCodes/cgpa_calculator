"use client"

import type React from "react"
import { Trash2, AlertCircle, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"

interface Course {
  id: number
  courseCode: string
  creditHours: string | number
  grade: string
}

interface CourseTableProps {
  courses: Course[]
  updateCourse: (id: number, field: keyof Course, value: string | number) => void
  deleteCourse: (id: number) => void
}

const CourseTable: React.FC<CourseTableProps> = ({ courses, updateCourse, deleteCourse }) => {
  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <table className="w-full mb-4 min-w-[600px]">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="py-3 px-2 text-left text-sm font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                Course Code
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="max-w-xs">Enter your course code (e.g., AUN 101, CS 202)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </th>
            <th className="py-3 px-2 text-left text-sm font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                Credit Hours
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="max-w-xs">Select the number of credit hours for this course</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </th>
            <th className="py-3 px-2 text-left text-sm font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                Grade
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="max-w-xs">Select the grade you received for this course</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </th>
            <th className="py-3 px-2 w-16"></th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {courses.map((course, index) => (
              <motion.tr
                key={course.id}
                className="border-b border-slate-100 dark:border-slate-800"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <td className="py-2 px-2">
                  <Input
                    type="text"
                    value={course.courseCode}
                    onChange={(e) => updateCourse(course.id, "courseCode", e.target.value)}
                    placeholder="Eg: AUN 101"
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-2">
                  <Select
                    value={course.creditHours.toString() || "-1"}
                    onValueChange={(value) => updateCourse(course.id, "creditHours", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Credits" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="-1" disabled={index === 0 && course.creditHours !== "-1"}>--</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="0">0</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-2 px-2">
                  <Select
                    value={course.grade || "-1"}
                    onValueChange={(value) => updateCourse(course.id, "grade", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-1" disabled={course.grade !== "-1"}>--</SelectItem>
                      <SelectItem value="A">A (4.0)</SelectItem>
                      <SelectItem value="A-">A- (3.7)</SelectItem>
                      <SelectItem value="B+">B+ (3.3)</SelectItem>
                      <SelectItem value="B">B (3.0)</SelectItem>
                      <SelectItem value="B-">B- (2.7)</SelectItem>
                      <SelectItem value="C+">C+ (2.3)</SelectItem>
                      <SelectItem value="C">C (2.0)</SelectItem>
                      <SelectItem value="D">D (1.0)</SelectItem>
                      <SelectItem value="F">F (0.0)</SelectItem>
                      <SelectItem value="W">W (Withdrawal)</SelectItem>
                      <SelectItem value="WP">WP (Withdrawal Passing)</SelectItem>
                      <SelectItem value="WF">WF (Withdrawal Failing)</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-2 px-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => deleteCourse(course.id)}
                          variant="ghost"
                          size="icon"
                          className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete course</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove this course</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>

          {courses.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-slate-500 dark:text-slate-400">
                <div className="flex flex-col items-center justify-center">
                  <AlertCircle className="h-8 w-8 mb-2 text-slate-400" />
                  <p>No courses added yet</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default CourseTable
