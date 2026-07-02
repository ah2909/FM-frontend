import { baseApi } from "./baseApi";

interface Envelope<T> {
	success: boolean;
	message: string;
	data: T;
}

export interface P2PSide {
	best: number | null;
	avg: number | null;
}

export interface P2PSpread {
	asset: string;
	fiat: string;
	buy: P2PSide;
	sell: P2PSide;
	spread: number | null;
	updated_at: string;
}

export interface PerformancePoint {
	date: string;
	value: number;
}

export interface PerformanceSeries {
	key: string;
	label: string;
	points: PerformancePoint[];
}

export interface PerformanceComparison {
	range: string;
	series: PerformanceSeries[];
}

export interface FearGreed {
	value: number;
	classification: string;
	timestamp: number;
}

export interface GlobalStats {
	totalMarketCap: number;
	totalVolume: number;
	marketCapChange24h: number;
	btcDominance: number;
	ethDominance: number;
}

export interface TrendingCoin {
	id: string;
	name: string;
	symbol: string;
	rank: number | null;
	thumb: string;
	price: number | null;
	change24h: number | null;
}

async function fetchJson(url: string) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`${res.status}`);
	return res.json();
}

function toQueryError(e: unknown) {
	return { error: { status: "CUSTOM_ERROR" as const, error: String(e) } };
}

interface RawTrendingCoin {
	item: {
		id: string;
		name: string;
		symbol: string;
		market_cap_rank?: number;
		thumb: string;
		data?: { price?: number; price_change_percentage_24h?: { usd?: number } };
	};
}

export const marketApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getP2P: builder.query<P2PSpread, void>({
			query: () => "market/p2p",
			transformResponse: (res: Envelope<P2PSpread>) => res.data,
		}),
		getPerformance: builder.query<PerformanceComparison, string>({
			query: (range) => `market/performance?range=${range}`,
			transformResponse: (res: Envelope<PerformanceComparison>) => res.data,
		}),
		// Public keyless APIs below are fetched client-side, not proxied through the backend
		getFearGreed: builder.query<FearGreed, void>({
			queryFn: async () => {
				try {
					const json = await fetchJson("https://api.alternative.me/fng/?limit=1");
					const item = json?.data?.[0];
					if (!item) throw new Error("empty");
					return {
						data: {
							value: Number(item.value),
							classification: item.value_classification,
							timestamp: Number(item.timestamp),
						},
					};
				} catch (e) {
					return toQueryError(e);
				}
			},
			keepUnusedDataFor: 900,
		}),
		getGlobalStats: builder.query<GlobalStats, void>({
			queryFn: async () => {
				try {
					const json = await fetchJson("https://api.coingecko.com/api/v3/global");
					const d = json?.data;
					if (!d) throw new Error("empty");
					return {
						data: {
							totalMarketCap: d.total_market_cap?.usd ?? 0,
							totalVolume: d.total_volume?.usd ?? 0,
							marketCapChange24h: d.market_cap_change_percentage_24h_usd ?? 0,
							btcDominance: d.market_cap_percentage?.btc ?? 0,
							ethDominance: d.market_cap_percentage?.eth ?? 0,
						},
					};
				} catch (e) {
					return toQueryError(e);
				}
			},
			keepUnusedDataFor: 300,
		}),
		getTrending: builder.query<TrendingCoin[], void>({
			queryFn: async () => {
				try {
					const json = await fetchJson("https://api.coingecko.com/api/v3/search/trending");
					const coins = (json?.coins ?? []).map((c: RawTrendingCoin) => ({
						id: c.item.id,
						name: c.item.name,
						symbol: c.item.symbol,
						rank: c.item.market_cap_rank ?? null,
						thumb: c.item.thumb,
						price: c.item.data?.price ?? null,
						change24h: c.item.data?.price_change_percentage_24h?.usd ?? null,
					}));
					return { data: coins };
				} catch (e) {
					return toQueryError(e);
				}
			},
			keepUnusedDataFor: 300,
		}),
	}),
});

export const {
	useGetP2PQuery,
	useGetPerformanceQuery,
	useGetFearGreedQuery,
	useGetGlobalStatsQuery,
	useGetTrendingQuery,
} = marketApi;
