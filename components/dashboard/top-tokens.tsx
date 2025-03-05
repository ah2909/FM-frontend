"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const tokens = [
  {
    id: "1",
    name: "Bitcoin",
    symbol: "BTC",
    value: 32456.78,
    change: 2.34,
    icon: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Ethereum",
    symbol: "ETH",
    value: 1845.23,
    change: -1.23,
    icon: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Solana",
    symbol: "SOL",
    value: 98.45,
    change: 5.67,
    icon: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Cardano",
    symbol: "ADA",
    value: 0.45,
    change: -0.23,
    icon: "/placeholder.svg?height=40&width=40",
  },
]

export function TopTokens() {
  return (
    <div className="space-y-8">
      {tokens.map((token) => (
        <div key={token.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={token.icon} alt={token.name} />
            <AvatarFallback>{token.symbol.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{token.name}</p>
            <p className="text-sm text-muted-foreground">{token.symbol}</p>
          </div>
          <div className="ml-auto font-medium">
            ${token.value.toLocaleString()}
            <p className={`text-xs ${token.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {token.change >= 0 ? "+" : ""}
              {token.change}%
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

