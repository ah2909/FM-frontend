import { Response } from "./portfolio-api";
import { baseApi } from "./baseApi";

export interface Exchange {
	id: number;
	name: string;
	img_url: string;
	is_connected: boolean;
}

export const exchangeApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getSupportedCEX: builder.query<Response, void>({
			query: () => "exchange/supported-cex",
			providesTags: ["Exchange"],
		}),
		connectExchange: builder.mutation<
			Response,
			{
				api_key: string;
				secret_key: string;
				cex_name?: string | undefined;
			}
		>({
			query: (key) => ({
				url: `exchange/connect`,
				method: "POST",
				body: key,
			}),
			invalidatesTags: ["Exchange"],
		}),
		getInfoExchange: builder.query<Response, void>({
			query: () => "exchange/info",
		}),
	}),
});

export const {
	useGetSupportedCEXQuery,
	useConnectExchangeMutation,
	useGetInfoExchangeQuery,
} = exchangeApi;
