"use client";

import { useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Zap,
  Activity,
} from "lucide-react";

import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { useGetPortfolioAnalysisQuery } from "@/lib/store/services/portfolio-api";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setHasRequested } from "@/lib/store/features/analyze-slice";

import { AlertCard }            from "@/components/analyze/alert-card";
import { RiskScoreGauge }       from "@/components/analyze/risk-score-gauge";
import { PerformerItem }        from "@/components/analyze/performer-item";
import { LoadingSkeleton }      from "@/components/analyze/loading-skeleton";
import { AnalyzingInterface }   from "@/components/analyze/analyzing-interface";
import { ConcentrationAnalysis } from "@/components/analyze/concentration-analysis";

import type {
  RiskAssessment,
  Insight,
  Alert,
} from "@/lib/store/features/analyze-slice";

/* ─── helpers ────────────────────────────────────────────────── */

const fmt = (n: number, dec = 2) =>
  Math.abs(n).toLocaleString(undefined, {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });

/* ─── reusable panel shell ───────────────────────────────────── */

function Panel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-5 flex flex-col",
        "dark:bg-card dark:border-border/40",
        className
      )}
    >
      {children}
    </div>
  );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-3">
      {children}
    </p>
  );
}

/* ─── page ───────────────────────────────────────────────────── */

