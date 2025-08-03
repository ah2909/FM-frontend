"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { TrendingUp, TrendingDown, Brain, Target, BarChart3, AlertCircle, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface PricePrediction {
  asset: string
  currentPrice: number
  predictions: {
    timeframe: "1d" | "7d" | "30d" | "90d"
    predictedPrice: number
    confidence: number
    direction: "bullish" | "bearish" | "neutral"
    factors: string[]
  }[]
  technicalIndicators: {
    rsi: number
    macd: "bullish" | "bearish"
    support: number
    resistance: number
  }
}

export function AIPricePredictor() {
  const [selectedAsset, setSelectedAsset] = useState("BTC")
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")
  const [prediction, setPrediction] = useState<PricePrediction | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const assets = [
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "SOL", name: "Solana" },
    { symbol: "ADA", name: "Cardano" },
  ]

  useEffect(() => {
    loadPrediction()
  }, [selectedAsset])

  const loadPrediction = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockPrediction: PricePrediction = {
      asset: selectedAsset,
      currentPrice: selectedAsset === "BTC" ? 43250 : selectedAsset === "ETH" ? 2650 : 98.5,
      predictions: [
        {
          timeframe: "1d",
          predictedPrice: selectedAsset === "BTC" ? 44100 : selectedAsset === "ETH" ? 2720 : 102.3,
          confidence: 78,
          direction: "bullish",
          factors: ["Technical breakout", "Volume increase", "Positive sentiment"],
        },
        {
          timeframe: "7d",
          predictedPrice: selectedAsset === "BTC" ? 46800 : selectedAsset === "ETH" ? 2890 : 108.7,
          confidence: 65,
          direction: "bullish",
          factors: ["Institutional buying", "Network growth", "Market momentum"],
        },
        {
          timeframe: "30d",
          predictedPrice: selectedAsset === "BTC" ? 52000 : selectedAsset === "ETH" ? 3200 : 125.4,
          confidence: 52,
          direction: "bullish",
          factors: ["Macro trends", "Adoption metrics", "Historical patterns"],
        },
        {
          timeframe: "90d",
          predictedPrice: selectedAsset === "BTC" ? 48500 : selectedAsset === "ETH" ? 3050 : 115.2,
          confidence: 41,
          direction: "neutral",
          factors: ["Market cycles", "Regulatory clarity", "Economic conditions"],
        },
      ],
      technicalIndicators: {
        rsi: 58,
        macd: "bullish",
        support: selectedAsset === "BTC" ? 41000 : selectedAsset === "ETH" ? 2500 : 92.0,
        resistance: selectedAsset === "BTC" ? 45000 : selectedAsset === "ETH" ? 2800 : 105.0,
      },
    }

    setPrediction(mockPrediction)
    setIsLoading(false)
  }

  const generateChartData = () => {
    if (!prediction) return null

    const currentPrediction = prediction.predictions.find((p) => p.timeframe === selectedTimeframe)
    if (!currentPrediction) return null

    const days = selectedTimeframe === "1d" ? 1 : selectedTimeframe === "7d" ? 7 : selectedTimeframe === "30d" ? 30 : 90
    const labels = Array.from({ length: days + 1 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() + i)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    })

    const historicalData = Array.from({ length: days + 1 }, (_, i) => {
      if (i === 0) return prediction.currentPrice
      const progress = i / days
      const priceDiff = currentPrediction.predictedPrice - prediction.currentPrice
      return prediction.currentPrice + priceDiff * progress + (Math.random() - 0.5) * (prediction.currentPrice * 0.02)
    })

    return {
      labels,
      datasets: [
        {
          label: "Predicted Price",
          data: historicalData,
          borderColor:
            currentPrediction.direction === "bullish"
              ? "rgb(34, 197, 94)"
              : currentPrediction.direction === "bearish"
                ? "rgb(239, 68, 68)"
                : "rgb(156, 163, 175)",
          backgroundColor:
            currentPrediction.direction === "bullish"
              ? "rgba(34, 197, 94, 0.1)"
              : currentPrediction.direction === "bearish"
                ? "rgba(239, 68, 68, 0.1)"
                : "rgba(156, 163, 175, 0.1)",
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: (context: any) => `$${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: (value: any) => `$${value.toLocaleString()}`,
        },
      },
    },
  }

  const currentPrediction = prediction?.predictions.find((p) => p.timeframe === selectedTimeframe)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle>AI Price Predictor</CardTitle>
              <CardDescription>Machine learning powered price predictions</CardDescription>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset.symbol} value={asset.symbol}>
                    {asset.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center p-8">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <h3 className="font-medium mb-2">Analyzing Market Data</h3>
            <p className="text-sm text-muted-foreground">
              AI is processing technical indicators, sentiment, and on-chain data...
            </p>
          </div>
        ) : prediction ? (
          <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="1d" className="text-xs">
                1D
              </TabsTrigger>
              <TabsTrigger value="7d" className="text-xs">
                7D
              </TabsTrigger>
              <TabsTrigger value="30d" className="text-xs">
                30D
              </TabsTrigger>
              <TabsTrigger value="90d" className="text-xs">
                90D
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-6">
              {/* Current Price & Prediction */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                  <p className="text-2xl font-bold">${prediction.currentPrice.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-1">Predicted Price</p>
                  <div className="flex items-center justify-center gap-2">
                    {currentPrediction?.direction === "bullish" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : currentPrediction?.direction === "bearish" ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <BarChart3 className="h-4 w-4 text-gray-500" />
                    )}
                    <p className="text-2xl font-bold">${currentPrediction?.predictedPrice.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                  <div className="flex items-center justify-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <p className="text-2xl font-bold">{currentPrediction?.confidence}%</p>
                  </div>
                </div>
              </div>

              {/* Price Chart */}
              <div className="h-64 w-full">
                {generateChartData() && <Line data={generateChartData()!} options={chartOptions} />}
              </div>

              {/* Prediction Details */}
              {currentPrediction && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Prediction Factors</h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        currentPrediction.direction === "bullish"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : currentPrediction.direction === "bearish"
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-gray-200 bg-gray-50 text-gray-700",
                      )}
                    >
                      {currentPrediction.direction}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {currentPrediction.factors.map((factor, index) => (
                      <div key={index} className="p-2 rounded bg-muted/50 text-sm text-center">
                        {factor}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Indicators */}
              <div className="space-y-4">
                <h3 className="font-medium">Technical Analysis</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">RSI</p>
                    <p className="font-medium">{prediction.technicalIndicators.rsi}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">MACD</p>
                    <div className="flex items-center justify-center gap-1">
                      {prediction.technicalIndicators.macd === "bullish" ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <p className="font-medium capitalize">{prediction.technicalIndicators.macd}</p>
                    </div>
                  </div>
                  <div className="text-center p-3 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">Support</p>
                    <p className="font-medium">${prediction.technicalIndicators.support.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">Resistance</p>
                    <p className="font-medium">${prediction.technicalIndicators.resistance.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-sm">Prediction Disclaimer</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  AI predictions are based on historical data and technical analysis. Cryptocurrency markets are highly
                  volatile and unpredictable. These predictions should not be considered as financial advice. Always do
                  your own research and consider your risk tolerance before making investment decisions.
                </p>
              </div>
            </div>
          </Tabs>
        ) : null}
      </CardContent>
    </Card>
  )
}
