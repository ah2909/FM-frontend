"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

interface PortfolioOverviewProps {
  portfolio: {
    id: string
    name: string
    description: string
    totalValue: number
    tokens: {
      id: string
      name: string
      symbol: string
      amount: number
      value: number
      icon: string
    }[]
  }
}

export function PortfolioOverview({ portfolio }: PortfolioOverviewProps) {
  const chartData = {
    labels: portfolio.tokens.map((token) => token.name),
    datasets: [
      {
        data: portfolio.tokens.map((token) => token.value),
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

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${portfolio.totalValue.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground mt-2">{portfolio.tokens.length} tokens in this portfolio</div>
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
    </div>
  )
}

