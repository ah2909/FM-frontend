"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useGetOpenPositionsQuery } from "@/lib/store/services/trading-api"
import { TrendingUp, TrendingDown, X, Loader } from "lucide-react"
import { toast } from "sonner"

export function PositionsPanel() {
  const { data: positions, isLoading, error } = useGetOpenPositionsQuery()
  // const [closePosition, { isLoading: isClosing }] = useClosePositionMutation()

  // const handleClosePosition = async (positionId: string) => {
  //   try {
  //     await closePosition({ positionId }).unwrap()
  //     toast.success({
  //       title: "Success",
  //       description: "Position closed successfully",
  //     })
  //   } catch (err: any) {
  //     toast.error({
  //       title: "Error",
  //       description: err?.data?.message || "Failed to close position",
  //       variant: "destructive",
  //     })
  //   }
  // }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Open Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Open Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground text-sm">
            <p>Failed to load positions</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!positions || positions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Open Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground text-sm">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No open positions</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Open Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {positions?.data.positions.length > 0 && positions?.data.positions.map((position: any) => (
            <div key={position.id} className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`${position.side === "LONG" ? "text-green-600" : "text-red-600"}`}>
                    {position.side === "LONG" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{position.symbol}</div>
                    <div className="text-xs text-muted-foreground">
                      {position.amount} • {position.leverage}x
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-sm ${position.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ${position.pnl.toFixed(2)}
                  </div>
                  <div className={`text-xs ${position.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {position.pnl >= 0 ? "+" : ""}
                    {position.pnlPercent.toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                <div>
                  <div className="text-muted-foreground">Entry</div>
                  <div className="font-mono font-semibold">${position.entryPrice.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Current</div>
                  <div className="font-mono font-semibold">${position.currentPrice.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Liq</div>
                  <div className="font-mono font-semibold text-red-600">
                    ${position.liquidationPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-7 bg-transparent"
                // onClick={() => handleClosePosition(position.id)}
                // disabled={isClosing}
              >
                {/* {isClosing ? (
                  <>
                    <Loader className="h-3 w-3 mr-1 animate-spin" />
                    Closing...
                  </>
                ) : (
                  <>
                    <X className="h-3 w-3 mr-1" />
                    Close Position
                  </>
                )} */}
                <X className="h-3 w-3 mr-1" />
                Close Position
              </Button>
            </div>
          ))}
          {positions.data?.positions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <p>No open positions</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
