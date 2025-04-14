import { configureStore } from "@reduxjs/toolkit"
import { portfolioApi } from "./services/portfolio-api"
import portfoliosReducer from "./features/portfolios-slice"
import { exchangeApi } from "./services/exchange-api"

export const store = configureStore({
  reducer: {
    portfolios: portfoliosReducer,
    [portfolioApi.reducerPath]: portfolioApi.reducer,
    [exchangeApi.reducerPath]: exchangeApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(portfolioApi.middleware).concat(exchangeApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

