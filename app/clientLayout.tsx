"use client"

import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "sonner"
import { store } from "@/lib/store/store"
import { Provider } from "react-redux"
import { WebSocketProvider } from "../contexts/WebSocketContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { usePathname } from "next/navigation"
import Script from "next/script"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { OfflineIndicator } from "@/components/offline-indicator"
import { useEffect } from "react"
import { registerServiceWorker } from "@/lib/pwa-utils"

const inter = Inter({ subsets: ["latin"] })
const GUEST_ROUTES = ["/login", "/register", "/welcome"]

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isGuestRoute = () => GUEST_ROUTES.includes(pathname)

  useEffect(() => {
    registerServiceWorker()
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#7C5DFA" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CryptoFolio" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="CryptoFolio" />

        {/* PWA Icons */}
        <link rel="icon" href="/icons/512.png" />
        <link rel="apple-touch-icon" href="/icons/192.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preload critical resources */}
        <link rel="preload" href="/icons/512.png" as="image" />
        <link rel="dns-prefetch" href="//accounts.google.com" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
            {!isGuestRoute() ? (
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
            ) : (
              <div className="min-h-screen flex flex-col">
                <main className="flex-1">{children}</main>
              </div>
            )}
            <PWAInstallPrompt />
            <OfflineIndicator />
            <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
            <Toaster richColors />
          </ThemeProvider>   
        </AuthProvider>
      </body>
    </html>
  )
}
