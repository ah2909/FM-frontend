"use client";

import { useState } from "react";
import { toast } from "sonner";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ShieldCheck, 
  Info,
  Target,
  BarChart3,
  Zap,
  CheckCircle2,
  XCircle,
  Activity,
  PieChart
} from "lucide-react";

import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { useGetPortfolioAnalysisQuery } from "@/lib/store/services/portfolio-api";
import { useWebSocketEvent } from "@/hooks/useWebSocketEvent";

// Sub-components
import { StatCard } from "@/components/analyze/stat-card";
import { AlertCard, type Alert } from "@/components/analyze/alert-card";
import { RiskScoreGauge } from "@/components/analyze/risk-score-gauge";
import { PerformerItem } from "@/components/analyze/performer-item";
import { RecommendationCard } from "@/components/analyze/recommendation-card";
import { AssetBreakdownTable } from "@/components/analyze/asset-breakdown-table";
import { LoadingSkeleton } from "@/components/analyze/loading-skeleton";
import { AnalyzingInterface } from "@/components/analyze/analyzing-interface";

// Types
interface Performer {
  symbol: string;
  pnl_pct: number;
  reason: string;
}

interface AssetPnl {
  symbol: string;
  invested: number;
  current: number;
  pnl: number;
  pnl_pct: number;
}

interface PnlAnalysis {
  total_invested: number;
  total_current_value: number;
  unrealized_pnl: number;
  unrealized_pnl_pct: number;
  per_asset: AssetPnl[];
}

interface VolatilityRisk {
  overall_volatility: string;
  assets_overbought: string[];
  assets_oversold: string[];
}

interface ConcentrationRisk {
  herfindahl_index: number;
  allocations: { symbol: string; percentage: number; flag: string }[];
}

interface RiskAssessment {
  pnl_analysis: PnlAnalysis;
  volatility_risk: VolatilityRisk;
  risk_score: number;
  concentration_risk: ConcentrationRisk;
  summary: string;
}

interface Insight {
  market_trend_alignment: string;
  recommendations: string[];
  best_performers: Performer[];
  worst_performers: Performer[];
}

interface PortfolioAnalysis {
  risk_assessment: RiskAssessment;
  alerts: Alert[];
  insights: Insight;
}


