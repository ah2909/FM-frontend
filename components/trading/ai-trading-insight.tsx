"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAnalyzeSymbolMutation } from "@/lib/store/services/trading-api"
import {
  Brain,
  AlertTriangle,
  Target,
  RefreshCw,
  BarChart3,
  Lightbulb,
  AlertCircle,
  ChevronDown,
  X,
  Loader,
  TrendingUp,
  TrendingDown,
  RotateCw
} from "lucide-react"
import {toast } from "sonner"
import { useWebSocketEvent } from "@/hooks/useWebSocketEvent"

interface AITradingInsightsProps {
  symbol: string
}

export interface TradingAnalysis {
  symbol: string
  analysis: {
    decision: "BUY" | "SELL"
    confidence: number
    confidenceReason: {
      indicatorConfluence: string
      resistanceLevels: number[]
      supportLevels: number[]
      trend: "UPTREND" | "DOWNTREND" | "SIDEWAYS"
    }
    positionSize: number
    timeHorizon: "SWING" | "DAY" | "SCALP"
    entryStrategy: {
      optimalEntryPrice: number
      orderType: "LIMIT" | "MARKET"
      dcaStrategy: string
      entryPriceRange: {
        min: number
        max: number
      }
    }
    exitStrategy: {
      takeProfit1: TakeProfitLevel
      takeProfit2: TakeProfitLevel
      takeProfit3: TakeProfitLevel
      stopLoss: {
        price: number
      }
    }
    riskRewardRatio: string
  }
  model: string
  marketData: {
    price: number
    change24h: number
    rsi: number
    buyPressure: number
  }
  timestamp: string
}

interface TakeProfitLevel {
  price: number
  percentage: number
}

