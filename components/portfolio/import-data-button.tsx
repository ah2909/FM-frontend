"use client";

import type React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Download, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	useGetSupportedCEXQuery,
	useConnectExchangeMutation,
} from "@/lib/store/services/portfolio-api";


const formSchema = z.object({
	apiKey: z.string().min(1, { message: "API Key is required" }),
	apiSecret: z.string().min(1, { message: "API Secret is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export function ImportDataButton() {
	const { data: exchanges, isLoading } = useGetSupportedCEXQuery();
	const [connectExchange] = useConnectExchangeMutation();
	const [isOpen, setIsOpen] = useState(false);
	const [selectedExchange, setSelectedExchange] = useState<number | null>(
		null
	);

	// Initialize React Hook Form with Zod validation
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			apiKey: "",
			apiSecret: "",
		},
	});

	const handleExchangeSelect = (exchangeId: number) => {
		const exchange = exchanges?.data?.find((e) => e.id === exchangeId);

		if (exchange?.is_connected) {
			// If already connected, we could trigger a sync or show details
			toast.info(`${exchange.name} is already connected`);
			return;
		}

		setSelectedExchange(exchangeId);
		form.reset();
	};

	const onSubmit = async (data: FormValues) => {
		if (!data.apiKey || !data.apiSecret) {
			toast.error("API Key and Secret are required");
			return;
		}

		try {
			await connectExchange({
				...data,
			}).unwrap();

			toast.success("Exchange connected successfully");
			setSelectedExchange(null);
		} catch (error) {
			toast.error("Failed to connect exchange");
		}
	};

	const handleCancel = () => {
		setSelectedExchange(null);
		form.reset();
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<Download className="mr-2 h-4 w-4" />
					Import Data
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Import Exchange Data</DialogTitle>
					<DialogDescription>
						Connect to cryptocurrency exchanges to import your
						balances and transactions.
					</DialogDescription>
				</DialogHeader>

				{selectedExchange ? (
					// Show API key form for the selected exchange
					<div className="py-4">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="apiKey"
									render={({ field }) => (
										<FormItem>
											<FormLabel>API Key</FormLabel>
											<FormControl>
												<Input {...field}/>
											</FormControl>
											<FormDescription>
												Your exchange API key for
												read-only access
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="apiSecret"
									render={({ field }) => (
										<FormItem>
											<FormLabel>API Secret</FormLabel>
											<FormControl>
												<Input
													type="password"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Your exchange API secret for
												read-only access
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<p className="text-sm text-muted-foreground">
									Your API keys are encrypted and stored
									securely. We only use read-only access to
									fetch your balances and transactions.
								</p>

								<div className="flex justify-end space-x-2">
									<Button
										variant="outline"
										type="button"
										onClick={handleCancel}
									>
										Cancel
									</Button>
									<Button type="submit" disabled={isLoading}>
										{isLoading
											? "Connecting..."
											: "Connect Exchange"}
									</Button>
								</div>
							</form>
						</Form>
					</div>
				) : (
					// Show exchange selection
					<Tabs defaultValue="centralized" className="py-4">
						<TabsList className="grid w-full grid-cols-1">
							<TabsTrigger value="centralized">
								Centralized Exchanges
							</TabsTrigger>
							{/* <TabsTrigger value="wallets">Wallets</TabsTrigger> */}
						</TabsList>
						<TabsContent value="centralized" className="mt-4">
							<div className="grid grid-cols-2 gap-4">
								{isLoading ? (
									<p>Loading exchanges...</p>
								) : (
									exchanges?.data?.map((exchange) => (
                                        <Card
                                            key={exchange.id}
                                            className={`cursor-pointer hover:border-primary transition-colors ${
                                                exchange.is_connected
                                                    ? "border-green-500"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleExchangeSelect(exchange.id)
                                            }
                                        >
                                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                                <div className="flex items-center space-x-2">
                                                    {exchange.img_url && (
                                                        <img
                                                            src={exchange.img_url || "/placeholder.svg"}
                                                            alt={exchange.name}
                                                            className="h-8 w-8"
                                                        />
                                                    )}
                                                    <CardTitle className="text-lg">
                                                        {exchange.name}
                                                    </CardTitle>
                                                </div>
                                                {exchange.is_connected ? (
                                                    <Check className="h-5 w-5 text-green-500" />
                                                )
												: (
													<X className="h-5 w-5 text-red-500" />
												)}
                                            </CardHeader>
                                            <CardContent className="pb-4">
                                                <CardDescription>
                                                    {exchange.is_connected
                                                        ? "Connected"
                                                        : "Connect to import your balances and transactions"}
                                                </CardDescription>
                                            </CardContent>
                                        </Card>
                                    ))
								)}
							</div>
						</TabsContent>
					</Tabs>
				)}
			</DialogContent>
		</Dialog>
	);
}
