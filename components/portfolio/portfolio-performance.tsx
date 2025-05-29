"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, TrendingDown, TrendingUp } from "lucide-react"

interface PortfolioPerformanceProps {
  metrics: {
    totalCost: number
    currentValue: number
    unrealizedPnl: number
    unrealizedPnlPercentage: number
    allTimeHigh: number
    allTimeLow: number
    change24h: number
    change7d: number
  }
}

export function PortfolioPerformance({ metrics }: PortfolioPerformanceProps) {
  const isProfitable = metrics.unrealizedPnl >= 0
  const is24hPositive = metrics.change24h >= 0
  const is7dPositive = metrics.change7d >= 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${metrics.totalCost.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Initial investment amount</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${metrics.currentValue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Current portfolio valuation</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unrealized PNL</CardTitle>
          {isProfitable ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isProfitable ? "text-green-500" : "text-red-500"}`}>
            {isProfitable ? "+" : ""}
            {metrics.unrealizedPnl.toLocaleString()}
          </div>
          <div className="flex items-center">
            <span className={`text-sm ${isProfitable ? "text-green-500" : "text-red-500"} font-medium`}>
              {isProfitable ? "+" : ""}
              {metrics.unrealizedPnlPercentage.toFixed(2)}%
            </span>
            <p className="ml-2 text-xs text-muted-foreground">From initial investment</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">24h Change</p>
              <div className={`flex items-center ${is24hPositive ? "text-green-500" : "text-red-500"}`}>
                {is24hPositive ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                <span className="text-sm font-medium">{Math.abs(metrics.change24h).toFixed(2)}%</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">7d Change</p>
              <div className={`flex items-center ${is7dPositive ? "text-green-500" : "text-red-500"}`}>
                {is7dPositive ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                <span className="text-sm font-medium">{Math.abs(metrics.change7d).toFixed(2)}%</span>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">All-Time High</p>
              <p className="text-sm font-medium">${metrics.allTimeHigh.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">All-Time Low</p>
              <p className="text-sm font-medium">${metrics.allTimeLow.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
