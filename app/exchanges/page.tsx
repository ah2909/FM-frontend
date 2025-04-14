import type { Metadata } from "next"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { UserExchanges } from "@/components/exchange/user-exchanges" 

export const metadata: Metadata = {
  title: "Exchanges",
  description: "Manage your connected exchanges",
}

export default function ExchangesPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Exchanges" text="Manage your connected cryptocurrency exchanges and wallets" showBackButton={false}/>
      <UserExchanges />
    </DashboardShell>
  )
}