export default function AnalyzePage() {
  const { isLoading: isApiLoading} = useGetPortfolioAnalysisQuery();
  const [analysis, setAnalysis] = useState<PortfolioAnalysis | null>(null);
  const [isWaitingForWs, setIsWaitingForWs] = useState(true);

  useWebSocketEvent<{ data: PortfolioAnalysis }>(
    "portfolio-analysis",
    "",
    (payload) => {
      console.log("Received portfolio-analysis update:", payload);
      const newData = payload.data;
      setAnalysis(newData);
      setIsWaitingForWs(false);
      toast.success("Analysis updated in real-time");
    }
  );

  const isWaitingAnalysis = isWaitingForWs && !analysis;

  if (isApiLoading) {
    return <LoadingSkeleton text={"Crunching numbers and market data..."} />;
  }

  if (isWaitingAnalysis) {
    return <AnalyzingInterface />;
  }

  // Deeply safe field extraction with defaults for every single used property
  const risk: RiskAssessment = {
    pnl_analysis: {
      total_invested: analysis?.risk_assessment?.pnl_analysis?.total_invested ?? 0,
      total_current_value: analysis?.risk_assessment?.pnl_analysis?.total_current_value ?? 0,
      unrealized_pnl: analysis?.risk_assessment?.pnl_analysis?.unrealized_pnl ?? 0,
      unrealized_pnl_pct: analysis?.risk_assessment?.pnl_analysis?.unrealized_pnl_pct ?? 0,
      per_asset: analysis?.risk_assessment?.pnl_analysis?.per_asset || [],
    },
    volatility_risk: {
      overall_volatility: analysis?.risk_assessment?.volatility_risk?.overall_volatility || 'neutral',
      assets_overbought: analysis?.risk_assessment?.volatility_risk?.assets_overbought || [],
      assets_oversold: analysis?.risk_assessment?.volatility_risk?.assets_oversold || [],
    },
    risk_score: analysis?.risk_assessment?.risk_score ?? 0,
    concentration_risk: {
      herfindahl_index: analysis?.risk_assessment?.concentration_risk?.herfindahl_index ?? 0,
      allocations: analysis?.risk_assessment?.concentration_risk?.allocations || [],
    },
    summary: analysis?.risk_assessment?.summary || 'Strategic analysis is being generated...'
  };

  const alerts = analysis?.alerts || [];

  const insights: Insight = {
    market_trend_alignment: analysis?.insights?.market_trend_alignment || 'neutral',
    recommendations: analysis?.insights?.recommendations || [],
    best_performers: analysis?.insights?.best_performers || [],
    worst_performers: analysis?.insights?.worst_performers || []
  };

  const mobileMenuItems = [
    {
      label: "AI Model",
      component: (
        <Badge variant="outline" className="bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px] py-1.5 px-3 w-full justify-start">
            <Zap className="size-3 mr-1.5" /> Google Gemini
        </Badge>
      )
    },
    ...(isWaitingAnalysis ? [{
      label: "Status",
      component: (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-none font-bold uppercase tracking-widest text-[10px] py-1.5 px-3 w-full justify-start">
            <Activity className="size-3 mr-1.5 animate-spin" /> Analyzing...
        </Badge>
      )
    }] : [])
  ];

  return (
    <BaseShell>
      <BaseHeader 
        heading="Portfolio Analysis" 
        text="Deep dive into your risk metrics and AI investment recommendations"
        mobileMenuItems={mobileMenuItems}
      >
        <div className="flex items-center gap-2">
            {isWaitingAnalysis && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-none font-bold uppercase tracking-widest text-[10px] py-1.5 px-3">
                  <Activity className="size-3 mr-1.5 animate-spin" /> Analyzing...
              </Badge>
            )}
            <Badge variant="outline" className="bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px] py-1.5 px-3">
                <Zap className="size-3 mr-1.5" /> Google Gemini
            </Badge>
        </div>
      </BaseHeader>

      <div className="space-y-8 pb-12">
        {/* Core Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Invested" 
            value={`$${risk.pnl_analysis.total_invested.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            subValue="Principal capital"
            icon={Target}
            colorClass="bg-indigo-500"
          />
          <StatCard 
            title="Equity Value" 
            value={`$${risk.pnl_analysis.total_current_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subValue={`${risk.pnl_analysis.unrealized_pnl >= 0 ? "+" : ""}${risk.pnl_analysis.unrealized_pnl.toLocaleString()} Unrealized`}
            trend={risk.pnl_analysis.unrealized_pnl >= 0 ? "up" : "down"}
            icon={Activity}
            colorClass="bg-primary"
          />
          <StatCard 
            title="Portfolio Yield" 
            value={`${risk.pnl_analysis.unrealized_pnl_pct.toFixed(2)}%`}
            subValue="Since initial deposit"
            trend={risk.pnl_analysis.unrealized_pnl_pct >= 0 ? "up" : "down"}
            icon={BarChart3}
            colorClass="bg-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column: Risk and Strategy */}
          <div className="xl:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-morphism border-none shadow-xl flex flex-col items-center justify-center p-6 text-center group md:col-span-1">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Portfolio Integrity</CardTitle>
                </CardHeader>
                <RiskScoreGauge score={risk.risk_score} />
                <p className="text-[10px] text-muted-foreground font-medium mt-2 max-w-[150px]">
                  Based on current volatility, concentration (HHI: {risk.concentration_risk.herfindahl_index.toFixed(2)}), and technical indicators.
                </p>
              </Card>

              <Card className="glass-morphism border-none shadow-xl md:col-span-2 overflow-hidden flex flex-col">
                <CardHeader className="pb-4 bg-white/5 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                        <ShieldCheck className="size-4" />
                      </div>
                      <CardTitle className="text-sm font-black uppercase tracking-widest">Analysis Executive Summary</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-6 relative">
                  <div className="absolute top-4 right-4 opacity-5">
                      <Info className="size-24" />
                  </div>
                  <div className="space-y-4 relative z-10">
                    <p className="text-base font-bold leading-relaxed italic text-foreground/90">
                      "{risk.summary}"
                    </p>
                    <div className="pt-4 border-t border-white/5">
                      <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Concentration Analysis</h5>
                      <div className="flex flex-wrap gap-2">
                          {risk.concentration_risk.allocations.length > 0 ? (
                            risk.concentration_risk.allocations.map((a) => (
                                <div key={a.symbol} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-colors">
                                    <span className="text-[10px] font-black">{a.symbol}</span>
                                    <span className="text-[10px] font-mono text-muted-foreground">{a.percentage.toFixed(1)}%</span>
                                    <div className={cn("size-1.5 rounded-full", 
                                      a.flag === 'safe' ? "bg-green-500" : 
                                      a.flag === 'moderate' ? "bg-yellow-500" : 
                                      a.flag === 'high' ? "bg-orange-500" : "bg-red-500"
                                    )} />
                                </div>
                            ))
                          ) : (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 border-dashed">
                              <span className="text-[10px] font-black uppercase text-muted-foreground/50">No concentration risk</span>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <RecommendationCard recommendations={insights.recommendations} />
            
            <AssetBreakdownTable 
              pnlAnalysis={risk.pnl_analysis} 
              volatilityRisk={risk.volatility_risk} 
            />
          </div>

          {/* Right Column: Alerts and Trends */}
          <div className="xl:col-span-4 space-y-6">
            <Card className="glass-morphism border-none shadow-xl h-fit">
              <CardHeader className="pb-4 border-b border-white/5 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                    <AlertTriangle className="size-4" />
                  </div>
                  <CardTitle className="text-sm font-black uppercase tracking-widest">Active Alerts</CardTitle>
                </div>
                <Badge variant="destructive" className="font-black text-[10px] px-2 py-0 h-5 border-none bg-red-500/20 text-red-500">{alerts.length}</Badge>
              </CardHeader>
              <CardContent className="pt-4 px-4 space-y-4">
                {alerts.length > 0 ? (
                  alerts.map((alert: Alert, idx: number) => (
                    <AlertCard key={`${alert.asset}-${idx}`} alert={alert} />
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center gap-3 text-muted-foreground opacity-30">
                    <CheckCircle2 className="size-10" />
                    <p className="text-xs font-black uppercase tracking-widest">No active alerts</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6">
              <Card className="glass border-none shadow-sm h-full overflow-hidden">
                <CardHeader className="pb-3 border-b border-white/5 bg-green-500/5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-green-500/10 text-green-500">
                      <TrendingUp className="size-4" />
                    </div>
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em]">Alpha Leaders</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 px-3 space-y-3">
                  {insights.best_performers.length > 0 ? (
                    insights.best_performers.map((p) => (
                      <PerformerItem key={p.symbol} p={p} type="best" />
                    ))
                  ) : (
                    <div className="py-8 flex flex-col items-center gap-2 text-muted-foreground opacity-30">
                      <TrendingUp className="size-8" />
                      <p className="text-[8px] font-black uppercase tracking-widest">No top performers</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass border-none shadow-sm h-full overflow-hidden">
                <CardHeader className="pb-3 border-b border-white/5 bg-red-500/5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500">
                      <TrendingDown className="size-4" />
                    </div>
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em]">Risk Exposure</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 px-3 space-y-3">
                  {insights.worst_performers.length > 0 ? (
                    insights.worst_performers.map((p) => (
                      <PerformerItem key={p.symbol} p={p} type="worst" />
                    ))
                  ) : (
                    <div className="py-8 flex flex-col items-center gap-2 text-muted-foreground opacity-30">
                      <TrendingDown className="size-8" />
                      <p className="text-[8px] font-black uppercase tracking-widest">No major risks</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </BaseShell>
  );
}
