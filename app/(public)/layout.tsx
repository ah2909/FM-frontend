"use client"

import type React from "react"
import "../globals.css"
import { Toaster } from "sonner"
import { AuthProvider } from "@/contexts/AuthContext"
import Script from "next/script"
import { OfflineIndicator } from "@/components/offline-indicator"
import { Provider } from "react-redux"
import { store } from "@/lib/store/store"


export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
          <div className="min-h-screen flex flex-col">
              <main className="flex-1">{children}</main>
          </div>
          <OfflineIndicator />
          <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
          <Toaster richColors />
      </AuthProvider>
    </Provider>
  )
}
