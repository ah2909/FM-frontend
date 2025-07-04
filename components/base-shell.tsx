import type React from "react"
interface BaseShellProps {
  children: React.ReactNode
  className?: string
}

export function BaseShell({ children, className = "" }: BaseShellProps) {
  return (
    <div className={`flex-1 space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8 lg:p-10 pt-4 sm:pt-6 ${className}`}>
      {children}
    </div>
  )
}
