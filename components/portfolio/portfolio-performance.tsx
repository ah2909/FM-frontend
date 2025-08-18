"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, TrendingDown, TrendingUp, DollarSign, Activity, Wallet } from "lucide-react"


interface PortfolioPerformanceProps {
  metrics: {
    totalCost: number
    currentValue: number
    unrealizedPnl: number
    unrealizedPnlPercentage: number
    allTimeHigh: number
    allTimeLow: number
    percentChange24h: number
    percentChange7d: number
    change24h: number
    change7d: number
  }
}

export function PortfolioPerformance({ metrics }: PortfolioPerformanceProps) {
  const isProfitable = metrics.unrealizedPnl >= 0
  const is24hPositive = metrics.change24h >= 0
  const is7dPositive = metrics.change7d >= 0

  return (
    <div className="space-y-4">
      {/* Main Performance Cards - Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Current Value</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-xl sm:text-2xl font-bold">${metrics.currentValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Current portfolio valuation</p>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${isProfitable ? "border-l-green-500" : "border-l-red-500"}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Unrealized PNL</CardTitle>
            {isProfitable ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent className="pb-3">
            <div className={`text-xl sm:text-2xl font-bold ${isProfitable ? "text-green-500" : "text-red-500"}`}>
              {isProfitable ? "+" : ""}${Math.abs(metrics.unrealizedPnl).toLocaleString()}
            </div>
            <div className="flex items-center mt-1">
              <span className={`text-xs sm:text-sm ${isProfitable ? "text-green-500" : "text-red-500"} font-medium`}>
                {isProfitable ? "+" : ""}
                {metrics.unrealizedPnlPercentage.toFixed(2)}%
              </span>
              <p className="ml-2 text-xs text-muted-foreground">From initial investment</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-xl sm:text-2xl font-bold">${metrics.totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Initial investment amount</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Performance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">24h Change</span>
                <div className={`flex items-center ${is24hPositive ? "text-green-500" : "text-red-500"}`}>
                  {is24hPositive ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                  <span className="text-xs sm:text-sm font-medium">${Math.abs(metrics.change24h).toFixed(2)} ({Math.abs(metrics.percentChange24h).toFixed(2)}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">7d Change</span>
                <div className={`flex items-center ${is7dPositive ? "text-green-500" : "text-red-500"}`}>
                  {is7dPositive ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                  <span className="text-xs sm:text-sm font-medium">${Math.abs(metrics.change7d).toFixed(2)} ({Math.abs(metrics.percentChange7d).toFixed(2)}%)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Performance Metrics - Mobile: Stack, Desktop: Side by side */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base">All-Time Performance</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">All-Time High</p>
                <p className="text-sm sm:text-base font-semibold text-green-700 dark:text-green-400">
                  ${metrics.allTimeHigh.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">All-Time Low</p>
                <p className="text-sm sm:text-base font-semibold text-red-700 dark:text-red-400">
                  ${metrics.allTimeLow.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base">Portfolio Summary</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">Total Invested</span>
                <span className="text-xs sm:text-sm font-medium">${metrics.totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">Current Value</span>
                <span className="text-xs sm:text-sm font-medium">${metrics.currentValue.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-medium">Net P&L</span>
                  <span className={`text-xs sm:text-sm font-bold ${isProfitable ? "text-green-500" : "text-red-500"}`}>
                    {isProfitable ? "+" : ""}${Math.abs(metrics.unrealizedPnl).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
