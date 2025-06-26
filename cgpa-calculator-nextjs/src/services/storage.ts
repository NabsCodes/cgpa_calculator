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

    const parsedData = JSON.parse(data) as SavedData;
    return { success: true, data: parsedData };
  } catch (error) {
    console.error("Error loading from localStorage:", error);
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
