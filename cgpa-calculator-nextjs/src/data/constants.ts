import type { AppConfig } from "@/types/storage";

// App configuration
export const APP_CONFIG: AppConfig = {
  DEFAULT_ROWS: 3,
  STORAGE_KEY: "cgpaCalculatorData",
  SESSION_KEY: "cgpaDataNotified",
  CONFIG_KEY: "cgpaCalculatorConfig",
} as const;
