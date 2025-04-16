"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CGPAFormProps {
  currentCGPA: number | string
  creditsEarned: number | string
  setCurrentCGPA: (value: number | string) => void
  setCreditsEarned: (value: number | string) => void
  calculateCGPA: () => void
}

const CGPAForm: React.FC<CGPAFormProps> = ({
  currentCGPA,
  creditsEarned,
  setCurrentCGPA,
  setCreditsEarned,
}) => {
  const handleCGPAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty string or valid CGPA values
    if (value === "") {
      setCurrentCGPA("")
      return
    }
    
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 4) {
      setCurrentCGPA(value)
    }
  }

  const handleCreditsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty string or valid credits values
    if (value === "") {
      setCreditsEarned("")
      return
    }
    
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setCreditsEarned(value)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="currentCGPA" className="text-sm font-medium">
            Current CGPA
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-slate-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Enter your current Cumulative GPA (0.00 - 4.00)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          type="number"
          id="currentCGPA"
          value={currentCGPA}
          onChange={handleCGPAChange}
          placeholder="Eg: 3.5"
          min="0"
          max="4"
          step="0.01"
          className="w-full"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">Leave blank if this is your first semester</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="creditsEarned" className="text-sm font-medium">
            Credits Earned
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-slate-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Enter the total number of credit hours you've completed so far</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          type="number"
          id="creditsEarned"
          value={creditsEarned}
          onChange={handleCreditsChange}
          placeholder="Eg: 30"
          min="0"
          className="w-full"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">Total credits completed in previous semesters</p>
      </div>
    </div>
  )
}

export default CGPAForm
