"use client"

import type React from "react"
import "../globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "sonner"
import { store } from "@/lib/store/store"
import { Provider } from "react-redux"
import { WebSocketProvider } from "@/contexts/WebSocketContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { OfflineIndicator } from "@/components/offline-indicator"
import { useEffect } from "react"
import { registerServiceWorker } from "@/lib/pwa-utils"


export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerServiceWorker()
  }, [])

  return (
    <AuthProvider>
      <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
        <WebSocketProvider>
        <Provider store={store}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <SiteHeader />
            <main className="flex-1 min-h-0">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        </Provider>
        </WebSocketProvider>
        <PWAInstallPrompt />
        <OfflineIndicator />
        <Toaster richColors />
      </ThemeProvider>   
    </AuthProvider>
  )
}
