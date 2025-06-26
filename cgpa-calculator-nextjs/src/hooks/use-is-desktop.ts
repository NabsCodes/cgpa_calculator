import { useState, useEffect } from "react";

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkIsDesktop = () => {
      // Check for mobile/tablet user agents
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );

      // Check for touch capability
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // Consider it desktop if it's not mobile and not primarily touch-based
      const isDesktopDevice = !isMobile && !isTouchDevice;

      setIsDesktop(isDesktopDevice);
    };

    checkIsDesktop();

    // Re-check on resize (for responsive testing or device orientation changes)
    window.addEventListener("resize", checkIsDesktop);

    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  return isDesktop;
}
