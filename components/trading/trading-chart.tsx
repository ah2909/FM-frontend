"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface TradingChartProps {
  symbol: string
}

export function TradingChart({ symbol }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    // Initialize TradingView widget
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    script.onload = () => {
      if (chartContainerRef.current && (window as any).TradingView) {
        ;new (window as any).TradingView.widget({
          container_id: chartContainerRef.current.id,
          autosize: true,
          symbol: `BINANCE:${symbol}`,
          interval: "15",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          // studies: ["STD;MACD", "STD;RSI"],
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650",
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [symbol, isExpanded, isMobile])

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Price Chart</CardTitle>
          </div>
          {isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2"
            >
              {isExpanded ? "Hide" : "Show"}
              <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Chart Container */}
      {(!isMobile || isExpanded) && (
        <CardContent>
          <div
            className="w-full bg-background rounded-lg overflow-hidden"
            style={{
              height: isMobile && isExpanded ? "500px" : "400px",
            }}
          >
            <div id="tradingview_chart" ref={chartContainerRef} className="w-full h-full" />
          </div>
        </CardContent>
      )}

      {/* Mobile Placeholder when collapsed */}
      {isMobile && !isExpanded && (
        <CardContent>
          <div className="p-6 rounded-lg bg-muted/50 text-center text-sm text-muted-foreground">
            Click "Show" to view the price chart
          </div>
        </CardContent>
      )}
    </Card>
  )
}
