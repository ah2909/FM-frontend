"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useGetInfoExchangeQuery } from "@/lib/store/services/exchange-api"
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
  const [isLoading, setIsLoading] = useState(false)
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
    if (selectedAssets.length === 0) return

    // Get the full asset objects for selected assets
    const selectedAssetObjects = account_asset?.data.filter((asset: TokenExchange) =>
      selectedAssets.includes(asset.symbol),
    )
    setIsLoading(true)
    onAssetsSelected(selectedAssetObjects)
  }

  return (
    <div>
      {isLoadingAsset ? (
        <Loader2 className="mx-auto my-2 h-8 w-8 animate-spin" />
      ) : !account_asset?.data || account_asset?.data.length === 0 ? (
        <div className="py-4 text-center text-muted-foreground">No assets found in this exchange.</div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 gap-2">
            <div className="text-sm text-muted-foreground">
              {selectedAssets.length} of {account_asset.data?.length - assets_array?.length} available assets selected
              {assets_array?.length > 0 && (
                <span className="block text-xs mt-1">
                  {assets_array?.length} asset
                  {assets_array?.length !== 1 ? "s" : ""} already in portfolio
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="w-full sm:w-auto text-xs bg-transparent"
            >
              {selectedAssets.length === account_asset.data?.length - assets_array?.length
                ? "Deselect All"
                : "Select All Available"}
            </Button>
          </div>

          <div className="space-y-2 max-h-[250px] sm:max-h-[300px] overflow-y-auto pr-2">
            {account_asset?.data.map((asset: TokenExchange, index: number) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 sm:p-3 border rounded-md transition-colors 
                    ${assets_set?.has(asset.symbol) ? "opacity-60 bg-muted/20" : "hover:bg-muted/30"}`}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <Checkbox
                    id={asset.symbol}
                    checked={selectedAssets.includes(asset.symbol) || assets_set?.has(asset.symbol)}
                    onCheckedChange={() => handleAssetToggle(asset.symbol)}
                    disabled={assets_set?.has(asset.symbol)}
                    className="flex-shrink-0"
                  />
                  <div className="flex items-center ml-2 sm:ml-3 min-w-0 flex-1">
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8 mr-2 flex-shrink-0">
                      <AvatarImage src={asset.img_url || "/placeholder.svg"} alt={asset.symbol} />
                      <AvatarFallback>{asset.symbol}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <Label className="font-medium cursor-pointer text-sm truncate block">{asset.symbol}</Label>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {asset.amount.toFixed(4)} {asset.symbol}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="font-semibold text-xs sm:text-sm">
                    ${asset.value.toFixed(4) ?? Number(asset.amount * asset.price).toFixed(4)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false)
                setIsLoading(false)
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            {isLoading ? (
              <Button size="sm" disabled className="w-full sm:w-auto">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Please wait
              </Button>
            ) : (
              <Button onClick={handleConfirm} disabled={selectedAssets.length === 0} className="w-full sm:w-auto">
                Add {selectedAssets.length} Assets
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
