'use client';

import { useState, useEffect } from 'react';
import CGPAForm from '@/components/cgpa-form';
import CourseTable from '@/components/course-table';
import Results from '@/components/results';
import ProgressBar from '@/components/progress-bar';
import Footer from '@/components/footer';

export default function Home() {
  const [currentCGPA, setCurrentCGPA] = useState<number | string>('');
  const [creditsEarned, setCreditsEarned] = useState<number | string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [results, setResults] = useState({
    totalCredits: 0,
    gpa: 0,
    cgpa: 0,
  });

  // Initialize with 4 empty courses
  useEffect(() => {
    if (courses.length === 0) {
      setCourses([
        { id: 1, courseCode: '', creditHours: '', grade: '' },
        { id: 2, courseCode: '', creditHours: '', grade: '' },
        { id: 3, courseCode: '', creditHours: '', grade: '' },
        { id: 4, courseCode: '', creditHours: '', grade: '' },
      ]);
    }
  }, [courses.length]);

  // Function to get grade points
  const getGradePoints = (grade: string): number => {
    switch (grade) {
      case "A": return 4.0;
      case "A-": return 3.7;
      case "B+": return 3.3;
      case "B": return 3.0;
      case "B-": return 2.7;
      case "C+": return 2.3;
      case "C": return 2.0;
      case "D": return 1.0;
      case "F":
      case "W":
      case "WP":
      case "WF":
      default: return 0.0;
    }
  };

  // Calculate CGPA based on courses and current CGPA
  const calculateCGPA = () => {
    let totalGradePoints = 0;
    let totalCreditHours = 0;

    courses.forEach(course => {
      if (course.creditHours && course.grade) {
        const creditHours = parseInt(course.creditHours.toString());
        const gradePoints = getGradePoints(course.grade);
        totalGradePoints += gradePoints * creditHours;
        totalCreditHours += creditHours;
      }
    });

    let newGPA = 0;
    let cgpa = 0;

    if (totalCreditHours > 0) {
      newGPA = totalGradePoints / totalCreditHours;

      if (currentCGPA && creditsEarned) {
        const currentCGPAValue = parseFloat(currentCGPA.toString());
        const creditsEarnedValue = parseFloat(creditsEarned.toString());

        if (currentCGPAValue > 0 && creditsEarnedValue > 0) {
          cgpa = ((currentCGPAValue * creditsEarnedValue) + totalGradePoints) / (creditsEarnedValue + totalCreditHours);
          if (cgpa > 4.0) cgpa = 0.0;
        } else {
          cgpa = newGPA;
        }
      } else {
        cgpa = newGPA;
      }
    } else if (currentCGPA && parseFloat(currentCGPA.toString()) > 0) {
      cgpa = parseFloat(currentCGPA.toString());
    }

    setResults({
      totalCredits: totalCreditHours,
      gpa: newGPA,
      cgpa: cgpa
    });
  };

  // Add a new course row
  const addCourse = () => {
    setCourses([
      ...courses,
      { id: Date.now(), courseCode: '', creditHours: '', grade: '' }
    ]);
  };

  // Delete a course row
  const deleteCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
    setTimeout(calculateCGPA, 0);
  };

  // Update course information
  const updateCourse = (id: number, field: keyof Course, value: string | number) => {
    setCourses(courses.map(course =>
      course.id === id ? { ...course, [field]: value } : course
    ));
    setTimeout(calculateCGPA, 0);
  };

  // Reset form
  const resetForm = () => {
    setCurrentCGPA('');
    setCreditsEarned('');
    setCourses([
      { id: 1, courseCode: '', creditHours: '', grade: '' },
      { id: 2, courseCode: '', creditHours: '', grade: '' },
      { id: 3, courseCode: '', creditHours: '', grade: '' },
      { id: 4, courseCode: '', creditHours: '', grade: '' },
    ]);
    setResults({
      totalCredits: 0,
      gpa: 0,
      cgpa: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-4xl mx-auto pt-10 pb-20 px-4">
        <h1 className="text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          CGPA CALCULATOR
        </h1>
        <p className="text-center text-lg font-semibold mb-1">
          <span className="px-3 py-1 rounded-full bg-gray-700 text-sm text-emerald-300">
            GRADE SCALE: 4.00
          </span>
        </p>
        <p className="text-center text-slate-300 mb-6">
          Enter your course details below
        </p>
        
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
          <CGPAForm
            currentCGPA={currentCGPA}
            creditsEarned={creditsEarned}
            setCurrentCGPA={setCurrentCGPA}
            setCreditsEarned={setCreditsEarned}
            calculateCGPA={calculateCGPA}
          />
          
          <CourseTable
            courses={courses}
            updateCourse={updateCourse}
            deleteCourse={deleteCourse}
          />
          
          <button
            onClick={addCourse}
            className="mt-4 w-full md:w-auto md:mx-auto md:px-6 py-2 flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Course
          </button>
          
          <Results results={results} />
          
          <div className="mt-6">
            <p className="text-center mb-2 font-semibold text-slate-300">
              Academic Standing
            </p>
            <ProgressBar gpa={results.gpa} />
          </div>
          
          <button
            onClick={resetForm}
            className="mt-6 w-full md:w-auto md:mx-auto md:px-6 py-2 flex items-center justify-center gap-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-white font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}

// Type definition for a Course
interface Course {
  id: number;
  courseCode: string;
  creditHours: string | number;
  grade: string;
}
