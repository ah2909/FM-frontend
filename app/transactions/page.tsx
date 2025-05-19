import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { TransactionList } from "@/components/transaction/transaction-list";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata: Metadata = {
	title: "Transactions",
	description: "Manage your crypto transactions",
};

export default async function TransactionsPage() {
	return (
		<ProtectedRoute>
			<BaseShell>
				<BaseHeader
					heading="Transactions"
					text="Manage your crypto transactions"
					showBackButton={false}
				>
					<Link href="/transactions/new">
						<Button>
							<PlusCircle className="mr-2 h-4 w-4" />
							New Transaction
						</Button>
					</Link>
				</BaseHeader>
				<TransactionList />
			</BaseShell>
		</ProtectedRoute>
	);
}
