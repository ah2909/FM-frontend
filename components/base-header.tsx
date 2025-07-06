"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
interface BaseHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function BaseHeader({ heading, text, children }: BaseHeaderProps) {
  const router = useRouter()
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0 gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-2xl font-bold tracking-tight break-words">{heading}</h1>
        {text && <p className="text-muted-foreground text-sm sm:text-base mt-1">{text}</p>}
      </div>
      {children && <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">{children}</div>}
    </div>
  )
}
