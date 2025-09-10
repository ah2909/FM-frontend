import type { Metadata } from "next";
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })
export default function RootLayout({ children }: { children: React.ReactNode }) {
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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
