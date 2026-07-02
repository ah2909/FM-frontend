"use client"

import { useEffect, useState } from "react"
import { Home, PieChart, Globe, Gauge, Bell, LineChart, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Portfolios",
    url: "/portfolios",
    icon: PieChart,
  },
  {
    title: "Exchanges",
    url: "/exchanges",
    icon: Globe,
  },
  {
    title: "Markets",
    url: "/markets",
    icon: LineChart,
  },
  {
    title: "Analyze",
    url: "/analyze",
    icon: Gauge,
  },
  {
    title: "Alerts",
    url: "/alerts",
    icon: Bell,
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the menu after navigating
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      {/* Scrim — tap outside to close */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Speed-dial menu column, rises above the button on the right */}
      <nav
        className={cn(
          "fixed right-4 z-50 flex flex-col items-end gap-2.5",
          "bottom-[calc(5.75rem+env(safe-area-inset-bottom))]",
          !open && "pointer-events-none"
        )}
        aria-label="Main navigation"
        aria-hidden={!open}
      >
        {navItems.map((item, i) => {
          const isActive = pathname === item.url
          return (
            <Link
              key={item.title}
              href={item.url}
              tabIndex={open ? 0 : -1}
              className={cn(
                "flex items-center gap-3 transition-all duration-300 ease-out",
                open ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-90"
              )}
              style={{ transitionDelay: open ? `${(navItems.length - 1 - i) * 35}ms` : "0ms" }}
            >
              <span
                className={cn(
                  "glass rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-md",
                  isActive ? "text-primary" : "text-foreground/80"
                )}
              >
                {item.title}
              </span>
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-primary/30"
                    : "glass text-foreground/80"
                )}
              >
                <item.icon className="h-5 w-5" />
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Floating action button — centered when closed, slides right when open */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        className={cn(
          "fixed z-50 flex h-14 w-14 items-center justify-center rounded-full",
          "bg-gradient-to-br from-primary to-blue-600 text-primary-foreground",
          "shadow-xl shadow-primary/30 active:scale-90",
          "bottom-[calc(1rem+env(safe-area-inset-bottom))]"
        )}
        style={{
          left: open ? "calc(100% - 4.5rem)" : "50%",
          transform: open ? "translateX(0) rotate(90deg)" : "translateX(-50%) rotate(0deg)",
          transition: "left 380ms cubic-bezier(0.34, 1.56, 0.64, 1), transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1), scale 150ms ease",
        }}
      >
        <Menu
          className={cn(
            "absolute h-6 w-6 transition-all duration-200",
            open ? "opacity-0 scale-50" : "opacity-100 scale-100"
          )}
        />
        <X
          className={cn(
            "absolute h-6 w-6 -rotate-90 transition-all duration-200",
            open ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}
        />
      </button>
    </>
  )
}
