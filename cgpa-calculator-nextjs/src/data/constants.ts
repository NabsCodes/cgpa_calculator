import type { AppConfig } from "@/types/storage";

// GPA calculation constants
export const GPA_CONFIG = {
  MAX_GPA: 4.0,
  MIN_GPA: 0.0,
} as const;

// App configuration
export const APP_CONFIG: AppConfig = {
  DEFAULT_ROWS: 3,
  STORAGE_KEY: "cgpaCalculatorData",
  SESSION_KEY: "cgpaDataNotified",
  CONFIG_KEY: "cgpaCalculatorConfig",
} as const;
