import type { Metadata } from "next"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PortfolioList } from "@/components/portfolio/portfolio-list"
import { ImportDataButton } from "@/components/portfolio/import-data-button"
import { ConnectedExchanges } from "@/components/portfolio/connected-exchanges"

export const metadata: Metadata = {
  title: "Portfolios",
  description: "Manage your crypto portfolios",
}

export default async function PortfoliosPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Portfolios" text="Manage your crypto portfolios">
        <div>
          <Link href="/portfolios/new">
            <Button className="mr-4 mb-2">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Portfolio
            </Button>
          </Link>
          <ImportDataButton />
        </div>
      </DashboardHeader>
      <PortfolioList />
      <ConnectedExchanges />
    </DashboardShell>
  )
}

