"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Bell, BellRing, Trash2, TrendingDown, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  useDeleteAlertMutation,
  type Alert,
} from "@/lib/store/services/alert-api"
import { getServerError } from "./utils"

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: price < 1 ? 6 : 2,
  }).format(price)
}

function AlertRow({ alert }: { alert: Alert }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteAlert, { isLoading }] = useDeleteAlertMutation()
  const isAbove = alert.condition === "above"

  async function handleDelete() {
    try {
      await deleteAlert(alert.id).unwrap()
      toast.success(`Alert for ${alert.symbol} removed`)
    } catch (error) {
      toast.error(getServerError(error, "Could not delete the alert"))
    }
  }

  return (
    <Card className="overflow-hidden transition-colors hover:border-primary/40">
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
            isAbove
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {isAbove ? (
            <TrendingUp className="size-5" />
          ) : (
            <TrendingDown className="size-5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold tracking-tight">{alert.symbol}</span>
            {alert.triggered ? (
              <Badge className="gap-1 bg-amber-500 text-white hover:bg-amber-500/90">
                <BellRing className="size-3" />
                Triggered
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <Bell className="size-3" />
                Watching
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Notify when price is{" "}
            <span className="font-medium text-foreground">{alert.condition}</span>{" "}
            <span className="font-medium text-foreground">
              {formatPrice(alert.price)}
            </span>
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-destructive"
          onClick={() => setConfirmOpen(true)}
          aria-label={`Delete alert for ${alert.symbol}`}
        >
          <Trash2 className="size-4" />
        </Button>

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this alert?</AlertDialogTitle>
              <AlertDialogDescription>
                Your {alert.symbol} {alert.condition} {formatPrice(alert.price)}{" "}
                alert will be removed. You can always create it again later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isLoading}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

export function AlertList({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="grid gap-3">
      {alerts.map((alert) => (
        <AlertRow key={alert.id} alert={alert} />
      ))}
    </div>
  )
}
