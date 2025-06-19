"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { 
  useGetInfoExchangeQuery,
} from "@/lib/store/services/exchange-api"
import { Loader2 } from "lucide-react"

interface ExchangeAssetSelectorProps {
  onAssetsSelected: (assets: any[]) => void
  setIsOpen: (isOpen: boolean) => void
  assets_array: any[]
}

export interface TokenExchange {
  symbol: string
  price: number
  amount: number
  value: number
  img_url: string
  exchanges: string[]
}

export function ExchangeAssetSelector({ onAssetsSelected, setIsOpen, assets_array }: ExchangeAssetSelectorProps) {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const assets_set = new Set(assets_array)
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

  const handleSelectAll = () => {
    const availableAssets = account_asset?.data?.filter((asset: any) => !assets_set.has(asset.symbol)) || []
    if (selectedAssets.length === availableAssets.length) {
      setSelectedAssets([])
    } else {
      setSelectedAssets(availableAssets.map((asset: any) => asset.symbol))
    }
  }

  const handleConfirm = () => {
    if (selectedAssets.length === 0) return;

    // Get the full asset objects for selected assets
    const selectedAssetObjects = account_asset?.data.filter((asset: TokenExchange) => selectedAssets.includes(asset.symbol))
    onAssetsSelected(selectedAssetObjects)
    setIsOpen(false)
  }

  return (
    <div>
      {isLoadingAsset ? (
        <Loader2 className="mx-auto my-2 h-8 w-8 animate-spin" />
      ) : !account_asset?.data || account_asset?.data.length === 0 ? (
        <div className="py-4 text-center text-muted-foreground">No assets found in this exchange.</div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
             <div className="text-sm text-muted-foreground">
              {selectedAssets.length} of {account_asset.data?.length - assets_array?.length} available assets selected
              {assets_array?.length > 0 && (
                <span className="block text-xs mt-1">
                  {assets_array?.length} asset
                  {assets_array?.length !== 1 ? "s" : ""} already in portfolio
                </span>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {selectedAssets.length === account_asset.data?.length - assets_array?.length
                ? "Deselect All"
                : "Select All Available"}
            </Button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {account_asset?.data.map((asset: TokenExchange, index: number) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-2 border rounded-md transition-colors 
                    ${assets_set?.has(asset.symbol)
                      ? "opacity-60 bg-muted/20" 
                      : "hover:bg-muted/30"
                    }`}
              >
                <div className="flex items-center">
                  <Checkbox
                    id={asset.symbol}
                    checked={selectedAssets.includes(asset.symbol) || assets_set?.has(asset.symbol)}
                    onCheckedChange={() => handleAssetToggle(asset.symbol)}
                    disabled={assets_set?.has(asset.symbol)}
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
                        {asset.amount.toFixed(4)} {asset.symbol}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">${asset.value.toFixed(4) ?? Number(asset.amount*asset.price).toFixed(4)}</div>
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
  )
}

