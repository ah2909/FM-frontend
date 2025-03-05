import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface Portfolio {
  id: number
  name: string
  description: string
  tokenCount: number
  totalValue: number
  created_at: string
}

export interface Exchange {
  id: number
  name: string
  img_url: string
  is_connected: boolean
}

export interface Response {
  error_code: number
  data: Portfolio[] | Exchange[]
}

// Replace with your actual API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const portfolioApi = createApi({
  reducerPath: "portfolioApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers: any) => {
      headers.set(
        "Authorization",
        `Bearer ${localStorage.getItem("apiToken")}`
      );
      return headers;
    },
  }),
  tagTypes: ["Portfolio", "Asset", "Exchange"],
  endpoints: (builder) => ({
    getPortfoliosByUserID: builder.query<Portfolio[], void>({
      query: () => "portfolio",
      providesTags: ["Portfolio"],
    }),
    createPortfolio: builder.mutation<Portfolio, Partial<Portfolio>>({
      query: (portfolio) => ({
        url: "portfolio",
        method: "POST",
        body: portfolio,
      }),
      invalidatesTags: ["Portfolio"],
    }),
    updatePortfolio: builder.mutation<Portfolio, { id: number; portfolio: Partial<Portfolio> }>({
      query: ({ id, portfolio }) => ({
        url: `portfolio/${id}`,
        method: "PUT",
        body: portfolio,
      }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Portfolio", id }],
    }),
    deletePortfolio: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `portfolio/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Portfolio"],
    }),
    getSupportedCEX: builder.query<Response, void>({
      query: () => "exchange/supported-cex",
      providesTags: ["Exchange"],
    }),
    connectExchange: builder.mutation<void, {apiKey: string, apiSecret: string}>({
      query: () => ({
        url: `exchange/connect`,
        method: "POST",
      }),
      invalidatesTags: ["Exchange"]
    }),
  }),
})

export const {
  useGetPortfoliosByUserIDQuery,
  useCreatePortfolioMutation,
  useUpdatePortfolioMutation,
  useDeletePortfolioMutation,
  useGetSupportedCEXQuery,
  useConnectExchangeMutation,
} = portfolioApi

