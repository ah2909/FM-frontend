"use client"

import { useState } from "react"
import { Plug, FileText, Upload, CheckCircle, AlertCircle, ChevronLeft, Loader2Icon } from 'lucide-react'
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { BaseShell } from "@/components/base-shell"
import { BaseHeader } from "@/components/base-header"
import ProtectedRoute from "@/components/ProtectedRoute"
import { toast } from "sonner"
import { useImportTransactionsMutation } from "@/lib/store/services/portfolio-api"
import { useGetSupportedCEXQuery, type Exchange } from "@/lib/store/services/exchange-api"
import { useWebSocketEvent } from "@/hooks/useWebSocketEvent"
import Image from "next/image"

interface ExchangeGuide {
  name: string
  steps: string[]
  notes?: string[]
}

const exchangeGuides: Record<string, ExchangeGuide> = {
  binance: {
    name: "Binance",
    steps: [
      "Log in to your Binance account",
      "Go to 'Wallet' → 'Transaction History'",
      "Select 'Spot Trading' and set your date range",
      "Click 'Export Complete Trade History'",
      "Download the CSV file when ready"
    ],
    notes: [
      "We do not support with importing Binance CSV file now."
    ]
  },
  bybit: {
    name: "Bybit",
    steps: [
      "Log in to your Bybit account",
      "Go to 'Orders' → 'Unified Trading Order'",
      "In tab 'Spot Orders', select tab 'Trade History'",
      "Click Export in the top right corner",
      "Select longest date range available",
      "Click 'Export' and download CSV"
    ],
    notes: [
      "You can only get CSV file from browser version of Bybit",
      "You can export data from any 6-month period within the last 2 years",
      "Select SPOT trading (if any) and the longest period of time available"
    ]
  },
  okx: {
    name: "OKX",
    steps: [
      "Log in to your OKX account",
      "Go to 'Assets' → 'Order Center'",
      "Select 'Trading History' tab",
      "Click download icon in the top right corner",
      "Select 'Spot' for Instrument, longest date range available",
      "Click 'Export' and download CSV"
    ],
    notes: [
      "You can only get CSV file from browser version of OKX",
      "You must remove first line of CSV file before importing",
      "Select SPOT trading (if any) and the longest period of time available",
    ]
  }
}

