"use client"

import { useState } from "react"
import { ChevronDown, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SymbolSelectorProps {
  selectedSymbol: string
  onSelectSymbol: (symbol: string) => void
  tickerData?: any
  isLoadingTicker?: boolean
}

const AVAILABLE_SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "ADAUSDT", "DOGEUSDT", "XRPUSDT", "LINKUSDT"]

export function SymbolSelector({ selectedSymbol, onSelectSymbol, tickerData, isLoadingTicker }: SymbolSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelectSymbol = (symbol: string) => {
    onSelectSymbol(symbol)
    setIsOpen(false)
  }

  return (
    <div className="relative w-full">
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full group relative overflow-hidden rounded-lg border border-border bg-card hover:bg-accent transition-colors"
      >
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div className="flex-1 text-left">
            {isLoadingTicker ? (
              <div className="space-y-2">
                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                <div className="h-8 w-48 bg-muted animate-pulse rounded" />
              </div>
            ) : tickerData?.data ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg sm:text-xl font-bold">{tickerData.data.symbol}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <span className="text-xl sm:text-2xl font-bold">${tickerData.data.last.toLocaleString()}</span>
                        <div className={cn("flex items-center gap-1 text-xs sm:text-sm font-medium px-2 py-1 rounded-full",
                            tickerData.data.percentage > 0 ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600",)}
                        >
                            {tickerData.data.percentage > 0 ? (
                                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                            ) : (
                                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                            <span>
                                {tickerData.data.percentage > 0 ? "+" : ""}
                                {tickerData.data.percentage.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-items-center gap-8">
                        <div>
                            <div className="text-muted-foreground text-xs mb-1">24h High</div>
                            <div className="font-semibold">${tickerData.data.high.toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground text-xs mb-1">24h Low</div>
                            <div className="font-semibold">${tickerData.data.low.toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground text-xs mb-1">24h Volume</div>
                            <div className="font-semibold">{tickerData.data.baseVolume}</div>
                        </div>
                    </div>
                </div>      
              </>
            ) : (
              <span className="text-muted-foreground">Select a symbol</span>
            )}
          </div>
          <ChevronDown
            className={cn("h-5 w-5 text-muted-foreground transition-transform flex-shrink-0", isOpen && "rotate-180")}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-lg border border-border bg-card shadow-lg max-h-80 overflow-y-auto">
          {AVAILABLE_SYMBOLS.map((symbol) => (
            <button
              key={symbol}
              onClick={() => handleSelectSymbol(symbol)}
              className={cn(
                "w-full px-3 py-3 text-left hover:bg-accent transition-colors border-l-2 text-sm",
                selectedSymbol === symbol
                  ? "border-l-primary bg-accent font-medium"
                  : "border-l-transparent",
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">{symbol}</span>
                </div>
              </div>
            </button>
          ))}

          {AVAILABLE_SYMBOLS.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">No symbols available</div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}
    </div>
  )
}