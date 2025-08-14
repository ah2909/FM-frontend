"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Check, Plus, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetSupportedCEXQuery, useConnectExchangeMutation, type Exchange } from "@/lib/store/services/exchange-api"
import Image from "next/image"
import { useWebSocketEvent } from "@/hooks/useWebSocketEvent"

const formSchema = z.object({
  api_key: z.string().min(1, { message: "API Key is required" }),
  secret_key: z.string().min(1, { message: "API Secret is required" }),
  password: z.string().optional(),
  cex_name: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function UserExchanges() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedExchange, setSelectedExchange] = useState<number | null>(null)

  const { data: exchanges, isLoading } = useGetSupportedCEXQuery()
  const [connectExchange, { isLoading: isConnecting }] = useConnectExchangeMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      api_key: "",
      secret_key: "",
    },
  })
  useWebSocketEvent("update-portfolio", "", (data: any) => {
    if(data?.success) {
      toast.success("Portfolio updated successfully!", {
        action: {
          label: 'Update',
          onClick: () => window.location.reload(),
        },
      })
    }
    else {
      toast.error("Failed to update portfolio.")
    }
  })
  const handleExchangeSelect = (exchangeId: number) => {
    const exchange = exchanges?.data?.find((e: Exchange) => e.id === exchangeId)

    if (exchange?.is_connected) {
      // If already connected, we could trigger a sync or show details
      toast.info(`${exchange.name} is already connected`)
      return
    }

    setSelectedExchange(exchangeId)
    form.reset()
  }

  async function onSubmit(data: FormValues) {
    const exchange = exchanges?.data?.find((e: Exchange) => e.id === selectedExchange)
    data.cex_name = exchange?.name

    try {
      await connectExchange(data).unwrap()
      toast.success(`${exchange?.name} connected successfully! Processing your portfolio data...`)
      setSelectedExchange(null)
      setIsOpen(false)
      form.reset()
    } catch (error) {
      if(error?.status === 400) {
        toast.error("Invalid API Key or Secret")
      }
      else
        toast.error("Failed to connect exchange")
    }
  }

  const handleCancel = () => {
    setSelectedExchange(null)
    form.reset()
  }

  const mappingExchangesLogo = (exchange_id: number) => {
    switch (exchange_id) {
      case 1:
        return "/binance.png"
      case 2:
        return "/okx.png"
      case 3:
        return "/bybit.png"
      default:
        return "/placeholder-logo.png"
    }
  }

  const connectedExchanges = exchanges?.data?.filter((exchange: Exchange) => exchange.is_connected) || []

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Your Connected Exchanges</h2>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Connect Exchange
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Connect Exchange</DialogTitle>
                <DialogDescription>
                  Connect to cryptocurrency exchanges to import your balances and transactions.
                  <span className="block mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-blue-700 dark:text-blue-300 text-sm">
                    💡 After connecting, we'll automatically compare and update your portfolio assets. This may take a
                    few minutes for large portfolios.
                  </span>
                </DialogDescription>
              </DialogHeader>

              {selectedExchange ? (
                <div className="py-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="api_key"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Key</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>Your exchange API key for read-only access</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="secret_key"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Secret</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Passphrase (Optional)</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>
                              Only required for some exchanges. Check your exchange's API documentation.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          🔒 Your API keys are encrypted and stored securely. We only use read-only access to fetch your
                          balances and transactions.
                        </p>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" type="button" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isConnecting}>
                          {isConnecting ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            "Connect Exchange"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              ) : (
                <Tabs defaultValue="centralized" className="py-4">
                  <TabsList className="grid w-full grid-cols-1">
                    <TabsTrigger value="centralized">Centralized Exchanges</TabsTrigger>
                  </TabsList>
                  <TabsContent value="centralized" className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {isLoading ? (
                        <p>Loading exchanges...</p>
                      ) : (
                        exchanges?.data?.map((exchange: Exchange) => (
                          <Card
                            key={exchange.id}
                            className={`cursor-pointer hover:border-primary transition-colors ${
                              exchange.is_connected ? "border-green-500 bg-green-50/50 dark:bg-green-950/20" : ""
                            }`}
                            onClick={() => handleExchangeSelect(exchange.id)}
                          >
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                              <div className="flex items-center space-x-2">
                                <Image
                                  src={mappingExchangesLogo(exchange.id)}
                                  alt={exchange.name}
                                  width={40}
                                  height={40}
                                  className="rounded-md"
                                />
                                <CardTitle className="text-lg">{exchange.name}</CardTitle>
                              </div>
                              {exchange.is_connected ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : (
                                <X className="h-5 w-5 text-red-500" />
                              )}
                            </CardHeader>
                            <CardContent className="pb-4">
                              <CardDescription>
                                {exchange.is_connected
                                  ? "✅ Connected and synced"
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
        </div>

        {isLoading ? (
          <div>Loading connected exchanges...</div>
        ) : connectedExchanges.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Connected Exchanges</CardTitle>
              <CardDescription>
                You haven't connected any exchanges yet. Connect an exchange to import your balances and transactions.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {connectedExchanges.map((exchange: any) => (
              <Card key={exchange.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={mappingExchangesLogo(exchange.id)}
                      alt={exchange.name}
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                    <CardTitle>{exchange.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription> 
                    ✅ Connected and ready
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
