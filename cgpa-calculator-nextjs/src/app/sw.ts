// This file contains client-side code to register the service worker

// Only register the service worker in production
if (
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  process.env.NODE_ENV === "production"
) {
  // Register service worker
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((err) => {
      console.error("Service Worker registration failed:", err);
    });

  // Handle service worker updates
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    console.log("New service worker activated");
  });
}
