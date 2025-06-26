import type { Course } from "./cgpa";

// Storage data structure
export interface SavedData {
  currentCGPA: number | string;
  creditsEarned: number | string;
  courses: Course[];
  lastUpdated: string;
}

// App configuration
export interface AppConfig {
  DEFAULT_ROWS: number;
  STORAGE_KEY: string;
  SESSION_KEY: string;
  CONFIG_KEY: string;
}

// Storage operation results
export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Local storage keys enum
export enum StorageKeys {
  CGPA_DATA = "cgpaCalculatorData",
  SESSION_NOTIFICATION = "cgpaDataNotified",
  USER_CONFIG = "cgpaCalculatorConfig",
  THEME = "theme",
}
