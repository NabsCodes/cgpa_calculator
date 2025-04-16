"use client";

import React, { useEffect, useState } from "react";

interface ProgressBarProps {
  gpa: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ gpa }) => {
  const [status, setStatus] = useState({
    label: "",
    width: "0%",
    color: "",
  });

  useEffect(() => {
    if (!gpa && gpa !== 0) {
      setStatus({ label: "", width: "0%", color: "" });
      return;
    }

    const percentageWidth = Math.min((gpa / 4) * 100, 100) + "%";

    if (gpa >= 3.8 && gpa <= 4.0) {
      setStatus({
        label: "President's List",
        width: percentageWidth,
        color: "bg-gradient-to-r from-emerald-500 to-emerald-400",
      });
    } else if (gpa >= 3.5 && gpa < 3.8) {
      setStatus({
        label: "Dean's List",
        width: percentageWidth,
        color: "bg-gradient-to-r from-blue-500 to-blue-400",
      });
    } else if (gpa >= 2.0 && gpa < 3.5) {
      setStatus({
        label: "Good Standing",
        width: percentageWidth,
        color: "bg-gradient-to-r from-yellow-500 to-yellow-400",
      });
    } else if (gpa >= 0.0 && gpa < 2.0) {
      setStatus({
        label: "Not Good Standing - See Your Academic Advisor",
        width: percentageWidth,
        color: "bg-gradient-to-r from-red-600 to-red-500",
      });
    } else {
      setStatus({ label: "", width: "0%", color: "" });
    }
  }, [gpa]);

  return (
    <div>
      <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className={`h-full ${status.color} transition-all duration-1000 ease-out`}
          style={{ width: status.width }}>
          {/* Animated stripe pattern */}
          <div className="h-full w-full bg-stripes opacity-20"></div>
        </div>
      </div>

      <div className="text-center mt-2">
        <span
          className={`
          font-medium text-sm
          ${status.label.includes("President") ? "text-emerald-400" : ""}
          ${status.label.includes("Dean") ? "text-blue-400" : ""}
          ${status.label.includes("Good Standing") ? "text-yellow-400" : ""}
          ${status.label.includes("Not Good") ? "text-red-400" : ""}
        `}>
          {status.label}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
