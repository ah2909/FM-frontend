import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { AddTokenForm } from "@/components/portfolio/add-token-form";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata: Metadata = {
	title: "Add Token",
	description: "Add a token to your portfolio",
};

interface AddTokenPageProps {
	params: {
		id: string;
	};
}

export default function AddTokenPage({ params }: AddTokenPageProps) {
	const portfolioId = params.id;

	return (
		<ProtectedRoute>
			<BaseShell>
				<BaseHeader
					heading="Add Token"
					text="Add a new token to your portfolio"
				>
					<Link href={`/portfolios/${portfolioId}`}>
						<Button variant="outline">Cancel</Button>
					</Link>
				</BaseHeader>
				<div className="grid gap-8">
					<AddTokenForm portfolioId={portfolioId} />
				</div>
			</BaseShell>
		</ProtectedRoute>
	);
}