export function AITradingInsights({ symbol }: AITradingInsightsProps) {
  const [expandedSection, setExpandedSection] = useState<string>("overview")
  const [analyzeSymbol] = useAnalyzeSymbolMutation()
  const [analysisData, setAnalysisData] = useState<TradingAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleAnalyze = async () => {
    try {
      setIsLoading(true)
      await analyzeSymbol({symbol: symbol}).unwrap()
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to analyze symbol",)
    }
  }
  useWebSocketEvent("analyze-symbol", "", (data: any) => {
    setIsLoading(false)
    if(data?.success) {
      setAnalysisData(data.analysis)
    }
    else {
      setError(true)
    }
  })

  if (isLoading && !analysisData) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Trading Analysis</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Loader className="h-5 w-5 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">Analyzing market conditions...</span>
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Analysis Error</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Failed to analyze the symbol</p>
            <Button onClick={handleAnalyze} className="w-full">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analysisData) {
    return (
      <Button size="sm" variant="outline" onClick={handleAnalyze} disabled={isLoading}>
        <RotateCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
        Analyze AI
      </Button>
    )
  }

  const analysis = analysisData.analysis
  const market = analysisData.marketData
  const confidence = analysis.confidence
  const reasoning = analysis.confidenceReason

  const decisionColor = analysis.decision === "SELL" ? "text-red-600" : "text-green-600"
  const decisionBg =
    analysis.decision === "SELL"
      ? "bg-red-50 dark:bg-red-950/20 border-red-200"
      : "bg-green-50 dark:bg-green-950/20 border-green-200"

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? "" : section)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">AI Trading Analysis</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {analysisData.symbol} • {analysis.timeHorizon}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleAnalyze} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Decision Banner */}
        <div className={`p-4 rounded-lg border ${decisionBg}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <div className={`text-4xl font-bold ${decisionColor} flex items-center gap-2`}>
                {analysis.decision}
                {analysis.decision === "BUY" ? (
                  <TrendingUp className="h-8 w-8" />
                ) : (
                  <TrendingDown className="h-8 w-8" />
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground">Confidence</div>
                <div className={`text-2xl font-bold ${decisionColor}`}>{confidence}/10</div>
              </div>
            </div>
            <Badge variant="outline" className="text-sm px-3 py-1">
              {analysis.riskRewardRatio} R:R
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">{reasoning.indicatorConfluence}</p>
        </div>

        {/* Market Data Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 rounded-lg bg-background border text-center">
            <div className="text-xs text-muted-foreground mb-1">Current Price</div>
            <div className="text-lg font-bold">${market.price.toLocaleString()}</div>
            <div className={`text-xs font-medium ${market.change24h > 0 ? "text-green-600" : "text-red-600"}`}>
              {market.change24h > 0 ? "+" : ""}
              {market.change24h.toFixed(2)}%
            </div>
          </div>
          <div className="p-3 rounded-lg bg-background border text-center">
            <div className="text-xs text-muted-foreground mb-1">RSI</div>
            <div className="text-lg font-bold">{market.rsi.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">
              {market.rsi > 70 ? "Overbought" : market.rsi < 30 ? "Oversold" : "Neutral"}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-background border text-center">
            <div className="text-xs text-muted-foreground mb-1">Buy Pressure</div>
            <div className="text-lg font-bold">{(market.buyPressure * 100).toFixed(1)}%</div>
            <div className="w-full bg-muted rounded-full h-1 mt-1 overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: `${Math.min(market.buyPressure * 100, 100)}%` }} />
            </div>
          </div>
          <div className="p-3 rounded-lg bg-background border text-center">
            <div className="text-xs text-muted-foreground mb-1">Trend</div>
            <div className="text-lg font-bold">{reasoning.trend}</div>
            <Badge variant="outline" className="text-xs mt-1 w-full justify-center">
              {analysis.timeHorizon}
            </Badge>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-2">
          {/* Entry & Exit Strategy */}
          <button
            onClick={() => toggleSection("strategy")}
            className="w-full p-3 rounded-lg bg-background border hover:bg-accent/50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-2 font-medium text-sm">
              <Target className="h-4 w-4" />
              Entry & Exit Strategy
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expandedSection === "strategy" ? "rotate-180" : ""}`}
            />
          </button>

          {expandedSection === "strategy" && (
            <div className="pl-4 pr-3 py-3 rounded-lg bg-slate-50 dark:bg-slate-900/30 border space-y-3">
              {/* Position Size */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="text-xs text-muted-foreground mb-1">Recommended Position Size</div>
                <div className="text-2xl font-bold text-primary">{analysis.positionSize}%</div>
              </div>

              {/* Entry Strategy */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded bg-blue-50 dark:bg-blue-950/30">
                  <div className="text-xs text-muted-foreground mb-1">Optimal Entry Price</div>
                  <div className="font-bold text-blue-600 text-lg">
                    ${analysis.entryStrategy.optimalEntryPrice.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{analysis.entryStrategy.orderType} Order</div>
                </div>
                <div className="p-3 rounded bg-purple-50 dark:bg-purple-950/30">
                  <div className="text-xs text-muted-foreground mb-1">Entry Range</div>
                  <div className="font-bold text-purple-600 text-sm">
                    ${analysis.entryStrategy.entryPriceRange.min.toLocaleString()} - $
                    {analysis.entryStrategy.entryPriceRange.max.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* DCA Strategy */}
              <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-sm text-amber-900 dark:text-amber-100">
                  {analysis.entryStrategy.dcaStrategy}
                </AlertDescription>
              </Alert>

              {/* Take Profit Levels */}
              <div className="space-y-2">
                <div className="text-sm font-semibold">Take Profit Targets:</div>
                <div className="space-y-1.5">
                  {[
                    { name: "TP1", ...analysis.exitStrategy.takeProfit1 },
                    { name: "TP2", ...analysis.exitStrategy.takeProfit2 },
                    { name: "TP3", ...analysis.exitStrategy.takeProfit3 },
                  ].map((tp, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded bg-green-50 dark:bg-green-950/30"
                    >
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">{tp.name}</span>
                      <span className="font-bold text-green-600">${tp.price.toLocaleString()}</span>
                      <span className="text-xs font-medium text-green-600">({tp.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stop Loss */}
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-red-700 dark:text-red-400">Stop Loss</span>
                  <span className="font-bold text-red-600 text-lg">
                    ${analysis.exitStrategy.stopLoss.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Technical Analysis */}
          <button
            onClick={() => toggleSection("technical")}
            className="w-full p-3 rounded-lg bg-background border hover:bg-accent/50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-2 font-medium text-sm">
              <BarChart3 className="h-4 w-4" />
              Technical Levels
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expandedSection === "technical" ? "rotate-180" : ""}`}
            />
          </button>

          {expandedSection === "technical" && (
            <div className="pl-4 pr-3 py-3 rounded-lg bg-slate-50 dark:bg-slate-900/30 border space-y-3">
              {/* Trend Info */}
              <div className="p-3 rounded-lg bg-background border">
                <div className="text-xs text-muted-foreground mb-1">Market Trend</div>
                <div className="text-lg font-bold">{reasoning.trend}</div>
              </div>

              {/* Support & Resistance */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-semibold mb-2 text-blue-600">Support Levels</div>
                  <div className="space-y-1">
                    {reasoning.supportLevels.map((level: number, idx: number) => (
                      <div key={idx} className="p-2 rounded bg-blue-50 dark:bg-blue-950/30">
                        <div className="text-xs text-muted-foreground">S{idx + 1}</div>
                        <div className="font-mono font-bold text-sm">${level.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold mb-2 text-red-600">Resistance Levels</div>
                  <div className="space-y-1">
                    {reasoning.resistanceLevels.map((level: number, idx: number) => (
                      <div key={idx} className="p-2 rounded bg-red-50 dark:bg-red-950/30">
                        <div className="text-xs text-muted-foreground">R{idx + 1}</div>
                        <div className="font-mono font-bold text-sm">${level.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Summary */}
          <button
            onClick={() => toggleSection("summary")}
            className="w-full p-3 rounded-lg bg-background border hover:bg-accent/50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-2 font-medium text-sm">
              <AlertTriangle className="h-4 w-4" />
              Analysis Summary
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expandedSection === "summary" ? "rotate-180" : ""}`}
            />
          </button>

          {expandedSection === "summary" && (
            <div className="pl-4 pr-3 py-3 rounded-lg bg-slate-50 dark:bg-slate-900/30 border space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">{reasoning.indicatorConfluence}</p>
            </div>
          )}
        </div>

        {/* Footer with timestamp */}
        <div className="pt-3 border-t text-xs text-muted-foreground text-center">
          Analysis from {analysisData.model} • {new Date(analysisData.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}
