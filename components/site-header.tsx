"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function SiteHeader() {
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)
    if (segments.length === 0) return [{ label: "Dashboard", href: "/" }]

    const breadcrumbs: { label: string; href?: string }[] = []
    let currentPath = ""

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1
      breadcrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: isLast ? undefined : currentPath,
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <header className="sticky top-0 z-40 flex h-14 sm:h-16 shrink-0 items-center gap-2 glass border-b border-border/40 px-3 sm:px-6 transition-all duration-300">
      <div className="flex items-center gap-2 w-full max-w-7xl mx-auto">
        <SidebarTrigger className="hover:bg-primary/10 hover:text-primary transition-colors h-9 w-9" />
        <Separator orientation="vertical" className="mx-2 h-5 opacity-40" />
        <Breadcrumb className="flex-1 min-w-0">
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.label} className="flex items-center">
                <BreadcrumbItem className="hidden sm:block">
                  {breadcrumb.href ? (
                    <Link href={breadcrumb.href} className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 hover:text-primary transition-colors">
                      {breadcrumb.label}
                    </Link>
                  ) : (
                    <BreadcrumbPage className="text-xs font-bold uppercase tracking-widest text-foreground">
                      {breadcrumb.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="hidden sm:block opacity-40 mx-2" />} 
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
