"use client"

import { AlertTriangle, FileText, X } from 'lucide-react'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface TransactionHistoryWarningProps {
  className?: string
}

export function TransactionHistoryWarning({ className }: TransactionHistoryWarningProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  const router = useRouter()

  if (isDismissed) return null

  const handleImportClick = () => {
    router.push('/transactions/import')
  }

  return (
    <Alert className={`border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1">
          <p className="text-amber-800 dark:text-amber-200 font-medium">
            Missing transaction history?
          </p>
          <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
            If you see incomplete transaction history, you can import your full trading data from CSV files.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={handleImportClick}
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-600 dark:hover:bg-amber-700"
          >
            <FileText className="mr-2 h-4 w-4" />
            Import CSV Data
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/20"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
