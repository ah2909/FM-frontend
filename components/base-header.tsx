"use client"

import type React from "react"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
interface BaseHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
  mobileMenuItems?: Array<{
    label: string
    icon?: React.ReactNode
    onClick?: () => void
    href?: string
    component?: React.ReactNode
  }>
}

export function BaseHeader({ heading, text, children, mobileMenuItems = [] }: BaseHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0 gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight truncate">{heading}</h1>
            {text && <p className="text-muted-foreground text-sm sm:text-base mt-1 line-clamp-2">{text}</p>}
          </div>

          {/* Mobile Menu - Only show if we have mobile menu items */}
          {mobileMenuItems.length > 1 && (
            <div className="md:hidden ml-2 flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {mobileMenuItems.map((item, index) => (
                    <div key={index}>
                      {item.component ? (
                        <div>{item.component}</div>
                      ) : (
                        <DropdownMenuItem onClick={item.onClick} className="flex items-center gap-2 cursor-pointer">
                          {item.icon}
                          {item.label}
                        </DropdownMenuItem>
                      )}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          {mobileMenuItems.length === 1 && (
            <div className="md:hidden ml-2 flex-shrink-0">
              {mobileMenuItems.map((item, index) => (
                <div key={index}>
                  {item.component ? (
                    <div>{item.component}</div>
                  ) : (
                    <Button variant="ghost" onClick={item.onClick} className="flex items-center gap-2 cursor-pointer">
                      {item.icon}
                      {item.label}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Desktop Actions */}
      {children && (
        <div className="hidden md:flex flex-col gap-2 sm:gap-3 w-full md:w-auto md:flex-row md:items-start md:flex-shrink-0">
          {children}
        </div>
      )}
    </div>
  )
}
