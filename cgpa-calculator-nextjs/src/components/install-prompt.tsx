/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Only run in the browser
    if (typeof window === "undefined") return;

    // Check if user previously dismissed the prompt
    const hasUserDismissedPrompt = localStorage.getItem(
      "installPromptDismissed",
    );
    if (hasUserDismissedPrompt === "true") {
      return; // Don't show prompt if user dismissed it
    }

    // Function to check if the PWA is already installed
    const isPWAInstalled = () => {
      return (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        window.matchMedia("(display-mode: minimal-ui)").matches ||
        (window.navigator as any).standalone === true // For iOS
      );
    };

    // If already installed as PWA, don't show prompt
    if (isPWAInstalled()) {
      return;
    }

    // More comprehensive browser detection for unsupported browsers
    const isUnsupportedBrowser = () => {
      const ua = navigator.userAgent;
      // Arc browser detection (more reliable)
      const isArc =
        ua.includes("Arc/") ||
        (ua.includes("Chrome") &&
          Object.prototype.hasOwnProperty.call(
            document.documentElement.style,
            "--arc-palette-title",
          ));

      // Facebook in-app browser
      const isFacebookBrowser = ua.includes("FBAN") || ua.includes("FBAV");

      // Instagram in-app browser
      const isInstagramBrowser = ua.includes("Instagram");

      // LinkedIn in-app browser
      const isLinkedInBrowser = ua.includes("LinkedInApp");

      // Other browsers known to have issues with PWA installation
      const isSnapchatBrowser = ua.includes("Snapchat");

      return (
        isArc ||
        isFacebookBrowser ||
        isInstagramBrowser ||
        isLinkedInBrowser ||
        isSnapchatBrowser
      );
    };

    // Don't show prompt on unsupported browsers
    if (isUnsupportedBrowser()) {
      return;
    }

    // Check if it's iOS
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOS);

    // For non-iOS devices, listen for the beforeinstallprompt event
    if (!isIOS) {
      let promptEventReceived = false;

      const handleBeforeInstallPrompt = (e: Event) => {
        // Prevent Chrome 76+ from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        setDeferredPrompt(e);
        promptEventReceived = true;

        // Show our custom install prompt, but only if we haven't shown it recently
        const lastPromptTime = localStorage.getItem("lastInstallPromptTime");
        const now = Date.now();

        if (
          !lastPromptTime ||
          now - parseInt(lastPromptTime) > 7 * 24 * 60 * 60 * 1000
        ) {
          // Only show if we haven't prompted in the last 7 days
          setShowPrompt(true);
          localStorage.setItem("lastInstallPromptTime", now.toString());
        }
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      // If after 1 second we haven't received the event, assume this browser doesn't support PWA installation
      setTimeout(() => {
        if (!promptEventReceived && !isIOS) {
          // Browser likely doesn't support PWA installation
          localStorage.setItem("browserDoesNotSupportPWA", "true");
        }
      }, 1000);

      // Check if app is already installed
      window.addEventListener("appinstalled", () => {
        // Hide the prompt when app is installed
        setShowPrompt(false);
        setDeferredPrompt(null);
        // Remember that user installed the app
        localStorage.setItem("appInstalled", "true");
      });

      return () => {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt,
        );
      };
    } else {
      // For iOS, show a custom prompt if the user is not in standalone mode
      const isInStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone;

      // Check if we've already shown the iOS prompt recently
      const lastIOSPromptTime = localStorage.getItem("lastIOSPromptTime");
      const now = Date.now();

      // Only show if not in standalone mode and we haven't prompted in the last 14 days (iOS users need more reminders)
      if (
        !isInStandaloneMode &&
        (!lastIOSPromptTime ||
          now - parseInt(lastIOSPromptTime) > 14 * 24 * 60 * 60 * 1000)
      ) {
        setShowPrompt(true);
        localStorage.setItem("lastIOSPromptTime", now.toString());
      }
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the installation prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // We've used the prompt, and can't use it again, discard it
    setDeferredPrompt(null);

    // Hide our custom install prompt regardless of outcome
    setShowPrompt(false);

    // If user accepted, remember that, otherwise mark as dismissed
    if (outcome === "accepted") {
      localStorage.setItem("appInstalled", "true");
    } else {
      localStorage.setItem("installPromptDismissed", "true");
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store in localStorage that user dismissed the prompt
    // On mobile, set a shorter dismissal period (30 days) so we can remind them again later
    // On desktop, respect the dismissal more permanently
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    if (isMobile) {
      // For mobile, store the dismissal time instead of a boolean
      localStorage.setItem("installPromptDismissedAt", Date.now().toString());
    } else {
      // For desktop, respect the dismissal more permanently
      localStorage.setItem("installPromptDismissed", "true");
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg bg-white p-4 shadow-lg dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Install CGPA Calculator
          </h3>
          {isIOS ? (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Tap{" "}
              <span className="inline-block">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </span>{" "}
              and then "Add to Home Screen" to install
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Install this app on your device for easy access anytime
            </p>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          aria-label="Dismiss"
          tabIndex={0}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {!isIOS && (
        <button
          onClick={handleInstallClick}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Install app"
          tabIndex={0}
        >
          <Download className="h-4 w-4" />
          Install App
        </button>
      )}
    </div>
  );
};

export default InstallPrompt;
