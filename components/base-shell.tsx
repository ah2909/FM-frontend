import type React from "react"
interface BaseShellProps {
  children: React.ReactNode
  className?: string
}

export function BaseShell({ children, className = "" }: BaseShellProps) {
  return (
    <div className={`flex-1 space-y-6 p-4 sm:p-6 lg:p-10 pt-4 sm:pt-10 max-w-7xl mx-auto w-full ${className}`}>
      {children}
    </div>
  )
}
