"use client"
import { PortfolioPerformance } from "@/components/portfolio/portfolio-performance"
import { useSelector } from "react-redux"

export function PortfolioOverview({ portfolio }: { portfolio: any }) {
  const balance = useSelector((state: any) => state.portfolios.performance)
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
    allTimeHigh: Math.max(...balance) || 0,
    allTimeLow: Math.min(...balance) || 0,
    change24h: isNaN(balance[0]) && balance[0] !== 0 ? (portfolio.totalValue / balance[0]) * 100 - 100 : 0,
    change7d: isNaN(balance[6]) && balance[6] !== 0 ? (portfolio.totalValue / balance[6]) * 100 - 100 : 0,
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PortfolioPerformance metrics={performanceMetrics} />
    </div>
  )
}
