import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Bitcoin, TrendingUp, TrendingDown, ArrowRight, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PublicAsset {
  symbol: string
  name: string
  img_url: string
  price: number | null
  percentChange: number | null
  allocation: number
  value: number | null
  amount: number | null
}

interface PublicPortfolio {
  name: string
  share_amounts: boolean
  updated_at: string
  totalValue: number | null
  assets: PublicAsset[]
}

const BAR_COLORS = [
  "bg-orange-500",
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-amber-500",
]

async function fetchPublicPortfolio(token: string): Promise<PublicPortfolio | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/portfolio/${token}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json?.data ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>
}): Promise<Metadata> {
  const { token } = await params
  const portfolio = await fetchPublicPortfolio(token)
  if (!portfolio) return { title: "Portfolio not found" }
  const top = portfolio.assets
    .slice(0, 3)
    .map((a) => a.symbol.toUpperCase())
    .join(", ")
  return {
    title: `${portfolio.name} — Live Portfolio`,
    description: `A live crypto portfolio tracked on CryptoFolio${top ? `: ${top}` : ""}. See the full allocation and performance.`,
    openGraph: {
      title: `${portfolio.name} — Live Portfolio | CryptoFolio`,
      description: `Live allocation${top ? ` across ${top}` : ""} — tracked with CryptoFolio.`,
    },
  }
}

function formatPrice(value: number | null) {
  if (value == null) return "—"
  if (value >= 1) return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  return `$${Number(value).toPrecision(3)}`
}

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const portfolio = await fetchPublicPortfolio(token)
  if (!portfolio) notFound()

  const assets = portfolio.assets ?? []

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Aurora atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-primary/20 blur-3xl dark:bg-primary/15" />
        <div className="absolute top-1/2 -right-48 h-[520px] w-[520px] rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-500/10" />
      </div>

      <div className="relative container max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Brand header */}
        <header className="flex items-center justify-between mb-8 animate-fade-in" style={{ opacity: 0 }}>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground shadow-lg shadow-primary/20">
              <Bitcoin className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight gradient-text">CryptoFolio</span>
          </Link>
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <Link href="/login">
              Track your own
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </header>

        {/* Portfolio card */}
        <main
          className="glass-morphism rounded-3xl p-6 sm:p-8 shadow-2xl animate-fade-in"
          style={{ animationDelay: "120ms", opacity: 0 }}
        >
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight truncate">{portfolio.name}</h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-500 flex-shrink-0">
                  <Radio className="h-3 w-3" />
                  Live
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Read-only view · prices refresh automatically
              </p>
            </div>
            {portfolio.share_amounts && portfolio.totalValue != null && (
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
                  Total Value
                </p>
                <p className="text-2xl sm:text-3xl font-black tracking-tighter tabular-nums">
                  $
                  {portfolio.totalValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Stacked allocation bar */}
          {assets.length > 0 && (
            <div className="flex h-2.5 w-full rounded-full overflow-hidden mb-8">
              {assets.map((asset, i) => (
                <div
                  key={asset.symbol}
                  className={`${BAR_COLORS[i % BAR_COLORS.length]} first:rounded-l-full last:rounded-r-full`}
                  style={{ width: `${asset.allocation}%` }}
                  title={`${asset.symbol.toUpperCase()} ${asset.allocation}%`}
                />
              ))}
            </div>
          )}

          {/* Holdings */}
          {assets.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              This portfolio has no assets yet.
            </p>
          ) : (
            <ul className="space-y-4">
              {assets.map((asset, i) => {
                const up = (asset.percentChange ?? 0) >= 0
                return (
                  <li
                    key={asset.symbol}
                    className="flex items-center gap-3 sm:gap-4 animate-fade-in"
                    style={{ animationDelay: `${240 + i * 80}ms`, opacity: 0 }}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${BAR_COLORS[i % BAR_COLORS.length]}`}
                    />
                    {asset.img_url ? (
                      <Image
                        src={asset.img_url}
                        alt={asset.name}
                        width={36}
                        height={36}
                        className="rounded-full flex-shrink-0"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-bold flex-shrink-0">
                        {asset.symbol.toUpperCase().slice(0, 2)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">{asset.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {asset.symbol.toUpperCase()} · {formatPrice(asset.price)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-sm tabular-nums">{asset.allocation}%</p>
                      {asset.percentChange != null && (
                        <p
                          className={`text-xs font-semibold tabular-nums inline-flex items-center gap-0.5 ${
                            up ? "text-emerald-500" : "text-red-500"
                          }`}
                        >
                          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {up ? "+" : ""}
                          {Number(asset.percentChange).toFixed(2)}%
                        </p>
                      )}
                    </div>
                    {asset.value != null && (
                      <div className="hidden sm:block text-right w-28 flex-shrink-0">
                        <p className="font-semibold text-sm tabular-nums">
                          ${asset.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                        {asset.amount != null && (
                          <p className="text-xs text-muted-foreground tabular-nums">
                            {Number(asset.amount).toFixed(4)}
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </main>

        {/* CTA banner */}
        <div
          className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in"
          style={{ animationDelay: "500ms", opacity: 0 }}
        >
          <div>
            <p className="font-bold text-sm sm:text-base">Want a live page like this for your portfolio?</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Track every coin across exchanges — with AI analysis and alerts built in.
            </p>
          </div>
          <Button asChild className="gap-2 flex-shrink-0 shadow-lg shadow-primary/25">
            <Link href="/register">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
