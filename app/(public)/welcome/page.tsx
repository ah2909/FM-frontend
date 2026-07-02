import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowRight,
  Sparkles,
  RefreshCw,
  Zap,
  BrainCircuit,
  BellRing,
  TrendingUp,
} from "lucide-react"

const FEATURES = [
  {
    icon: RefreshCw,
    title: "Exchange auto-sync",
    text: "Connect Binance and more — balances and trades import themselves.",
    tint: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Zap,
    title: "Real-time prices",
    text: "Live websocket tickers, not five-minute-old snapshots.",
    tint: "bg-amber-500/10 text-amber-500",
  },
  {
    icon: BrainCircuit,
    title: "AI portfolio analysis",
    text: "Risk scores, concentration checks, and token research on demand.",
    tint: "bg-emerald-500/10 text-emerald-500",
  },
  {
    icon: BellRing,
    title: "Telegram alerts",
    text: "Price alerts delivered where you already are.",
    tint: "bg-violet-500/10 text-violet-500",
  },
]

const DEMO_ASSETS = [
  { symbol: "BTC", name: "Bitcoin", alloc: 52, change: "+3.2%", color: "bg-orange-500" },
  { symbol: "ETH", name: "Ethereum", alloc: 31, change: "+1.8%", color: "bg-indigo-500" },
  { symbol: "SOL", name: "Solana", alloc: 17, change: "+6.4%", color: "bg-emerald-500" },
]

function DemoPortfolioCard() {
  return (
    <div className="relative">
      {/* Floating accent chips */}
      <div className="absolute -top-5 -right-3 sm:-right-8 z-10 animate-float">
        <div className="glass rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <span className="text-sm font-bold tabular-nums text-emerald-500">+12.4%</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            this month
          </span>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-3 sm:-left-8 z-10 animate-float-delayed">
        <div className="glass rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-muted-foreground">Live · 3 exchanges synced</span>
        </div>
      </div>

      {/* Mock portfolio card */}
      <div className="glass-morphism rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70">
              Portfolio Value
            </p>
            <p className="text-3xl sm:text-4xl font-black tracking-tighter tabular-nums mt-1">
              $48,256.90
            </p>
          </div>
          <span className="badge-gain">
            <TrendingUp className="h-3 w-3" />
            +$1,204 today
          </span>
        </div>

        {/* Animated demo chart */}
        <svg viewBox="0 0 400 120" className="w-full h-24 sm:h-28 mb-6" aria-hidden>
          <defs>
            <linearGradient id="welcome-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary) / 0.25)" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0)" />
            </linearGradient>
          </defs>
          <path
            d="M0,95 C40,88 60,70 90,74 C120,78 140,52 170,48 C200,44 220,62 250,54 C280,46 300,24 340,20 C365,17 385,14 400,10 L400,120 L0,120 Z"
            fill="url(#welcome-fill)"
            className="animate-fade-in-late"
            style={{ opacity: 0 }}
          />
          <path
            d="M0,95 C40,88 60,70 90,74 C120,78 140,52 170,48 C200,44 220,62 250,54 C280,46 300,24 340,20 C365,17 385,14 400,10"
            pathLength="1"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="animate-draw"
          />
        </svg>

        {/* Demo holdings */}
        <div className="space-y-3">
          {DEMO_ASSETS.map((asset, i) => (
            <div
              key={asset.symbol}
              className="flex items-center gap-3 animate-fade-in"
              style={{ animationDelay: `${600 + i * 150}ms`, opacity: 0 }}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${asset.color} text-white text-[10px] font-bold flex-shrink-0`}
              >
                {asset.symbol.slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{asset.name}</span>
                  <span className="font-bold tabular-nums text-emerald-500">{asset.change}</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${asset.color}`}
                    style={{ width: `${asset.alloc}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-medium text-muted-foreground tabular-nums w-8 text-right">
                {asset.alloc}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Aurora atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-primary/20 blur-3xl dark:bg-primary/15" />
        <div className="absolute top-1/3 -right-48 h-[520px] w-[520px] rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute -bottom-48 left-1/4 h-[420px] w-[420px] rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-500/10" />
      </div>

      <main className="relative container max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-0 lg:min-h-screen lg:flex lg:items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          {/* Pitch */}
          <div className="max-w-xl">
            <div
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 animate-fade-in"
              style={{ opacity: 0 }}
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Welcome to CryptoFolio
              </span>
            </div>

            <h1
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.05] animate-fade-in"
              style={{ animationDelay: "120ms", opacity: 0 }}
            >
              Every coin.
              <br />
              Every exchange.
              <br />
              <span className="gradient-text">One clear picture.</span>
            </h1>

            <p
              className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed animate-fade-in"
              style={{ animationDelay: "240ms", opacity: 0 }}
            >
              Create your first portfolio to unlock live tracking, AI-powered analysis, and
              alerts that find you before the market moves on.
            </p>

            <div
              className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-in"
              style={{ animationDelay: "360ms", opacity: 0 }}
            >
              <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/25 text-base h-12 px-7">
                <Link href="/portfolios/new">
                  Create your portfolio
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <span className="text-sm text-muted-foreground">Takes under a minute</span>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((feature, i) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-3 rounded-2xl p-3 -m-1 transition-colors hover:bg-muted/40 animate-fade-in"
                  style={{ animationDelay: `${480 + i * 100}ms`, opacity: 0 }}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0 ${feature.tint}`}
                  >
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold leading-tight">{feature.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product mock */}
          <div className="animate-fade-in px-3 sm:px-0" style={{ animationDelay: "300ms", opacity: 0 }}>
            <DemoPortfolioCard />
          </div>
        </div>
      </main>
    </div>
  )
}
