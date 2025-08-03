"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, AlertTriangle, TrendingDown, BarChart3, PieChart, Activity, Target, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface RiskMetric {
  name: string
  value: number
  status: "low" | "medium" | "high" | "critical"
  description: string
  recommendation?: string
}

interface RiskAnalysis {
  overallRiskScore: number
  riskLevel: "low" | "medium" | "high" | "critical"
  metrics: RiskMetric[]
  correlations: {
    asset1: string
    asset2: string
    correlation: number
  }[]
  scenarios: {
    name: string
    probability: number
    impact: number
    description: string
  }[]
}

export function AIRiskAnalyzer() {
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadRiskAnalysis()
  }, [])

  const loadRiskAnalysis = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockAnalysis: RiskAnalysis = {
      overallRiskScore: 72,
      riskLevel: "high",
      metrics: [
        {
          name: "Portfolio Volatility",
          value: 68,
          status: "high",
          description: "Your portfolio shows high volatility with 30-day standard deviation of 68%",
          recommendation: "Consider adding stable assets to reduce volatility",
        },
        {
          name: "Concentration Risk",
          value: 85,
          status: "critical",
          description: "45% of your portfolio is concentrated in Bitcoin",
          recommendation: "Diversify holdings across different asset classes",
        },
        {
          name: "Liquidity Risk",
          value: 35,
          status: "medium",
          description: "Some assets may have limited liquidity during market stress",
          recommendation: "Maintain allocation in highly liquid assets",
        },
        {
          name: "Correlation Risk",
          value: 78,
          status: "high",
          description: "High correlation between assets reduces diversification benefits",
          recommendation: "Add uncorrelated assets like commodities or real estate tokens",
        },
        {
          name: "Drawdown Risk",
          value: 42,
          status: "medium",
          description: "Maximum potential drawdown estimated at 42%",
          recommendation: "Set stop-loss levels and position sizing rules",
        },
      ],
      correlations: [
        { asset1: "BTC", asset2: "ETH", correlation: 0.87 },
        { asset1: "BTC", asset2: "SOL", correlation: 0.82 },
        { asset1: "ETH", asset2: "SOL", correlation: 0.79 },
        { asset1: "BTC", asset2: "ADA", correlation: 0.91 },
        { asset1: "ETH", asset2: "ADA", correlation: 0.85 },
      ],
      scenarios: [
        {
          name: "Market Crash",
          probability: 15,
          impact: -45,
          description: "Broad crypto market decline similar to previous bear markets",
        },
        {
          name: "Regulatory Crackdown",
          probability: 25,
          impact: -30,
          description: "Major regulatory restrictions on cryptocurrency trading",
        },
        {
          name: "Exchange Hack",
          probability: 10,
          impact: -20,
          description: "Security breach affecting major cryptocurrency exchanges",
        },
        {
          name: "DeFi Protocol Failure",
          probability: 20,
          impact: -15,
          description: "Smart contract vulnerabilities in DeFi protocols",
        },
      ],
    }

    setAnalysis(mockAnalysis)
    setIsLoading(false)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-500 bg-green-50 border-green-200"
      case "medium":
        return "text-orange-500 bg-orange-50 border-orange-200"
      case "high":
        return "text-red-500 bg-red-50 border-red-200"
      case "critical":
        return "text-red-700 bg-red-100 border-red-300"
      default:
        return "text-gray-500 bg-gray-50 border-gray-200"
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low":
        return <Shield className="h-4 w-4 text-green-500" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "high":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-700" />
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>AI Risk Analyzer</CardTitle>
            </div>
            <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
          <CardDescription>Analyzing portfolio risk factors...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
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

  if (!analysis) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle>AI Risk Analyzer</CardTitle>
              <CardDescription>Comprehensive portfolio risk assessment</CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={loadRiskAnalysis}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="correlations" className="text-xs sm:text-sm">
              Correlations
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="text-xs sm:text-sm">
              Scenarios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-4">
            {/* Overall Risk Score */}
            <div className="text-center p-6 rounded-lg bg-muted/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                {getRiskIcon(analysis.riskLevel)}
                <h3 className="text-lg font-semibold capitalize">{analysis.riskLevel} Risk</h3>
              </div>
              <div className="text-3xl font-bold mb-2">{analysis.overallRiskScore}/100</div>
              <p className="text-sm text-muted-foreground">Overall Portfolio Risk Score</p>
              <div className="mt-4 max-w-xs mx-auto">
                <Progress value={analysis.overallRiskScore} className="h-3" />
              </div>
            </div>

            {/* Risk Metrics */}
            <div className="space-y-4">
              <h3 className="font-medium">Risk Breakdown</h3>
              {analysis.metrics.map((metric, index) => (
                <div key={index} className={cn("rounded-lg border p-4", getRiskColor(metric.status))}>
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {getRiskIcon(metric.status)}
                        <h4 className="font-medium text-sm">{metric.name}</h4>
                        <Badge variant="outline" className={cn("text-xs", getRiskColor(metric.status))}>
                          {metric.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{metric.description}</p>

                      {metric.recommendation && (
                        <div className="bg-background/50 rounded p-2 mb-3">
                          <p className="text-xs font-medium text-primary">Recommendation:</p>
                          <p className="text-xs text-muted-foreground">{metric.recommendation}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Risk Level:</span>
                        <Progress value={metric.value} className="w-20 h-2" />
                        <span className="text-xs font-medium">{metric.value}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="correlations" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Asset Correlations</h3>
                <Badge variant="outline" className="text-xs">
                  Higher correlation = Higher risk
                </Badge>
              </div>

              <div className="space-y-3">
                {analysis.correlations.map((corr, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-background/50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {corr.asset1}
                        </Badge>
                        <span className="text-xs text-muted-foreground">×</span>
                        <Badge variant="secondary" className="text-xs">
                          {corr.asset2}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={corr.correlation * 100}
                        className={cn(
                          "w-16 h-2",
                          corr.correlation > 0.8
                            ? "text-red-500"
                            : corr.correlation > 0.6
                              ? "text-orange-500"
                              : "text-green-500",
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium",
                          corr.correlation > 0.8
                            ? "text-red-500"
                            : corr.correlation > 0.6
                              ? "text-orange-500"
                              : "text-green-500",
                        )}
                      >
                        {(corr.correlation * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <PieChart className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-sm">Correlation Analysis</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your portfolio shows high correlation between major assets. During market downturns, highly correlated
                  assets tend to move together, reducing diversification benefits. Consider adding assets with lower
                  correlation to improve risk-adjusted returns.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="font-medium">Risk Scenarios</h3>

              {analysis.scenarios.map((scenario, index) => (
                <div key={index} className="rounded-lg border p-4 bg-background/50">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{scenario.name}</h4>
                      <p className="text-sm text-muted-foreground">{scenario.description}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        scenario.impact < -30
                          ? "border-red-200 bg-red-50 text-red-700"
                          : scenario.impact < -20
                            ? "border-orange-200 bg-orange-50 text-orange-700"
                            : "border-yellow-200 bg-yellow-50 text-yellow-700",
                      )}
                    >
                      {scenario.impact}% impact
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Probability:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={scenario.probability} className="flex-1 h-2" />
                        <span className="font-medium">{scenario.probability}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expected Loss:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Activity className="h-3 w-3 text-red-500" />
                        <span className="font-medium text-red-500">{scenario.impact}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-sm">Risk Management Tips</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Set stop-loss orders to limit downside risk</li>
                  <li>• Maintain emergency cash reserves (5-10%)</li>
                  <li>• Regularly rebalance your portfolio</li>
                  <li>• Consider hedging strategies during high volatility</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
