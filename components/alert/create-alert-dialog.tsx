"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Plus, RefreshCw, TrendingDown, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateAlertMutation } from "@/lib/store/services/alert-api"
import { getServerError } from "./utils"

const formSchema = z.object({
  symbol: z
    .string()
    .min(1, { message: "Symbol is required" })
    .regex(/^[A-Za-z0-9]+$/, { message: "Use a trading pair like BTCUSDT" }),
  condition: z.enum(["above", "below"]),
  price: z
    .string()
    .min(1, { message: "Price is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be greater than 0",
    }),
})

type FormValues = z.infer<typeof formSchema>

export function CreateAlertDialog() {
  const [open, setOpen] = useState(false)
  const [createAlert, { isLoading }] = useCreateAlertMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { symbol: "", condition: "above", price: "" },
  })

  async function onSubmit(values: FormValues) {
    try {
      await createAlert({
        // Server stores symbols uppercased — mirror that client-side.
        symbol: values.symbol.toUpperCase(),
        condition: values.condition,
        price: Number(values.price),
      }).unwrap()
      toast.success("Alert created — the engine will start watching within ~15s")
      setOpen(false)
      form.reset()
    } catch (error) {
      toast.error(getServerError(error, "Could not create the alert"))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Alert
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Create a price alert</DialogTitle>
          <DialogDescription>
            We&apos;ll message your Telegram bot when the condition is met.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trading pair</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="BTCUSDT"
                      autoCapitalize="characters"
                      className="uppercase"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormDescription>The Binance-style pair, e.g. ETHUSDT.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="above">
                          <span className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                            Above
                          </span>
                        </SelectItem>
                        <SelectItem value="below">
                          <span className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            Below
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        inputMode="decimal"
                        placeholder="60000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Alert"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
