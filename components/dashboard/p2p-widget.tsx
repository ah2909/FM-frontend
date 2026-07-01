"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useGetP2PQuery } from "@/lib/store/services/market-api";

const formatVnd = (v: number | null | undefined) =>
  v == null ? "—" : `₫${Math.round(v).toLocaleString("vi-VN")}`;

function RateStat({
  label,
  value,
  avg,
  tone,
}: {
  label: string;
  value: number | null | undefined;
  avg: number | null | undefined;
  tone: "up" | "down";
}) {
  const color = tone === "up" ? "text-emerald-500" : "text-rose-500";
  const Icon = tone === "up" ? ArrowDownLeft : ArrowUpRight;
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className={`h-3 w-3 ${color}`} />
        {label}
      </div>
      <div className={`mt-1 text-base font-bold tabular-nums ${color}`}>{formatVnd(value)}</div>
      <div className="text-[11px] text-muted-foreground tabular-nums">avg {formatVnd(avg)}</div>
    </div>
  );
}

export function P2PWidget() {
  const { data, isLoading } = useGetP2PQuery();

  const buy = data?.buy.best ?? null;
  const sell = data?.sell.best ?? null;
  const mid = buy != null && sell != null ? (buy + sell) / 2 : buy ?? sell;
  const bps = mid && data?.spread != null ? (data.spread / mid) * 10000 : null;

  return (
    <Card className="relative overflow-hidden border-none glass card-hover shadow-sm animate-fade-in">
      {/* USDT-tinted ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-500/10 blur-3xl"
      />

      <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-6">
        {/* Identity + live status */}
        <div className="flex items-center gap-3 sm:w-44 sm:flex-shrink-0">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-xl font-black text-emerald-500">
            ₮
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1 text-base font-bold tracking-tight">
              USDT
              <span className="font-medium text-muted-foreground">/ VND</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Binance P2P · Live
            </div>
          </div>
        </div>

        {/* Mid-price hero */}
        <div className="sm:border-l sm:border-border/50 sm:pl-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Mid price
          </div>
          {isLoading ? (
            <Skeleton className="mt-1 h-9 w-40" />
          ) : (
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-xl font-medium text-muted-foreground">₫</span>
              <span className="text-3xl font-black tracking-tight tabular-nums">
                {mid == null ? "—" : Math.round(mid).toLocaleString("vi-VN")}
              </span>
            </div>
          )}
        </div>

        {/* Buy / Sell / Spread rails */}
        {isLoading ? (
          <div className="grid grid-cols-3 gap-4 sm:ml-auto sm:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 sm:ml-auto sm:gap-6">
            <RateStat label="Buy" value={buy} avg={data?.buy.avg} tone="up" />
            <RateStat label="Sell" value={sell} avg={data?.sell.avg} tone="down" />
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Spread
              </div>
              <div className="mt-1 text-base font-bold tabular-nums">{formatVnd(data?.spread)}</div>
              <div className="text-[11px] text-muted-foreground tabular-nums">
                {bps == null ? "—" : `${bps.toFixed(1)} bps`}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
