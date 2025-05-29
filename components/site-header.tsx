"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bitcoin, LayoutDashboard, PieChart, Wallet2, Globe } from "lucide-react"

import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Bitcoin className="h-6 w-6" />
            <span className="inline-block font-bold">CryptoFolio</span>
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/"
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground",
                pathname === "/" && "text-foreground",
              )}
            >
              <LayoutDashboard className="mr-1 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/portfolios"
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground",
                pathname?.startsWith("/portfolios") && "text-foreground",
              )}
            >
              <PieChart className="mr-1 h-4 w-4" />
              Portfolios
            </Link>
            {/* <Link
              href="/transactions"
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground",
                pathname?.startsWith("/transactions") && "text-foreground",
              )}
            >
              <Wallet2 className="mr-1 h-4 w-4" />
              Transactions
            </Link> */}
            <Link
              href="/exchanges"
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground",
                pathname?.startsWith("/exchanges") && "text-foreground",
              )}
            >
              <Globe className="mr-1 h-4 w-4" />
              Exchanges
            </Link>
          </nav>
        </div>
        <nav className="flex items-center">
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}

