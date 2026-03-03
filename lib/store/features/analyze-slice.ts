import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type Severity = "critical" | "high" | "medium" | "low"

export interface Alert {
  severity: Severity
  asset: string
  type: string
  message: string
  action: string
}

export interface Performer {
  symbol: string
  pnl_pct: number
  reason: string
}

export interface AssetPnl {
  symbol: string
  invested: number
  current: number
  pnl: number
  pnl_pct: number
}

export interface PnlAnalysis {
  total_invested: number
  total_current_value: number
  unrealized_pnl: number
  unrealized_pnl_pct: number
  per_asset: AssetPnl[]
}

export interface VolatilityRisk {
  overall_volatility: string
  assets_overbought: string[]
  assets_oversold: string[]
}

export interface ConcentrationRisk {
  herfindahl_index: number
  allocations: { symbol: string; percentage: number; flag: string }[]
}

export interface RiskAssessment {
  pnl_analysis: PnlAnalysis
  volatility_risk: VolatilityRisk
  risk_score: number
  concentration_risk: ConcentrationRisk
  summary: string
}

export interface Insight {
  market_trend_alignment: string
  recommendations: string[]
  best_performers: Performer[]
  worst_performers: Performer[]
}

export interface PortfolioAnalysis {
  risk_assessment: RiskAssessment
  alerts: Alert[]
  insights: Insight
}

interface AnalyzeState {
  analysis: PortfolioAnalysis | null
  hasRequested: boolean
}

const initialState: AnalyzeState = {
  analysis: null,
  hasRequested: false,
}

const analyzeSlice = createSlice({
  name: "analyze",
  initialState,
  reducers: {
    setAnalysis(state, action: PayloadAction<PortfolioAnalysis>) {
      state.analysis = action.payload
    },
    setHasRequested(state) {
      state.hasRequested = true
    },
  },
})

export const { setAnalysis, setHasRequested } = analyzeSlice.actions
export default analyzeSlice.reducer
