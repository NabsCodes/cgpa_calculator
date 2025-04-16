"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle2, Award, Trophy } from "lucide-react"

interface ProgressBarProps {
  gpa: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ gpa }) => {
  const [status, setStatus] = useState({
    label: "",
    progress: 0,
    color: "",
    icon: null as React.ReactNode,
    description: "",
  })

  useEffect(() => {
    if (!gpa && gpa !== 0) {
      setStatus({
        label: "",
        progress: 0,
        color: "",
        icon: null,
        description: "",
      })
      return
    }

    const progressPercentage = Math.min((gpa / 4) * 100, 100)

    if (gpa >= 3.8 && gpa <= 4.0) {
      setStatus({
        label: "President's List",
        progress: progressPercentage,
        color: "bg-emerald-500",
        icon: <Trophy className="h-5 w-5 text-emerald-500" />,
        description: "Outstanding academic achievement. Keep up the excellent work!",
      })
    } else if (gpa >= 3.5 && gpa < 3.8) {
      setStatus({
        label: "Dean's List",
        progress: progressPercentage,
        color: "bg-blue-500",
        icon: <Award className="h-5 w-5 text-blue-500" />,
        description: "Excellent academic performance. You're on the right track!",
      })
    } else if (gpa >= 2.0 && gpa < 3.5) {
      setStatus({
        label: "Good Standing",
        progress: progressPercentage,
        color: "bg-amber-500",
        icon: <CheckCircle2 className="h-5 w-5 text-amber-500" />,
        description: "You're in good academic standing. Consider aiming higher!",
      })
    } else if (gpa >= 0.0 && gpa < 2.0) {
      setStatus({
        label: "Academic Warning",
        progress: progressPercentage,
        color: "bg-red-500",
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        description: "Your GPA is below the minimum requirement. Please see your academic advisor.",
      })
    } else {
      setStatus({
        label: "",
        progress: 0,
        color: "",
        icon: null,
        description: "",
      })
    }
  }, [gpa])

  return (
    <div className="space-y-4">
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <motion.div 
          className={`absolute top-0 left-0 h-full rounded-full ${status.color}`}
          initial={{ width: 0 }}
          animate={{ width: `${status.progress}%` }}
          transition={{ 
            duration: 0.8, 
            ease: [0.34, 1.56, 0.64, 1], // Spring-like bounce effect
            delay: 0.1 
          }}
        >
          {status.progress > 30 && (
            <div className="absolute top-0 left-0 h-full w-full opacity-20 bg-[linear-gradient(45deg,rgba(255,255,255,0)_25%,rgba(255,255,255,0.4)_25%,rgba(255,255,255,0.4)_50%,rgba(255,255,255,0)_50%,rgba(255,255,255,0)_75%,rgba(255,255,255,0.4)_75%,rgba(255,255,255,0.4)_100%)] bg-[length:10px_10px] animate-[progress-move_1s_linear_infinite]" />
          )}
        </motion.div>
      </div>

      {/* GPA markers */}
      <div className="flex justify-between px-1 text-[10px] text-slate-500 dark:text-slate-400">
        <span>0.0</span>
        <span>1.0</span>
        <span>2.0</span>
        <span>3.0</span>
        <span>4.0</span>
      </div>

      {status.label && (
        <motion.div
          className="flex items-start gap-3 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="mt-0.5">{status.icon}</div>
          <div>
            <h4
              className={`font-medium text-lg
              ${status.label.includes("President") ? "text-emerald-600 dark:text-emerald-400" : ""}
              ${status.label.includes("Dean") ? "text-blue-600 dark:text-blue-400" : ""}
              ${status.label.includes("Good Standing") ? "text-amber-600 dark:text-amber-400" : ""}
              ${status.label.includes("Warning") ? "text-red-600 dark:text-red-400" : ""}
            `}
            >
              {status.label}
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{status.description}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ProgressBar
