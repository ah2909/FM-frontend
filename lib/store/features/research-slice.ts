import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type Confidence = "high" | "medium" | "med" | "low"

export interface CasePoint {
  point: string
  source_ids: string[]
  confidence: Confidence
}

export interface RiskItem {
  risk: string
  source_ids: string[]
}

export interface Catalyst {
  event: string
  date?: string
  type?: string
  source_ids?: string[]
}

export interface TokenomicsSnapshot {
  emission_note: string
  circulating_pct: number
  fdv_to_mc: number
  circulating_supply: number
  total_supply: number
  market_cap: number
  fdv: number
  current_price: number
}

export interface DataCoverage {
  sources_available: string[]
  sources_missing: string[]
}

export interface Outlook {
  summary: string
  bull_case: CasePoint[]
  bear_case: CasePoint[]
  key_risks: RiskItem[]
  catalysts_to_watch: Catalyst[]
  tokenomics_snapshot: TokenomicsSnapshot
  asset: string
  data_coverage: DataCoverage
  categories?: string[]
  chain?: string
}

export interface ResearchMetadata {
  user_id: string
  generated_at: string
  sources_used: string[]
  partial: boolean
  errors: string[]
}

export interface TokenResearch {
  outlook: Outlook
  metadata: ResearchMetadata
}

interface ResearchState {
  byAsset: Record<string, TokenResearch>
}

const initialState: ResearchState = {
  byAsset: {},
}

const researchSlice = createSlice({
  name: "research",
  initialState,
  reducers: {
    setResearch(state, action: PayloadAction<TokenResearch>) {
      state.byAsset[action.payload.outlook.asset.toUpperCase()] = action.payload
    },
  },
})

export const { setResearch } = researchSlice.actions
export default researchSlice.reducer
