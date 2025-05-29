import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Portfolio } from "../services/portfolio-api"

interface PortfoliosState {
  portfolio: any
  assets: any[]
  transactions: any[]
  totalUnrealizedPNL: number
}

const initialState: PortfoliosState = {
  portfolio: {},
  assets: [],
  transactions: [],
  totalUnrealizedPNL: 0,
}

export const portfoliosSlice = createSlice({
  name: "portfolios",
  initialState,
  reducers: {
    setPortfolio: (state, action: PayloadAction<Portfolio>) => {
      state.portfolio = action.payload
    },
    setAssets: (state, action: PayloadAction<any[]>) => {
      state.assets = action.payload
    },
    setTransactions: (state, action: PayloadAction<any[]>) => {
      state.transactions = action.payload
    },
    setTotalUnrealizedPNL: (state, action: PayloadAction<number>) => {
      state.totalUnrealizedPNL = action.payload
    }
  },
})

export const { setPortfolio, setAssets, setTransactions, setTotalUnrealizedPNL } = portfoliosSlice.actions
export default portfoliosSlice.reducer

