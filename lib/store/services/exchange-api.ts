import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Response } from "./portfolio-api"

export interface Exchange {
    id: number
    name: string
    img_url: string
    is_connected: boolean
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const exchangeApi = createApi({
  reducerPath: "exchangeApi",
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
  tagTypes: ["Exchange"],
  endpoints: (builder) => ({
    getSupportedCEX: builder.query<Response, void>({
        query: () => "exchange/supported-cex",
        providesTags: ["Exchange"],
    }),
    connectExchange: builder.mutation<void, {api_key: string, secret_key: string, cex_name?: string|undefined}>({
        query: (key) => ({
        url: `exchange/connect`,
        method: "POST",
        body: key,
        }),
        invalidatesTags: ["Exchange"]
    }),
    getInfoExchange: builder.query<Response, void>({
        query: () => "exchange/info",
    }),
  }),
})

export const {
    useGetSupportedCEXQuery,
    useConnectExchangeMutation,
    useGetInfoExchangeQuery,
} = exchangeApi