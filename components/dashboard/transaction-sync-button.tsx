"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, RefreshCw, AlertTriangle } from "lucide-react"
import { useSyncTransactionsMutation } from "@/lib/store/services/portfolio-api"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setSyncStatus } from "@/lib/store/features/portfolios-slice"

type SyncStatus = "syncing" | "success" | "error" | ""

interface TransactionSyncButtonProps {
  className?: string
  portfolio_id: number
}

export function TransactionSyncButton({ className = "", portfolio_id }: TransactionSyncButtonProps) {
  const [syncStatus, setSyncStatusLocal] = useState<SyncStatus>("")
  const [errorMessage, setErrorMessage] = useState("")
  const [syncTransactions] = useSyncTransactionsMutation()
  const syncStatusKey = `sync-transactions-${portfolio_id}`
  const dispatch = useAppDispatch()
  const rSyncStatus = useAppSelector((state) => state.portfolios.syncStatus)
  const hasInitialSync = useRef(false)

  useEffect(() => {
    if (rSyncStatus) {
      setSyncStatusLocal(rSyncStatus)
      sessionStorage.setItem(syncStatusKey, rSyncStatus)
    }
  }, [rSyncStatus, syncStatusKey])

  useEffect(() => {
    const savedStatus = sessionStorage.getItem(syncStatusKey)
    if (savedStatus) {
      setSyncStatusLocal(savedStatus as SyncStatus)
    }

    if (!savedStatus && !hasInitialSync.current) {
      hasInitialSync.current = true
      startSync()
    }
  }, [syncStatusKey])

  const startSync = async () => {
    if (syncStatus === "syncing" || sessionStorage.getItem(syncStatusKey) === "syncing") {
      return
    }

    setSyncStatusLocal("syncing")
    dispatch(setSyncStatus("syncing"))
    setErrorMessage("")
    sessionStorage.setItem(syncStatusKey, "syncing")

    try {
      const res = await syncTransactions({ portfolio_id }).unwrap()
      const status = res.data?.status || "error"
      setSyncStatusLocal(status)
      dispatch(setSyncStatus(status))
      sessionStorage.setItem(syncStatusKey, status)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Synchronization failed"
      setSyncStatusLocal("error")
      dispatch(setSyncStatus("error"))
      sessionStorage.setItem(syncStatusKey, "error")
      setErrorMessage(errorMsg)
    }
  }


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
