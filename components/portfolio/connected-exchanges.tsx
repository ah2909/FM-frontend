"use client"

import { useState } from "react"
import { toast } from "sonner"
import { RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  useGetSupportedCEXQuery,
  // useSyncExchangeMutation,
  // useDisconnectExchangeMutation,
} from "@/lib/store/services/portfolio-api";


export function ConnectedExchanges() {
  const { data: allExchanges, isLoading } = useGetSupportedCEXQuery()
  // const [syncExchange] = useSyncExchangeMutation()
  // const [disconnectExchange] = useDisconnectExchangeMutation()

  const [openDisconnectDialog, setOpenDisconnectDialog] = useState(false)
  const [exchangeToDisconnect, setExchangeToDisconnect] = useState<number | null>(null)

  // Filter exchanges that are connected to this portfolio
  const connectedExchanges = allExchanges?.data?.filter(
    (exchange) => exchange.is_connected,
  )

  const handleSync = async (exchangeId: number) => {
    try {
      // await syncExchange(exchangeId).unwrap()
      toast.success("Exchange data synced successfully")
    } catch (error) {
      toast.error("Failed to sync exchange data")
    }
  }

  const handleDisconnectClick = (exchangeId: number) => {
    setExchangeToDisconnect(exchangeId)
    setOpenDisconnectDialog(true)
  }

  const handleDisconnectConfirm = async () => {
    if (exchangeToDisconnect) {
      try {
        // await disconnectExchange(exchangeToDisconnect).unwrap()
        toast.success("Exchange disconnected successfully")
        setOpenDisconnectDialog(false)
        setExchangeToDisconnect(null)
      } catch (error) {
        toast.error("Failed to disconnect exchange")
      }
    }
  }

  if (isLoading) {
    return <div>Loading exchanges...</div>
  }

  if (!connectedExchanges?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connected Exchanges</CardTitle>
          <CardDescription>
            No exchanges connected to this portfolio yet. Use the "Import Data" button to connect exchanges.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Exchanges</CardTitle>
        <CardDescription>Exchanges connected to this portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {connectedExchanges.map((exchange) => (
            <Card key={exchange.id} className="border border-muted">
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div className="flex items-center space-x-2">
                  {exchange.img_url && (
                    <img src={exchange.img_url || "/placeholder.svg"} alt={exchange.name} className="h-6 w-6" />
                  )}
                  <CardTitle className="text-base">{exchange.name}</CardTitle>
                </div>
              </CardHeader>
              {/* <CardContent className="pb-2">
                <CardDescription>
                  {exchange.lastSync
                    ? `Last synced: ${new Date(exchange.lastSync).toLocaleString()}`
                    : "Not synced yet"}
                </CardDescription>
              </CardContent> */}
              <div className="flex justify-end p-4 pt-0 space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleDisconnectClick(exchange.id)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Disconnect
                </Button>
                <Button variant="default" size="sm" onClick={() => handleSync(exchange.id)}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Sync
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>

      <AlertDialog open={openDisconnectDialog} onOpenChange={setOpenDisconnectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Exchange?</AlertDialogTitle>
            <AlertDialogDescription>
              This will disconnect the exchange from your portfolio. Your transaction history will be preserved, but
              automatic updates will stop.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDisconnectConfirm}>Disconnect</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

