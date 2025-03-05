"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
	symbol: z.string().min(1, {
		message: "Token symbol is required.",
	}),
	amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
		message: "Amount must be a positive number.",
	}),
});

interface AddTokenFormProps {
	portfolioId: string;
}

export function AddTokenForm({ portfolioId }: AddTokenFormProps) {
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			symbol: "",
			amount: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			// Here you would typically call a server action to add the token
			console.log(values);

			toast.success(
				"The token has been added to your portfolio."
			);

			router.push(`/portfolios/${portfolioId}`);
		} catch (error) {
			toast.error( 
        "Something went wrong. Please try again."		
			);
		}
	}

	return (
		<Card>
			<CardContent className="pt-6">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8"
					>
						<FormField
							control={form.control}
							name="symbol"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Token Symbol</FormLabel>
									<div className="flex gap-2">
										<FormControl>
											<Input
												placeholder="BTC"
												{...field}
											/>
										</FormControl>
										<Button
											type="button"
											variant="outline"
											size="icon"
										>
											<Search className="h-4 w-4" />
										</Button>
									</div>
									<FormDescription>
										Enter the symbol of the cryptocurrency
										(e.g., BTC, ETH).
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Amount</FormLabel>
									<FormControl>
										<Input
											type="number"
											step="any"
											placeholder="0.5"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Enter the amount of tokens you own.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Add Token</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
