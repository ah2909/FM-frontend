import type { Metadata } from "next";

import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { UserExchanges } from "@/components/exchange/user-exchanges";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata: Metadata = {
	title: "Exchanges",
	description: "Manage your connected exchanges",
};

export default function ExchangesPage() {
	return (
		<ProtectedRoute>
			<BaseShell>
				<BaseHeader
					heading="Exchanges"
					text="Manage your connected cryptocurrency exchanges and wallets"
					showBackButton={false}
				/>
				<UserExchanges />
			</BaseShell>
		</ProtectedRoute>
	);
}
