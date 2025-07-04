"use client"
import { PortfolioPerformance } from "@/components/portfolio/portfolio-performance"

export function PortfolioOverview({ portfolio }: { portfolio: any }) {
  const totalCost = portfolio.assets.reduce((acc: number, token: any) => {
    if (token.avg_price !== 0) {
      return acc + token.amount * token.avg_price
    } else return acc + token.amount * token.price
  }, 0)

  const performanceMetrics = {
    totalCost: totalCost,
    currentValue: portfolio.totalValue,
    unrealizedPnl: portfolio.totalValue - totalCost,
    unrealizedPnlPercentage: ((portfolio.totalValue - totalCost) / totalCost) * 100,
    allTimeHigh: 1000,
    allTimeLow: 100,
    change24h: 10,
    change7d: 50,
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PortfolioPerformance metrics={performanceMetrics} />
    </div>
  )
}
