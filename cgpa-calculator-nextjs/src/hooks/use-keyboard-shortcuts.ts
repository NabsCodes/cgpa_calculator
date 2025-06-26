import { useEffect, useCallback } from "react";

interface KeyboardShortcuts {
  onAddCourse?: () => void;
  onReset?: () => void;
  onFocusCurrentCGPA?: () => void;
  onFocusCreditsEarned?: () => void;
}

export function useKeyboardShortcuts({
  onAddCourse,
  onReset,
  onFocusCurrentCGPA,
  onFocusCreditsEarned,
}: KeyboardShortcuts) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const isTyping =
        event.target instanceof HTMLElement &&
        (event.target.isContentEditable ||
          /INPUT|TEXTAREA|SELECT/.test(event.target.tagName));

      if (isTyping && event.key !== "Escape") {
        return;
      }
      if (event.key === "Escape") {
        (event.target as HTMLElement)?.blur();
        return;
      }

      const isModifierPressed = event.metaKey || event.ctrlKey;

      if (isModifierPressed && event.key === "Enter") {
        event.preventDefault();
        onAddCourse?.();
      } else if (isModifierPressed && event.key === "Backspace") {
        event.preventDefault();
        onReset?.();
      } else if (
        isModifierPressed &&
        event.shiftKey &&
        event.key.toLowerCase() === "c"
      ) {
        event.preventDefault();
        onFocusCurrentCGPA?.();
      } else if (
        isModifierPressed &&
        event.shiftKey &&
        event.key.toLowerCase() === "e"
      ) {
        event.preventDefault();
        onFocusCreditsEarned?.();
      } else if (event.key.toLowerCase() === "a" && !isModifierPressed) {
        onAddCourse?.();
      } else if (event.key.toLowerCase() === "d" && !isModifierPressed) {
        onReset?.();
      }
    },
    [onAddCourse, onReset, onFocusCurrentCGPA, onFocusCreditsEarned],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return {
    shortcuts: [
      { keys: ["Cmd/Ctrl", "Enter"], action: "Add new course" },
      { keys: ["Cmd/Ctrl", "Backspace"], action: "Reset calculator" },
      { keys: ["Cmd/Ctrl", "Shift", "C"], action: "Focus Current CGPA" },
      { keys: ["Cmd/Ctrl", "Shift", "E"], action: "Focus Credits Earned" },
      { keys: ["A"], action: "Add course (when not typing)" },
      { keys: ["D"], action: "Reset (when not typing)" },
      { keys: ["Escape"], action: "Exit input field" },
    ],
  };
}
