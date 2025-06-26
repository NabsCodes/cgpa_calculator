"use client";

import React from "react";
import { Keyboard } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const KeyboardShortcutsTooltip: React.FC = () => {
  const isMac =
    typeof window !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const cmdOrCtrl = isMac ? "Cmd" : "Ctrl";

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="View keyboard shortcuts"
          >
            <Keyboard className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <div className="space-y-2">
            <p className="text-sm font-medium">Keyboard Shortcuts</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between gap-4">
                <span>{cmdOrCtrl} + Enter</span>
                <span>Add course</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>{cmdOrCtrl} + R</span>
                <span>Reset calculator</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Alt + C</span>
                <span>Focus Current CGPA</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Alt + E</span>
                <span>Focus Credits Earned</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>A</span>
                <span>Add course</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>R</span>
                <span>Reset</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Escape</span>
                <span>Exit input field</span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default KeyboardShortcutsTooltip;
