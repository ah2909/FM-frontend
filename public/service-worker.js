const CACHE_NAME = "cryptofolio-v1"
const STATIC_CACHE_NAME = "cryptofolio-static-v1"
const DYNAMIC_CACHE_NAME = "cryptofolio-dynamic-v1"

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icons/192.png",
  "/icons/512.png",
  "/offline.html",
]

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /https:\/\/backend.cryptofolio.io.vn\/api\/*/
  // Add your API endpoints here
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...")

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        return self.skipWaiting()
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME && cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle navigation requests
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigation responses
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => cache.put(request, responseClone))
          }
          return response
        })
        .catch(() => {
          // Serve cached version or offline page
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match("/offline.html")
          })
        }),
    )
    return
  }

  // Handle API requests
  if (API_CACHE_PATTERNS.some((pattern) => pattern.test(request.url))) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        return fetch(request)
          .then((response) => {
            // Cache successful API responses for 5 minutes
            if (response.status === 200) {
              const responseClone = response.clone()
              // Add timestamp to track cache age
              const headers = new Headers(responseClone.headers)
              headers.set("sw-cache-timestamp", Date.now().toString())
              const cachedResponse = new Response(responseClone.body, {
                status: responseClone.status,
                statusText: responseClone.statusText,
                headers: headers,
              })
              cache.put(request, cachedResponse)
            }
            return response
          })
          .catch(() => {
            // Serve from cache if network fails
            return cache.match(request).then((cachedResponse) => {
              if (cachedResponse) {
                const cacheTimestamp = cachedResponse.headers.get("sw-cache-timestamp")
                const now = Date.now()
                const fiveMinutes = 5 * 60 * 1000

                // Serve cached response if less than 5 minutes old
                if (cacheTimestamp && now - Number.parseInt(cacheTimestamp) < fiveMinutes) {
                  return cachedResponse
                }
              }
              // Return a basic offline response for API calls
              return new Response(JSON.stringify({ error: "Offline", cached: false }), {
                status: 503,
                headers: { "Content-Type": "application/json" },
              })
            })
          })
      }),
    )
    return
  }

  // Handle static assets
  event.respondWith(
    caches
      .match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }

        return fetch(request).then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => cache.put(request, responseClone))
          }
          return response
        })
      })
      .catch(() => {
        // Fallback for failed requests
        if (request.destination === "image") {
          return caches.match("/icons/192.png")
        }
        return new Response("Offline", { status: 503 })
      }),
  )
})

// Background sync for when connection is restored
// self.addEventListener("sync", (event) => {
//   console.log("Background sync triggered:", event.tag)

//   if (event.tag === "portfolio-sync") {
//     event.waitUntil(
//       // Implement your sync logic here
//       syncPortfolioData(),
//     )
//   }
// })

// Push notifications
// self.addEventListener("push", (event) => {
//   console.log("Push notification received:", event)

//   const options = {
//     body: event.data ? event.data.text() : "New update available!",
//     icon: "/icons/192.png",
//     badge: "/icons/72.png",
//     vibrate: [200, 100, 200],
//     data: {
//       dateOfArrival: Date.now(),
//       primaryKey: 1,
//     },
//     actions: [
//       {
//         action: "close",
//         title: "Close",
//         icon: "/icons/72.png",
//       },
//     ],
//   }

//   event.waitUntil(self.registration.showNotification("CryptoFolio", options))
// })

// Notification click handling
// self.addEventListener("notificationclick", (event) => {
//   console.log("Notification clicked:", event)

//   event.notification.close()

//   if (event.action === "explore") {
//     event.waitUntil(clients.openWindow("/portfolios"))
//   } else if (event.action === "close") {
//     // Just close the notification
//   } else {
//     // Default action - open the app
//     event.waitUntil(clients.openWindow("/"))
//   }
// })

// Helper function for portfolio sync
// async function syncPortfolioData() {
//   try {
//     // Implement your portfolio sync logic here
//     console.log("Syncing portfolio data in background...")

//     // Example: fetch latest portfolio data
//     const response = await fetch("/api/portfolio/sync", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })

//     if (response.ok) {
//       console.log("Portfolio sync completed successfully")
//     } else {
//       console.error("Portfolio sync failed:", response.status)
//     }
//   } catch (error) {
//     console.error("Portfolio sync error:", error)
//   }
// }
