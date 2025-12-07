import { baseApi } from "./baseApi";

export const tradingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTickerInfo: builder.query<any, string>({
      query: (symbol) => ({
        url: "/trading/futures/ticker",
        method: "POST",
        body: { symbol },
      }),
    }),

    // Get Binance futures account info
    getFutureAccount: builder.query<any, void>({
      query: () => "/trading/futures/account",
    }),

    // Analyze symbol with AI
    analyzeSymbol: builder.mutation<any, {symbol: string}>({
      query: (payload) => ({
        url: "/trading/analyze",
        method: "POST",
        body: payload,
      }),
    }),

    // Get open future positions
    getOpenPositions: builder.query<any, void>({
      query: (payload) => ({
        url: "/trading/futures/positions",
        method: "POST",
        body: payload,
      }),
    }),

    // Place order (mutation)
    // placeOrder: builder.mutation<
    //   { orderId: string; success: boolean },
    //   {
    //     symbol: string
    //     side: "BUY" | "SELL"
    //     type: "MARKET" | "LIMIT"
    //     quantity: number
    //     price?: number
    //     leverage: number
    //   }
    // >({
    //   query: (payload) => ({
    //     url: "/trading/orders",
    //     method: "POST",
    //     body: payload,
    //   }),
    //   invalidatesTags: ["Positions", "Account"],
    // }),

    // // Close position
    // closePosition: builder.mutation<{ success: boolean }, { positionId: string }>({
    //   query: (payload) => ({
    //     url: "/trading/positions/close",
    //     method: "POST",
    //     body: payload,
    //   }),
    //   invalidatesTags: ["Positions", "Account"],
    // }),
  }),
})

export const {
  useGetTickerInfoQuery,
  useGetFutureAccountQuery,
  useAnalyzeSymbolMutation,
  useGetOpenPositionsQuery,
//   usePlaceOrderMutation,
//   useClosePositionMutation,
} = tradingApi