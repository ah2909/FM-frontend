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
import { ImportDataButton } from "@/components/portfolio/import-data-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
          <ImportDataButton portfolio_id={portfolioId}/>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56"> 
              <DropdownMenuItem>
                <Link href={`/portfolios/${portfolioId}/edit`}>
                  Edit Portfolio
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/portfolios/${portfolioId}/add-token`}>
                  Add Token
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DashboardHeader>

      <div className="grid gap-8">
        {portfolio.assets.length > 0 && <PortfolioOverview portfolio={portfolio} />}
        <PortfolioTokens portfolioId={portfolioId} tokens={portfolio.assets} />
      </div>
    </DashboardShell>
  )
}

