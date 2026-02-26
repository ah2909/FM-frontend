"use client"

import { Home, PieChart, Wallet2, Globe, BarChart3 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useGetUserInfoQuery } from "@/lib/store/services/user-api"
import { useSidebar } from "@/components/ui/sidebar"
import { useEffect } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bitcoin } from "lucide-react"

// Menu items.
const items = [
  {
    title: "Dashboard",
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
    title: "Analyze",
    url: "/analyze",
    icon: BarChart3,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { data, isLoading } = useGetUserInfoQuery()
  const { setOpenMobile, isMobile } = useSidebar()

  // Close sidebar when pathname changes on mobile
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [pathname, isMobile, setOpenMobile])

  const handleMenuItemClick = () => {
    // Close sidebar on mobile when menu item is clicked
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar variant="inset" className="border-r bg-sidebar-background/50 backdrop-blur-xl">
      <SidebarHeader className="border-b border-sidebar-border bg-transparent p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-sidebar-accent/50 transition-all"
            >
              <Link 
                href="/" 
                className="flex items-center gap-3"
                onClick={handleMenuItemClick}
              >
                <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground shadow-lg shadow-primary/20">
                  <Bitcoin className="size-5" />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-bold text-base tracking-tight gradient-text">CryptoFolio</span>
                  <span className="truncate text-[10px] font-medium text-muted-foreground uppercase tracking-widest opacity-80">Portfolio Hub</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
            Maintenance
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="w-full justify-start px-3 py-5 text-sm font-medium transition-all hover:bg-sidebar-accent/80 hover:translate-x-1 active:scale-95 data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold rounded-xl"
                  >
                    <Link 
                      href={item.url} 
                      className="flex items-center gap-3"
                      onClick={handleMenuItemClick}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3 bg-transparent">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="w-full px-1">
              {!isLoading && data?.user && (
                <div className="flex items-center gap-3 p-2 rounded-xl bg-sidebar-accent/30 border border-sidebar-border/50">
                  <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                    <AvatarImage src={data.user.avatar_url} alt={data.user.name} />
                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-bold">
                      {data.user.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 text-left leading-tight overflow-hidden">
                    <span className="truncate font-semibold text-sm">{data.user.name}</span>
                    <span className="truncate text-xs text-muted-foreground opacity-70">{data.user.email}</span>
                  </div>
                </div>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
