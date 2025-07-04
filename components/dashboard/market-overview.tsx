"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useState, useEffect } from "react"

interface MarketData {
  symbol: string
  name: string
  price: string
  change: string
  changePercent: string
}

export function MarketOverview() {
  const [marketData, setMarketData] = useState<MarketData[]>([])

  // Mock market data - in real app, this would come from an API
  useEffect(() => {
    const mockData: MarketData[] = [
      { symbol: "BTC", name: "Bitcoin", price: "43,250.00", change: "+1,250.00", changePercent: "+2.98" },
      { symbol: "ETH", name: "Ethereum", price: "2,650.00", change: "-45.00", changePercent: "-1.67" },
      { symbol: "SOL", name: "Solana", price: "98.50", change: "+3.20", changePercent: "+3.36" },
      { symbol: "ADA", name: "Cardano", price: "0.45", change: "+0.02", changePercent: "+4.65" },
    ]
    setMarketData(mockData)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {marketData.map((coin) => {
            const isPositive = coin.changePercent.startsWith("+")
            return (
              <div key={coin.symbol} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold">{coin.symbol}</span>
                  </div>
                  <div>
                    <p className="font-medium">{coin.name}</p>
                    <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${coin.price}</p>
                  <div className={`flex items-center text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {coin.changePercent}%
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
