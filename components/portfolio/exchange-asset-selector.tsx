"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { 
  useGetInfoExchangeQuery,
} from "@/lib/store/services/exchange-api"

interface ExchangeAssetSelectorProps {
  onAssetsSelected: (assets: any[]) => void
}

export interface TokenExchange {
  symbol: string
  price: number
  amount: number
  value: number
  img_url: string
  exchanges: string[]
}

export function ExchangeAssetSelector({ onAssetsSelected }: ExchangeAssetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])

  // RTK Query hooks
  const { data: account_asset, isLoading: isLoadingAsset } = useGetInfoExchangeQuery()

  const handleAssetToggle = (asset: string) => {
    setSelectedAssets((prev) => {
      if (prev.includes(asset)) {
        return prev.filter((tmp) => tmp !== asset)
      } else {
        return [...prev, asset]
      }
    })
  }

  const handleConfirm = () => {
    if (selectedAssets.length === 0) return;

    // Get the full asset objects for selected assets
    const selectedAssetObjects = account_asset?.data.filter((asset: TokenExchange) => selectedAssets.includes(asset.symbol))
    onAssetsSelected(selectedAssetObjects)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Import Assets from Exchanges
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Assets from Exchanges</DialogTitle>
          <DialogDescription>
            Choose which assets from your connected exchanges to include in this portfolio.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoadingAsset ? (
            <div className="py-4 text-center">Loading assets...</div>
          ) : !account_asset?.data || account_asset?.data.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">No assets found in this exchange.</div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <p className="text-sm font-medium">Select assets to include in your portfolio</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAssets(account_asset?.data.map((asset: TokenExchange) => asset.symbol))}
                >
                  Select All
                </Button>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {account_asset?.data.map((asset: TokenExchange, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center">
                      <Checkbox
                        id={asset.symbol}
                        checked={selectedAssets.includes(asset.symbol)}
                        onCheckedChange={() => handleAssetToggle(asset.symbol)}
                      />
                      <div className="flex items-center ml-3">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={asset.img_url} alt={asset.symbol} />
                          <AvatarFallback>{asset.symbol}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Label className="font-medium cursor-pointer">
                            {asset.symbol}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {asset.amount} {asset.symbol} (${asset.value ?? Number(asset.amount*asset.price).toFixed(2)})
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button 
                    onClick={handleConfirm} 
                    disabled={selectedAssets.length === 0}
                >
                  Add {selectedAssets.length} Assets
                </Button>
              </div>
            </div>
            )}
        </div>

      </DialogContent>
    </Dialog>
  )
}

