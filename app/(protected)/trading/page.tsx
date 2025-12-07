"use client"

import { useState } from "react"
import { AlertCircle, RotateCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { SymbolSelector } from "@/components/trading/symbol-selector"
import { TradingForm } from "@/components/trading/trading-form"
import { PositionsPanel } from "@/components/trading/position-panel"
import { AITradingInsights } from "@/components/trading/ai-trading-insight"
import { TradingChart } from "@/components/trading/trading-chart"
import { BaseHeader } from "@/components/base-header"
import { BaseShell } from "@/components/base-shell"
import { Card, CardContent } from "@/components/ui/card"
import { useGetTickerInfoQuery, useGetFutureAccountQuery } from "@/lib/store/services/trading-api"

const DEFAULT_SYMBOL = "BTCUSDT"

export default function TradingPage() {
  const [selectedSymbol, setSelectedSymbol] = useState(DEFAULT_SYMBOL)

  // Fetch ticker data for selected symbol only
  const {
    data: tickerData,
    isLoading: isLoadingTicker,
    error: tickerError,
    refetch: refetchTicker,
  } = useGetTickerInfoQuery(selectedSymbol)

  // Fetch account info
  const {
    data: accountData,
    isLoading: isLoadingAccount,
    error: accountError,
    refetch: refetchAccount,
  } = useGetFutureAccountQuery()

  const handleRefresh = () => {
    refetchTicker()
    refetchAccount()
  }

  const isLoading = isLoadingTicker || isLoadingAccount

  return (
    <BaseShell>
      <BaseHeader heading="Futures Trading" text="Trade crypto futures with AI-powered insights">
        <Button size="sm" variant="outline" onClick={handleRefresh} disabled={isLoading}>
          <RotateCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </BaseHeader>

      {/* Error Alerts */}
      {tickerError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load ticker data. Please try again.</AlertDescription>
        </Alert>
      )}

      {accountError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load account information. Please try again.</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <SymbolSelector
          selectedSymbol={selectedSymbol}
          onSelectSymbol={setSelectedSymbol}
          tickerData={tickerData}
          isLoadingTicker={isLoadingTicker}
        />

        <AITradingInsights symbol={selectedSymbol} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <TradingChart symbol={selectedSymbol} />
            <PositionsPanel />
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 text-sm">Futures Account</h3>
                {isLoadingAccount ? (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-4 bg-muted animate-pulse rounded" />
                    ))}
                  </div>
                ) : accountData?.data ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Balance:</span>
                      <span className="font-semibold">
                        $
                        {accountData.data.totalWalletBalance.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available:</span>
                      <span className="font-semibold text-green-600">
                        $
                        {accountData.data.availableBalance.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Margin Used:</span>
                      <span className="font-semibold">
                        $
                        {(accountData.data.totalWalletBalance-accountData.data.availableBalance).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Unrealized P&L:</span>
                      <span
                        className={
                          accountData.data.totalUnrealizedProfit >= 0 ? "font-semibold text-green-600" : "font-semibold text-red-600"
                        }
                      >
                        {accountData.data.totalUnrealizedProfit >= 0 ? "+" : ""}$
                        {accountData.data.totalUnrealizedProfit.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
            <TradingForm 
              symbol={selectedSymbol} 
              currentPrice={tickerData?.data.last} 
              accountBalance={accountData?.data.totalWalletBalance} 
              availableBalance={accountData?.data.availableBalance} 
            />
            
          </div>
        </div>
      </div>
    </BaseShell>
  )
}
