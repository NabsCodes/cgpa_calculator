"use client";

import { useEffect, useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PWAStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === "undefined") return;

    // Check initial online status
    setIsOnline(navigator.onLine);

    // Handle online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "You're online",
        description: "Back online! Your changes will sync automatically.",
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "No worries! The app will continue to work offline.",
        duration: 5000,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for service worker updates if available
    if ("serviceWorker" in navigator && typeof window !== "undefined") {
      // Check for updates with the service worker
      navigator.serviceWorker.ready.then((registration) => {
        // Check for updates periodically
        setInterval(
          () => {
            registration.update().catch((err) => {
              console.error("Error checking for SW updates:", err);
            });
          },
          60 * 60 * 1000,
        ); // Check every hour
      });

      // Setup message event listener for update notifications
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "UPDATE_AVAILABLE") {
          setIsUpdateAvailable(true);
          toast({
            title: "Update available",
            description: "A new version is available. Update now?",
            duration: 0, // Persist until user dismisses
          });
        }
      });

      // Handle service worker update found
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        // Only reload if we haven't shown the update UI
        // This prevents automatic reloads when user hasn't confirmed
        if (!isUpdateAvailable) {
          window.location.reload();
        }
      });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [toast, isUpdateAvailable]);

  const handleUpdate = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Send skip waiting message to the service worker
        registration.waiting?.postMessage({ type: "SKIP_WAITING" });
        setIsUpdateAvailable(false);
      });
    }
  };

  // If offline, show offline indicator
  if (!isOnline) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-lg dark:bg-slate-800">
        <WifiOff className="h-4 w-4 text-red-500" />
        <span className="text-xs font-medium">Offline</span>
      </div>
    );
  }

  // If update available, show update button
  if (isUpdateAvailable) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-lg dark:bg-slate-800">
        <button
          onClick={handleUpdate}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          aria-label="Update application"
          tabIndex={0}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Update available</span>
        </button>
      </div>
    );
  }

  return null;
};

export default PWAStatus;
