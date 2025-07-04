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

const inter = Inter({ subsets: ["latin"] })
const GUEST_ROUTES = ["/login", "/register", "/welcome"]

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isGuestRoute = () => GUEST_ROUTES.includes(pathname)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <WebSocketProvider>
            <Provider store={store}>
              <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
                {!isGuestRoute() ? (
                  <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                      <SiteHeader />
                      <main className="flex-1 min-h-0">{children}</main>
                    </SidebarInset>
                  </SidebarProvider>
                ) : (
                  <div className="min-h-screen flex flex-col">
                    <main className="flex-1">{children}</main>
                  </div>
                )}
                <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
                <Toaster richColors />
              </ThemeProvider>
            </Provider>
          </WebSocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
