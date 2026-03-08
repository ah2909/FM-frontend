"use client"

import { useState, memo, useMemo } from "react"
import Link from "next/link"
import { ExternalLink, TrendingUp, TrendingDown, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useWebSocketEvent } from "@/hooks/useWebSocketEvent"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Token } from "@/components/portfolio/portfolio-tokens"
import { calculateAssetMetrics } from "@/lib/utils"

interface AssetTableProps {
  tokens: Token[]
  totalValue: number
  isLoading?: boolean
}

export function AssetTable({ tokens, totalValue, isLoading = false }: AssetTableProps) {
  const [priceData, setPriceData] = useState<Record<string, { price: number; percentChange: number }>>({})
  const isMobileCard = useMediaQuery("(max-width: 639px)")

  const top5Tokens = useMemo(
    () => [...tokens].sort((a, b) => b.value - a.value).slice(0, 5),
    [tokens]
  )

  const stream =
    top5Tokens.length > 0
      ? "/stream?streams=" + top5Tokens.map((t) => t.symbol.toLowerCase() + "usdt@ticker").join("/")
      : ""

  useWebSocketEvent("ticker", stream, (data: any) => {
    const token = top5Tokens.find((t) => t.symbol.toUpperCase() + "USDT" === data.s)
    if (token) {
      setPriceData((prev) => ({
        ...prev,
        [token.symbol]: {
          price: Number.parseFloat(data.c),
          percentChange: Number.parseFloat(data.P),
        },
      }))
    }
  })

  if (isLoading) {
    return isMobileCard ? (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-8 rounded-md" />
              <Skeleton className="h-8 rounded-md" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
              <Skeleton className="h-8 rounded-md" />
              <Skeleton className="h-8 rounded-md" />
            </div>
          </Card>
        ))}
      </div>
    ) : (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {["Token", "Portfolio %", "Price", "24h Change", "Value", "Unrealized P&L", ""].map((h, i) => (
                <TableHead key={i} className="text-xs">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-24 mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-4 w-14 mx-auto" /></TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20 mx-auto" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-7 w-7 ml-auto rounded" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (!tokens || tokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4">
          <Plus className="h-6 w-6" />
        </div>
        <p className="font-medium text-sm">No assets yet</p>
        <p className="text-xs mt-1 text-center max-w-xs">
          Start building your portfolio by adding your first cryptocurrency asset.
        </p>
      </div>
    )
  }

  // Mobile: stacked cards
  if (isMobileCard) {
    return (
      <div className="space-y-3">
        {top5Tokens.map((token) => (
          <DashboardMobileCard
            key={token.id}
            token={token}
            totalValue={totalValue}
            priceData={priceData}
          />
        ))}
      </div>
    )
  }

  // Desktop: full rich table
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs font-bold uppercase tracking-widest">Token</TableHead>
            <TableHead className="text-center text-xs font-bold uppercase tracking-widest">
              Portfolio %
            </TableHead>
            <TableHead className="text-center text-xs font-bold uppercase tracking-widest">Price</TableHead>
            <TableHead className="text-center text-xs font-bold uppercase tracking-widest">
              24h Change
            </TableHead>
            <TableHead className="text-center text-xs font-bold uppercase tracking-widest">Value</TableHead>
            <TableHead className="text-center text-xs font-bold uppercase tracking-widest">
              Unrealized P&L
            </TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {top5Tokens.map((token) => (
            <DashboardTableRow
              key={token.id}
              token={token}
              totalValue={totalValue}
              priceData={priceData}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ── Desktop table row ─────────────────────────────────────────────────────────
const DashboardTableRow = memo(function DashboardTableRow({
  token,
  totalValue,
  priceData,
}: {
  token: Token
  totalValue: number
  priceData: Record<string, { price: number; percentChange: number }>
}) {
  const currentPrice = priceData[token.symbol]?.price ?? token.price
  const percentChange = priceData[token.symbol]?.percentChange ?? token.percentChange
  const { currentValue, unrealizedPnL, allocation, isPnLPositive } = calculateAssetMetrics({
    price: currentPrice,
    amount: token.amount,
    avgPrice: token.avg_price,
    totalPortfolioValue: totalValue,
  })
  const isIncrease = Number(percentChange) >= 0

  return (
    <TableRow className="hover:bg-muted/30 transition-colors">
      {/* Token identity */}
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarImage src={token.img_url} alt={token.symbol} />
            <AvatarFallback className="text-xs font-semibold">
              {token.symbol.toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{token.name}</p>
            <p className="text-xs text-muted-foreground">{token.symbol.toUpperCase()}</p>
          </div>
        </div>
      </TableCell>

      {/* Portfolio allocation */}
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-medium tabular-nums w-8 text-right">{allocation}%</span>
          <div className="w-20 h-1.5 rounded-full overflow-hidden bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min(allocation, 100)}%` }}
            />
          </div>
        </div>
      </TableCell>

      {/* Current price */}
      <TableCell className="text-center">
        {currentPrice ? (
          <span className="font-medium text-sm tabular-nums">
            $
            {Number(currentPrice).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        ) : (
          <Skeleton className="h-4 w-16 mx-auto" />
        )}
      </TableCell>

      {/* 24h change */}
      <TableCell className="text-center">
        <div
          className={`inline-flex items-center gap-1 text-sm font-medium tabular-nums ${
            isIncrease ? "text-green-600" : "text-red-600"
          }`}
        >
          {isIncrease ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {isIncrease ? "+" : "-"}
          {Math.abs(Number(percentChange)).toFixed(2)}%
        </div>
      </TableCell>

      {/* Value + holdings amount */}
      <TableCell className="text-center">
        {currentPrice ? (
          <div>
            <p className="font-semibold text-sm tabular-nums">
              $
              {currentValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-muted-foreground tabular-nums">
              {token.amount.toFixed(4)} {token.symbol.toUpperCase()}
            </p>
          </div>
        ) : (
          <Skeleton className="h-8 w-24 mx-auto" />
        )}
      </TableCell>

      {/* Unrealized P&L */}
      <TableCell className="text-center">
        {currentPrice ? (
          <div
            className={`font-medium text-sm tabular-nums ${
              isPnLPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPnLPositive ? "+" : "-"}$
            {Math.abs(unrealizedPnL).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        ) : (
          <Skeleton className="h-4 w-16 mx-auto" />
        )}
      </TableCell>

      {/* Link to transactions */}
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href={`/transactions?id=${token.id}`}>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="sr-only">View transactions for {token.name}</span>
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  )
})

// ── Mobile card ───────────────────────────────────────────────────────────────
const DashboardMobileCard = memo(function DashboardMobileCard({
  token,
  totalValue,
  priceData,
}: {
  token: Token
  totalValue: number
  priceData: Record<string, { price: number; percentChange: number }>
}) {
  const currentPrice = priceData[token.symbol]?.price ?? token.price
  const percentChange = priceData[token.symbol]?.percentChange ?? token.percentChange
  const { currentValue, unrealizedPnL, allocation, isPnLPositive } = calculateAssetMetrics({
    price: currentPrice,
    amount: token.amount,
    avgPrice: token.avg_price,
    totalPortfolioValue: totalValue,
  })
  const isIncrease = Number(percentChange) >= 0

  return (
    <Card className="p-4 space-y-3 hover:shadow-md transition-shadow duration-200">
      {/* Header: avatar + name + 24h change + link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={token.img_url} alt={token.symbol} />
            <AvatarFallback className="text-xs font-semibold">
              {token.symbol.toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{token.name}</p>
            <p className="text-xs text-muted-foreground">
              {token.symbol.toUpperCase()}
              <span
                className={`ml-2 font-medium ${
                  isIncrease ? "text-green-600" : "text-red-600"
                }`}
              >
                {isIncrease ? "+" : "-"}
                {Math.abs(Number(percentChange)).toFixed(2)}%
              </span>
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" asChild>
          <Link href={`/transactions?id=${token.id}`}>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="sr-only">View transactions for {token.name}</span>
          </Link>
        </Button>
      </div>

      {/* Allocation bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Portfolio Allocation</span>
          <span className="font-medium tabular-nums">{allocation}%</span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${Math.min(allocation, 100)}%` }}
          />
        </div>
      </div>

      {/* Price + Holdings */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Price</p>
          <p className="text-sm font-semibold tabular-nums">
            {currentPrice ? (
              `$${Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            ) : (
              <Skeleton className="h-4 w-16 inline-block" />
            )}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Holdings</p>
          <p className="text-sm font-semibold tabular-nums">
            {token.amount.toFixed(4)} {token.symbol.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Value + Unrealized P&L */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Value</p>
          <p className="text-sm font-bold tabular-nums">
            {currentPrice ? (
              `$${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            ) : (
              <Skeleton className="h-4 w-16 inline-block" />
            )}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Unrealized P&L</p>
          <div className="flex items-center gap-1">
            {isPnLPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500 flex-shrink-0" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 flex-shrink-0" />
            )}
            <p
              className={`text-sm font-bold tabular-nums ${
                isPnLPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {currentPrice ? (
                `$${Math.abs(unrealizedPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              ) : (
                <Skeleton className="h-4 w-12 inline-block" />
              )}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
})
