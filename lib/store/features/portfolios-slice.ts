import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Portfolio } from "../services/portfolio-api"

interface PortfoliosState {
  selectedPortfolioId: string | null
  portfolios: Portfolio[]
}

const initialState: PortfoliosState = {
  selectedPortfolioId: null,
  portfolios: [],
}

export const portfoliosSlice = createSlice({
  name: "portfolios",
  initialState,
  reducers: {
    setSelectedPortfolio: (state, action: PayloadAction<string | null>) => {
      state.selectedPortfolioId = action.payload
    },
    setPortfolios: (state, action: PayloadAction<Portfolio[]>) => {
      state.portfolios = action.payload
    },
  },
})

export const { setSelectedPortfolio, setPortfolios } = portfoliosSlice.actions
export default portfoliosSlice.reducer

