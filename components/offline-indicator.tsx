"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { WifiOff, Wifi } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)

      if (!online) {
        setShowIndicator(true)
      } else {
        // Show "back online" message briefly
        if (!isOnline) {
          setShowIndicator(true)
          setTimeout(() => setShowIndicator(false), 3000)
        }
      }
    }

    // Set initial status
    updateOnlineStatus()

    // Listen for online/offline events
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [isOnline])

  if (!showIndicator) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <Card className={`shadow-lg ${isOnline ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
        <CardContent className="py-2 px-4">
          <div className="flex items-center gap-2 text-sm">
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 text-green-600" />
                <span className="text-green-700 font-medium">Back online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-600" />
                <span className="text-red-700 font-medium">You're offline</span>
                <span className="text-red-600 text-xs">Some features may be limited</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}