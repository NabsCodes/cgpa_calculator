// Service Worker for CGPA Calculator PWA

const CACHE_NAME = "cgpa-calculator-v1";
const urlsToCache = [
  "/",
  "/manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/apple-touch-icon.png",
];

// Custom offline page URL
const OFFLINE_URL = "/";

// Install event - cache essential files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Notify clients about the update
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "UPDATE_AVAILABLE",
            });
          });
        });

        // Don't automatically skipWaiting to allow user to choose when to update
        // self.skipWaiting() is called when user clicks update button
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Helper function to determine if a request is an API call
const isApiRequest = (url) => {
  return url.indexOf("/api/") !== -1;
};

// Helper function to determine if a request is for a static asset
const isStaticAsset = (url) => {
  return (
    url.match(
      /\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|otf)$/,
    ) !== null
  );
};

// Fetch event - with improved strategies
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Different strategies for different types of requests
  if (isApiRequest(event.request.url)) {
    // Network-first strategy for API requests
    handleApiRequest(event);
  } else if (isStaticAsset(event.request.url)) {
    // Cache-first strategy for static assets
    handleStaticAsset(event);
  } else {
    // Network-first with fallback for HTML pages
    handlePageRequest(event);
  }
});

// Handle API requests - network first
function handleApiRequest(event) {
  event.respondWith(
    fetch(event.request.clone())
      .then((response) => {
        // Cache successful API responses
        if (response.ok) {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      })
      .catch(() => {
        // Use cached response if available when network fails
        return caches.match(event.request);
      }),
  );
}

// Handle static assets - cache first
function handleStaticAsset(event) {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset
        return cachedResponse;
      }

      // Not in cache, get from network
      return fetch(event.request)
        .then((networkResponse) => {
          // Cache the network response
          if (networkResponse && networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If it's an image, could return a placeholder
          if (event.request.url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) {
            // Could return a placeholder image from cache if available
            return caches.match("/icons/icon-512x512.png");
          }
          // Otherwise just fail
          return new Response("Network error occurred", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          });
        });
    }),
  );
}

// Handle page requests - network first with fallback
function handlePageRequest(event) {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache the latest version
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        // Offline fallback
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If no cached version, use offline fallback
          return caches.match(OFFLINE_URL);
        });
      }),
  );
}

// Handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
