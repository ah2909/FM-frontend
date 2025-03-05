import { configureStore } from "@reduxjs/toolkit"
import { portfolioApi } from "./services/portfolio-api"
import portfoliosReducer from "./features/portfolios-slice"

export const store = configureStore({
  reducer: {
    portfolios: portfoliosReducer,
    [portfolioApi.reducerPath]: portfolioApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(portfolioApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