export default function ImportPage() {
  const router = useRouter()
  const [selectedExchange, setSelectedExchange] = useState<string>("bybit")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const { data: exchanges, isLoading: isLoadingExchange } = useGetSupportedCEXQuery()
  const [ importTransactions, { isLoading: isLoadingImport } ] = useImportTransactionsMutation()

  const connectedExchanges = exchanges?.data?.filter((exchange: Exchange) => exchange.is_connected) || []
  const hasConnectedExchanges = connectedExchanges.length > 0

  useWebSocketEvent("import-csv-transactions", "", (data: any) => {
    if (data?.success) {
      toast.success(data?.message ?? 'CSV transactions imported successfully.')
      setTimeout(() => window.location.href = "/portfolios", 2000)
    } else {
      toast.error("Failed to import CSV transactions.")
    }
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/csv') {
      setUploadedFile(file)
    } else {
      toast.error("Please select a valid CSV file")
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type === 'text/csv') {
      setUploadedFile(file)
    } else {
      toast.error("Please drop a valid CSV file")
    }
  }

  const processImport = async () => {
    if (!uploadedFile) return
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('exchange', selectedExchange);
      importTransactions(formData)
    } catch (error) {
      toast.error("Failed to process CSV file")
    }
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

  const mobileMenuItems = [
    {
      label: "Back",
      icon: <ChevronLeft className="h-4 w-4" />,
      onClick: () => router.back(),
    },
  ]

  const currentGuide = exchangeGuides[selectedExchange]

  return (
    <ProtectedRoute>
      <BaseShell>
        <BaseHeader
          heading="Import Transaction History"
          text="Import your complete trading history from exchange CSV files"
          mobileMenuItems={mobileMenuItems}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </BaseHeader>
        <div className="space-y-6">
          {/* Connection Status Alert */}
          {!hasConnectedExchanges && (
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
            <Plug className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">No exchanges connected</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    For the best experience, connect your exchanges first. This allows us to automatically sync your
                    current balances and avoid duplicate transactions when importing CSV data.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    onClick={() => router.push("/exchanges")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plug className="mr-2 h-4 w-4" />
                    Connect Exchanges
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
          )}

          {/* Connected Exchanges Status */}
          {hasConnectedExchanges && (
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                      Connected Exchanges ({connectedExchanges.length})
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {connectedExchanges.map((exchange: any) => (
                        <div
                          key={exchange.id}
                          className="flex items-center gap-2 bg-white dark:bg-green-950/40 rounded-md px-2 py-1 border border-green-200 dark:border-green-800"
                        >
                          <Image
                            src={mappingExchangesLogo(exchange.id) || "/placeholder.svg"}
                            alt={exchange.name}
                            width={16}
                            height={16}
                            className="rounded-sm"
                          />
                          <span className="text-sm font-medium text-green-800 dark:text-green-200">
                            {exchange.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Great! We'll automatically check for duplicates when importing your CSV data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Exchange Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Select Your Exchange
              </CardTitle>
              <CardDescription>
                Choose the exchange you want to import transaction history from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedExchange} onValueChange={setSelectedExchange}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="binance" className="relative">
                    <div className="flex items-center gap-2">
                      <span>Binance</span>
                      {!connectedExchanges.some((ex: any) => ex.name.toLowerCase() === "binance") && (
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="bybit" className="relative">
                    <div className="flex items-center gap-2">
                      <span>Bybit</span>
                      {!connectedExchanges.some((ex: any) => ex.name.toLowerCase() === "bybit") && (
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="okx" className="relative">
                    <div className="flex items-center gap-2">
                      <span>OKX</span>
                      {!connectedExchanges.some((ex: any) => ex.name.toLowerCase() === "okx") && (
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  </TabsTrigger>
                </TabsList>

                {Object.entries(exchangeGuides).map(([key, guide]) => (
                  <TabsContent key={key} value={key} className="mt-6">
                    <div className="space-y-4">
                      {/* Connection Status for this exchange */}
                      {!connectedExchanges.some((ex: any) => ex.name.toLowerCase() === key) ? (
                        <Alert className="mb-4 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
                          <Plug className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <AlertDescription>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div>
                                <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                                  {guide.name} not connected
                                </p>
                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                  Connect your {guide.name} account to automatically sync balances and prevent duplicate
                                  transactions.
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.push("/exchanges")}
                                className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-950/40 bg-transparent flex-shrink-0"
                              >
                                <Plug className="mr-2 h-4 w-4" />
                                Connect {guide.name}
                              </Button>
                            </div>
                          </AlertDescription>
                        </Alert>
                      ) : (
                      <>
                      {/* Export Instructions */}
                      <div>
                        <h4 className="font-semibold mb-3">How to export from {guide.name}:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                          {guide.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      {/* Notes */}
                      {guide.notes && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {guide.notes.map((note, index) => (
                                <li key={index}>{note}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}
                      </>
                    )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* File Upload */}
          {connectedExchanges.some((ex: any) => ex.name.toLowerCase() === selectedExchange && ex.name.toLowerCase() !== 'binance') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload CSV File
                </CardTitle>
                <CardDescription>
                  Upload your {currentGuide.name} transaction history CSV file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Upload Area */}
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('csv-upload')?.click()}
                  >
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    {uploadedFile ? (
                      <div>
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium mb-2">Drop your CSV file here or click to browse</p>
                        <p className="text-sm text-muted-foreground">
                          Supports CSV files up to 10MB
                        </p>
                      </div>
                    )}
                    <input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={processImport}
                      disabled={!uploadedFile || isLoadingImport}
                      className="flex-1"
                    >
                      { isLoadingImport ? 'Importing' : 'Import Transactions' }
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </BaseShell>
    </ProtectedRoute>
  )
}
