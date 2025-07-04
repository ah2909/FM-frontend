"use client"

import { memo } from "react"
import Link from "next/link"
import { MoreHorizontal, Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

interface Token {
  id: number
  symbol: string
  name: string
  price: number
  amount: number
  value: number
  img_url: string
  avg_price: number
}

interface TokenMobileCardProps {
  token: Token
  portfolioTotalValue: number
  currentPrice?: number
  onDeleteClick: (symbol: string) => void
}

export const TokenMobileCard = memo(function TokenMobileCard({
  token,
  portfolioTotalValue,
  currentPrice,
  onDeleteClick,
}: TokenMobileCardProps) {
  // Memoized calculations to prevent recalculation on every render
  const price = currentPrice || token.price
  const currentValue = price * token.amount
  const unrealizedPnL = Number((currentValue - token.avg_price * token.amount).toFixed(2))
  const allocation = Number(((currentValue / portfolioTotalValue) * 100).toFixed(0))
  const isPnLPositive = unrealizedPnL >= 0

  return (
    <Card className="p-4 space-y-3 hover:shadow-md transition-shadow duration-200">
      {/* Header with token info and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={token.img_url || "/placeholder.svg"} alt={token.symbol} />
            <AvatarFallback className="text-xs font-semibold">{token.symbol.toUpperCase().slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm truncate">{token.name}</h3>
            <p className="text-xs text-muted-foreground">{token.symbol.toUpperCase()}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu for {token.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/transactions?id=${token.id}`}>
                <Plus className="mr-2 h-4 w-4" />
                View Transactions
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteClick(token.symbol)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Token
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Portfolio allocation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Portfolio Allocation</span>
          <span className="font-medium">{allocation}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(allocation, 100)}%` }}
          />
        </div>
      </div>

      {/* Price and value information */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Current Price</p>
          <p className="text-sm font-semibold">
            {price ? `$${Number(price).toFixed(2)}` : <Skeleton className="h-4 w-16" />}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Holdings</p>
          <p className="text-sm font-semibold">
            {token.amount.toFixed(4)} {token.symbol.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Value and P&L */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Total Value</p>
          <p className="text-base font-bold">
            {price ? `$${currentValue.toFixed(2)}` : <Skeleton className="h-5 w-20" />}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Unrealized P&L</p>
          <div className="flex items-center space-x-1">
            {isPnLPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500 flex-shrink-0" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 flex-shrink-0" />
            )}
            <p className={`text-sm font-bold ${isPnLPositive ? "text-green-500" : "text-red-500"}`}>
              {price ? `$${Math.abs(unrealizedPnL).toFixed(2)}` : <Skeleton className="h-4 w-16" />}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
})
