"use client"

import { toast } from "sonner"
import { useWebSocketEvent } from "@/hooks/useWebSocketEvent"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setAnalysis, type PortfolioAnalysis } from "@/lib/store/features/analyze-slice"
import { syncTransactionsByAssetID, setSyncStatus, setAssets } from "@/lib/store/features/portfolios-slice"
import { prependNotification } from "@/lib/store/features/notifications-slice"
import { portfolioApi } from "@/lib/store/services/portfolio-api"
import { randomUUID } from "crypto"

const EXCHANGE_ID: Record<string, number> = { binance: 1, okx: 2, bybit: 3 }

export function WsEventListener() {
  const dispatch = useAppDispatch()
  const assets = useAppSelector((state) => state.portfolios.assets)
  const portfolioId = useAppSelector((state) => state.portfolios.portfolio?.id)

  // ── Real-time notification ───────────────────────────────────────────────
  useWebSocketEvent("new-notification", "", (data: any) => {
    dispatch(prependNotification(data))
  })

  // ── Portfolio Analysis (LLM result, slow) ────────────────────────────────
  useWebSocketEvent<{ data: PortfolioAnalysis }>(
    "portfolio-analysis", "",
    (payload) => {
      dispatch(setAnalysis(payload.data))
      toast.success("Portfolio analysis complete")
    }
  )

  // ── Exchange connected → assets synced in background ─────────────────────
  useWebSocketEvent("update-portfolio", "", (data: any) => {
    if (data?.success) {
      toast.success("Portfolio updated successfully!", {
        id: "connect-exchange",
        description: "Your assets have been synced from the exchange.",
      })
      dispatch(portfolioApi.util.invalidateTags(["Portfolio"]))
    } else {
      toast.error("Failed to update portfolio data.", { id: "connect-exchange" })
    }
  })

  // ── Import assets from exchange → added to portfolio ─────────────────────
  useWebSocketEvent("add-token-to-port", "", (data: any) => {
    if (data?.success) {
      toast.success(data?.message ?? "Tokens added to portfolio successfully.", {
        id: "import-assets",
      })
      // data.data is the full updated asset list — map to Token shape and update
      // store directly. price/value/percentChange will be filled by the ticker stream.
      if (Array.isArray(data.data)) {
        dispatch(setAssets(data.data.map((item: any) => ({
          id: item.id,
          symbol: item.symbol,
          name: item.name,
          img_url: item.img_url,
          amount: item.pivot.amount,
          avg_price: item.pivot.avg_price,
          price: 0,
          value: 0,
          percentChange: 0,
        }))))
      }
    } else {
      toast.error("Failed to add tokens to portfolio.", { id: "import-assets" })
    }
  })

  // ── CSV transaction import complete ──────────────────────────────────────
  useWebSocketEvent("import-csv-transactions", "", (data: any) => {
    if (data?.success) {
      toast.success(data?.message ?? "CSV transactions imported successfully.")
      dispatch(portfolioApi.util.invalidateTags(["Portfolio"]))
    } else {
      toast.error("Failed to import CSV transactions.")
    }
  })

  // ── Transaction sync (exchange → portfolio) ───────────────────────────────
  useWebSocketEvent("sync-transactions", "", (data: any) => {
    const status = data?.success ? 'success' : 'error'
    if (!status) return

    dispatch(setSyncStatus(status))

    if (status === "success" && data?.data?.length > 0) {
      data.data.forEach((tx: any) => {
        const asset = assets.find(
          (a: any) => a.symbol.toUpperCase() === tx.symbol.split("/")[0].toUpperCase()
        )
        if (asset) {
          dispatch(
            syncTransactionsByAssetID({
              assetId: asset.id,
              transaction: {
                id: tx.id,
                portfolio_id: portfolioId,
                asset_id: asset.id,
                exchange_id: EXCHANGE_ID[tx.exchange],
                quantity: tx.quantity,
                price: tx.price,
                type: tx.type.toUpperCase(),
                transact_date: new Date(tx.transact_date)
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " "),
              },
            })
          )
        }
      })
    }
  })

  return null
}
