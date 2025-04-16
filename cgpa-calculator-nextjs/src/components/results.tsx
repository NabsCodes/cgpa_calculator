"use client";

import React from "react";

interface ResultsProps {
  results: {
    totalCredits: number;
    gpa: number;
    cgpa: number;
  };
}

const Results: React.FC<ResultsProps> = ({ results }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-6">
      <div className="bg-slate-700/50 rounded-lg p-4 text-center">
        <div className="text-sm text-slate-400 mb-1">Total Credits</div>
        <div className="text-2xl font-bold text-white">
          {results.totalCredits}
        </div>
      </div>

      <div className="bg-slate-700/50 rounded-lg p-4 text-center">
        <div className="text-sm text-slate-400 mb-1">GPA</div>
        <div className="text-2xl font-bold text-white">
          {results.gpa.toFixed(2)}
        </div>
      </div>

      <div className="bg-slate-700/50 rounded-lg p-4 text-center relative overflow-hidden">
        <div className="text-sm text-slate-400 mb-1">CGPA</div>
        <div className="text-2xl font-bold text-white relative z-10">
          {results.cgpa.toFixed(2)}
        </div>
        {/* Highlight effect for the CGPA value */}
        {results.cgpa > 0 && (
          <div
            className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"
            style={{
              transform: `scaleX(${Math.min(results.cgpa / 4, 1)})`,
              transformOrigin: "left",
              transition: "transform 0.5s ease-out",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Results;
