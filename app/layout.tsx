import ClientLayout from "./clientLayout"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cryptofolio",
  description: "Crypto portfolio management",
  icons: {
    icon: '/logo512.png',
  },
  manifest: "/web.manifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>
}
