import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { TransactionForm } from "@/components/transaction/transaction-form";

export const metadata: Metadata = {
	title: "New Transaction",
	description: "Add a new crypto transaction",
};

export default function NewTransactionPage() {
	return (
		<BaseShell>
			<BaseHeader
				heading="New Transaction"
				text="Add a new crypto transaction"
			>
				<Link href="/transactions">
					<Button variant="outline">Cancel</Button>
				</Link>
			</BaseHeader>
			<div className="grid gap-8">
				<TransactionForm />
			</div>
		</BaseShell>
	);
}