export default function AnalyzePage() {
  const dispatch = useAppDispatch();
  const { analysis, hasRequested } = useAppSelector((s) => s.analyze);

  const { isLoading } = useGetPortfolioAnalysisQuery(undefined, {
    skip: hasRequested,
  });

  useEffect(() => {
    if (!hasRequested) dispatch(setHasRequested());
  }, []);

  if (isLoading) return <LoadingSkeleton text="Crunching numbers and market data…" />;
  if (!analysis)  return <AnalyzingInterface />;

  /* ─── normalise ─────────────────────────────────────────── */
  const risk: RiskAssessment = {
    pnl_analysis: {
      total_invested:      analysis.risk_assessment?.pnl_analysis?.total_invested      ?? 0,
      total_current_value: analysis.risk_assessment?.pnl_analysis?.total_current_value ?? 0,
      unrealized_pnl:      analysis.risk_assessment?.pnl_analysis?.unrealized_pnl      ?? 0,
      unrealized_pnl_pct:  analysis.risk_assessment?.pnl_analysis?.unrealized_pnl_pct  ?? 0,
      per_asset:           analysis.risk_assessment?.pnl_analysis?.per_asset           || [],
    },
    volatility_risk: {
      overall_volatility: analysis.risk_assessment?.volatility_risk?.overall_volatility || "neutral",
      assets_overbought:  analysis.risk_assessment?.volatility_risk?.assets_overbought  || [],
      assets_oversold:    analysis.risk_assessment?.volatility_risk?.assets_oversold    || [],
    },
    risk_score:        analysis.risk_assessment?.risk_score ?? 0,
    concentration_risk:{
      herfindahl_index: analysis.risk_assessment?.concentration_risk?.herfindahl_index ?? 0,
      allocations:      analysis.risk_assessment?.concentration_risk?.allocations      || [],
    },
    summary: analysis.risk_assessment?.summary || "",
  };

  const alerts: Alert[] = analysis.alerts || [];
  const insights: Insight = {
    market_trend_alignment: analysis.insights?.market_trend_alignment || "neutral",
    recommendations:        analysis.insights?.recommendations        || [],
    best_performers:        analysis.insights?.best_performers        || [],
    worst_performers:       analysis.insights?.worst_performers       || [],
  };

  const pnl  = risk.pnl_analysis;
  const pnlUp = pnl.unrealized_pnl >= 0;

  const VOL_COLORS: Record<string, string> = {
    low:     "bg-emerald-500/10 text-emerald-400",
    medium:  "bg-yellow-500/10 text-yellow-400",
    high:    "bg-orange-500/10 text-orange-400",
    extreme: "bg-red-500/10 text-red-400",
  };

  const mobileMenuItems = [{
    label: "AI Model",
    component: (
      <Badge variant="outline" className="bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px] py-1.5 px-3 w-full justify-start">
        <Zap className="size-3 mr-1.5" /> Google Gemini
      </Badge>
    ),
  }];

  return (
    <BaseShell>
      <BaseHeader
        heading="Portfolio Analysis"
        text="Deep dive into your risk metrics and AI investment recommendations"
        mobileMenuItems={mobileMenuItems}
      >
        <Badge variant="outline" className="bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px] py-1.5 px-3">
          <Zap className="size-3 mr-1.5" /> Google Gemini
        </Badge>
      </BaseHeader>

      <div className="space-y-4 pb-12">

        {/* ══ ROW 1 — 4 panels ══════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* 1 · Risk Profile */}
          <Panel className="items-center text-center gap-2">
            <PanelLabel>Risk Profile</PanelLabel>
            <RiskScoreGauge score={risk.risk_score} />
            <div className="mt-2 flex flex-col items-center gap-1.5">
              <Badge
                variant="outline"
                className={cn(
                  "text-[9px] font-bold border-none px-2.5",
                  VOL_COLORS[risk.volatility_risk.overall_volatility] ?? "bg-muted text-muted-foreground"
                )}
              >
                Volatility: {risk.volatility_risk.overall_volatility}
              </Badge>
              {(risk.volatility_risk.assets_overbought.length > 0 || risk.volatility_risk.assets_oversold.length > 0) && (
                <div className="flex flex-wrap justify-center gap-1">
                  {risk.volatility_risk.assets_overbought.map((s) => (
                    <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-bold">{s}↑</span>
                  ))}
                  {risk.volatility_risk.assets_oversold.map((s) => (
                    <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">{s}↓</span>
                  ))}
                </div>
              )}
            </div>
          </Panel>

          {/* 2 · Total Value */}
          <Panel className="justify-between">
            <PanelLabel>Total Value</PanelLabel>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-4xl font-black tracking-tight font-mono">
                ${fmt(pnl.total_current_value)}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                Invested: <span className="text-foreground font-bold">${fmt(pnl.total_invested, 0)}</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-border/40">
              <Activity className="size-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {insights.market_trend_alignment.replace(/_/g, " ")}
              </span>
            </div>
          </Panel>

          {/* 3 · Unrealized P&L */}
          <Panel className="justify-between">
            <PanelLabel>Unrealized P&L</PanelLabel>
            <div className="flex-1 flex flex-col justify-center">
              <p className={cn("text-4xl font-black tracking-tight font-mono", pnlUp ? "text-emerald-400" : "text-red-400")}>
                {pnlUp ? "+" : "-"}${fmt(pnl.unrealized_pnl)}
              </p>
              <div className={cn("flex items-center gap-1 mt-1.5", pnlUp ? "text-emerald-400" : "text-red-400")}>
                {pnlUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                <span className="text-sm font-bold font-mono">
                  {pnlUp ? "+" : ""}{pnl.unrealized_pnl_pct.toFixed(2)}%
                </span>
                <span className="text-xs text-muted-foreground font-medium">since deposit</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-border/40">
              {pnlUp
                ? <TrendingUp  className="size-3 text-emerald-500" />
                : <TrendingDown className="size-3 text-red-500" />
              }
              <span className="text-[10px] text-muted-foreground font-medium">
                {pnlUp ? "Portfolio performing above cost" : "Portfolio below cost basis"}
              </span>
            </div>
          </Panel>

          {/* 4 · Concentration Analysis */}
          <Panel>
            <ConcentrationAnalysis
              allocations={risk.concentration_risk.allocations}
              herfindahl_index={risk.concentration_risk.herfindahl_index}
            />
          </Panel>
        </div>

        {/* ══ ROW 2 — 3 panels ══════════════════════════════════ */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Active Alerts */}
          <Panel className="gap-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-orange-400" />
                <PanelLabel>Active Alerts</PanelLabel>
              </div>
              <span className={cn(
                "text-[10px] font-black px-2 py-0.5 rounded-full",
                alerts.length > 0 ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
              )}>
                {alerts.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {alerts.length > 0 ? (
                alerts.map((alert: Alert, idx: number) => (
                  <AlertCard key={`${alert.asset}-${idx}`} alert={alert} />
                ))
              ) : (
                <div className="py-10 flex flex-col items-center gap-2 text-muted-foreground/30">
                  <CheckCircle2 className="size-8" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No active alerts</p>
                </div>
              )}
            </div>
          </Panel>

          {/* Recommendations */}
          <Panel className="gap-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="size-4 text-primary" />
                <PanelLabel>Recommendations</PanelLabel>
              </div>
              <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {insights.recommendations.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {insights.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-xl border border-border/50 bg-card/50 p-3 hover:border-primary/30 hover:bg-card transition-all group"
                >
                  <div className="size-5 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[9px] font-black shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {i + 1}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          {/* Asset Performance */}
          <Panel className="gap-0">
            <PanelLabel>Asset Performance</PanelLabel>

            {/* Top performers */}
            <div className="mb-1">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="size-3 text-emerald-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/70">
                  Top Performers
                </span>
              </div>
              <div>
                {insights.best_performers.length > 0 ? (
                  insights.best_performers.map((p) => (
                    <PerformerItem key={p.symbol} p={p} type="best" />
                  ))
                ) : (
                  <p className="text-[10px] text-muted-foreground/40 py-2 px-1">No data</p>
                )}
              </div>
            </div>

            <div className="my-2 border-t border-border/40" />

            {/* Worst performers */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingDown className="size-3 text-red-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-red-400/70">
                  Underperformers
                </span>
              </div>
              <div>
                {insights.worst_performers.length > 0 ? (
                  insights.worst_performers.map((p) => (
                    <PerformerItem key={p.symbol} p={p} type="worst" />
                  ))
                ) : (
                  <p className="text-[10px] text-muted-foreground/40 py-2 px-1">No data</p>
                )}
              </div>
            </div>
          </Panel>
        </div>

      </div>
    </BaseShell>
  );
}
