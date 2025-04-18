"use client";

import React, { useState } from "react";
import {
  Download,
  X,
  AlertCircle,
  Mail,
  Loader2,
  ClipboardCopy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: number;
  courseCode: string;
  creditHours: string | number;
  grade: string;
}

interface ExportCSVProps {
  courses: Course[];
  currentCGPA: number | string;
  creditsEarned: number | string;
  results: {
    totalCredits: number;
    gpa: number;
    cgpa: number;
  };
}

const ExportCSV: React.FC<ExportCSVProps> = ({
  courses,
  currentCGPA,
  creditsEarned,
  results,
}) => {
  const { toast } = useToast();
  const [fileName, setFileName] = useState<string>(
    `cgpa_calculation_${new Date().toISOString().split("T")[0]}`,
  );
  const [includeEmptyCourses, setIncludeEmptyCourses] =
    useState<boolean>(false);
  const [includeSummary, setIncludeSummary] = useState<boolean>(true);
  const [includeAcademicStanding, setIncludeAcademicStanding] =
    useState<boolean>(true);
  const [exportInProgress, setExportInProgress] = useState<boolean>(false);
  const [csvPreview, setCsvPreview] = useState<string>("");
  const [dialogTab, setDialogTab] = useState<string>("options");
  const [open, setOpen] = useState(false);

  // Check if there is data to export
  const hasData = () => {
    const hasCurrentCGPA =
      currentCGPA !== "" && parseFloat(currentCGPA.toString()) > 0;
    const hasCreditsEarned =
      creditsEarned !== "" && parseFloat(creditsEarned.toString()) > 0;
    const hasValidCourses = courses.some(
      (course) => course.courseCode || course.creditHours || course.grade,
    );

    return hasCurrentCGPA || hasCreditsEarned || hasValidCourses;
  };

  // Get current academic standing based on GPA
  const getAcademicStanding = (gpa: number) => {
    if (gpa >= 3.8 && gpa <= 4.0) {
      return "President's List";
    } else if (gpa >= 3.5 && gpa < 3.8) {
      return "Dean's List";
    } else if (gpa >= 2.0 && gpa < 3.5) {
      return "Good Standing";
    } else if (gpa >= 0.0 && gpa < 2.0) {
      return "Not Good Standing - See Your Academic Advisor";
    }
    return "Unknown";
  };

  // Generate CSV content for preview or export
  const generateCsvContent = () => {
    // Filter courses based on settings
    const filteredCourses = includeEmptyCourses
      ? courses
      : courses.filter(
          (course) => course.courseCode || course.creditHours || course.grade,
        );

    if (filteredCourses.length === 0 && !includeEmptyCourses) {
      return null;
    }

    // Create CSV content
    const headers = ["Course Code", "Credit Hours", "Grade"];
    const courseRows = filteredCourses.map(
      (course) => `${course.courseCode},${course.creditHours},${course.grade}`,
    );

    // Create summary rows if included
    const summary = includeSummary
      ? [
          `Current CGPA,${currentCGPA}`,
          `Credits Earned,${creditsEarned}`,
          `Semester GPA,${results.gpa.toFixed(2)}`,
          `New CGPA,${results.cgpa.toFixed(2)}`,
          `Total Credits,${results.totalCredits}`,
        ]
      : [];

    // Add academic standing if included
    if (includeAcademicStanding) {
      summary.push(`Academic Standing,${getAcademicStanding(results.gpa)}`);
    }

    // Combine all content
    const csvContent = [
      "CGPA Calculator Export",
      `Generated on,${new Date().toLocaleString()}`,
      "",
      headers.join(","),
      ...courseRows,
    ];

    // Add summary if included
    if (includeSummary && summary.length > 0) {
      csvContent.push("", ...summary);
    }

    // Return as string
    return csvContent.join("\n");
  };

  // Update preview when options change
  const updatePreview = () => {
    if (dialogTab === "preview") {
      const content = generateCsvContent();
      setCsvPreview(content || "No data to preview");
      return;
    }
  };

  // Handle export
  const exportData = async () => {
    try {
      setExportInProgress(true);

      const content = generateCsvContent();
      if (!content) {
        toast({
          title: "No data to export",
          description:
            "Please add at least one course or include empty courses.",
          variant: "destructive",
        });
        setExportInProgress(false);
        return;
      }

      // Regular CSV export
      const blob = new Blob([content], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      toast({
        title: "Export successful",
        description: "Your CGPA calculation has been exported to CSV.",
      });

      // Close the dialog after a moment to show success animation
      setTimeout(() => {
        setOpen(false);
        setExportInProgress(false);
      }, 1000);
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
      setExportInProgress(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    const content = generateCsvContent();
    if (!content) {
      toast({
        title: "No data to copy",
        description: "Please add at least one course or include empty courses.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "Your CGPA data has been copied to clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        title: "Copy failed",
        description: "There was an error copying to clipboard.",
        variant: "destructive",
      });
    }
  };

  // Email sharing
  const shareViaEmail = () => {
    const subject = encodeURIComponent("CGPA Calculation Results");
    const content = generateCsvContent();
    if (!content) {
      toast({
        title: "No data to share",
        description: "Please add at least one course or include empty courses.",
        variant: "destructive",
      });
      return;
    }

    const body = encodeURIComponent(
      "Here are my CGPA calculation results:\n\n" + content.replace(/,/g, "\t"),
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;

    toast({
      title: "Email client opened",
      description: "Add recipients to share your CGPA data.",
    });
  };

  // Check if there's nothing meaningful to export
  const noMeaningfulData = !hasData();

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (newOpen && dialogTab === "preview") {
          updatePreview();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "border-slate-300 dark:border-slate-700",
            noMeaningfulData && "cursor-not-allowed opacity-50",
          )}
          onClick={(e) => {
            if (noMeaningfulData) {
              e.preventDefault();
              toast({
                title: "No data to export",
                description:
                  "Please enter course information or CGPA data first.",
                variant: "destructive",
              });
            }
          }}
          disabled={noMeaningfulData}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Results
        </Button>
      </DialogTrigger>
      <DialogContent
        className="flex max-h-[90vh] max-w-[calc(100vw-2rem)] flex-col overflow-hidden p-4 sm:max-w-[500px] sm:p-6"
        onInteractOutside={(e) => {
          // Don't close the dialog when interacting with popups or alerts
          if (exportInProgress) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Export CGPA Data</DialogTitle>
          <DialogDescription>
            Choose your export options and customize the output file.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={dialogTab}
          onValueChange={(value) => {
            setDialogTab(value);
            if (value === "preview") {
              updatePreview();
            }
          }}
          className="flex w-full flex-1 flex-col overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="options">Options</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent
              value="options"
              className="h-full space-y-4 overflow-auto py-4"
            >
              <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4">
                <Label htmlFor="fileName" className="sm:text-right">
                  File name
                </Label>
                <Input
                  id="fileName"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="col-span-1 sm:col-span-3"
                />
              </div>

              <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-4 sm:gap-4">
                <Label className="mt-1 sm:text-right">Options</Label>
                <div className="col-span-1 space-y-2 sm:col-span-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeEmptyCourses"
                      checked={includeEmptyCourses}
                      onCheckedChange={(checked) =>
                        setIncludeEmptyCourses(checked === true)
                      }
                    />
                    <Label htmlFor="includeEmptyCourses">
                      Include empty courses
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeSummary"
                      checked={includeSummary}
                      onCheckedChange={(checked) =>
                        setIncludeSummary(checked === true)
                      }
                    />
                    <Label htmlFor="includeSummary">Include CGPA summary</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeAcademicStanding"
                      checked={includeAcademicStanding}
                      onCheckedChange={(checked) =>
                        setIncludeAcademicStanding(checked === true)
                      }
                    />
                    <Label htmlFor="includeAcademicStanding">
                      Include academic standing
                    </Label>
                  </div>
                </div>
              </div>

              {noMeaningfulData && (
                <div className="rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle
                        className="h-5 w-5 text-yellow-400 dark:text-yellow-300"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700 dark:text-yellow-200">
                        No meaningful data to export. Add course information or
                        CGPA data first.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!noMeaningfulData &&
                !includeEmptyCourses &&
                courses.filter(
                  (course) =>
                    course.courseCode || course.creditHours || course.grade,
                ).length === 0 && (
                  <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle
                          className="h-5 w-5 text-blue-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700 dark:text-blue-200">
                          No course data available. Enable "Include empty
                          courses" to export anyways.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </TabsContent>

            <TabsContent
              value="share"
              className="h-full space-y-4 overflow-auto py-4"
            >
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  className="flex h-16 flex-col items-center justify-center p-3 sm:h-24"
                >
                  <ClipboardCopy className="mb-1 h-5 w-5 sm:h-8 sm:w-8" />
                  <span>Copy to Clipboard</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={shareViaEmail}
                  className="flex h-16 flex-col items-center justify-center p-3 sm:h-24"
                >
                  <Mail className="mb-1 h-5 w-5 sm:h-8 sm:w-8" />
                  <span>Share via Email</span>
                </Button>
              </div>

              <div className="mt-4 rounded-md bg-slate-50 p-3 dark:bg-slate-800/50">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  <p className="mb-1 font-semibold">Tips for sharing:</p>
                  <ul className="list-disc space-y-1 pl-4">
                    <li>
                      Use "Copy to Clipboard" to paste in messages or documents
                    </li>
                    <li>
                      Use "Share via Email" to send your results to your advisor
                    </li>
                    <li>
                      Ensure data privacy when sharing personal information
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="h-full overflow-auto py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Data Preview</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 py-1 text-xs"
                    onClick={updatePreview}
                  >
                    <RefreshIcon className="mr-1 h-3.5 w-3.5" /> Refresh
                  </Button>
                </div>
                <div className="relative">
                  {csvPreview ? (
                    <div className="max-h-[35vh] overflow-auto rounded-md border bg-white shadow-sm dark:bg-slate-900">
                      {csvPreview.split("\n").map((line, index) => {
                        // Skip empty lines
                        if (!line.trim()) return null;

                        const cells = line.split(",");

                        // Determine row type for styling
                        let rowClass =
                          "border-b border-slate-200 dark:border-slate-700";
                        let cellClass = "px-3 py-2 text-xs";

                        // Format title row
                        if (index === 0) {
                          return (
                            <div
                              key={index}
                              className={`bg-slate-100 font-medium dark:bg-slate-800 ${rowClass}`}
                            >
                              <div
                                className={`${cellClass} text-slate-700 dark:text-slate-300`}
                              >
                                {line}
                              </div>
                            </div>
                          );
                        }

                        // Format date row
                        if (index === 1) {
                          return (
                            <div
                              key={index}
                              className={`${rowClass} bg-slate-50 italic dark:bg-slate-800/50`}
                            >
                              <div
                                className={`${cellClass} text-slate-500 dark:text-slate-400`}
                              >
                                {cells.join(" ")}
                              </div>
                            </div>
                          );
                        }

                        // Format header row
                        if (index === 3) {
                          return (
                            <div
                              key={index}
                              className={`${rowClass} bg-blue-50 dark:bg-blue-900/20`}
                            >
                              {cells.map((cell, cellIndex) => (
                                <span
                                  key={cellIndex}
                                  className={`${cellClass} inline-block font-medium text-blue-700 dark:text-blue-300 w-1/${cells.length}`}
                                >
                                  {cell}
                                </span>
                              ))}
                            </div>
                          );
                        }

                        // Format course rows
                        if (
                          index > 3 &&
                          !line.startsWith("Current CGPA") &&
                          !line.startsWith("Credits Earned") &&
                          !line.startsWith("Semester GPA") &&
                          !line.startsWith("New CGPA") &&
                          !line.startsWith("Total Credits") &&
                          !line.startsWith("Academic Standing")
                        ) {
                          return (
                            <div
                              key={index}
                              className={`${rowClass} hover:bg-slate-50 dark:hover:bg-slate-800/60`}
                            >
                              {cells.map((cell, cellIndex) => (
                                <span
                                  key={cellIndex}
                                  className={`${cellClass} inline-block w-1/${cells.length}`}
                                >
                                  {cell}
                                </span>
                              ))}
                            </div>
                          );
                        }

                        // Format summary rows
                        if (
                          line.startsWith("Current CGPA") ||
                          line.startsWith("Credits Earned") ||
                          line.startsWith("Semester GPA") ||
                          line.startsWith("New CGPA") ||
                          line.startsWith("Total Credits") ||
                          line.startsWith("Academic Standing")
                        ) {
                          return (
                            <div
                              key={index}
                              className={`${rowClass} bg-slate-50 dark:bg-slate-800/50`}
                            >
                              <span
                                className={`${cellClass} inline-block w-2/3 font-medium text-slate-700 dark:text-slate-300`}
                              >
                                {cells[0]}
                              </span>
                              <span
                                className={`${cellClass} inline-block font-medium ${
                                  line.includes("GPA") || line.includes("CGPA")
                                    ? parseFloat(cells[1]) >= 3.5
                                      ? "text-blue-600 dark:text-blue-400"
                                      : parseFloat(cells[1]) >= 3.0
                                        ? "text-cyan-600 dark:text-cyan-400"
                                        : parseFloat(cells[1]) >= 2.0
                                          ? "text-amber-600 dark:text-amber-400"
                                          : "text-red-600 dark:text-red-400"
                                    : "text-slate-700 dark:text-slate-300"
                                } w-1/3`}
                              >
                                {cells[1]}
                              </span>
                            </div>
                          );
                        }

                        // Default formatting for any other rows
                        return (
                          <div key={index} className={rowClass}>
                            <div className={cellClass}>{line}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex h-32 items-center justify-center rounded-md border bg-slate-50 text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                      Click on "Refresh" to see your data preview
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  This preview shows how your data will appear in the exported
                  file.
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="flex flex-col-reverse items-center justify-between gap-2 border-t border-slate-200 pt-2 dark:border-slate-700 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={exportInProgress}
            className="w-full sm:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>

          <Button
            onClick={exportData}
            disabled={noMeaningfulData || exportInProgress}
            className="w-full sm:w-auto"
          >
            {exportInProgress ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Additional icon for refresh functionality
const RefreshIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

export default ExportCSV;
