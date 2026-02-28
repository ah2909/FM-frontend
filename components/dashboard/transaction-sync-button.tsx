"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, RefreshCw, AlertTriangle } from "lucide-react"
import { useSyncTransactionsMutation } from "@/lib/store/services/portfolio-api"
import { useWebSocketEvent } from "@/hooks/useWebSocketEvent"
import { useDispatch, useSelector } from "react-redux"
import { syncTransactionsByAssetID } from "@/lib/store/features/portfolios-slice"

type SyncStatus = "syncing" | "success" | "error" | ""

interface TransactionSyncButtonProps {
  className?: string
  portfolio_id: number
}

export function TransactionSyncButton({ className = "", portfolio_id }: TransactionSyncButtonProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("")
  const [errorMessage, setErrorMessage] = useState("")
  const [syncTransactions] = useSyncTransactionsMutation()
  const syncStatusKey = `sync-transactions-${portfolio_id}`
  const dispatch = useDispatch()
  const assets = useSelector((state: any) => state.portfolios.assets)
  const hasInitialSync = useRef(false)

  // Synchronize status with session storage on mount
  useEffect(() => {
    const savedStatus = sessionStorage.getItem(syncStatusKey)
    if (savedStatus) {
      setSyncStatus(savedStatus as SyncStatus)
    }
    
    // Auto-start sync only if not already syncing and haven't tried this session
    if (!savedStatus && !hasInitialSync.current) {
      hasInitialSync.current = true
      startSync()
    }
  }, [syncStatusKey])

  const startSync = async () => {
    // Prevent multiple concurrent sync calls
    if (syncStatus === "syncing" || sessionStorage.getItem(syncStatusKey) === "syncing") {
      return
    }

    setSyncStatus("syncing")
    setErrorMessage("")
    sessionStorage.setItem(syncStatusKey, "syncing")

    try {
      const res = await syncTransactions({ portfolio_id }).unwrap()
      const status = res.data?.status || "error"
      setSyncStatus(status)
      sessionStorage.setItem(syncStatusKey, status)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Synchronization failed"
      setSyncStatus("error")
      sessionStorage.setItem(syncStatusKey, "error")
      setErrorMessage(errorMsg)
    }
  }

  const getExchangeId = useCallback((exchange: string) => {
    const exchangeMap: Record<string, number> = {
      binance: 1,
      okx: 2,
      bybit: 3,
    }
    return exchangeMap[exchange] ?? null
  }, [])

  // Listen for sync-transactions event
  // Note: If multiple instances of this button are mounted (e.g. Mobile + Desktop menus),
  // they will all receive this event. The Redux reducer is now idempotent to handle this.
  useWebSocketEvent("sync-transactions", "", (data: any) => {
    console.log("sync-transactions", data)
    const status = data?.status
    if (!status) return

    setSyncStatus(status)
    sessionStorage.setItem(syncStatusKey, status)

    if (status === "success" && data?.data && data.data.length > 0) {
      data.data.forEach((transaction: any) => {
        // Find matching asset
        const asset = assets.find((a: any) => 
          a.symbol.toUpperCase() === transaction.symbol.split('/')[0].toUpperCase()
        )
        
        if (asset) {
          dispatch(syncTransactionsByAssetID({
            assetId: asset.id,
            transaction: {
              id: transaction.id,
              portfolio_id: portfolio_id,
              asset_id: asset.id,
              exchange_id: getExchangeId(transaction.exchange),
              quantity: transaction.amount,
              price: transaction.price,
              type: transaction.side.toUpperCase(),
              transact_date: new Date(transaction.timestamp).toISOString().slice(0, 19).replace("T", " "),
            },
          }))
        }
      })
    }
  })

  // Memoize sync content
  const syncContent = useMemo(() => {
    const content = {
      syncing: {
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        text: "Syncing...",
        className: "bg-blue-100 text-blue-700 border border-blue-200",
      },
      success: {
        icon: <CheckCircle className="h-4 w-4" />,
        text: "Synced",
        className: "bg-green-100 text-green-700 border border-green-200",
      },
      error: {
        icon: <XCircle className="h-4 w-4" />,
        text: "Sync failed",
        className: "bg-red-100 text-red-700 border border-red-200",
      },
    }
    return content[syncStatus as keyof typeof content] || content.syncing
  }, [syncStatus])

  return (
    <div className={`transaction-sync-container ${className}`}>
      {/* CSS for transitions */}
      <style jsx>{`
        .button-transition {
          transition: all 0.2s ease;
          opacity: 0;
          transform: scale(0.95);
        }
        
        .button-transition.visible {
          opacity: 1;
          transform: scale(1);
        }
        
        .progress-transition {
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(-20px);
        }
        
        .progress-transition.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .alert-transition {
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(-20px);
        }
        
        .alert-transition.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .progress-bar {
          transition: width 0.3s ease;
        }
        
        .success-pulse {
          animation: ${syncStatus === "success" ? "pulse 0.3s" : "none"};
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>

      {syncStatus !== "error" && (
        <div className={`button-transition visible`}>
          <Button
            disabled={true}
            className={`${syncContent?.className} min-w-[120px] sm:min-w-[160px] transition-all duration-200 text-xs sm:text-sm`}
          >
            <div className={`flex items-center gap-1 sm:gap-2 ${syncStatus === "success" ? "success-pulse" : ""}`}>
              {syncContent?.icon}
              <span className="hidden sm:inline">{syncContent?.text}</span>
              <span className="sm:hidden">{syncContent?.text.split(" ")[0]}</span>
            </div>
          </Button>
        </div>
      )}

      {/* Error Message with Retry Options */}
      {syncStatus === "error" && (
        <div className={`alert-transition mt-4 visible`}>
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="mb-3 text-sm">
                <strong>Synchronization failed:</strong> {errorMessage}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button size="sm" onClick={startSync} className="bg-red-600 hover:bg-red-700 text-white text-xs">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry Sync
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={startSync}
                  className="border-red-300 text-red-700 hover:bg-red-50 text-xs bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
