"use client"

import { memo, useMemo } from "react"
import { TokenMobileCard } from "./token-mobile-card"
import { Token } from "./portfolio-tokens"

interface TokenMobileListProps {
  tokens: Token[]
  portfolioTotalValue: number
  priceData: Record<string, {price: number, percentChange: number}>
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
      const aValue = (priceData[a.symbol]?.price || a.price) * a.amount
      const bValue = (priceData[b.symbol]?.price || b.price) * b.amount
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
          current={priceData[token.symbol]}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  )
})
