"use client"

import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { Bitcoin } from "lucide-react"

export function MobileSiteHeader() {
  return (
    <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-2 sm:px-0">
      <Link 
        href="/" 
        className="flex items-center gap-3 px-3 py-2"
      >
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Bitcoin className="size-6" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold text-base">CryptoFolio</span>
        </div>
      </Link>
      <div className="ml-auto px-1 sm:px-3">
        <ModeToggle />
      </div>
    </header>
  )
}
