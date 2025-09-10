import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { EditTransactionForm } from "@/components/transaction/edit-transaction-form";

export const metadata: Metadata = {
	title: "Edit Transaction",
	description: "Edit your crypto transaction",
};

interface EditTransactionPageProps {
	params: {
		id: string;
	};
}

export default function EditTransactionPage({
	params,
}: EditTransactionPageProps) {
	const transactionId = params.id;

	// In a real app, you would fetch the transaction data here
	const transaction = {
		id: transactionId,
		portfolioId: "1",
		tokenSymbol: "BTC",
		type: "buy" as const,
		amount: "0.05",
		price: "32456.78",
		date: new Date("2023-10-15"),
	};

	if (!transaction) {
		notFound();
	}

	return (
		<BaseShell>
			<BaseHeader
				heading="Edit Transaction"
				text="Update your transaction details"
			>
				<Link href="/transactions">
					<Button variant="outline">Cancel</Button>
				</Link>
			</BaseHeader>
			<div className="grid gap-8">
				<EditTransactionForm transaction={transaction} />
			</div>
		</BaseShell>
	);
}
