"use client"

import { useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { store } from "@/lib/store/store"
import { Provider } from "react-redux"
import { WebSocketProvider } from "@/contexts/WebSocketContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { OfflineIndicator } from "@/components/offline-indicator"
import { registerServiceWorker } from "@/lib/pwa-utils"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { useIsMobile } from "@/hooks/use-mobile"
import { MobileSiteHeader } from "@/components/mobile-site-header"
import { PullToRefresh } from "@/components/pull-to-refresh"
import { SiteHeader } from "@/components/site-header"

interface ProtectedShellProps {
  children: React.ReactNode
}

export function ProtectedShell({ children }: ProtectedShellProps) {
  const isMobile = useIsMobile()

  useEffect(() => {
    registerServiceWorker()
  }, [])

  return (
    <AuthProvider>
      <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
        <WebSocketProvider>
          <Provider store={store}>
            {isMobile ? (
              <>
                <PullToRefresh>
                  <MobileSiteHeader />
                  <main className="flex-1 pb-16 overflow-auto animate-fade-in">
                    {children}
                  </main>
                </PullToRefresh>
                <MobileBottomNav />
              </>
            ) : (
              <>
                <SidebarProvider>
                  <AppSidebar />
                  <SidebarInset>
                    <SiteHeader />
                    <main className="flex-1 min-h-0 animate-fade-in">
                      {children}
                    </main>
                  </SidebarInset>
                </SidebarProvider>
              </>
            )}
          </Provider>
        </WebSocketProvider>
        <PWAInstallPrompt />
        <OfflineIndicator />
        <Toaster richColors expand={false} position="top-right" />
      </ThemeProvider>
    </AuthProvider>
  )
}
