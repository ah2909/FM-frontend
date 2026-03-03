import { configureStore } from "@reduxjs/toolkit"
import portfoliosReducer from "./features/portfolios-slice"
import analyzeReducer from "./features/analyze-slice"
import { baseApi } from "./services/baseApi"
import { authApi } from "./services/auth-api"

export const store = configureStore({
  reducer: {
    portfolios: portfoliosReducer,
    analyze: analyzeReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, authApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

