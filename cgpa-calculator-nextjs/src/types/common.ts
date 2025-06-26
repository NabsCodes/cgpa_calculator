// Common types used across the application
export type Theme = "light" | "dark" | "system";
export type AppTab = "cgpaCalculator" | "goalPlanner" | "whatIfSimulator";

// Component prop types
export interface ComponentWithChildren {
  children: React.ReactNode;
}

export interface ComponentWithClassName {
  className?: string;
}

// Form field types
export interface FormField {
  value: string | number;
  error?: string;
  touched?: boolean;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
