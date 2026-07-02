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
	}),
});

export const { useGetP2PQuery, useGetPerformanceQuery } = marketApi;
