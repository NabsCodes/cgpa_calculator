import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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

export const useGPAGoal = (
  currentCGPA: number | string,
  creditsEarned: number | string,
) => {
  const [state, setState] = useState<GPAGoalState>({
    goalGPA: "",
    creditsNeeded: "",
    neededGPA: null,
    alternativePaths: [],
    academicGoal: "",
  });
  const { toast } = useToast();

  // Helper function to check if initial data exists
  const hasInitialData = () => {
    return (
      currentCGPA !== "" &&
      creditsEarned !== "" &&
      !isNaN(parseFloat(currentCGPA.toString())) &&
      !isNaN(parseFloat(creditsEarned.toString()))
    );
  };

  // Update state in a type-safe manner
  const updateState = (updates: Partial<GPAGoalState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  // Set academic goal based on target CGPA
  useEffect(() => {
    const gpaValue = parseFloat(state.goalGPA);
    if (!isNaN(gpaValue)) {
      let goal = "";
      if (gpaValue >= 3.9) {
        goal = "Summa Cum Laude";
      } else if (gpaValue >= 3.7) {
        goal = "Magna Cum Laude";
      } else if (gpaValue >= 3.5) {
        goal = "Cum Laude";
      } else if (gpaValue >= 3.0) {
        goal = "Good Standing";
      }
      updateState({ academicGoal: goal });
    } else {
      updateState({ academicGoal: "" });
    }
  }, [state.goalGPA]);

  // Generate alternative paths when needed
  useEffect(() => {
    if (state.neededGPA !== null && state.neededGPA > 4.0) {
      generateAlternativePaths();
    }
  }, [state.neededGPA]);

  // Calculate the required GPA to achieve goal
  const calculateGoalGPA = (): CalculationResult => {
    const currentCGPAValue = parseFloat(currentCGPA.toString());
    const creditsEarnedValue = parseFloat(creditsEarned.toString());
    const goalGPAValue = parseFloat(state.goalGPA);
    const creditsNeededValue = parseFloat(state.creditsNeeded);

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
      isNaN(goalGPAValue) ||
      goalGPAValue < 0 ||
      goalGPAValue > 4
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
      isNaN(creditsNeededValue) ||
      creditsNeededValue <= 0
    ) {
      toast({
        title: "Invalid credits",
        description: "Please enter a valid number of credits greater than 0.",
        variant: "destructive",
      });
      return { success: false, shouldShowAlternatives: false };
    }

    // Handle case where target is lower than current CGPA
    if (goalGPAValue < currentCGPAValue) {
      toast({
        title: "Goal already achieved",
        description: "Your target CGPA is lower than your current CGPA.",
      });
      return { success: true, shouldShowAlternatives: false };
    }

    const totalNeededPoints =
      goalGPAValue * (creditsEarnedValue + creditsNeededValue);
    const currentPoints = currentCGPAValue * creditsEarnedValue;
    const neededPoints = totalNeededPoints - currentPoints;
    const calculatedGPA = neededPoints / creditsNeededValue;

    updateState({ neededGPA: calculatedGPA });

    if (calculatedGPA > 4.0) {
      toast({
        title: "Goal may not be achievable",
        description: `You need a ${calculatedGPA.toFixed(
          2,
        )} GPA in your upcoming courses, which exceeds the 4.0 maximum.`,
        variant: "destructive",
      });
      return { success: true, shouldShowAlternatives: true };
    } else if (calculatedGPA < 0) {
      toast({
        title: "Goal already achieved",
        description: "Your current CGPA is already higher than your target.",
      });
      return { success: true, shouldShowAlternatives: false };
    } else {
      toast({
        title: "Calculation complete",
        description: `You need a ${calculatedGPA.toFixed(
          2,
        )} GPA in your upcoming courses.`,
      });
      return { success: true, shouldShowAlternatives: false };
    }
  };

  // Generate alternative paths to achieve the goal
  const generateAlternativePaths = () => {
    const currentCGPAValue = parseFloat(currentCGPA.toString());
    const creditsEarnedValue = parseFloat(creditsEarned.toString());
    const goalGPAValue = parseFloat(state.goalGPA);
    const paths: AlternativePathResult[] = [];

    // Current points earned
    const currentPoints = currentCGPAValue * creditsEarnedValue;

    // Calculate how many credits would be needed with a perfect 4.0 GPA
    const baseCreditsNeeded = parseFloat(state.creditsNeeded);

    // Average credits per semester (used to estimate time)
    const avgCreditsPerSemester = Math.min(baseCreditsNeeded, 15);

    // Try different credit amounts
    for (
      let additionalCredits = 0;
      additionalCredits <= 42;
      additionalCredits += 3
    ) {
      const totalCreditsNeeded = baseCreditsNeeded + additionalCredits;

      // Calculate required GPA for this credit amount
      const totalPointsNeeded =
        goalGPAValue * (creditsEarnedValue + totalCreditsNeeded);
      const additionalPointsNeeded = totalPointsNeeded - currentPoints;
      const requiredGPA = additionalPointsNeeded / totalCreditsNeeded;

      // Estimate how many semesters this would take
      const semestersEstimate = Math.ceil(
        totalCreditsNeeded / avgCreditsPerSemester,
      );

      paths.push({
        creditsNeeded: totalCreditsNeeded,
        requiredGPA: requiredGPA,
        isAchievable: requiredGPA <= 4.0,
        semestersEstimate: semestersEstimate,
      });

      // Stop once we find an achievable path or reach max credits to show
      if (requiredGPA <= 4.0 || additionalCredits >= 42) break;
    }

    updateState({ alternativePaths: paths });
  };

  const resetCalculator = () => {
    setState({
      goalGPA: "",
      creditsNeeded: "",
      neededGPA: null,
      alternativePaths: [],
      academicGoal: "",
    });
  };

  // Setters for form fields
  const setGoalGPA = (value: string) => updateState({ goalGPA: value });
  const setCreditsNeeded = (value: string) =>
    updateState({ creditsNeeded: value });

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
