import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "CryptoFolio – Portfolio Tracker",
    template: "%s | CryptoFolio",
  },
  description:
    "Track your crypto portfolio across exchanges in real-time. Monitor balances, performance, and transactions all in one place.",
  applicationName: "CryptoFolio",
  keywords: ["crypto", "portfolio", "bitcoin", "ethereum", "tracker", "defi"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "CryptoFolio",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icons/512.png",
    apple: "/icons/192.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#1748ce",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={jakarta.variable}>
      <head>
        <link rel="dns-prefetch" href="//accounts.google.com" />
      </head>
      <body className={jakarta.className}>{children}</body>
    </html>
  )
}
