import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { PortfolioForm } from "@/components/portfolio/portfolio-form";

export const metadata: Metadata = {
	title: "Create Portfolio",
	description: "Create a new crypto portfolio",
};

export default function NewPortfolioPage() {
	return (
		<BaseShell>
			<BaseHeader
				heading="Create Portfolio"
				text="Create a new crypto portfolio"
			>
				<Link href="/portfolios">
					<Button variant="outline">Cancel</Button>
				</Link>
			</BaseHeader>
			<div className="grid gap-8">
				<PortfolioForm />
			</div>
		</BaseShell>
	);
}
