"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { PieChart } from "lucide-react"
import { useTheme } from "next-themes"

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
  isLoading?: boolean
}

export function PortfolioAllocation({ tokens, totalValue, isLoading = false }: PortfolioAllocationProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  if (isLoading) {
    return (
      <Card className="card-hover overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl font-bold">Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center relative">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-44 h-44 border-[16px] border-muted rounded-full"></div>
              <div className="mt-6 w-32 h-4 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!tokens || tokens.length === 0) {
    return (
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl font-bold">Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 transition-transform hover:scale-110 duration-300">
              <PieChart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">No Portfolio Data</h3>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              Add some assets to your portfolio to see the allocation breakdown.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort and group data
  const sortedTokens = [...tokens].sort((a, b) => b.value - a.value)
  const top5 = sortedTokens.slice(0, 5)
  const others = sortedTokens.slice(5)
  const othersValue = others.reduce((acc, curr) => acc + curr.value, 0)

  const chartItems = [...top5]
  if (othersValue > 0) {
    chartItems.push({
      symbol: "OTHER",
      name: "Other Assets",
      value: othersValue,
    } as any)
  }

  const colors = [
    "hsl(221.2 83.2% 53.3%)", // Primary
    "hsl(142 70% 50%)",      // Green
    "hsl(43 96% 58%)",       // Amber
    "hsl(270 95% 75%)",      // Purple
    "hsl(190 90% 50%)",      // Cyan
    "hsl(215 16% 47%)",      // Gray for "Other"
  ]

  const data = {
    labels: chartItems.map((token) => token.symbol.toUpperCase()),
    datasets: [
      {
        data: chartItems.map((token) => ((token.value / totalValue) * 100).toFixed(1)),
        backgroundColor: colors,
        borderColor: isDark ? "hsl(224 18% 9%)" : "#ffffff",
        borderWidth: 3,
        hoverOffset: 12,
        cutout: "75%",
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Custom legend instead
      },
      tooltip: {
        backgroundColor: isDark ? "hsl(224 18% 12%)" : "#ffffff",
        titleColor: isDark ? "#ffffff" : "hsl(222.2 84% 4.9%)",
        bodyColor: isDark ? "#ffffff" : "hsl(222.2 84% 4.9%)",
        borderColor: "hsla(var(--border) / 0.1)",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => {
            return ` ${context.label}: ${context.parsed}%`
          },
        },
      },
    },
  }

  return (
    <Card className="card-hover overflow-hidden border-none glass select-none">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">Portfolio Allocation</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative h-[240px] w-full">
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Value</span>
              <span className="text-xl sm:text-2xl font-black tracking-tighter">
                ${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            {chartItems.map((item, index) => (
              <div key={item.symbol} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-2.5 h-2.5 rounded-full shadow-sm group-hover:scale-125 transition-transform" 
                    style={{ backgroundColor: colors[index] }}
                  />
                  <span className="text-xs font-bold tracking-tight text-foreground/90 uppercase">{item.symbol}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground/80">
                    {((item.value / totalValue) * 100).toFixed(1)}%
                  </span>
                  <div className="w-16 h-1 bg-muted rounded-full overflow-hidden hidden sm:block">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${(item.value / totalValue) * 100}%`,
                        backgroundColor: colors[index]
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
