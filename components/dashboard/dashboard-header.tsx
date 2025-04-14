"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
  showBackButton?: boolean
}

export function DashboardHeader({ heading, text, children, showBackButton = true }: DashboardHeaderProps) {
  const router = useRouter()
  return (
    <div className="flex items-center justify-between px-2">
      <div className="grid gap-1">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2" aria-label="Go back">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="font-heading text-3xl md:text-4xl">{heading}</h1>
        {text && <p className="text-lg text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  )
}

