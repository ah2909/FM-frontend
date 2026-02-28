"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import { useState, memo } from "react"
import { Skeleton } from "../ui/skeleton"
import { useWebSocketEvent } from "@/hooks/useWebSocketEvent"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Token } from "../portfolio/portfolio-tokens"
import Image from "next/image"

interface AssetTableProps {
  tokens: Token[]
  totalValue: number
  isLoading?: boolean
}

export function AssetTable({ tokens, totalValue, isLoading = false }: AssetTableProps) {
  const [priceData, setPriceData] = useState<Record<string, {price: number, percentChange: number}>>({})
  const top5Tokens = [...tokens].sort((a: Token, b: Token) => b.value - a.value).slice(0, 5)
  const stream =
    "/stream?streams=" + top5Tokens.map((token: Token) => token.symbol.toLowerCase() + "usdt@ticker").join("/")

  useWebSocketEvent("ticker", stream, (data: any) => {
    const token = top5Tokens.find((token: Token) => token.symbol.toUpperCase() + "USDT" === data.s)
    if (token)
      setPriceData((prev) => ({
        ...prev,
        [token.symbol]: {
          price: Number.parseFloat(data.c), 
          percentChange: Number.parseFloat(data.P),
        },
      }))
  })

  if (isLoading) {
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
                {/* <TableHead className="w-12 text-xs sm:text-sm">ACTION</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="w-16 h-2 rounded-full" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  {/* <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (!tokens || tokens.length === 0) {
    return (
      <Card className="border-hidden">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Plus className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg text-muted-foreground">No Assets Yet</CardTitle>
          <CardDescription>Start building your portfolio by adding your first cryptocurrency asset.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-xs sm:text-sm">NO</TableHead>
              <TableHead className="text-xs sm:text-sm">NAME</TableHead>
              <TableHead className="text-xs hidden sm:table-cell">PORTFOLIO (%)</TableHead>
              <TableHead className="text-xs sm:text-sm text-center">HOLDINGS</TableHead>
              <TableHead className="text-xs sm:text-sm text-center">PRICE (24H)</TableHead>
              {/* <TableHead className="w-12 text-xs sm:text-sm">ACTION</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {top5Tokens.map((token: Token, index: number) => (
              <AssetTableRow
                key={token.id}
                token={token}
                index={index}
                totalValue={totalValue}
                priceData={priceData}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

const AssetTableRow = memo(function AssetTableRow({
  token,
  index,
  totalValue,
  priceData,
}: {
  token: Token 
  index: number
  totalValue: number
  priceData: any
}) {
  const currentPrice = priceData[token.symbol]?.price ?? token.price
  const value = currentPrice ? Number(currentPrice * token.amount) : 0
  const allocation = Number((value / totalValue) * 100).toFixed(0)
  const percentChange = priceData[token.symbol]?.percentChange || token.percentChange
  const isIncrease = Number(percentChange) >= 0

  return (
    <TableRow>
      <TableCell className="font-medium text-xs sm:text-sm">{index + 1}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0 bg-muted relative">
            <Image 
              src={token.img_url} 
              alt={token.symbol} 
              fill
              sizes="(max-width: 640px) 24px, 32px"
              className="object-cover" 
            />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-xs sm:text-sm truncate">{token.name}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">
              {token.symbol.toUpperCase()}
              <span className={`ml-2 font-medium ${Number(percentChange) >= 0 ? "text-green-600" : "text-red-600"}`}>
                {isIncrease ? "+" : "-"}
                {Math.abs(Number(percentChange)).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <div className="flex items-center gap-1 sm:gap-2 justify-center">
          {!isNaN(Number(allocation)) ? (
            <span className="text-xs sm:text-sm">{allocation}%</span>
          ) : (
            <Skeleton className="h-3 w-8 sm:h-4 sm:w-4" />
          )}
          <div className="w-16 sm:w-24 h-1.5 sm:h-2 rounded-full overflow-hidden bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${!isNaN(Number(allocation)) ? allocation : 0}%`,
              }}
            ></div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-center text-xs sm:text-sm">
        <div className="font-medium">
          {token.amount} {token.symbol.toUpperCase()}
        </div>
        <div className="text-[10px] sm:text-xs text-muted-foreground">
          {currentPrice ? `$${value.toFixed(2)}` : <Skeleton className="h-3 w-12" />}
        </div>
      </TableCell>
      <TableCell className="text-center text-xs sm:text-sm font-semibold">
        {currentPrice ? `$${currentPrice}` : <Skeleton className="h-4 w-12 mx-auto" />}
      </TableCell>
    </TableRow>
  )
})
