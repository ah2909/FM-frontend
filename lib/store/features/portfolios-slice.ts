import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Portfolio } from "../services/portfolio-api"
import { portfolioApi } from "../services/portfolio-api"

interface PortfoliosState {
  portfolio: any
  assets: any[]
  transactions: any
  performance: number[]
}

const initialState: PortfoliosState = {
  portfolio: {},
  assets: [],
  transactions: {},
  performance: [],
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
    },
    syncTransactionsByAssetID: (state, action: PayloadAction<{ assetId: string, transaction: any }>) => {
      const { assetId, transaction } = action.payload;
      state.transactions[assetId] = [...state.transactions[assetId], transaction];
      let updatedAmount = transaction.type === 'BUY' ? transaction.quantity : -transaction.quantity;
      const assetIndex = state.assets.findIndex((asset: any) => asset.id === assetId);
      if (assetIndex !== -1) {
        state.assets[assetIndex].amount += updatedAmount;
        state.assets[assetIndex].value = state.assets[assetIndex].amount * state.assets[assetIndex].price;
        state.portfolio.totalValue += updatedAmount * state.assets[assetIndex].price;
      }
    },
    updateTotalValue: (state, action: PayloadAction<number>) => {
      state.portfolio.totalValue = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      portfolioApi.endpoints.getPortfoliosByUserID.matchFulfilled,
      (state, { payload }) => {
        state.portfolio = payload.data;
        state.assets = payload.data?.assets ?? [];
        if(state.assets.length > 0) {
          payload.data?.assets.map((asset: any) => {
            state.transactions[asset.id] = payload.data.transactions.filter((transaction: any) => transaction.asset_id === asset.id);
          })
        }  
      }
    );
    builder.addMatcher(
      portfolioApi.endpoints.getBalanceData.matchFulfilled,
      (state, { payload }) => {
        state.performance = payload.data.map((item: {balance: number, date: string}) => item.balance);
      }
    );
  }
})

export const { setPortfolio, setAssets, removeSymbol, editPortfolio, syncTransactionsByAssetID, updateTotalValue } = portfoliosSlice.actions
export default portfoliosSlice.reducer

