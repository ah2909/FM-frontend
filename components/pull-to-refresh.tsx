"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, RefreshCw } from "lucide-react"

interface PullToRefreshProps {
  children: React.ReactNode
}

export function PullToRefresh({ children }: PullToRefreshProps) {
  const router = useRouter()
  const [startY, setStartY] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const THRESHOLD = 80
  const MAX_PULL = 160

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only enable pull to refresh when at the top of the page
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY
    
    // Check if we are at the top and pulling down
    if (window.scrollY <= 0 && startY > 0 && currentY > startY) {
      const delta = currentY - startY
      
      // Calculate pull distance with resistance/damping
      const pull = Math.min(delta * 0.4, MAX_PULL)
      setTranslateY(pull)
      
      // Prevent native scrolling if we are pulling down
      if (e.cancelable && pull > 0) {
        // e.preventDefault() // This might be too aggressive, let's see
      }
    } else {
      // If we scroll down or back up, reset
      if (translateY > 0) {
        setTranslateY(0)
        setStartY(0)
      }
    }
  }

  const handleTouchEnd = async () => {
    if (translateY === 0) {
      setStartY(0)
      return
    }

    if (translateY > THRESHOLD) {
      setIsRefreshing(true)
      setTranslateY(THRESHOLD) // Snap to loading position
      
      try {
        // Attempt to reload the page
        window.location.reload()
      } catch (error) {
        console.error("Reload failed", error)
        setIsRefreshing(false)
        setTranslateY(0)
      }
    } else {
      // Bounce back
      setTranslateY(0)
    }
    setStartY(0)
  }

  return (
    <div 
      className="min-h-[100dvh]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Loading Indicator */}
      <div 
        className="fixed top-0 left-0 w-full flex justify-center items-start pt-4 pointer-events-none z-50"
        style={{ 
          opacity: translateY > 0 ? 1 : 0,
          transform: `translateY(${translateY > THRESHOLD ? 0 : translateY - THRESHOLD}px)`,
          transition: isRefreshing ? 'transform 0.2s' : 'none'
        }}
      >
        <div className="bg-background/80 backdrop-blur-sm shadow-md rounded-full p-2 border border-border">
          {isRefreshing ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <RefreshCw 
              className="h-5 w-5 text-primary" 
              style={{ transform: `rotate(${translateY * 2}deg)` }}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div 
        style={{ 
          transform: `translateY(${translateY}px)`,
          transition: isRefreshing ? 'transform 0.2s' : 'transform 0.3s ease-out' 
        }}
      >
        {children}
      </div>
    </div>
  )
}
