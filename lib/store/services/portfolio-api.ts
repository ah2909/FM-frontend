import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface Portfolio {
  id: number
  name: string
  description: string
  totalValue: number
  created_at: string
}
export interface Response {
  error_code: number
  data: any
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
  tagTypes: ["Portfolio", "Asset"],
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
    addTokenToPortfolio: builder.mutation<void, { portfolio_id: number, token: any[] }>({
      query: (token) => ({
        url: `/portfolio/asset`,
        method: "POST",
        body: token,
      }),
      invalidatesTags: ["Portfolio"],
    }),
    removeTokenFromPortfolio: builder.mutation<void, { portfolio_id: number, token: string }>({
      query: (token) => ({
        url: `/portfolio/asset/remove`,
        method: "POST",
        body: token,
      }),
      invalidatesTags: ["Portfolio"],
    }),
  }),
})

export const {
  useGetPortfoliosByUserIDQuery,
  useCreatePortfolioMutation,
  useUpdatePortfolioMutation,
  useDeletePortfolioMutation,
  useAddTokenToPortfolioMutation,
  useRemoveTokenFromPortfolioMutation,
} = portfolioApi

