"use client";

import React, { useState } from "react";
import { Keyboard } from "lucide-react";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const KeyboardShortcutsModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useIsDesktop();

  // Don't render on mobile/tablet
  if (!isDesktop) {
    return null;
  }

  const shortcuts = [
    {
      category: "Course Management",
      items: [
        { keys: ["Cmd/Ctrl", "Enter"], description: "Add new course row" },
        { keys: ["A"], description: "Add course (when not typing)" },
      ],
    },
    {
      category: "Calculator Actions",
      items: [
        { keys: ["Cmd/Ctrl", "Backspace"], description: "Reset calculator" },
        { keys: ["D"], description: "Reset (when not typing)" },
      ],
    },
    {
      category: "Navigation",
      items: [
        { keys: ["Cmd/Ctrl", "Shift", "C"], description: "Focus Current CGPA" },
        {
          keys: ["Cmd/Ctrl", "Shift", "E"],
          description: "Focus Credits Earned",
        },
        { keys: ["Escape"], description: "Exit any input field" },
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          aria-label="View keyboard shortcuts"
        >
          <Keyboard className="h-4 w-4" />
          <span className="hidden sm:inline">Shortcuts</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Use these keyboard shortcuts to navigate and interact with the CGPA
            Calculator more efficiently.
          </p>

          <div className="space-y-6">
            {shortcuts.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-3">
                <h3 className="border-b border-slate-200 pb-1 font-semibold text-slate-800 dark:border-slate-700 dark:text-slate-200">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.items.map((shortcut, shortcutIndex) => (
                    <div
                      key={shortcutIndex}
                      className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50"
                    >
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <Badge
                              variant="outline"
                              className="border-slate-300 bg-white px-2 py-1 font-mono text-xs dark:border-slate-600 dark:bg-slate-700"
                            >
                              {key}
                            </Badge>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="mx-1 text-slate-400">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              </div>
              <div className="text-sm">
                <p className="mb-1 font-medium text-blue-800 dark:text-blue-200">
                  Pro Tip
                </p>
                <div className="text-blue-700 dark:text-blue-300">
                  Keyboard shortcuts marked with "when not typing" only work
                  when you're not actively typing in an input field. Use{" "}
                  <Badge variant="outline" className="mx-1 text-xs">
                    Escape
                  </Badge>{" "}
                  to exit any input field and enable these shortcuts.
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsModal;
