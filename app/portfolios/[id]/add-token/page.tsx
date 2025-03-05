import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AddTokenForm } from "@/components/portfolio/add-token-form"

export const metadata: Metadata = {
  title: "Add Token",
  description: "Add a token to your portfolio",
}

interface AddTokenPageProps {
  params: {
    id: string
  }
}

export default function AddTokenPage({ params }: AddTokenPageProps) {
  const portfolioId = params.id

  return (
    <DashboardShell>
      <DashboardHeader heading="Add Token" text="Add a new token to your portfolio">
        <Link href={`/portfolios/${portfolioId}`}>
          <Button variant="outline">Cancel</Button>
        </Link>
      </DashboardHeader>
      <div className="grid gap-8">
        <AddTokenForm portfolioId={portfolioId} />
      </div>
    </DashboardShell>
  )
}

