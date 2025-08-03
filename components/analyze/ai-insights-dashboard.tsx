"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Brain,
  Zap,
  BarChart3,
  PieChart,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AIInsight {
  id: string
  type: "opportunity" | "risk" | "optimization" | "trend"
  title: string
  description: string
  confidence: number
  impact: "high" | "medium" | "low"
  actionable: boolean
  relatedAssets?: string[]
  recommendation?: string
}

interface MarketSentiment {
  overall: "bullish" | "bearish" | "neutral"
  score: number
  factors: {
    technical: number
    fundamental: number
    social: number
    onchain: number
  }
}

export function AIInsightsDashboard() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [sentiment, setSentiment] = useState<MarketSentiment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("insights")

  useEffect(() => {
    // Simulate loading AI insights
    const loadInsights = async () => {
      setIsLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setInsights([
        {
          id: "1",
          type: "opportunity",
          title: "DeFi Sector Undervalued",
          description:
            "AI analysis suggests DeFi tokens are 23% undervalued compared to historical metrics. Consider increasing allocation.",
          confidence: 87,
          impact: "high",
          actionable: true,
          relatedAssets: ["UNI", "AAVE", "COMP"],
          recommendation: "Increase DeFi allocation by 5-10% over the next 2 weeks",
        },
        {
          id: "2",
          type: "risk",
          title: "High Correlation Risk",
          description:
            "Your portfolio shows 0.89 correlation with Bitcoin. Consider diversifying into uncorrelated assets.",
          confidence: 92,
          impact: "medium",
          actionable: true,
          relatedAssets: ["BTC"],
          recommendation: "Add real-world assets or commodities-backed tokens",
        },
        {
          id: "3",
          type: "trend",
          title: "AI Token Momentum",
          description:
            "Machine learning models detect strong momentum in AI-related cryptocurrencies. 14-day trend strength: 78%",
          confidence: 74,
          impact: "medium",
          actionable: true,
          relatedAssets: ["FET", "AGIX", "OCEAN"],
        },
        {
          id: "4",
          type: "optimization",
          title: "Rebalancing Opportunity",
          description:
            "Portfolio drift detected. Your target allocation is off by 12%. Optimal rebalancing could improve risk-adjusted returns.",
          confidence: 95,
          impact: "high",
          actionable: true,
          recommendation: "Rebalance within 3-5 days to maintain target allocation",
        },
      ])

      setSentiment({
        overall: "bullish",
        score: 67,
        factors: {
          technical: 72,
          fundamental: 65,
          social: 58,
          onchain: 74,
        },
      })

      setIsLoading(false)
    }

    loadInsights()
  }, [])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "risk":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "optimization":
        return <Target className="h-4 w-4 text-blue-500" />
      case "trend":
        return <BarChart3 className="h-4 w-4 text-purple-500" />
      default:
        return <Brain className="h-4 w-4 text-gray-500" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "opportunity":
        return "border-green-200 bg-green-50 dark:bg-green-950/20"
      case "risk":
        return "border-red-200 bg-red-50 dark:bg-red-950/20"
      case "optimization":
        return "border-blue-200 bg-blue-50 dark:bg-blue-950/20"
      case "trend":
        return "border-purple-200 bg-purple-50 dark:bg-purple-950/20"
      default:
        return "border-gray-200 bg-gray-50 dark:bg-gray-950/20"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "low":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle>AI Portfolio Insights</CardTitle>
            </div>
            <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
          <CardDescription>AI is analyzing your portfolio and market conditions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                AI Portfolio Insights
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </CardTitle>
              <CardDescription>Powered by machine learning and market analysis</CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="insights" className="text-xs sm:text-sm">
              Insights ({insights.length})
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="text-xs sm:text-sm">
              Market Sentiment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4 mt-4">
            {insights.map((insight) => (
              <div key={insight.id} className={cn("rounded-lg border p-4", getInsightColor(insight.type))}>
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {getInsightIcon(insight.type)}
                      <h3 className="font-medium text-sm">{insight.title}</h3>
                      <Badge variant="outline" className={cn("text-xs", getImpactColor(insight.impact))}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>

                    {insight.relatedAssets && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {insight.relatedAssets.map((asset) => (
                          <Badge key={asset} variant="secondary" className="text-xs">
                            {asset}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {insight.recommendation && (
                      <div className="bg-background/50 rounded p-2 mb-3">
                        <p className="text-xs font-medium text-primary">Recommendation:</p>
                        <p className="text-xs text-muted-foreground">{insight.recommendation}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Confidence:</span>
                      <Progress value={insight.confidence} className="w-20 h-2" />
                      <span className="text-xs font-medium">{insight.confidence}%</span>
                    </div>
                  </div>

                  {insight.actionable && (
                    <Button size="sm" variant="outline" className="flex-shrink-0 bg-transparent">
                      <Zap className="h-3 w-3 mr-1" />
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-4 mt-4">
            {sentiment && (
              <div className="space-y-4">
                <div className="text-center p-6 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {sentiment.overall === "bullish" ? (
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    ) : sentiment.overall === "bearish" ? (
                      <TrendingDown className="h-6 w-6 text-red-500" />
                    ) : (
                      <BarChart3 className="h-6 w-6 text-gray-500" />
                    )}
                    <h3 className="text-lg font-semibold capitalize">{sentiment.overall}</h3>
                  </div>
                  <div className="text-3xl font-bold mb-1">{sentiment.score}/100</div>
                  <p className="text-sm text-muted-foreground">Overall Market Sentiment Score</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(sentiment.factors).map(([factor, score]) => (
                    <div key={factor} className="p-4 rounded-lg border bg-background/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium capitalize">{factor}</span>
                        <span className="text-sm font-bold">{score}%</span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-blue-500" />
                    Sentiment Analysis Summary
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Current market sentiment is <strong>{sentiment.overall}</strong> with a score of {sentiment.score}
                    /100. Technical indicators are showing strength ({sentiment.factors.technical}%), while on-chain
                    metrics suggest continued positive momentum ({sentiment.factors.onchain}%).
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
