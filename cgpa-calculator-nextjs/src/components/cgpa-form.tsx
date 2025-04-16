"use client";

import React from "react";

interface CGPAFormProps {
  currentCGPA: number | string;
  creditsEarned: number | string;
  setCurrentCGPA: (value: number | string) => void;
  setCreditsEarned: (value: number | string) => void;
  calculateCGPA: () => void;
}

const CGPAForm: React.FC<CGPAFormProps> = ({
  currentCGPA,
  creditsEarned,
  setCurrentCGPA,
  setCreditsEarned,
  calculateCGPA,
}) => {
  const handleCGPAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 4)) {
      setCurrentCGPA(value);
      setTimeout(calculateCGPA, 0);
    }
  };

  const handleCreditsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || parseInt(value) >= 0) {
      setCreditsEarned(value);
      setTimeout(calculateCGPA, 0);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="space-y-2">
        <label
          htmlFor="currentCGPA"
          className="block text-sm font-medium text-slate-300">
          Current CGPA
        </label>
        <input
          type="number"
          id="currentCGPA"
          value={currentCGPA}
          onChange={handleCGPAChange}
          placeholder="Eg: 3.5"
          min="0"
          max="4"
          step="0.01"
          className="w-full p-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="creditsEarned"
          className="block text-sm font-medium text-slate-300">
          Credits Earned
        </label>
        <input
          type="number"
          id="creditsEarned"
          value={creditsEarned}
          onChange={handleCreditsChange}
          placeholder="Eg: 30"
          min="0"
          className="w-full p-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default CGPAForm;
