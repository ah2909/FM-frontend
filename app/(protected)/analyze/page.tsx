"use client";

import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ShieldCheck, 
  Info,
  Lightbulb,
  Target,
  BarChart3,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Globe
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// --- Sub-components for better organization ---

const StatCard = ({ title, value, subValue, icon: Icon, trend, colorClass }: any) => (
  <Card className="glass border-none shadow-sm card-hover overflow-hidden relative">
    <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10 rounded-full", colorClass)} />
    <CardHeader className="pb-2 flex flex-row items-center justify-between">
      <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</CardTitle>
      <Icon className={cn("size-4", trend === 'up' ? "text-green-500" : trend === 'down' ? "text-red-500" : "text-primary")} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-black tracking-tight">{value}</div>
      {subValue && (
        <div className={cn("text-xs font-bold mt-1", trend === 'up' ? "text-green-500" : trend === 'down' ? "text-red-500" : "text-muted-foreground")}>
          {subValue}
        </div>
      )}
    </CardContent>
  </Card>
);

const PerformerCard = ({ title, performers, icon: Icon, type }: any) => (
  <Card className="glass border-none shadow-sm h-full">
    <CardHeader className="pb-3 border-b border-white/5">
      <div className="flex items-center gap-2">
        <Icon className={cn("size-5", type === 'best' ? "text-green-500" : "text-red-500")} />
        <CardTitle className="text-sm font-bold uppercase tracking-wide">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="pt-4 px-3">
      <div className="space-y-3">
        {performers?.map((p: any) => (
            <div key={p.symbol} className="p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-xs uppercase tracking-tighter">{p.symbol}</span>
                    <Badge variant={type === 'best' ? "outline" : "destructive"} className={cn("text-[10px] font-bold px-1.5 py-0 h-4 border-none", type === 'best' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
                        {p.pnl_pct >= 0 ? "+" : ""}{p.pnl_pct.toFixed(2)}%
                    </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground/80 leading-relaxed font-medium line-clamp-2 italic">"{p.reason}"</p>
            </div>
        ))}
        {(!performers || performers.length === 0) && (
            <div className="text-center py-6 text-muted-foreground text-xs font-medium">No performance data available</div>
        )}
      </div>
    </CardContent>
  </Card>
);

const RecommendationCard = ({ recommendations }: { recommendations: string[] }) => (
  <Card className="glass-morphism border-none shadow-xl overflow-hidden group">
    <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-transparent">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/20 text-primary animate-pulse">
            <Lightbulb className="size-5" />
        </div>
        <div>
            <CardTitle className="text-lg font-black tracking-tight">Active Recommendations</CardTitle>
            <CardDescription className="text-xs font-medium opacity-80">AI-powered insights to optimize your portfolio</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="grid gap-4">
        {recommendations?.map((rec, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all hover:translate-x-1 group">
             <div className="flex-shrink-0 size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs group-hover:bg-primary group-hover:text-white transition-colors">
                 {i + 1}
             </div>
             <p className="text-sm font-medium leading-relaxed group-hover:text-foreground transition-colors">{rec}</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ScoreCircular = ({ score, label, color, description }: any) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-4 group">
            <div className="relative size-32">
                {/* Background Ring */}
                <svg className="size-full -rotate-90 transform">
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        className="text-white/5"
                    />
                    {/* Progress Ring */}
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke={color}
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset: offset }}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black tracking-tighter leading-none">{score}</span>
                    <span className="text-[8px] font-black uppercase text-muted-foreground/60 mt-0.5 tracking-tighter">/ 100</span>
                </div>
            </div>
            <div className="text-center">
                <h4 className="font-black text-sm uppercase tracking-widest">{label}</h4>
                <p className="text-[10px] text-muted-foreground mt-1 max-w-[120px] font-medium leading-tight">{description}</p>
            </div>
        </div>
    );
};

// --- Dummy data following the provided structure ---
const DUMMY_DATA = {
    risk_assessment: {
        risk_score: 35,
        concentration_risk: {
            allocations: [
                { symbol: "ETH", percentage: 42.5, flag: "safe" },
                { symbol: "BTC", percentage: 28.1, flag: "safe" },
                { symbol: "SOL", percentage: 15.4, flag: "moderate" },
                { symbol: "LINK", percentage: 8.2, flag: "safe" },
                { symbol: "UNI", percentage: 5.8, flag: "safe" },
            ],
            herfindahl_index: 0.28
        },
        volatility_risk: {
            assets_overbought: ["SOL", "NEAR"],
            assets_oversold: ["ETH"],
            high_bb_volatility: ["SOL"],
            overall_volatility: "moderate"
        },
        pnl_analysis: {
            total_invested: 12450.50,
            total_current_value: 15820.75,
            unrealized_pnl: 3370.25,
            unrealized_pnl_pct: 27.06,
        },
        summary: "The portfolio shows healthy growth but is starting to show signs of concentration in SOL, which is currently in an overbought RSI territory. Diversification remains strong with a focus on blue-chip Layer 1s and DeFi."
    },
    insights: {
        best_performers: [
            { symbol: "SOL", pnl_pct: 142.50, reason: "Strong ecosystem growth and TVL expansion over the last quarter." },
            { symbol: "ETH", pnl_pct: 22.15, reason: "Consistent accumulation and institutional interest in L2 scaling." },
            { symbol: "PENDLE", pnl_pct: 88.40, reason: "Yield stripping demand increasing within the re-staking narrative." }
        ],
        worst_performers: [
            { symbol: "LDO", pnl_pct: -18.40, reason: "Governance concerns and competition from decentralized liquid staking." },
            { symbol: "ARB", pnl_pct: -12.10, reason: "Token unlocks and increased competition among optimistic rollups." }
        ],
        diversification_score: 74,
        diversification_notes: "The portfolio is well-balanced across L1s, L2s, and Oracle sectors. Adding exposure to RWA or DePIN could push this score into the 80s.",
        market_trend_alignment: "aligned",
        recommendations: [
            "Consider take-profit on SOL as technicals signal an overextended weekly run.",
            "Rebalance L1 exposure by rotating 5% into BTC to hedge against potential alt-market drawdown.",
            "Implement a trailing stop-loss on PENDLE to protect unrealized gains during volatile cycles.",
            "Investigate sector rotation into RWA (Real World Assets) to lower overall asset correlation."
        ]
    }
};

export default function AnalyzePage() {
  const analysis = DUMMY_DATA;

  const getRiskColor = (score: number) => {
    if (score < 30) return "#22c55e"; // Low risk
    if (score < 60) return "#eab308"; // Medium risk
    return "#ef4444"; // High risk
  };

  const getDiversificationColor = (score: number) => {
    if (score > 70) return "#22c55e"; 
    if (score > 40) return "#eab308";
    return "#ef4444";
  };

  const pnl = analysis.risk_assessment?.pnl_analysis;
  const insights = analysis.insights;
  const risk = analysis.risk_assessment;

  return (
    <BaseShell>
      <BaseHeader 
        heading="Portfolio Analysis" 
        text="Deep dive into your risk metrics and AI investment recommendations"
      >
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px] py-1 px-3">
                <Zap className="size-3 mr-1" /> AI Powered
            </Badge>
            <Badge variant="outline" className="bg-muted/40 border-none font-bold uppercase tracking-widest text-[10px] py-1 px-3">
                <Clock className="size-3 mr-1" /> Real-time
            </Badge>
        </div>
      </BaseHeader>

      <div className="space-y-8">
        {/* Core Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Invested" 
            value={`$${Number(pnl?.total_invested || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            icon={Target}
            colorClass="bg-primary"
          />
          <StatCard 
            title="Current Value" 
            value={`$${Number(pnl?.total_current_value || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            subValue={`${pnl?.unrealized_pnl >= 0 ? "+" : ""}${pnl?.unrealized_pnl_pct?.toFixed(2)}% Performance`}
            trend={pnl?.unrealized_pnl >= 0 ? "up" : "down"}
            icon={BarChart3}
            colorClass="bg-blue-500"
          />
          <StatCard 
            title="Volatility Risk" 
            value={risk?.volatility_risk?.overall_volatility?.toUpperCase() || "N/A"}
            subValue={`${risk?.volatility_risk?.assets_overbought?.length || 0} Overbought Assets`}
            icon={Zap}
            colorClass="bg-yellow-500"
          />
          <StatCard 
            title="Trend Alignment" 
            value={insights?.market_trend_alignment?.replace('_', ' ')?.toUpperCase() || "N/A"}
            icon={Globe}
            colorClass="bg-indigo-500"
          />
        </div>

        {/* Risk & Diversification Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 glass-morphism border-none shadow-xl flex flex-col items-center justify-center p-8 text-center group">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-12 w-full">
                <ScoreCircular 
                    score={risk?.risk_score || 0} 
                    label="Risk Index" 
                    color={getRiskColor(risk?.risk_score || 0)}
                    description="Aggregate risk based on volatility and loss"
                />
                <ScoreCircular 
                    score={insights?.diversification_score || 0} 
                    label="Diversification" 
                    color={getDiversificationColor(insights?.diversification_score || 0)}
                    description="Asset spread and sector exposure effectiveness"
                />
              </div>
          </Card>

          <Card className="lg:col-span-2 glass-morphism border-none shadow-lg overflow-hidden flex flex-col">
            <CardHeader className="pb-4 bg-white/5">
                <CardTitle className="text-xl font-bold tracking-tight">System Summary</CardTitle>
                <CardDescription className="text-xs font-medium">Automatic summary of your portfolio health</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-6 relative">
              <div className="absolute top-6 left-6 opacity-10">
                  <Info className="size-16" />
              </div>
              <p className="text-base font-medium leading-relaxed italic text-foreground/90 relative z-10">
                "{risk?.summary || insights?.diversification_notes}"
              </p>
              
              <div className="mt-8 pt-6 border-t border-white/5">
                <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Concentration Check</h5>
                <div className="flex flex-wrap gap-2">
                    {risk?.concentration_risk?.allocations?.slice(0, 10).map((a: any) => (
                        <div key={a.symbol} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                            <span className="text-[10px] font-black">{a.symbol}</span>
                            <Badge variant="outline" className={cn("text-[8px] font-bold px-1 h-3.5 border-none", a.flag === 'safe' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
                                {a.flag?.toUpperCase()}
                            </Badge>
                        </div>
                    ))}
                    {(risk?.concentration_risk?.allocations?.length || 0) > 10 && (
                        <span className="text-[10px] font-bold text-muted-foreground flex items-center px-2">+{risk.concentration_risk.allocations.length - 10} more</span>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance & Recommendations */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
            <PerformerCard 
              title="Best Performers" 
              performers={insights?.best_performers?.slice(0, 5)} 
              icon={TrendingUp} 
              type="best" 
            />
            <PerformerCard 
              title="Worst Performers" 
              performers={insights?.worst_performers?.slice(0, 5)} 
              icon={TrendingDown} 
              type="worst" 
            />
          </div>
          <div className="xl:col-span-2">
            <RecommendationCard recommendations={insights?.recommendations} />
          </div>
        </div>
      </div>
    </BaseShell>
  );
}
