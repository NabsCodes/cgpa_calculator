import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

// Clearly defined interfaces for better type safety
export interface AlternativePathResult {
  creditsNeeded: number;
  requiredGPA: number;
  isAchievable: boolean;
  semestersEstimate: number;
}

export interface GPAGoalState {
  goalGPA: string;
  creditsNeeded: string;
  neededGPA: number | null;
  alternativePaths: AlternativePathResult[];
  academicGoal: string;
}

export interface CalculationResult {
  success: boolean;
  shouldShowAlternatives: boolean;
}

// Constants for academic honors classification
const ACADEMIC_HONORS = {
  SUMMA_CUM_LAUDE: { min: 3.9, label: "Summa Cum Laude" },
  MAGNA_CUM_LAUDE: { min: 3.8, label: "Magna Cum Laude" },
  CUM_LAUDE: { min: 3.7, label: "Cum Laude" },
  UNIVERSITY_HONORS: { min: 3.5, label: "University Honors" },
};

// Constants for calculation settings
const CALCULATION_SETTINGS = {
  MAX_GPA: 4.0,
  MIN_GPA: 0.0,
  CREDIT_INCREMENT: 3,
  MAX_ADDITIONAL_CREDITS: 42,
  DEFAULT_CREDITS_PER_SEMESTER: 15,
};

