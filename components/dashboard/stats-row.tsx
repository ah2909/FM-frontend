"use client"

import type * as React from "react"
import { useMemo } from "react"
import { TrendingUp, TrendingDown, Wallet, Trophy, Flame } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Token } from "@/components/portfolio/portfolio-tokens"
import { cn } from "@/lib/utils"

interface StatsRowProps {
  tokens: Token[]
  balanceData?: { balance: number; date: string }[]
  isLoading?: boolean
}

function formatUsd(value: number) {
  return Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// Tiny inline SVG sparkline, stroke follows gain/loss
function Sparkline({ points, positive }: { points: number[]; positive: boolean }) {
  if (points.length < 2) return null
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const w = 96
  const h = 32
  const step = w / (points.length - 1)
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(h - ((p - min) / range) * (h - 4) - 2).toFixed(1)}`)
    .join(" ")
  const color = positive ? "hsl(142 60% 50%)" : "hsl(0 72% 55%)"
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-24" preserveAspectRatio="none" aria-hidden>
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatCard({
  label,
  icon: Icon,
  iconClass,
  children,
  delay,
}: {
  label: string
  icon: React.ElementType
  iconClass: string
  children: React.ReactNode
  delay: number
}) {
  return (
    <Card
      className="card-hover glass border-none shadow-sm p-4 sm:p-5 flex flex-col gap-3 animate-fade-in"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
          {label}
        </span>
        <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", iconClass)}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      {children}
    </Card>
  )
}

function PerformerBody({ token }: { token: Token | null }) {
  if (!token) return <p className="text-sm text-muted-foreground">—</p>
  const pct = Number(token.percentChange) || 0
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={token.img_url} alt={token.symbol} />
        <AvatarFallback className="text-[10px] font-semibold">
          {token.symbol.toUpperCase().slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="text-lg font-black tracking-tight leading-none truncate">
          {token.symbol.toUpperCase()}
        </p>
        <span className={cn("mt-1", pct >= 0 ? "badge-gain" : "badge-loss")}>
          {pct >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {pct >= 0 ? "+" : ""}
          {pct.toFixed(2)}%
        </span>
      </div>
    </div>
  )
}

export function StatsRow({ tokens, balanceData, isLoading = false }: StatsRowProps) {
  const stats = useMemo(() => {
    if (!tokens?.length) return null

    let change24h = 0
    let costBasis = 0
    let totalValue = 0
    tokens.forEach((t) => {
      const pct = Number(t.percentChange) || 0
      const value = Number(t.value) || 0
      // back out yesterday's value from today's value and the 24h % move
      change24h += value - value / (1 + pct / 100)
      costBasis += (Number(t.avg_price) || 0) * (Number(t.amount) || 0)
      totalValue += value
    })
    const unrealized = totalValue - costBasis
    const sorted = [...tokens].sort(
      (a, b) => (Number(b.percentChange) || 0) - (Number(a.percentChange) || 0)
    )

    return {
      change24h,
      change24hPct: totalValue - change24h !== 0 ? (change24h / (totalValue - change24h)) * 100 : 0,
      unrealized,
      unrealizedPct: costBasis > 0 ? (unrealized / costBasis) * 100 : 0,
      best: sorted[0] ?? null,
      worst: sorted.length > 1 ? sorted[sorted.length - 1] : null,
    }
  }, [tokens])

  const sparkPoints = useMemo(
    () =>
      (balanceData ?? [])
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-14)
        .map((d) => d.balance),
    [balanceData]
  )

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[104px] rounded-xl" />
        ))}
      </div>
    )
  }

  if (!stats) return null

  const dayUp = stats.change24h >= 0
  const pnlUp = stats.unrealized >= 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <StatCard
        label="24h Change"
        icon={dayUp ? TrendingUp : TrendingDown}
        iconClass={dayUp ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}
        delay={0}
      >
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p
              className={cn(
                "text-lg sm:text-xl font-black tracking-tight tabular-nums leading-none truncate",
                dayUp ? "text-emerald-500" : "text-red-500"
              )}
            >
              {dayUp ? "+" : "-"}${formatUsd(stats.change24h)}
            </p>
            <p className="text-xs font-medium text-muted-foreground tabular-nums mt-1">
              {dayUp ? "+" : ""}
              {stats.change24hPct.toFixed(2)}% today
            </p>
          </div>
          <div className="hidden sm:block flex-shrink-0">
            <Sparkline points={sparkPoints} positive={dayUp} />
          </div>
        </div>
      </StatCard>

      <StatCard
        label="Unrealized P&L"
        icon={Wallet}
        iconClass={pnlUp ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}
        delay={60}
      >
        <div className="min-w-0">
          <p
            className={cn(
              "text-lg sm:text-xl font-black tracking-tight tabular-nums leading-none truncate",
              pnlUp ? "text-emerald-500" : "text-red-500"
            )}
          >
            {pnlUp ? "+" : "-"}${formatUsd(stats.unrealized)}
          </p>
          <p className="text-xs font-medium text-muted-foreground tabular-nums mt-1">
            {pnlUp ? "+" : ""}
            {stats.unrealizedPct.toFixed(2)}% all time
          </p>
        </div>
      </StatCard>

      <StatCard label="Top Performer" icon={Trophy} iconClass="bg-amber-500/10 text-amber-500" delay={120}>
        <PerformerBody token={stats.best} />
      </StatCard>

      <StatCard label="Biggest Drop" icon={Flame} iconClass="bg-red-500/10 text-red-500" delay={180}>
        <PerformerBody token={stats.worst} />
      </StatCard>
    </div>
  )
}
