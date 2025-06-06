"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
	portfolioId: z.string({
		required_error: "Please select a portfolio.",
	}),
	tokenSymbol: z.string().min(1, {
		message: "Token symbol is required.",
	}),
	type: z.enum(["buy", "sell"], {
		required_error: "Please select a transaction type.",
	}),
	amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
		message: "Amount must be a positive number.",
	}),
	price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
		message: "Price must be a positive number.",
	}),
	date: z.date({
		required_error: "Transaction date is required.",
	}),
});

interface EditTransactionFormProps {
	transaction: {
		id: string;
		portfolioId: string;
		tokenSymbol: string;
		type: "buy" | "sell";
		amount: string;
		price: string;
		date: Date;
	};
}

export function EditTransactionForm({ transaction }: EditTransactionFormProps) {
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			portfolioId: transaction.portfolioId,
			tokenSymbol: transaction.tokenSymbol,
			type: transaction.type,
			amount: transaction.amount,
			price: transaction.price,
			date: transaction.date,
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			// Here you would typically call a server action to update the transaction
			toast.success(
				"Your transaction has been updated successfully."
			);

			router.push("/transactions");
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
							name="portfolioId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Portfolio</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a portfolio" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="1">
												Long Term Hodl
											</SelectItem>
											<SelectItem value="2">
												Trading Portfolio
											</SelectItem>
											<SelectItem value="3">
												Altcoin Gems
											</SelectItem>
										</SelectContent>
									</Select>
									<FormDescription>
										Select the portfolio for this
										transaction.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="tokenSymbol"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Token Symbol</FormLabel>
									<FormControl>
										<Input placeholder="BTC" {...field} />
									</FormControl>
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
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Transaction Type</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select transaction type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="buy">
												Buy
											</SelectItem>
											<SelectItem value="sell">
												Sell
											</SelectItem>
										</SelectContent>
									</Select>
									<FormDescription>
										Select whether you bought or sold the
										token.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
											Enter the amount of tokens.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Price per Token (USD)
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="any"
												placeholder="30000"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Enter the price per token in USD.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Transaction Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className="w-full pl-3 text-left font-normal"
												>
													{field.value ? (
														format(
															field.value,
															"PPP"
														)
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent
											className="w-auto p-0"
											align="start"
										>
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormDescription>
										Select the date of the transaction.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Update Transaction</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
