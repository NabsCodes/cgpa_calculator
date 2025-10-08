import type { SavedData, StorageResult } from "@/types/storage";
import { APP_CONFIG } from "@/data/constants";

// Save data to localStorage
export function saveToLocalStorage(
  data: Partial<SavedData>,
): StorageResult<void> {
  if (typeof window === "undefined") {
    return { success: false, error: "Window not available" };
  }

  try {
    const dataToSave = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(dataToSave));
    return { success: true };
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return { success: false, error: "Failed to save data" };
  }
}

// Validate saved data structure
function isValidSavedData(data: unknown): data is SavedData {
  if (!data || typeof data !== "object") return false;

  const d = data as Record<string, unknown>;

  // Check required fields exist
  if (!("currentCGPA" in d) || !("creditsEarned" in d) || !("courses" in d)) {
    return false;
  }

  // Validate types
  if (
    typeof d.currentCGPA !== "number" &&
    typeof d.currentCGPA !== "string"
  ) {
    return false;
  }

  if (
    typeof d.creditsEarned !== "number" &&
    typeof d.creditsEarned !== "string"
  ) {
    return false;
  }

  // Validate courses array
  if (!Array.isArray(d.courses)) return false;

  // Validate each course has required fields
  for (const course of d.courses) {
    if (!course || typeof course !== "object") return false;
    const c = course as Record<string, unknown>;
    if (
      typeof c.id !== "number" ||
      typeof c.courseCode !== "string" ||
      (typeof c.creditHours !== "string" && typeof c.creditHours !== "number") ||
      typeof c.grade !== "string"
    ) {
      return false;
    }
  }

  return true;
}

// Load data from localStorage
export function loadFromLocalStorage(): StorageResult<SavedData> {
  if (typeof window === "undefined") {
    return { success: false, error: "Window not available" };
  }

  try {
    const data = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
    if (!data) {
      return { success: false, error: "No data found" };
    }

    const parsedData = JSON.parse(data);

    // Validate the parsed data structure
    if (!isValidSavedData(parsedData)) {
      console.error("Invalid data structure in localStorage");
      // Clear corrupted data
      localStorage.removeItem(APP_CONFIG.STORAGE_KEY);
      return { success: false, error: "Invalid data structure" };
    }

    return { success: true, data: parsedData };
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    // Clear corrupted data on parse error
    try {
      localStorage.removeItem(APP_CONFIG.STORAGE_KEY);
    } catch (e) {
      // Ignore cleanup errors
    }
    return { success: false, error: "Failed to load data" };
  }
}

// Clear all storage data
export function clearStorageData(): StorageResult<void> {
  if (typeof window === "undefined") {
    return { success: false, error: "Window not available" };
  }

  try {
    localStorage.removeItem(APP_CONFIG.STORAGE_KEY);
    sessionStorage.removeItem(APP_CONFIG.SESSION_KEY);
    return { success: true };
  } catch (error) {
    console.error("Error clearing storage:", error);
    return { success: false, error: "Failed to clear storage" };
  }
}

// Check if restoration notification should be shown
export function shouldShowRestoredDataNotification(): boolean {
  if (typeof window === "undefined") return false;
  return !sessionStorage.getItem(APP_CONFIG.SESSION_KEY);
}

// Mark notification as shown
export function markNotificationShown(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(APP_CONFIG.SESSION_KEY, "true");
}

// Format last saved date for display
export function formatLastSaved(dateString: string | null): string | null {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return null;
  }
}
