"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const transactions = [
  {
    id: "1",
    type: "buy",
    token: "Bitcoin",
    symbol: "BTC",
    amount: 0.05,
    value: 1622.84,
    date: "2023-10-15",
    icon: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    type: "sell",
    token: "Ethereum",
    symbol: "ETH",
    amount: 1.2,
    value: 2214.28,
    date: "2023-10-12",
    icon: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    type: "buy",
    token: "Solana",
    symbol: "SOL",
    amount: 10,
    value: 984.5,
    date: "2023-10-10",
    icon: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    type: "buy",
    token: "Cardano",
    symbol: "ADA",
    amount: 500,
    value: 225.0,
    date: "2023-10-05",
    icon: "/placeholder.svg?height=40&width=40",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={transaction.icon} alt={transaction.token} />
            <AvatarFallback>{transaction.symbol.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.token}</p>
            <p className="text-sm text-muted-foreground">{transaction.date}</p>
          </div>
          <div className="ml-auto font-medium">
            <Badge variant={transaction.type === "buy" ? "default" : "destructive"}>
              {transaction.type.toUpperCase()}
            </Badge>
            <p className="text-sm mt-1">
              {transaction.amount} {transaction.symbol} (${transaction.value.toLocaleString()})
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

