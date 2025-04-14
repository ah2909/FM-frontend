"use client"

import { useState } from "react"
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
import { TokenExchange } from "./exchange-asset-selector"
import { useAddTokenToPortfolioMutation } from "@/lib/store/services/portfolio-api"

interface ImportDataButtonProps {
  portfolio_id: number
}

export function ImportDataButton({ portfolio_id }: ImportDataButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const [ addTokenToPortfolio ] = useAddTokenToPortfolioMutation()

  const handleAssetsSelected = async (assets: TokenExchange[]) => {
    if (assets.length === 0) return
    try {
      await addTokenToPortfolio({ 
        portfolio_id: portfolio_id, 
        token: assets.map((asset) => ({
          symbol: asset.symbol, 
          amount: asset.amount,
        })) 
    })
      toast.success(`${assets.length} assets added to portfolio`)
      setIsOpen(false)
    } catch (error) {
      toast.error("Failed to add assets to portfolio")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Download className="mr-2 h-4 w-4" />
          Import Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Exchange Data</DialogTitle>
          <DialogDescription>Select assets from your connected exchanges to add to this portfolio.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ExchangeAssetSelector onAssetsSelected={handleAssetsSelected} />
        </div>
      </DialogContent>
    </Dialog>
  )
}