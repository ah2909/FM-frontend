import { createApi } from "@reduxjs/toolkit/query/react";
import { makeBaseQueryWithRefresh } from "./baseApi";

// The alert engine is a third backend service. Browser requests hit the
// same-origin `/alert-engine/*` rewrite (see next.config.mjs), which proxies to
// NEXT_PUBLIC_ALERT_SERVICE_URL. Auth is the same RS256 access token used by the
// main backend, so we reuse the shared refresh-aware base query (and its mutex).

export interface TelegramBinding {
	id: number;
	user_id: number;
	telegram_chat_id: number;
	created_at: string;
}

export type AlertCondition = "above" | "below";

export interface Alert {
	id: number;
	user_id: number;
	symbol: string;
	condition: AlertCondition;
	price: number;
	triggered: boolean;
	created_at: string;
}

// The alert engine wraps every payload as { success, data } / { success, error }.
interface Envelope<T> {
	success: boolean;
	data: T;
	error?: string;
}

export const alertApi = createApi({
	reducerPath: "alertApi",
	baseQuery: makeBaseQueryWithRefresh("/alert-engine/api"),
	tagTypes: ["TelegramBinding", "Alert"],
	endpoints: (builder) => ({
		getTelegramBinding: builder.query<TelegramBinding, void>({
			query: () => "telegram-bot",
			transformResponse: (res: Envelope<TelegramBinding>) => res.data,
			providesTags: ["TelegramBinding"],
		}),
		registerTelegramBot: builder.mutation<
			TelegramBinding,
			{ telegram_bot_token: string; telegram_chat_id: number }
		>({
			query: (body) => ({
				url: "telegram-bot",
				method: "POST",
				body,
			}),
			transformResponse: (res: Envelope<TelegramBinding>) => res.data,
			invalidatesTags: ["TelegramBinding"],
		}),
		getAlerts: builder.query<Alert[], void>({
			query: () => "alerts",
			transformResponse: (res: Envelope<Alert[]>) => res.data ?? [],
			providesTags: ["Alert"],
		}),
		createAlert: builder.mutation<
			Alert,
			{ symbol: string; condition: AlertCondition; price: number }
		>({
			query: (body) => ({
				url: "alerts",
				method: "POST",
				body,
			}),
			transformResponse: (res: Envelope<Alert>) => res.data,
			invalidatesTags: ["Alert"],
		}),
		deleteAlert: builder.mutation<{ deleted: number }, number>({
			query: (id) => ({
				url: `alerts/${id}`,
				method: "DELETE",
			}),
			transformResponse: (res: Envelope<{ deleted: number }>) => res.data,
			invalidatesTags: ["Alert"],
		}),
	}),
});

export const {
	useGetTelegramBindingQuery,
	useRegisterTelegramBotMutation,
	useGetAlertsQuery,
	useCreateAlertMutation,
	useDeleteAlertMutation,
} = alertApi;
