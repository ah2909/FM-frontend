"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Skeleton } from "../ui/skeleton"
import { useWebSocketEvent } from "@/hooks/useWebSocketEvent"

export interface Token {
  id: number
  symbol: string
  name: string
  price: number
  amount: number
  value: number
  img_url: string
  avg_price: number
}

interface AssetTableProps {
  tokens: Token[]
  totalValue: number
}

export function AssetTable({ tokens, totalValue }: AssetTableProps) {
  const [priceData, setPriceData] = useState<any>({})
  const top5Tokens = [...tokens].sort((a: Token, b: Token) => b.value - a.value).slice(0, 5)
  const stream =
    "/stream?streams=" + top5Tokens.map((token: Token) => token.symbol.toLowerCase() + "usdt@ticker").join("/")

  useWebSocketEvent("ticker", stream, (data: any) => {
    const token = top5Tokens.find((token: Token) => token.symbol.toUpperCase() + "USDT" === data.s)
    if (token)
      setPriceData((prev: any) => ({
        ...prev,
        [token.symbol]: data.c,
      }))
  })

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-xs sm:text-sm">NO</TableHead>
              <TableHead className="text-xs sm:text-sm">NAME</TableHead>
              <TableHead className="text-xs sm:text-sm text-center">PORTFOLIO (%)</TableHead>
              <TableHead className="text-xs sm:text-sm text-center">HOLDINGS</TableHead>
              <TableHead className="text-xs sm:text-sm text-center">PRICE (24H)</TableHead>
              <TableHead className="w-12 text-xs sm:text-sm">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {top5Tokens.map((token: Token, index: number) => {
              const currentPrice = priceData[token.symbol] ?? token.price
              const value = currentPrice ? Number(currentPrice * token.amount) : 0
              const allocation = Number((value / totalValue) * 100).toFixed(0)

              return (
                <TableRow key={token.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={token.img_url || "/placeholder.svg"}
                          alt={token.symbol}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm sm:text-base truncate">{token.name}</div>
                        <div className="text-xs text-muted-foreground">{token.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 sm:gap-2 justify-center">
                      {!isNaN(Number(allocation)) ? (
                        <span className="text-xs sm:text-sm">{allocation}%</span>
                      ) : (
                        <Skeleton className="h-3 w-8 sm:h-4 sm:w-4" />
                      )}
                      <div
                        className="w-16 sm:w-24 h-1.5 sm:h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: "hsl(var(--muted))" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${!isNaN(Number(allocation)) ? allocation : 0}%`,
                            backgroundColor: "hsl(var(--primary))",
                          }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {token.amount.toFixed(4)} {token.symbol.toUpperCase()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {currentPrice ? `$${value.toFixed(2)}` : <Skeleton className="h-4 w-16" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    {currentPrice ? `$${Number(currentPrice).toFixed(2)}` : <Skeleton className="h-4 w-16" />}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
