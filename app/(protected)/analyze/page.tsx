"use client";

import { useEffect } from "react";
import { Zap } from "lucide-react";

import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { useGetPortfolioAnalysisQuery } from "@/lib/store/services/portfolio-api";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setAnalysis } from "@/lib/store/features/analyze-slice";

import { LoadingSkeleton }       from "@/components/analyze/loading-skeleton";
import { AnalyzingInterface }    from "@/components/analyze/analyzing-interface";
import { ConcentrationAnalysis } from "@/components/analyze/concentration-analysis";
import { Panel }                 from "@/components/analyze/panel";
import { RiskProfilePanel }      from "@/components/analyze/risk-profile-panel";
import { TotalValuePanel }       from "@/components/analyze/total-value-panel";
import { UnrealizedPnlPanel }    from "@/components/analyze/unrealized-pnl-panel";
import { ActiveAlertsPanel }     from "@/components/analyze/active-alerts-panel";
import { RecommendationsPanel }  from "@/components/analyze/recommendations-panel";
import { AssetPerformancePanel } from "@/components/analyze/asset-performance-panel";

import type {
  RiskAssessment,
  Insight,
  Alert,
  PortfolioAnalysis,
} from "@/lib/store/features/analyze-slice";

// GET /portfolio/analyze returns a trigger ack (no analysis) until the LLM
// result lands via the `portfolio-analysis` WS event; cached results arrive
// complete. Only a fully-shaped payload should drive the UI.
const isCompleteAnalysis = (d: any): d is PortfolioAnalysis =>
  !!d && typeof d.risk_assessment === "object" && typeof d.insights === "object";

const GeminiBadge = ({ className }: { className?: string }) => (
  <Badge className={cn("bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px] py-1.5 px-3", className)}>
    <Zap className="size-3 mr-1.5" /> Google Gemini
  </Badge>
);

const mobileMenuItems = [{ label: "AI Model", component: <GeminiBadge className="w-full justify-start" /> }];

export default function AnalyzePage() {
  const dispatch = useAppDispatch();
  const { analysis } = useAppSelector((s) => s.analyze);

  const { data, isLoading } = useGetPortfolioAnalysisQuery();

  useEffect(() => {
    if (isCompleteAnalysis(data?.data) && !analysis) {
      dispatch(setAnalysis(data.data));
    }
  }, [data, analysis, dispatch]);

  const analysisData = analysis || (isCompleteAnalysis(data?.data) ? data.data : null);

  if (isLoading && !analysisData) {
    return <LoadingSkeleton text="Crunching numbers and market data…" />;
  }

  if (!analysisData) {
    return <AnalyzingInterface />;
  }

  /* ─── normalise (guard only ensures the two top-level objects exist) ─── */
  const risk: RiskAssessment = {
    pnl_analysis: {
      total_invested:      analysisData?.risk_assessment?.pnl_analysis?.total_invested      ?? 0,
      total_current_value: analysisData?.risk_assessment?.pnl_analysis?.total_current_value ?? 0,
      unrealized_pnl:      analysisData?.risk_assessment?.pnl_analysis?.unrealized_pnl      ?? 0,
      unrealized_pnl_pct:  analysisData?.risk_assessment?.pnl_analysis?.unrealized_pnl_pct  ?? 0,
      per_asset:           analysisData?.risk_assessment?.pnl_analysis?.per_asset           || [],
    },
    volatility_risk: {
      overall_volatility: analysisData?.risk_assessment?.volatility_risk?.overall_volatility || "neutral",
      assets_overbought:  analysisData?.risk_assessment?.volatility_risk?.assets_overbought  || [],
      assets_oversold:    analysisData?.risk_assessment?.volatility_risk?.assets_oversold    || [],
    },
    risk_score:        analysisData?.risk_assessment?.risk_score ?? 0,
    concentration_risk:{
      herfindahl_index: analysisData?.risk_assessment?.concentration_risk?.herfindahl_index ?? 0,
      allocations:      analysisData?.risk_assessment?.concentration_risk?.allocations      || [],
    },
    summary: analysisData?.risk_assessment?.summary || "",
  };

  const alerts: Alert[] = analysisData?.alerts || [];
  const insights: Insight = {
    market_trend_alignment: analysisData?.insights?.market_trend_alignment || "neutral",
    recommendations:        analysisData?.insights?.recommendations        || [],
    best_performers:        analysisData?.insights?.best_performers        || [],
    worst_performers:       analysisData?.insights?.worst_performers       || [],
  };

  return (
    <BaseShell>
      <BaseHeader
        heading="Portfolio Analysis"
        text="Deep dive into your risk metrics and AI investment recommendations"
        mobileMenuItems={mobileMenuItems}
      >
        <GeminiBadge />
      </BaseHeader>

      <div className="space-y-4 pb-12">

        {/* ══ ROW 1 — 4 panels ══════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <RiskProfilePanel risk={risk} />
          <TotalValuePanel pnl={risk.pnl_analysis} marketTrend={insights.market_trend_alignment} />
          <UnrealizedPnlPanel pnl={risk.pnl_analysis} />
          <Panel>
            <ConcentrationAnalysis
              allocations={risk.concentration_risk.allocations}
              herfindahl_index={risk.concentration_risk.herfindahl_index}
            />
          </Panel>
        </div>

        {/* ══ ROW 2 — 3 panels ══════════════════════════════════ */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <ActiveAlertsPanel alerts={alerts} />
          <RecommendationsPanel recommendations={insights.recommendations} />
          <AssetPerformancePanel best={insights.best_performers} worst={insights.worst_performers} />
        </div>

      </div>
    </BaseShell>
  );
}
