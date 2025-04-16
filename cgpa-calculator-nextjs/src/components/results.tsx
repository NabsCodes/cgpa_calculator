"use client"

import type React from "react"
import { motion } from "framer-motion"
import { BookOpen, Award, Calculator } from "lucide-react"

interface ResultsProps {
  results: {
    totalCredits: number
    gpa: number
    cgpa: number
  }
}

const Results: React.FC<ResultsProps> = ({ results }) => {
  const getGradeColor = (value: number) => {
    if (value >= 3.5) return "text-blue-500"
    if (value >= 3.0) return "text-cyan-500"
    if (value >= 2.0) return "text-amber-500"
    return "text-red-500"
  }

  const getGradeLabel = (value: number) => {
    if (value >= 3.7) return "Excellent"
    if (value >= 3.0) return "Very Good"
    if (value >= 2.0) return "Good"
    if (value > 0) return "Needs Improvement"
    return ""
  }

  const MotionCard = ({
    icon,
    title,
    value,
    label,
    colorClass,
    delay,
  }: {
    icon: React.ReactNode
    title: string
    value: number | string
    label?: string
    colorClass?: string
    delay: number
  }) => (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border border-slate-200 dark:border-slate-700 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">{icon}</div>
        <div className="text-right">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
          {label && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>}
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 opacity-20"></div>
    </motion.div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MotionCard
        icon={<BookOpen className="h-5 w-5 text-slate-600 dark:text-slate-300" />}
        title="Total Credits"
        value={results.totalCredits}
        label="Credit Hours"
        delay={0}
      />

      <MotionCard
        icon={<Calculator className="h-5 w-5 text-slate-600 dark:text-slate-300" />}
        title="Current GPA"
        value={results.gpa > 0 ? results.gpa.toFixed(2) : "—"}
        label={getGradeLabel(results.gpa)}
        colorClass={getGradeColor(results.gpa)}
        delay={0.1}
      />

      <MotionCard
        icon={<Award className="h-5 w-5 text-slate-600 dark:text-slate-300" />}
        title="Cumulative GPA"
        value={results.cgpa > 0 ? results.cgpa.toFixed(2) : "—"}
        label={getGradeLabel(results.cgpa)}
        colorClass={getGradeColor(results.cgpa)}
        delay={0.2}
      />
    </div>
  )
}

export default Results