export const useGPAGoal = (
  currentCGPA: number | string,
  creditsEarned: number | string,
) => {
  // Single state object for related state
  const [state, setState] = useState<GPAGoalState>({
    goalGPA: "",
    creditsNeeded: "",
    neededGPA: null,
    alternativePaths: [],
    academicGoal: "",
  });

  const { toast } = useToast();

  // Parse values once and reuse them
  const parsedCurrentCGPA = useMemo(() => Number(currentCGPA), [currentCGPA]);
  const parsedCreditsEarned = useMemo(
    () => Number(creditsEarned),
    [creditsEarned],
  );
  const parsedGoalGPA = useMemo(() => Number(state.goalGPA), [state.goalGPA]);
  const parsedCreditsNeeded = useMemo(
    () => Number(state.creditsNeeded),
    [state.creditsNeeded],
  );

  // Type-safe state update function
  const updateState = useCallback((updates: Partial<GPAGoalState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Check if initial CGPA and credits data exists
  const hasInitialData = useCallback(() => {
    return (
      currentCGPA !== "" &&
      creditsEarned !== "" &&
      !isNaN(parsedCurrentCGPA) &&
      !isNaN(parsedCreditsEarned)
    );
  }, [currentCGPA, creditsEarned, parsedCurrentCGPA, parsedCreditsEarned]);

  // Determine academic goal based on target GPA
  useEffect(() => {
    if (isNaN(parsedGoalGPA)) {
      updateState({ academicGoal: "" });
      return;
    }

    let goal = "";
    if (parsedGoalGPA >= ACADEMIC_HONORS.SUMMA_CUM_LAUDE.min) {
      goal = ACADEMIC_HONORS.SUMMA_CUM_LAUDE.label;
    } else if (parsedGoalGPA >= ACADEMIC_HONORS.MAGNA_CUM_LAUDE.min) {
      goal = ACADEMIC_HONORS.MAGNA_CUM_LAUDE.label;
    } else if (parsedGoalGPA >= ACADEMIC_HONORS.CUM_LAUDE.min) {
      goal = ACADEMIC_HONORS.CUM_LAUDE.label;
    } else if (parsedGoalGPA >= ACADEMIC_HONORS.UNIVERSITY_HONORS.min) {
      goal = ACADEMIC_HONORS.UNIVERSITY_HONORS.label;
    }

    updateState({ academicGoal: goal });
  }, [parsedGoalGPA, updateState]);

  // Generate alternative paths when the needed GPA is too high
  useEffect(() => {
    if (
      state.neededGPA !== null &&
      state.neededGPA > CALCULATION_SETTINGS.MAX_GPA
    ) {
      generateAlternativePaths();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.neededGPA]);

  // Calculate required GPA
  const calculateGoalGPA = useCallback((): CalculationResult => {
    // Validate input data
    if (!hasInitialData()) {
      toast({
        title: "Missing information",
        description: "Please enter your current CGPA and credits earned first.",
        variant: "destructive",
      });
      return { success: false, shouldShowAlternatives: false };
    }

    if (
      !state.goalGPA ||
      isNaN(parsedGoalGPA) ||
      parsedGoalGPA < CALCULATION_SETTINGS.MIN_GPA ||
      parsedGoalGPA > CALCULATION_SETTINGS.MAX_GPA
    ) {
      toast({
        title: "Invalid target CGPA",
        description: "Please enter a valid CGPA between 0 and 4.",
        variant: "destructive",
      });
      return { success: false, shouldShowAlternatives: false };
    }

    if (
      !state.creditsNeeded ||
      isNaN(parsedCreditsNeeded) ||
      parsedCreditsNeeded <= 0
    ) {
      toast({
        title: "Invalid credits",
        description: "Please enter a valid number of credits greater than 0.",
        variant: "destructive",
      });
      return { success: false, shouldShowAlternatives: false };
    }

    // Handle case where goal is already achieved
    if (parsedGoalGPA < parsedCurrentCGPA) {
      toast({
        title: "Goal already achieved",
        description: "Your target CGPA is lower than your current CGPA.",
      });
      return { success: true, shouldShowAlternatives: false };
    }

    // Core calculation
    const totalNeededPoints =
      parsedGoalGPA * (parsedCreditsEarned + parsedCreditsNeeded);
    const currentPoints = parsedCurrentCGPA * parsedCreditsEarned;
    const neededPoints = totalNeededPoints - currentPoints;
    const calculatedGPA = neededPoints / parsedCreditsNeeded;

    updateState({ neededGPA: calculatedGPA });

    // Provide appropriate feedback based on the result
    if (calculatedGPA > CALCULATION_SETTINGS.MAX_GPA) {
      toast({
        title: "Goal may not be achievable",
        description: `You need a ${calculatedGPA.toFixed(2)} GPA in your upcoming courses, which exceeds the 4.0 maximum.`,
        variant: "destructive",
      });
      return { success: true, shouldShowAlternatives: true };
    } else if (calculatedGPA < CALCULATION_SETTINGS.MIN_GPA) {
      toast({
        title: "Goal already achieved",
        description: "Your current CGPA is already higher than your target.",
      });
      return { success: true, shouldShowAlternatives: false };
    } else {
      toast({
        title: "Calculation complete",
        description: `You need a ${calculatedGPA.toFixed(2)} GPA in your upcoming courses.`,
      });
      return { success: true, shouldShowAlternatives: false };
    }
  }, [
    hasInitialData,
    parsedCurrentCGPA,
    parsedCreditsEarned,
    parsedGoalGPA,
    parsedCreditsNeeded,
    state.goalGPA,
    state.creditsNeeded,
    toast,
    updateState,
  ]);

  // Generate alternative paths to achieve goal
  const generateAlternativePaths = useCallback(() => {
    if (
      !hasInitialData() ||
      isNaN(parsedGoalGPA) ||
      isNaN(parsedCreditsNeeded)
    ) {
      return;
    }

    const currentPoints = parsedCurrentCGPA * parsedCreditsEarned;
    const baseCreditsNeeded = parsedCreditsNeeded;
    const avgCreditsPerSemester = Math.min(
      baseCreditsNeeded,
      CALCULATION_SETTINGS.DEFAULT_CREDITS_PER_SEMESTER,
    );
    const paths: AlternativePathResult[] = [];

    // Try different credit amounts
    for (
      let additionalCredits = 0;
      additionalCredits <= CALCULATION_SETTINGS.MAX_ADDITIONAL_CREDITS;
      additionalCredits += CALCULATION_SETTINGS.CREDIT_INCREMENT
    ) {
      const totalCreditsNeeded = baseCreditsNeeded + additionalCredits;

      // Calculate required GPA for this credit amount
      const totalPointsNeeded =
        parsedGoalGPA * (parsedCreditsEarned + totalCreditsNeeded);
      const additionalPointsNeeded = totalPointsNeeded - currentPoints;
      const requiredGPA = additionalPointsNeeded / totalCreditsNeeded;
      const semestersEstimate = Math.ceil(
        totalCreditsNeeded / avgCreditsPerSemester,
      );

      paths.push({
        creditsNeeded: totalCreditsNeeded,
        requiredGPA: requiredGPA,
        isAchievable: requiredGPA <= CALCULATION_SETTINGS.MAX_GPA,
        semestersEstimate: semestersEstimate,
      });

      // Stop once we find an achievable path or reach max credits
      if (
        requiredGPA <= CALCULATION_SETTINGS.MAX_GPA ||
        additionalCredits >= CALCULATION_SETTINGS.MAX_ADDITIONAL_CREDITS
      ) {
        break;
      }
    }

    updateState({ alternativePaths: paths });
  }, [
    parsedCurrentCGPA,
    parsedCreditsEarned,
    parsedGoalGPA,
    parsedCreditsNeeded,
    hasInitialData,
    updateState,
  ]);

  // Reset calculator state
  const resetCalculator = useCallback(() => {
    setState({
      goalGPA: "",
      creditsNeeded: "",
      neededGPA: null,
      alternativePaths: [],
      academicGoal: "",
    });
  }, []);

  // Field setters
  const setGoalGPA = useCallback(
    (value: string) => {
      updateState({ goalGPA: value });
    },
    [updateState],
  );

  const setCreditsNeeded = useCallback(
    (value: string) => {
      updateState({ creditsNeeded: value });
    },
    [updateState],
  );

  return {
    state,
    hasInitialData,
    calculateGoalGPA,
    resetCalculator,
    setGoalGPA,
    setCreditsNeeded,
    generateAlternativePaths,
  };
};
