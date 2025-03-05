import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PortfolioForm } from "@/components/portfolio/portfolio-form"

export const metadata: Metadata = {
  title: "Create Portfolio",
  description: "Create a new crypto portfolio",
}

export default function NewPortfolioPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Create Portfolio" text="Create a new crypto portfolio">
        <Link href="/portfolios">
          <Button variant="outline">Cancel</Button>
        </Link>
      </DashboardHeader>
      <div className="grid gap-8">
        <PortfolioForm />
      </div>
    </DashboardShell>
  )
}

