"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DollarSign, TrendingDown, TrendingUp, Zap, AlertTriangle, Info, Wallet } from "lucide-react"

interface TradingFormProps {
  symbol: string
  currentPrice: number
  accountBalance: number
  availableBalance: number
  aiSuggestion?: {
    decision: string
    entryPrice: number
    positionSize: number
    exitStrategy: {
      takeProfit1: { price: number; percentage: number }
      takeProfit2: { price: number; percentage: number }
      takeProfit3: { price: number; percentage: number }
      stopLoss: { price: number; percentage: number }
    }
  }
}

export function TradingForm({ symbol, currentPrice, accountBalance, availableBalance, aiSuggestion }: TradingFormProps) {
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [side, setSide] = useState<"long" | "short">("long")
  const [leverage, setLeverage] = useState([5])
  const [amount, setAmount] = useState("")
  const [entryPrice, setEntryPrice] = useState(currentPrice)
  const [useAISettings, setUseAISettings] = useState(false)

  const leverageValue = leverage[0]
  const positionSize = Number.parseFloat(amount || "0") * leverageValue
  const marginRequired = Number.parseFloat(amount || "0") / leverageValue
  const liquidationPrice =
    side === "long"
      ? entryPrice * (1 - 1 / leverageValue)
      : entryPrice * (1 + 1 / leverageValue)

  const handleApplyAISuggestion = () => {
    if (aiSuggestion) {
      setEntryPrice(aiSuggestion.entryPrice)
      setLeverage([aiSuggestion.positionSize])
      setUseAISettings(true)
      setSide(aiSuggestion.decision === "SELL" ? "short" : "long")
    }
  }

  const canTrade = marginRequired <= availableBalance

  return (
    <div className="space-y-4">
      {/* Trading Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4" />
            Place Order
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AI Suggestion Banner */}
          {aiSuggestion && !useAISettings && (
            <Alert className="border-primary/50 bg-primary/5">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span>AI suggests {aiSuggestion.decision} position</span>
                  <Button size="sm" variant="outline" onClick={handleApplyAISuggestion}>
                    Apply AI Settings
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Order Type Tabs */}
          <Tabs value={orderType} onValueChange={(val) => setOrderType(val as "market" | "limit")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="market">Market</TabsTrigger>
              <TabsTrigger value="limit">Limit</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Side Selection */}
          <div className="flex gap-2">
            <Button
              variant={side === "long" ? "default" : "outline"}
              className={`flex-1 ${side === "long" ? "bg-green-600 hover:bg-green-700" : ""}`}
              onClick={() => setSide("long")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Long
            </Button>
            <Button
              variant={side === "short" ? "default" : "outline"}
              className={`flex-1 ${side === "short" ? "bg-red-600 hover:bg-red-700" : ""}`}
              onClick={() => setSide("short")}
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              Short
            </Button>
          </div>

          {/* Entry Price */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Entry Price (USDT)</Label>
            <Input
              type="text"
              placeholder="Entry price"
              value={currentPrice}
              onChange={(e) => setEntryPrice(Number(e.target.value))}
              className="text-sm"
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Amount (USDT)</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmount((entryPrice * 10).toString())}
              >
                Max
              </Button>
            </div>
          </div>

          {/* Leverage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Leverage</Label>
              <Badge variant="secondary">{leverageValue}x</Badge>
            </div>
            <Slider value={leverage} onValueChange={setLeverage} min={1} max={125} step={1} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1x</span>
              <span>125x</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/30 border space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Margin Required</span>
              <span className="font-medium">${marginRequired.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Liquidation Price</span>
              <span className="font-medium text-red-600">${liquidationPrice}</span>
            </div>
            {marginRequired > availableBalance && (
              <div className="text-xs text-red-600 pt-1 border-t">
                Insufficient balance. Need ${(marginRequired - availableBalance).toFixed(2)} more
              </div>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {["25%", "50%", "75%", "100%"].map((percent) => (
              <Button
                key={percent}
                variant="outline"
                size="sm"
                onClick={() => setAmount(((accountBalance * Number.parseInt(percent)) / 100).toString())}
                className="text-xs"
              >
                {percent}
              </Button>
            ))}
          </div>

          {/* Place Order Button */}
          <Button
            disabled={!amount || !canTrade}
            className={`w-full text-base font-semibold h-12 ${
              side === "long"
                ? "bg-green-600 hover:bg-green-700 disabled:bg-slate-600"
                : "bg-red-600 hover:bg-red-700 disabled:bg-slate-600"
            }`}
          >
            <DollarSign className="h-5 w-5 mr-2" />
            {side === "long" ? "Open Long" : "Open Short"}
          </Button>

          {/* Warning */}
          {leverageValue > 10 && (
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-xs">
                High leverage ({leverageValue}x) increases liquidation risk. Trade carefully.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
