"use client"

import type * as React from "react"
import { useMemo } from "react"
import Image from "next/image"
import { TrendingUp, TrendingDown, Globe2, Flame } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  useGetFearGreedQuery,
  useGetGlobalStatsQuery,
  useGetTrendingQuery,
} from "@/lib/store/services/market-api"

function formatCompactUsd(value: number) {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

function formatPrice(value: number | null) {
  if (value == null) return "—"
  if (value >= 1) return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  return `$${value.toPrecision(3)}`
}

// ── Fear & Greed gauge ────────────────────────────────────────────────────────
function sentimentColor(value: number) {
  if (value < 25) return "hsl(0 72% 55%)"
  if (value < 45) return "hsl(25 90% 55%)"
  if (value < 55) return "hsl(45 90% 50%)"
  if (value < 75) return "hsl(90 60% 45%)"
  return "hsl(142 65% 45%)"
}

function FearGreedGauge() {
  const { data, isLoading, isError } = useGetFearGreedQuery()

  // Semicircle from 180° to 0°, needle angle from value
  const angle = useMemo(() => ((data?.value ?? 50) / 100) * 180, [data])

  return (
    <Card className="card-hover glass border-none shadow-sm h-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
          Fear &amp; Greed Index
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-2 pb-5">
        {isLoading ? (
          <Skeleton className="h-[120px] w-full rounded-lg" />
        ) : isError || !data ? (
          <p className="text-sm text-muted-foreground py-10">Sentiment unavailable</p>
        ) : (
          <>
            <svg viewBox="0 0 200 115" className="w-full max-w-[220px]" aria-label={`Fear and greed: ${data.value}`}>
              <defs>
                <linearGradient id="fng-arc" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(0 72% 55%)" />
                  <stop offset="35%" stopColor="hsl(25 90% 55%)" />
                  <stop offset="60%" stopColor="hsl(45 90% 50%)" />
                  <stop offset="100%" stopColor="hsl(142 65% 45%)" />
                </linearGradient>
              </defs>
              <path
                d="M 15 100 A 85 85 0 0 1 185 100"
                fill="none"
                stroke="url(#fng-arc)"
                strokeWidth="14"
                strokeLinecap="round"
                opacity="0.9"
              />
              {/* needle */}
              <g transform={`rotate(${angle - 90} 100 100)`} style={{ transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
                <line x1="100" y1="100" x2="100" y2="32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <circle cx="100" cy="100" r="6" fill="currentColor" />
              </g>
              <text
                x="100"
                y="92"
                textAnchor="middle"
                fontSize="30"
                fontWeight="800"
                fill={sentimentColor(data.value)}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {data.value}
              </text>
            </svg>
            <p className="text-sm font-bold mt-1" style={{ color: sentimentColor(data.value) }}>
              {data.classification}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// ── Global stats ──────────────────────────────────────────────────────────────
function GlobalStatItem({ label, value, badge }: { label: string; value: string; badge?: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-muted/40 p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70">{label}</p>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-base sm:text-lg font-black tracking-tight tabular-nums">{value}</p>
        {badge}
      </div>
    </div>
  )
}

function GlobalStatsCard() {
  const { data, isLoading, isError } = useGetGlobalStatsQuery()
  const capUp = (data?.marketCapChange24h ?? 0) >= 0

  return (
    <Card className="card-hover glass border-none shadow-sm h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
          <Globe2 className="h-3.5 w-3.5" />
          Global Market
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-5">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[68px] rounded-xl" />
            ))}
          </div>
        ) : isError || !data ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Market data unavailable</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <GlobalStatItem
              label="Market Cap"
              value={formatCompactUsd(data.totalMarketCap)}
              badge={
                <span className={capUp ? "badge-gain" : "badge-loss"}>
                  {capUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {capUp ? "+" : ""}
                  {data.marketCapChange24h.toFixed(1)}%
                </span>
              }
            />
            <GlobalStatItem label="24h Volume" value={formatCompactUsd(data.totalVolume)} />
            <GlobalStatItem label="BTC Dominance" value={`${data.btcDominance.toFixed(1)}%`} />
            <GlobalStatItem label="ETH Dominance" value={`${data.ethDominance.toFixed(1)}%`} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ── Trending coins ────────────────────────────────────────────────────────────
function TrendingCard() {
  const { data, isLoading, isError } = useGetTrendingQuery()
  const coins = (data ?? []).slice(0, 6)

  return (
    <Card className="card-hover glass border-none shadow-sm h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
          <Flame className="h-3.5 w-3.5 text-orange-500" />
          Trending Now
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        {isLoading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 rounded-lg" />
            ))}
          </div>
        ) : isError || coins.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Trending data unavailable</p>
        ) : (
          <ul className="divide-y divide-border/40">
            {coins.map((coin, i) => {
              const up = (coin.change24h ?? 0) >= 0
              return (
                <li key={coin.id} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                  <span className="w-4 text-xs font-bold text-muted-foreground/50 tabular-nums">{i + 1}</span>
                  <Image
                    src={coin.thumb}
                    alt={coin.name}
                    width={24}
                    height={24}
                    className="rounded-full flex-shrink-0"
                    unoptimized
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate leading-tight">{coin.name}</p>
                    <p className="text-[11px] text-muted-foreground uppercase">{coin.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">{formatPrice(coin.price)}</p>
                    {coin.change24h != null && (
                      <p
                        className={cn(
                          "text-[11px] font-semibold tabular-nums",
                          up ? "text-emerald-500" : "text-red-500"
                        )}
                      >
                        {up ? "+" : ""}
                        {coin.change24h.toFixed(1)}%
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

// ── Assembled section ─────────────────────────────────────────────────────────
export function MarketPulse() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
      <div className="lg:col-span-3">
        <FearGreedGauge />
      </div>
      <div className="lg:col-span-4">
        <GlobalStatsCard />
      </div>
      <div className="md:col-span-2 lg:col-span-5">
        <TrendingCard />
      </div>
    </div>
  )
}
