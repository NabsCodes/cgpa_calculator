"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GraduationCap, PlusCircle, RefreshCw, BookOpen, Award } from "lucide-react"
import CGPAForm from "@/components/cgpa-form"
import CourseTable from "@/components/course-table"
import Results from "@/components/results"
import ProgressBar from "@/components/progress-bar"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [currentCGPA, setCurrentCGPA] = useState<number | string>("")
  const [creditsEarned, setCreditsEarned] = useState<number | string>("")
  const [courses, setCourses] = useState<Course[]>([])
  const [results, setResults] = useState({
    totalCredits: 0,
    gpa: 0,
    cgpa: 0,
  })

  // Initialize with 4 empty courses
  useEffect(() => {
    if (courses.length === 0) {
      setCourses([
        { id: 1, courseCode: "", creditHours: "", grade: "" },
        { id: 2, courseCode: "", creditHours: "", grade: "" },
        { id: 3, courseCode: "", creditHours: "", grade: "" },
        { id: 4, courseCode: "", creditHours: "", grade: "" },
      ])
    }
  }, [])

  // Add this effect to automatically recalculate when inputs change
  useEffect(() => {
    calculateCGPA()
  }, [courses, currentCGPA, creditsEarned])

  // Function to get grade points
  const getGradePoints = (grade: string): number => {
    switch (grade) {
      case "A":
        return 4.0
      case "A-":
        return 3.7
      case "B+":
        return 3.3
      case "B":
        return 3.0
      case "B-":
        return 2.7
      case "C+":
        return 2.3
      case "C":
        return 2.0
      case "D":
        return 1.0
      case "F":
      case "W":
      case "WP":
      case "WF":
      default:
        return 0.0
    }
  }

  // Calculate CGPA based on courses and current CGPA
  const calculateCGPA = () => {
    let totalGradePoints = 0
    let totalCreditHours = 0

    courses.forEach((course) => {
      if (course.creditHours && course.grade) {
        const creditHours = parseInt(course.creditHours.toString())
        const gradePoints = getGradePoints(course.grade)
        
        if (!isNaN(creditHours) && !isNaN(gradePoints)) {
          totalGradePoints += gradePoints * creditHours
          totalCreditHours += creditHours
        }
      }
    })

    let newGPA = 0
    let cgpa = 0

    if (totalCreditHours > 0) {
      newGPA = totalGradePoints / totalCreditHours

      const currentCGPAValue = parseFloat(currentCGPA.toString())
      const creditsEarnedValue = parseFloat(creditsEarned.toString())

      if (!isNaN(currentCGPAValue) && !isNaN(creditsEarnedValue) && 
          currentCGPAValue > 0 && creditsEarnedValue > 0) {
        cgpa = ((currentCGPAValue * creditsEarnedValue) + totalGradePoints) / 
               (creditsEarnedValue + totalCreditHours)
        
        // Cap CGPA at 4.0 as in the original code
        if (cgpa > 4.0) {
          cgpa = 0.0
        }
      } else {
        cgpa = newGPA
      }
    } else if (currentCGPA) {
      const currentCGPAValue = parseFloat(currentCGPA.toString())
      if (!isNaN(currentCGPAValue) && currentCGPAValue > 0) {
        cgpa = currentCGPAValue
      }
    }

    // Ensure values are not NaN
    if (isNaN(cgpa)) cgpa = 0
    if (isNaN(newGPA)) newGPA = 0
    if (isNaN(totalCreditHours)) totalCreditHours = 0

    setResults({
      totalCredits: totalCreditHours,
      gpa: newGPA,
      cgpa: cgpa,
    })
  }

  // Add a new course row
  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), courseCode: "", creditHours: "", grade: "" }])
  }

  // Delete a course row
  const deleteCourse = (id: number) => {
    setCourses(courses.filter((course) => course.id !== id))
  }

  // Update course information
  const updateCourse = (id: number, field: keyof Course, value: string | number) => {
    setCourses(courses.map((course) => (course.id === id ? { ...course, [field]: value } : course)))
  }

  // Reset form
  const resetForm = () => {
    setCurrentCGPA("")
    setCreditsEarned("")
    setCourses([
      { id: 1, courseCode: "", creditHours: "", grade: "" },
      { id: 2, courseCode: "", creditHours: "", grade: "" },
      { id: 3, courseCode: "", creditHours: "", grade: "" },
      { id: 4, courseCode: "", creditHours: "", grade: "" },
    ])
    setResults({
      totalCredits: 0,
      gpa: 0,
      cgpa: 0,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
      <div className="max-w-5xl mx-auto pt-10 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <GraduationCap className="h-10 w-10 text-blue-500 mr-2" />
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-600">
              CGPA Calculator
            </h1>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-sm text-blue-700 dark:text-blue-300 font-medium flex items-center">
              <Award className="h-4 w-4 mr-1" />
              Grade Scale: 4.00
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              Academic Calculator
            </span>
          </div>

          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Track your academic progress with our advanced CGPA calculator. Enter your current CGPA, credits earned, and
            course details to calculate your new GPA and CGPA.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-6 border-slate-200 dark:border-slate-700 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                Current Academic Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CGPAForm
                currentCGPA={currentCGPA}
                creditsEarned={creditsEarned}
                setCurrentCGPA={setCurrentCGPA}
                setCreditsEarned={setCreditsEarned}
                calculateCGPA={calculateCGPA}
              />
            </CardContent>
          </Card>

          <Card className="mb-6 border-slate-200 dark:border-slate-700 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                Course Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CourseTable courses={courses} updateCourse={updateCourse} deleteCourse={deleteCourse} />

              <div className="flex flex-wrap gap-3 mt-4">
                <Button onClick={addCourse} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Course
                </Button>

                <Button onClick={resetForm} variant="outline" className="border-slate-300 dark:border-slate-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-slate-200 dark:border-slate-700 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-500" />
                Your Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Results results={results} />

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3 text-slate-800 dark:text-slate-200">Academic Standing</h3>
                <ProgressBar gpa={results.gpa} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Footer />
      </div>
    </div>
  )
}

// Type definition for a Course
interface Course {
  id: number
  courseCode: string
  creditHours: string | number
  grade: string
}
