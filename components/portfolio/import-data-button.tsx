"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ExchangeAssetSelector } from "./exchange-asset-selector"
import type { TokenExchange } from "./exchange-asset-selector"
import { useAddTokenToPortfolioMutation } from "@/lib/store/services/portfolio-api"
import { cn } from "@/lib/utils"

interface ImportDataButtonProps {
  portfolio_id: number
  assets_array: any[]
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link"
  className?: string
}

export function ImportDataButton({ 
  portfolio_id, 
  assets_array,
  variant = "default",
  className,
}: ImportDataButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [addTokenToPortfolio] = useAddTokenToPortfolioMutation()

  const handleAssetsSelected = async (assets: TokenExchange[]) => {
    if (assets.length === 0) return
    try {
      const response = await addTokenToPortfolio({
        portfolio_id: portfolio_id,
        token: assets.map((asset) => ({
          symbol: asset.symbol,
          amount: asset.amount,
          exchange: asset.exchanges,
        })),
      })
      if (response.data?.success) {
        toast.success(`${assets.length} assets added to portfolio`)
      } else {
        toast.error("Failed to add assets to portfolio.")
      }
      setIsOpen(false)
    } catch (error) {
      toast.error("Failed to add assets to portfolio")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className={cn(variant === "default" ? "w-full sm:w-auto text-sm" : "", className)}>
          <Download className="mr-2 h-4 w-4" />
          <span className={variant === "default" ? "hidden sm:inline" : ""}>Import Data</span>
          {variant === "default" && <span className="sm:hidden">Import</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Import Assets from Exchanges</DialogTitle>
          <DialogDescription className="text-sm">
            Select assets from your connected exchanges to include in this portfolio.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <ExchangeAssetSelector
            onAssetsSelected={handleAssetsSelected}
            setIsOpen={setIsOpen}
            assets_array={assets_array}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
