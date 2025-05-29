"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { PortfolioPerformance } from "@/components/portfolio/portfolio-performance"

ChartJS.register(ArcElement, Tooltip, Legend)

export function PortfolioOverview({ portfolio }: { portfolio: any }) {
  const chartData = {
    labels: portfolio.assets.map((token: any) => token.symbol.toUpperCase()),
    datasets: [
      {
        data: portfolio.assets.map((token: any) => token.value?.toFixed(2)),
        label: "Asset Allocation",
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }
  const totalCost = portfolio.assets.reduce((acc: number, token: any) => {
    if(token.avg_price !== 0) {
      return acc + token.amount * token.avg_price
    }
    else return acc + token.amount * token.price
  }, 0)

  const performanceMetrics = {
    totalCost: totalCost,
    currentValue: portfolio.totalValue,
    unrealizedPnl: portfolio.totalValue - totalCost,
    unrealizedPnlPercentage: (portfolio.totalValue - totalCost) / totalCost * 100,
    allTimeHigh: 1000,
    allTimeLow: 100,
    change24h: 10,
    change7d: 50,
  }

  return (
    <div className="space-y-6">
      <PortfolioPerformance metrics={performanceMetrics} />
      {/* <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${portfolio.totalValue?.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground mt-2">{portfolio.assets.length} tokens in this portfolio</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex justify-center">
              <Doughnut
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  )
}

