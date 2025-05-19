"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
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
import { Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useAddTokenToPortfolioManualMutation } from "@/lib/store/services/portfolio-api";

const formSchema = z.object({
	symbol: z.string().min(1, {
		message: "Token symbol is required.",
	}),
	amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
		message: "Amount must be a positive number.",
	}),
});

interface AddTokenFormProps {
	portfolioId: number;
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
	const [suggestions, setSuggestions] = useState<Array<any>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
	const stopSearch = useRef(false);
	const [ addTokenToPortfolioManual ] = useAddTokenToPortfolioManualMutation();

    const fetchSuggestions = async (q: string) => {
        if (!q || q.length < 2) return setSuggestions([]);
        setIsLoading(true);
        try {
            const res = await fetch(
                `https://api.coingecko.com/api/v3/search?query=${q}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-cg-demo-api-key": process.env.NEXT_PUBLIC_COINGECKO_API_KEY ?? "",
                    },
                }
            );
            const data = await res.json();
            setSuggestions(data.coins || []);
        } catch {
            setSuggestions([]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const symbol = form.watch("symbol");
		if (stopSearch.current) {
            stopSearch.current = false;
            return;
        }
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        if (symbol && symbol.length > 1) {
            searchTimeout.current = setTimeout(() => fetchSuggestions(symbol), 500);
        } else {
            setSuggestions([]);
        }
        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [form.watch("symbol")]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			console.log(values);
			await addTokenToPortfolioManual({ 
				portfolio_id: portfolioId, 
				token: {
					symbol: values.symbol.toUpperCase(),
					amount: Number(values.amount),
				}
			}) 
			toast.success(
				"The token has been added to your portfolio."
			);

			router.push(`/portfolios/${portfolioId}`);
		} catch (error) {
			toast.error( 
        		"Failed to add assets to portfolio."		
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
										<Command>
											<Input
												placeholder="BTC"
												{...field}
											/>
											<CommandList>
												{isLoading ? (
													<Loader2 className="mx-auto my-2 h-8 w-8 animate-spin" />
												) : (
													suggestions?.map((asset: any) => (
														<CommandItem
															key={asset.id}
															onSelect={() => {
																stopSearch.current = true;
																form.setValue("symbol", asset.symbol.toUpperCase());
																setSuggestions([]);
															}}
														>
															<Image
																src={asset.thumb}
																alt="logo"
																width={20}
																height={20}
															/>
															<span className="ml-2">
																{asset.name}
															</span>
															<span className="ml-1 text-muted-foreground">
																({asset.symbol})
															</span>
														</CommandItem>
													))
												)}
											</CommandList>
										</Command>
										</FormControl>
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
