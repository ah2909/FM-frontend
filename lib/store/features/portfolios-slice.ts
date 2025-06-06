import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Portfolio } from "../services/portfolio-api"
import { portfolioApi } from "../services/portfolio-api"

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
    },
    removeSymbol: (state, action: PayloadAction<string>) => {
      const symbol = action.payload
      const asset = state.assets.find((asset) => asset.symbol === symbol)
      state.portfolio.totalValue -=  (asset ? asset.value : 0)
      state.portfolio.assets = state.portfolio.assets.filter((asset: any) => asset.symbol !== symbol)
      state.assets = state.assets.filter((asset: any) => asset.symbol !== symbol)
    },
    editPortfolio: (state, action: PayloadAction<any>) => {
      const updatedPortfolio = action.payload
      state.portfolio.name = updatedPortfolio.name
      state.portfolio.description = updatedPortfolio.description
    }
  },
  extraReducers: (builder) => {
  builder.addMatcher(
    portfolioApi.endpoints.getPortfoliosByUserID.matchFulfilled,
    (state, { payload }) => {
      state.portfolio = payload.data;
      state.assets = payload.data.assets;
      state.transactions = payload.data.transactions;
    }
  );
}
})

export const { setPortfolio, setAssets, setTransactions, setTotalUnrealizedPNL, removeSymbol, editPortfolio } = portfoliosSlice.actions
export default portfoliosSlice.reducer

