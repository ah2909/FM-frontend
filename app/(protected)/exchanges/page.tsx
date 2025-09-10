import type { Metadata } from "next";

import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { UserExchanges } from "@/components/exchange/user-exchanges";

export const metadata: Metadata = {
	title: "Exchanges",
	description: "Manage your connected exchanges",
};

export default function ExchangesPage() {
	return (
		<BaseShell>
			<BaseHeader
				heading="Exchanges"
				text="Connect and manage your cryptocurrency exchange accounts"
			/>
			<UserExchanges />
		</BaseShell>
	);
}
