"use client"

import { useEffect, useState } from "react"
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
import { WsEventListener } from "@/components/ws-event-listener"
import { ConnectionProgress } from "@/components/exchange/connection-progress"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

interface ProtectedShellProps {
  children: React.ReactNode
}

export function ProtectedShell({ children }: ProtectedShellProps) {
  return (
    <AuthProvider>
      <AuthGuard>
        <ProtectedContent>{children}</ProtectedContent>
      </AuthGuard>
    </AuthProvider>
  )
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Securing your session...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}

function ProtectedContent({ children }: ProtectedShellProps) {
  const isMobile = useIsMobile()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    registerServiceWorker()
  }, [])

  const layoutContent = (!hasMounted || !isMobile) ? (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <main className="flex-1 min-h-0">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  ) : (
    <>
      <PullToRefresh>
        <MobileSiteHeader />
        <main className="flex-1 pb-16 overflow-auto">
          {children}
        </main>
      </PullToRefresh>
      <MobileBottomNav />
    </>
  )

  return (
    <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
      <WebSocketProvider>
        <Provider store={store}>
          <WsEventListener />
          <ConnectionProgress />
          {layoutContent}
        </Provider>
      </WebSocketProvider>
      <PWAInstallPrompt />
      <OfflineIndicator />
      <Toaster richColors expand={false} position="top-right" />
    </ThemeProvider>
  )
}

