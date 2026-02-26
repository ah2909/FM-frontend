"use client"

import { Home, PieChart, Globe } from "lucide-react"
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
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass safe-area-pb border-t border-border/50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.url
          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 rounded-xl mx-1",
                isActive
                  ? "text-primary bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
              )}
            >
              <item.icon className={cn("h-5 w-5 mb-1 transition-transform duration-300", isActive && "text-primary scale-110")} />
              <span className="truncate leading-none">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
