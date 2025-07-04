"use client"

import { memo, useMemo } from "react"
import { TokenMobileCard } from "./token-mobile-card"

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

interface TokenMobileListProps {
  tokens: Token[]
  portfolioTotalValue: number
  priceData: Record<string, number>
  onDeleteClick: (symbol: string) => void
}

export const TokenMobileList = memo(function TokenMobileList({
  tokens,
  portfolioTotalValue,
  priceData,
  onDeleteClick,
}: TokenMobileListProps) {
  // Memoize the sorted tokens to prevent re-sorting on every render
  const sortedTokens = useMemo(() => {
    return [...tokens].sort((a: Token, b: Token) => {
      const aValue = (priceData[a.symbol] || a.price) * a.amount
      const bValue = (priceData[b.symbol] || b.price) * b.amount
      return bValue - aValue
    })
  }, [tokens, priceData])

  return (
    <div className="space-y-3">
      {sortedTokens.map((token) => (
        <TokenMobileCard
          key={token.id}
          token={token}
          portfolioTotalValue={portfolioTotalValue}
          currentPrice={priceData[token.symbol]}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  )
})
