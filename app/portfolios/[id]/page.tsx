"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PortfolioTokens } from "@/components/portfolio/portfolio-tokens"
import { PortfolioOverview } from "@/components/portfolio/portfolio-overview"
import { UseDispatch, useSelector } from "react-redux"
import { Portfolio } from "@/lib/store/services/portfolio-api"

interface PortfolioPageProps {
  params: {
    id: number
  }
}

export default function PortfolioPage({ params }: PortfolioPageProps) {
  const portfolioId = params.id
  const local = useSelector((state: any) => state.portfolios.portfolios);
  const portfolio = local.find((port: Portfolio) => port.id == portfolioId)

  if (!portfolio) {
    notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={portfolio.name} text={portfolio.description}>
        <div className="flex space-x-2">
          <Link href={`/portfolios/${portfolioId}/edit`}>
            <Button variant="outline">Edit Portfolio</Button>
          </Link>
          <Link href={`/portfolios/${portfolioId}/add-token`}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Token
            </Button>
          </Link>
        </div>
      </DashboardHeader>

      <div className="grid gap-8">
        {/* <PortfolioOverview portfolio={portfolio} /> */}
        {/* <PortfolioTokens portfolioId={portfolioId} tokens={portfolio.tokens} /> */}
        <p>Wait for update...</p>
      </div>
    </DashboardShell>
  )
}

