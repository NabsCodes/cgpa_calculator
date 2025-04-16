"use client";

import React from "react";

interface Course {
  id: number;
  courseCode: string;
  creditHours: string | number;
  grade: string;
}

interface CourseTableProps {
  courses: Course[];
  updateCourse: (
    id: number,
    field: keyof Course,
    value: string | number
  ) => void;
  deleteCourse: (id: number) => void;
}

const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  updateCourse,
  deleteCourse,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full mb-4">
        <thead>
          <tr className="bg-slate-700/50">
            <th className="p-3 text-left text-sm font-medium text-slate-300">
              Course Code
            </th>
            <th className="p-3 text-left text-sm font-medium text-slate-300">
              Credit Hours
            </th>
            <th className="p-3 text-left text-sm font-medium text-slate-300">
              Grade
            </th>
            <th className="p-3 w-16"></th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="border-t border-slate-700">
              <td className="p-3">
                <input
                  type="text"
                  value={course.courseCode}
                  onChange={(e) =>
                    updateCourse(course.id, "courseCode", e.target.value)
                  }
                  placeholder="Eg: AUN 101"
                  className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="p-3">
                <select
                  value={course.creditHours}
                  onChange={(e) =>
                    updateCourse(course.id, "creditHours", e.target.value)
                  }
                  className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="" disabled>
                    --
                  </option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                  <option value="0">0</option>
                </select>
              </td>
              <td className="p-3">
                <select
                  value={course.grade}
                  onChange={(e) =>
                    updateCourse(course.id, "grade", e.target.value)
                  }
                  className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="" disabled>
                    --
                  </option>
                  <option value="A">A</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="B-">B-</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="F">F</option>
                  <option value="W">W</option>
                  <option value="WP">WP</option>
                  <option value="WF">WF</option>
                </select>
              </td>
              <td className="p-3">
                <button
                  onClick={() => deleteCourse(course.id)}
                  className="p-2 text-red-400 hover:text-red-300 focus:outline-none">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable;
