"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

export function SiteHeader() {
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)
    if (segments.length === 0) return [{ label: "Dashboard", href: "/" }]

    const breadcrumbs = [{ label: "Dashboard", href: "/" }]
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
    <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-2 sm:px-0">
      <div className="flex items-center gap-2 px-2 sm:px-4 w-full">
        <SidebarTrigger className="ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="flex-1 min-w-0">
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.label} className="flex items-center">
                <BreadcrumbItem className="hidden sm:block">
                  {breadcrumb.href ? (
                    <BreadcrumbLink href={breadcrumb.href} className="text-sm">
                      {breadcrumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="text-sm">{breadcrumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {/* Mobile: only show current page */}
                {index === breadcrumbs.length - 1 && (
                  <BreadcrumbItem className="sm:hidden">
                    <BreadcrumbPage className="text-sm truncate">{breadcrumb.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="hidden sm:block" />}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto px-1 sm:px-3">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
