"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, TrendingUp, Shield, Zap, BarChart3, Settings, Play, Pause, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface OptimizationSuggestion {
  id: string
  type: "rebalance" | "add" | "reduce" | "swap"
  asset: string
  currentAllocation: number
  suggestedAllocation: number
  reason: string
  expectedImpact: {
    risk: number
    return: number
    sharpe: number
  }
}

interface OptimizationSettings {
  riskTolerance: number
  rebalanceFrequency: "daily" | "weekly" | "monthly"
  autoRebalance: boolean
  maxSingleAsset: number
  minCashReserve: number
  excludeAssets: string[]
}

export function AIPortfolioOptimizer() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationComplete, setOptimizationComplete] = useState(false)
  const [settings, setSettings] = useState<OptimizationSettings>({
    riskTolerance: 50,
    rebalanceFrequency: "weekly",
    autoRebalance: false,
    maxSingleAsset: 30,
    minCashReserve: 5,
    excludeAssets: [],
  })

  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([
    {
      id: "1",
      type: "rebalance",
      asset: "BTC",
      currentAllocation: 45,
      suggestedAllocation: 35,
      reason: "Reduce concentration risk and improve diversification",
      expectedImpact: {
        risk: -8,
        return: 2,
        sharpe: 12,
      },
    },
    {
      id: "2",
      type: "add",
      asset: "SOL",
      currentAllocation: 0,
      suggestedAllocation: 8,
      reason: "High growth potential with strong ecosystem development",
      expectedImpact: {
        risk: 3,
        return: 15,
        sharpe: 8,
      },
    },
    {
      id: "3",
      type: "reduce",
      asset: "DOGE",
      currentAllocation: 12,
      suggestedAllocation: 5,
      reason: "High volatility with limited utility compared to alternatives",
      expectedImpact: {
        risk: -12,
        return: -2,
        sharpe: 18,
      },
    },
  ])

  const handleOptimize = async () => {
    setIsOptimizing(true)
    setOptimizationComplete(false)

    // Simulate optimization process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsOptimizing(false)
    setOptimizationComplete(true)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "rebalance":
        return <RotateCcw className="h-4 w-4 text-blue-500" />
      case "add":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "reduce":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
      case "swap":
        return <RotateCcw className="h-4 w-4 text-purple-500" />
      default:
        return <Target className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "add":
        return "bg-green-100 text-green-700 border-green-200"
      case "reduce":
        return "bg-red-100 text-red-700 border-red-200"
      case "rebalance":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "swap":
        return "bg-purple-100 text-purple-700 border-purple-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle>AI Portfolio Optimizer</CardTitle>
              <CardDescription>Optimize your portfolio allocation using AI algorithms</CardDescription>
            </div>
          </div>
          <Button onClick={handleOptimize} disabled={isOptimizing} className="w-full sm:w-auto">
            {isOptimizing ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Optimizing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Optimization
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="suggestions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="suggestions" className="text-xs sm:text-sm">
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-4 mt-4">
            {isOptimizing ? (
              <div className="space-y-4">
                <div className="text-center p-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-primary animate-pulse" />
                  </div>
                  <h3 className="font-medium mb-2">Analyzing Your Portfolio</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    AI is calculating optimal allocations based on risk-return profiles...
                  </p>
                  <Progress value={66} className="w-full max-w-xs mx-auto" />
                </div>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-4">
                {optimizationComplete && (
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-sm">Optimization Complete</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Expected portfolio improvement: +12% Sharpe ratio, -8% volatility
                    </p>
                  </div>
                )}

                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="rounded-lg border p-4 bg-background/50">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(suggestion.type)}
                          <h3 className="font-medium text-sm">{suggestion.asset}</h3>
                          <Badge variant="outline" className={cn("text-xs", getTypeColor(suggestion.type))}>
                            {suggestion.type}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Current Allocation</p>
                            <div className="flex items-center gap-2">
                              <Progress value={suggestion.currentAllocation} className="flex-1 h-2" />
                              <span className="text-sm font-medium">{suggestion.currentAllocation}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Suggested Allocation</p>
                            <div className="flex items-center gap-2">
                              <Progress value={suggestion.suggestedAllocation} className="flex-1 h-2" />
                              <span className="text-sm font-medium">{suggestion.suggestedAllocation}%</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">{suggestion.reason}</p>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-2 rounded bg-muted/50">
                            <div
                              className={cn(
                                "font-medium",
                                suggestion.expectedImpact.risk > 0 ? "text-red-500" : "text-green-500",
                              )}
                            >
                              {suggestion.expectedImpact.risk > 0 ? "+" : ""}
                              {suggestion.expectedImpact.risk}%
                            </div>
                            <div className="text-muted-foreground">Risk</div>
                          </div>
                          <div className="text-center p-2 rounded bg-muted/50">
                            <div
                              className={cn(
                                "font-medium",
                                suggestion.expectedImpact.return > 0 ? "text-green-500" : "text-red-500",
                              )}
                            >
                              {suggestion.expectedImpact.return > 0 ? "+" : ""}
                              {suggestion.expectedImpact.return}%
                            </div>
                            <div className="text-muted-foreground">Return</div>
                          </div>
                          <div className="text-center p-2 rounded bg-muted/50">
                            <div className="font-medium text-blue-500">+{suggestion.expectedImpact.sharpe}%</div>
                            <div className="text-muted-foreground">Sharpe</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <Button size="sm" variant="outline" className="w-full sm:w-auto bg-transparent">
                          Apply
                        </Button>
                        <Button size="sm" variant="ghost" className="w-full sm:w-auto">
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">No Optimization Needed</h3>
                <p className="text-sm text-muted-foreground">
                  Your portfolio is already well-optimized. Run optimization to check for new opportunities.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Risk Tolerance</Label>
                <div className="mt-2 space-y-2">
                  <Slider
                    value={[settings.riskTolerance]}
                    onValueChange={(value) => setSettings({ ...settings, riskTolerance: value[0] })}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Conservative</span>
                    <span>{settings.riskTolerance}%</span>
                    <span>Aggressive</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Maximum Single Asset Allocation</Label>
                <div className="mt-2 space-y-2">
                  <Slider
                    value={[settings.maxSingleAsset]}
                    onValueChange={(value) => setSettings({ ...settings, maxSingleAsset: value[0] })}
                    max={50}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>10%</span>
                    <span>{settings.maxSingleAsset}%</span>
                    <span>50%</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Minimum Cash Reserve</Label>
                <div className="mt-2 space-y-2">
                  <Slider
                    value={[settings.minCashReserve]}
                    onValueChange={(value) => setSettings({ ...settings, minCashReserve: value[0] })}
                    max={20}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>{settings.minCashReserve}%</span>
                    <span>20%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto-Rebalancing</Label>
                  <p className="text-xs text-muted-foreground">Automatically apply optimization suggestions</p>
                </div>
                <Switch
                  checked={settings.autoRebalance}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoRebalance: checked })}
                />
              </div>

              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-sm">Optimization Settings</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  These settings control how the AI optimizer analyzes and suggests changes to your portfolio. Higher
                  risk tolerance allows for more aggressive rebalancing suggestions.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
