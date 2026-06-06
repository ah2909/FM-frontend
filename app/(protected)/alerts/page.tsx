import type { Metadata } from "next";

import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { AlertsManager } from "@/components/alert/alerts-manager";

export const metadata: Metadata = {
	title: "Price Alerts",
	description: "Get notified on Telegram when your price targets are hit",
};

export default function AlertsPage() {
	return (
		<BaseShell>
			<BaseHeader
				heading="Price Alerts"
				text="Get a Telegram message the moment a coin crosses your target price"
			/>
			<AlertsManager />
		</BaseShell>
	);
}
