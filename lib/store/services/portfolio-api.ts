import { baseApi } from "./baseApi";

export interface Portfolio {
	id: number;
	name: string;
	description: string;
	// totalValue: number;
	updated_at: string;
}
export interface Response {
	success: boolean;
	message: string;
	data: any;
}


export const portfolioApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getPortfoliosByUserID: builder.query<Response, void>({
			query: () => "portfolio",
			providesTags: ["Portfolio"],
		}),
		createPortfolio: builder.mutation<Response, Partial<Portfolio>>({
			query: (portfolio) => ({
				url: "portfolio",
				method: "POST",
				body: portfolio,
			}),
			invalidatesTags: ["Portfolio"],
		}),
		updatePortfolio: builder.mutation<
			Portfolio,
			{ id: number; portfolio: Partial<Portfolio> }
		>({
			query: ({ id, portfolio }) => ({
				url: `portfolio/${id}`,
				method: "PUT",
				body: portfolio,
			}),
		}),
		deletePortfolio: builder.mutation<void, number>({
			query: (id: number) => ({
				url: `portfolio/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Portfolio"],
		}),
		addTokenToPortfolio: builder.mutation<
			void,
			{ portfolio_id: number; token: any[] }
		>({
			query: (token) => ({
				url: `/portfolio/asset`,
				method: "POST",
				body: token,
			}),
		}),
		addTokenToPortfolioManual: builder.mutation<
			void,
			{ portfolio_id: number; token: {symbol: string, amount: number} }
		>({
			query: (token) => ({
				url: `/portfolio/asset/add-manual`,
				method: "POST",
				body: token,
			}),
			invalidatesTags: ["Portfolio"],
		}),
		removeTokenFromPortfolio: builder.mutation<
			void,
			{ portfolio_id: number; token: string }
		>({
			query: (token) => ({
				url: `/portfolio/asset/remove`,
				method: "POST",
				body: token,
			}),
		}),
		syncTransactions: builder.mutation<Response, { portfolio_id: number }>({
			query: (data) => ({
				url: `/portfolio/sync-transactions`,
				method: "POST",
				body: data,
			}),
		}),
		getBalanceData: builder.query<Response, void>({
			query: () => ({
				url: `/portfolio/balance`,
			}),
		}),
		getRecentActivity: builder.query<Response, void>({
			query: () => ({
				url: `/portfolio/recent-activity`,
			}),
		}),
		importTransactions: builder.mutation<Response, FormData>({
			query: (data) => ({
				url: `/portfolio/import-transactions`,
				method: "POST",
				body: data,
			}),
		}),
	}),
});

export const {
	useGetPortfoliosByUserIDQuery,
	useCreatePortfolioMutation,
	useUpdatePortfolioMutation,
	useDeletePortfolioMutation,
	useAddTokenToPortfolioMutation,
	useAddTokenToPortfolioManualMutation,
	useRemoveTokenFromPortfolioMutation,
	useSyncTransactionsMutation,
	useGetBalanceDataQuery,
	useGetRecentActivityQuery,
	useImportTransactionsMutation,
} = portfolioApi;
