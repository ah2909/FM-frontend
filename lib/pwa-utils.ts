// Service Worker registration and PWA utilities
export const registerServiceWorker = async () => {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/service-worker.js", {
        scope: "/",
      })
      console.log("Service Worker registered successfully")
      return registration
    } catch (error) {
      console.error("Service Worker registration failed:", error)
    }
  }
}

export const unregisterServiceWorker = async () => {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        await registration.unregister()
        console.log("Service Worker unregistered")
      }
    } catch (error) {
      console.error("Service Worker unregistration failed:", error)
    }
  }
}

// Check if app is running as PWA
export const isPWA = (): boolean => {
  if (typeof window === "undefined") return false

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes("android-app://")
  )
}

// Get PWA display mode
export const getPWADisplayMode = (): string => {
  if (typeof window === "undefined") return "browser"

  const displayModes = ["fullscreen", "standalone", "minimal-ui", "browser"]

  for (const mode of displayModes) {
    if (window.matchMedia(`(display-mode: ${mode})`).matches) {
      return mode
    }
  }

  return "browser"
}

// Cache management utilities
export const clearAppCache = async () => {
  if ("caches" in window) {
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
    console.log("App cache cleared")
  }
}

export const getCacheSize = async (): Promise<number> => {
  if (!("caches" in window) || !("storage" in navigator) || !("estimate" in navigator.storage)) {
    return 0
  }

  try {
    const estimate = await navigator.storage.estimate()
    return estimate.usage || 0
  } catch (error) {
    console.error("Failed to get cache size:", error)
    return 0
  }
}
