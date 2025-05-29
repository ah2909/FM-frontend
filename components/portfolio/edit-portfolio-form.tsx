"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { useUpdatePortfolioMutation } from "@/lib/store/services/portfolio-api"

const formSchema = z.object({
	name: z.string().min(2, {
		message: "Portfolio name must be at least 2 characters.",
	}),
	description: z.string().optional(),
});

interface EditPortfolioFormProps {
	portfolio: {
		id: number;
		name: string;
		description: string;
	};
}

export function EditPortfolioForm({ portfolio }: EditPortfolioFormProps) {
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: portfolio.name,
			description: portfolio.description,
		},
	});
	const [updatePortfolio, {isLoading}] = useUpdatePortfolioMutation();

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await updatePortfolio({
				id: portfolio.id, 
				portfolio: values
			}).unwrap()

			toast.success("Your portfolio has been updated successfully.");

			router.push(`/portfolios`);
		} catch (error) {
			toast.error("Something went wrong. Please try again.");
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
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Portfolio Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Long Term Hodl"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										This is the name of your portfolio.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Long-term investment portfolio for holding crypto assets"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										A brief description of your portfolio's
										purpose.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Update Portfolio</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
