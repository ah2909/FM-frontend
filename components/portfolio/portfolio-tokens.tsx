"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import Link from "next/link"
import { MoreHorizontal, Plus, Trash2, Search, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { useRemoveTokenFromPortfolioMutation } from "@/lib/store/services/portfolio-api"
import { useDispatch } from "react-redux"
import { useWebSocketEvent } from "@/hooks/useWebSocketEvent"
import { removeSymbol, updateTotalValue } from "@/lib/store/features/portfolios-slice"
import { useSelector } from "react-redux"
import { TokenMobileList } from "./token-mobile-list"

export interface Token {
  id: number
  symbol: string
  name: string
  price: number
  amount: number
  value: number
  img_url: string
  avg_price: number
  percentChange: number
}

interface PortfolioTokensProps {
  portfolio: any
}

export function PortfolioTokens({ portfolio }: PortfolioTokensProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [tokenToDelete, setTokenToDelete] = useState<string | null>(null)
  const tokens = useSelector((state: any) => state.portfolios.assets ?? [])
  const [removeTokenFromPortfolio] = useRemoveTokenFromPortfolioMutation()
  const dispatch = useDispatch()
  const [priceData, setPriceData] = useState<Record<string, {price: number, percentChange: number}>>({})

  // Memoize the WebSocket stream to prevent recreation
  const stream = useMemo(() => {
    if (tokens.length === 0) return ""
    return "/stream?streams=" + tokens.map((token: Token) => token.symbol.toLowerCase() + "usdt@ticker").join("/")
  }, [tokens])

  // Memoize the event handler to prevent recreation
  const eventHandler = useCallback(
    (data: any) => {
      const token = tokens.find((token: Token) => token.symbol.toUpperCase() + "USDT" === data.s)
      if (token) {
        setPriceData((prev) => ({
          ...prev,
          [token.symbol]: {
            price: Number.parseFloat(data.c), 
            percentChange: Number.parseFloat(data.P),
          },
        }))
      }
    },
    [tokens],
  )

  useWebSocketEvent("ticker", stream, eventHandler)

  // Memoize the delete handler
  const handleDeleteClick = useCallback((tokenSymbol: string) => {
    setTokenToDelete(tokenSymbol)
    setOpenDeleteDialog(true)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (tokenToDelete) {
      try {
        await removeTokenFromPortfolio({
          portfolio_id: portfolio.id,
          token: tokenToDelete,
        })
        dispatch(removeSymbol(tokenToDelete))
        toast.success("The token has been removed from your portfolio.")
      } catch (error) {
        toast.error("Failed to remove token from portfolio.")
      } finally {
        setOpenDeleteDialog(false)
        setTokenToDelete(null)
      }
    }
  }, [tokenToDelete, removeTokenFromPortfolio, portfolio.id, dispatch])

  // Memoize sorted tokens for desktop table
  const sortedTokensForTable = useMemo(() => {
    return [...tokens].sort((a: Token, b: Token) => {
      const aValue = (priceData[a.symbol]?.price || a.price) * a.amount
      const bValue = (priceData[b.symbol]?.price || b.price) * b.amount
      return bValue - aValue
    })
  }, [tokens, priceData])

  const calculateTotalValue = useMemo(() => {
  if (!tokens || tokens.length === 0) return portfolio.totalValue;
  return tokens.reduce((acc: number, t: Token) => {
    const price = priceData[t.symbol]?.price ?? t.price ?? 0;
    return acc + price * t.amount;
  }, 0);
}, [tokens, priceData]);

useEffect(() => {
  if (typeof calculateTotalValue === "number" && !isNaN(calculateTotalValue)) {
    dispatch(updateTotalValue(calculateTotalValue));
  }
}, [calculateTotalValue, dispatch]);

  if (tokens.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle className="text-lg sm:text-xl">Portfolio Tokens</CardTitle>
              <CardDescription className="text-sm">Manage your tokens in this portfolio</CardDescription>
            </div>
            {/* <Link href={`/portfolios/add-token`}>
              <Button size="sm" className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Token
              </Button>
            </Link> */}
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tokens in this portfolio yet.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="my-4">
      <CardHeader className="pb-4">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle className="text-lg sm:text-xl">Portfolio Tokens</CardTitle>
            <CardDescription className="text-sm">
              {tokens.length} token{tokens.length !== 1 ? "s" : ""} in this portfolio
            </CardDescription>
          </div>
          {/* <Link href={`/portfolios/add-token`}>
            <Button size="sm" className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Token
            </Button>
          </Link> */}
          <div className="flex w-full lg:w-auto gap-2">
            <div className="relative flex-1 lg:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search assets..."
                className="pl-8 w-full lg:w-[240px] text-sm"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-1 bg-transparent text-sm px-3">
              Filter
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        {/* Mobile View - Optimized Card Layout */}
        <div className="block sm:hidden">
          <TokenMobileList
            tokens={tokens}
            portfolioTotalValue={portfolio.totalValue}
            priceData={priceData}
            onDeleteClick={handleDeleteClick}
          />
        </div>

        {/* Desktop View - Table Layout */}
        <div className="hidden sm:block overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Token</TableHead>
                <TableHead className="text-center text-xs sm:text-sm">Portfolio (%)</TableHead>
                <TableHead className="text-center text-xs sm:text-sm">Price</TableHead>
                <TableHead className="text-center text-xs sm:text-sm">Change (%)</TableHead>
                <TableHead className="text-center text-xs sm:text-sm">Value</TableHead>
                <TableHead className="text-center text-xs sm:text-sm">Unrealized P&L</TableHead>
                <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTokensForTable.map((token: Token) => {
                const currentPrice = priceData[token.symbol]?.price || token.price
                const currentValue = currentPrice * token.amount
                const unrealizedPnL = Number((currentValue - token.avg_price * token.amount).toFixed(2))
                const allocation = Number(((currentValue / portfolio.totalValue) * 100).toFixed(0))
                const percentChange = priceData[token.symbol]?.percentChange || token.percentChange
                const isIncrease = Number(percentChange) >= 0

                return (
                  <TableRow key={token.id} className="hover:bg-muted/30 transition-colors">
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
                      {/* percentchange */}
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
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Token?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove "{tokenToDelete}" from your portfolio. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Token
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
