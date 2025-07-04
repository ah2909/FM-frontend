"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

interface Token {
  id: number
  symbol: string
  name: string
  price: number
  amount: number
  value: number
  img_url: string
  avg_price: number
}

interface PortfolioAllocationProps {
  tokens: Token[]
  totalValue: number
}

export function PortfolioAllocation({ tokens, totalValue }: PortfolioAllocationProps) {
  const top5Tokens = [...tokens].sort((a, b) => b.value - a.value).slice(0, 5)

  const colors = [
    "rgba(124, 93, 250, 0.8)",
    "rgba(34, 197, 94, 0.8)",
    "rgba(251, 146, 60, 0.8)",
    "rgba(239, 68, 68, 0.8)",
    "rgba(168, 85, 247, 0.8)",
  ]

  const data = {
    labels: top5Tokens.map((token) => token.symbol.toUpperCase()),
    datasets: [
      {
        data: top5Tokens.map((token) => ((token.value / totalValue) * 100).toFixed(1)),
        backgroundColor: colors,
        borderColor: colors.map((color) => color.replace("0.8", "1")),
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${context.parsed}%`
          },
        },
      },
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Portfolio Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[300px]">
          <Doughnut data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
