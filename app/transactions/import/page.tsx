"use client"

import { useState } from "react"
import { ArrowLeft, Download, FileText, Upload, CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react'
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BaseShell } from "@/components/base-shell"
import { BaseHeader } from "@/components/base-header"
import ProtectedRoute from "@/components/ProtectedRoute"
import { toast } from "sonner"
import { useImportTransactionsMutation } from "@/lib/store/services/portfolio-api"
import { useWebSocketEvent } from "@/hooks/useWebSocketEvent"

interface ExchangeGuide {
  name: string
  steps: string[]
  notes?: string[]
}

const exchangeGuides: Record<string, ExchangeGuide> = {
  // binance: {
  //   name: "Binance",
  //   steps: [
  //     "Log in to your Binance account",
  //     "Go to 'Wallet' → 'Transaction History'",
  //     "Select 'Spot Trading' and set your date range",
  //     "Click 'Export Complete Trade History'",
  //     "Download the CSV file when ready"
  //   ],
  //   notes: [
  //     "Select SPOT trading (if any) and the longest period of time available"
  //   ]
  // },
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
      "You must remove first line of CSV file before importing",
      "Select SPOT trading (if any) and the longest period of time available",
    ]
  }
}

export default function ImportPage() {
  const router = useRouter()
  const [selectedExchange, setSelectedExchange] = useState<string>("bybit")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [importResults, setImportResults] = useState<{
    success: number
    errors: number
    total: number
  } | null>(null)
  const [importTransactions, isLoading] = useImportTransactionsMutation()

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
      setImportResults(null)
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
      setImportResults(null)
    } else {
      toast.error("Please drop a valid CSV file")
    }
  }

  const processImport = async () => {
    if (!uploadedFile) return

    setIsProcessing(true)
    setProcessingProgress(0)

    // Simulate processing with progress updates
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('exchange', selectedExchange);
      await importTransactions(formData)
      setProcessingProgress(100)
      setImportResults({
        success: 100, // Simulated success count
        errors: 0, // Simulated error count
        total: 100 // Simulated total rows processed
      })
    } catch (error) {
      toast.error("Failed to process CSV file")
    } finally {
      setIsProcessing(false)
      clearInterval(progressInterval)
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
                <TabsList className="grid w-full grid-cols-2">
                  {/* <TabsTrigger value="binance">Binance</TabsTrigger> */}
                  <TabsTrigger value="bybit">Bybit</TabsTrigger>
                  <TabsTrigger value="okx">OKX</TabsTrigger>
                </TabsList>

                {Object.entries(exchangeGuides).map(([key, guide]) => (
                  <TabsContent key={key} value={key} className="mt-6">
                    <div className="space-y-4">
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
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* File Upload */}
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

                {/* Processing */}
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Processing CSV file...</span>
                      <span>{processingProgress}%</span>
                    </div>
                    <Progress value={processingProgress} />
                  </div>
                )}

                {/* Results */}
                {importResults && (
                  <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium text-green-800 dark:text-green-200">
                          Import completed successfully!
                        </p>
                        <div className="text-sm text-green-700 dark:text-green-300">
                          <p>✅ {importResults.success} transactions imported</p>
                          {importResults.errors > 0 && (
                            <p>⚠️ {importResults.errors} rows had errors and were skipped</p>
                          )}
                          <p>📊 Total processed: {importResults.total} rows</p>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {!importResults && (
                  <Button
                    onClick={processImport}
                    disabled={!uploadedFile || isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? "Processing..." : "Import Transactions"}
                  </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </BaseShell>
    </ProtectedRoute>
  )
}
