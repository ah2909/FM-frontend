"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { AddTokenForm } from "@/components/portfolio/add-token-form";
import { useSelector } from "react-redux";

export default function AddTokenPage() {
	const portfolio = useSelector((state: any) => state.portfolios.portfolio);

	return (
		<BaseShell>
			<BaseHeader
				heading="Add Token"
				text="Add a new token to your portfolio"
			>
				<Link href={`/portfolios`}>
					<Button variant="outline">Cancel</Button>
				</Link>
			</BaseHeader>
			<div className="grid gap-8">
				<AddTokenForm portfolioId={portfolio.id} />
			</div>
		</BaseShell>
	);
}
