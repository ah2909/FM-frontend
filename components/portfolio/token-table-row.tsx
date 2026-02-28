"use client"

import { memo } from "react"
import Link from "next/link"
import { MoreHorizontal, Plus, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import { Token } from "./portfolio-tokens"
import { calculateAssetMetrics } from "@/lib/utils"

interface TokenTableRowProps {
  token: Token
  portfolio: any
  priceData: any
  handleDeleteClick: (symbol: string) => void
}

export const TokenTableRow = memo(function TokenTableRow({
  token,
  portfolio,
  priceData,
  handleDeleteClick,
}: TokenTableRowProps) {
  const currentPrice = priceData[token.symbol]?.price || token.price
  const { currentValue, unrealizedPnL, allocation } = calculateAssetMetrics({
    price: currentPrice,
    amount: token.amount,
    avgPrice: token.avg_price,
    totalPortfolioValue: portfolio.totalValue
  })
  
  const percentChange = priceData[token.symbol]?.percentChange || token.percentChange
  const isIncrease = Number(percentChange) >= 0

  return (
    <TableRow className="hover:bg-muted/30 transition-colors">
      <TableCell>
        <div className="flex items-center min-w-0">
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
            <AvatarImage src={token.img_url} alt={token.symbol} />
            <AvatarFallback>{token.symbol.toUpperCase().slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="ml-3 sm:ml-4 min-w-0">
            <p className="font-medium text-sm sm:text-base truncate">{token.name}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">{token.symbol.toUpperCase()}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center gap-2 justify-center">
          <span className="text-sm font-medium">{allocation}%</span>
          <div className="w-16 lg:w-24 h-2 rounded-full overflow-hidden bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(allocation, 100)}%` }}
            />
          </div>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <p className="font-medium">${Number(currentPrice)}</p>
      </TableCell>
      <TableCell className="text-center">
        <div className={`font-medium text-sm ${Number(percentChange) >= 0 ? "text-green-600" : "text-red-600"}`}>
          {isIncrease ? "+" : "-"}
          {Math.abs(Number(percentChange)).toFixed(2)}%
        </div>
      </TableCell>
      <TableCell className="text-center">
        <div>
          <div className="font-medium text-sm sm:text-base">${currentValue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {token.amount.toFixed(4)} {token.symbol.toUpperCase()}
          </p>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <div className={`font-medium text-sm ${unrealizedPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
          ${Math.abs(unrealizedPnL).toFixed(2)}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
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
              onClick={() => handleDeleteClick(token.symbol)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Token
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
})
