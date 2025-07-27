"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useSelector } from "react-redux"

interface TransactionListProps {
  selectedToken: any
}

export function TransactionList({ selectedToken }: TransactionListProps) {
  const [selectedExchange, setSelectedExchange] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const transactions = useSelector((state: any) => state.portfolios.transactions)
  const transByAsset = [...transactions[selectedToken?.id]].sort((a: any, b: any) => {
    return new Date(b.transact_date).getTime() - new Date(a.transact_date).getTime()
  })

  const mappingExchanges = (exchange_id: number) => {
    switch (exchange_id) {
      case 1:
        return "Binance"
      case 2:
        return "OKX"
      case 3:
        return "Bybit"
      default:
        return "Unknown Exchange"
    }
  }

  const mappingExchangesLogo = (exchange_id: number) => {
    switch (exchange_id) {
      case 1:
        return "/binance.png"
      case 2:
        return "/okx.png"
      case 3:
        return "/bybit.png"
      default:
        return ""
    }
  }

  const filteredTransactions = transByAsset?.filter((transaction: any) => {
    if (selectedExchange !== "all" && transaction.exchange !== selectedExchange) {
      return false
    }
    if (selectedType !== "all" && transaction.type !== selectedType) {
      return false
    }
    if (
      searchQuery &&
      !transaction.token.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !transaction.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    return true
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const formatAmount = (amount: number, symbol: string) => {
    if (amount >= 1) {
      return `${amount.toLocaleString()} ${symbol}`
    } else {
      return `${amount} ${symbol}`
    }
  }

  return (
    <>
      <div className="space-y-1">
        {filteredTransactions?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No transactions found matching your filters.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transByAsset?.map((transaction: any) => (
              <div
                key={transaction.id}
                className="grid grid-cols-1 sm:grid-cols-12 items-center py-4 px-2 hover:bg-muted/30 rounded-lg transition-colors group gap-4 border sm:border-0"
              >
                {/* Mobile layout */}
                <div className="sm:hidden space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={selectedToken.img_url} alt={selectedToken.symbol} />
                        <AvatarFallback>{selectedToken.symbol.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{selectedToken.name}</div>
                        <div className="text-xs text-muted-foreground">{selectedToken.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        transaction.type === "BUY"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {transaction.type}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">
                        $ {Number(transaction.price * transaction.quantity).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatAmount(transaction.quantity, selectedToken.symbol.toUpperCase())}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-sm">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={mappingExchangesLogo(transaction.exchange_id)}
                            alt={mappingExchanges(transaction.exchange_id)}
                          />
                          <AvatarFallback className="text-xs">
                            {mappingExchanges(transaction.exchange_id).slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{mappingExchanges(transaction.exchange_id)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDate(transaction.transact_date)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop layout - keep existing grid structure but hide on mobile */}
                <div className="hidden sm:contents">
                  {/* Left side - Crypto icon and info */}
                  <div className="col-span-2 flex items-center space-x-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={selectedToken.img_url} alt={selectedToken.symbol} />
                      <AvatarFallback>{selectedToken.symbol.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-medium text-base truncate">{selectedToken.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedToken.symbol.toUpperCase()}</div>
                    </div>
                  </div>

                  {/* Transaction type badge */}
                  <div className="col-span-1 flex justify-center">
                    <Badge
                      variant="outline"
                      className={`${
                        transaction.type === "BUY"
                          ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                          : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      }`}
                    >
                      {transaction.type}
                    </Badge>
                  </div>

                  {/* Amount and Value */}
                  <div className="col-span-4 text-center">
                    <div className="font-semibold text-lg">
                      $ {Number(transaction.price * transaction.quantity).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatAmount(transaction.quantity, selectedToken.symbol.toUpperCase())}
                    </div>
                  </div>

                  {/* Exchange */}
                  <div className="col-span-2 flex items-center space-x-2">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage
                        src={mappingExchangesLogo(transaction.exchange_id)}
                        alt={mappingExchanges(transaction.exchange_id)}
                      />
                      <AvatarFallback className="text-xs">{mappingExchanges(transaction.exchange_id)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium truncate">{mappingExchanges(transaction.exchange_id)}</span>
                  </div>

                  {/* Date */}
                  <div className="col-span-2 text-sm text-muted-foreground text-right">
                    {formatDate(transaction.transact_date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
