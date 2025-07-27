import ClientLayout from "./clientLayout"
import type { Metadata } from "next";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>
}
