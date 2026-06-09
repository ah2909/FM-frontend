import { configureStore } from "@reduxjs/toolkit"
import portfoliosReducer from "./features/portfolios-slice"
import analyzeReducer from "./features/analyze-slice"
import researchReducer from "./features/research-slice"
import notificationsReducer from "./features/notifications-slice"
import { baseApi } from "./services/baseApi"
import { authApi } from "./services/auth-api"
import { alertApi } from "./services/alert-api"

export const store = configureStore({
  reducer: {
    portfolios: portfoliosReducer,
    analyze: analyzeReducer,
    research: researchReducer,
    notifications: notificationsReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [alertApi.reducerPath]: alertApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, authApi.middleware, alertApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

