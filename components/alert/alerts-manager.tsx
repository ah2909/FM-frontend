"use client"

import { Bell, MessageSquare, ShieldCheck } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useGetAlertsQuery,
  useGetTelegramBindingQuery,
} from "@/lib/store/services/alert-api"
import { TelegramSetup } from "./telegram-setup"
import { CreateAlertDialog } from "./create-alert-dialog"
import { AlertList } from "./alert-list"

function isHttpError(error: unknown): error is { status: number } {
  return typeof error === "object" && error !== null && "status" in error
}

function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-20 w-full rounded-xl" />
    </div>
  )
}

export function AlertsManager() {
  const { user, isLoading: isAuthLoading } = useAuth()

  // The endpoint reads the user from the JWT, so no arg is needed — but we still
  // wait until auth has hydrated the access token before firing the request.
  const {
    data: binding,
    error: bindingError,
    isLoading: isBindingLoading,
  } = useGetTelegramBindingQuery(undefined, { skip: !user })

  // A 404 just means this user hasn't registered a bot yet — that's the normal
  // first-run state and the gate for the whole feature, not an error.
  const notConfigured = isHttpError(bindingError) && bindingError.status === 404
  const isBound = Boolean(binding) && !notConfigured
  const hardError =
    bindingError && !notConfigured ? bindingError : undefined

  if (isAuthLoading || (isBindingLoading && !!user)) {
    return <SectionSkeleton />
  }

  if (hardError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Couldn&apos;t load your alert settings</AlertTitle>
        <AlertDescription>
          The alert service didn&apos;t respond as expected. Please refresh the
          page and try again.
        </AlertDescription>
      </Alert>
    )
  }

  if (!isBound) {
    return (
      <div className="space-y-6">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MessageSquare className="size-5" />
              </div>
              <div>
                <CardTitle>Connect Telegram to get started</CardTitle>
                <CardDescription>
                  Alerts are delivered through your own Telegram bot. Set it up
                  once, then create as many alerts as you like.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TelegramSetup />
          </CardContent>
        </Card>

        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 p-3 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" />
          <span>
            Your bot token is sent securely and stored write-only — it&apos;s
            never shown back to you or anyone else.
          </span>
        </div>
      </div>
    )
  }

  return <BoundAlerts chatId={binding!.telegram_chat_id} />
}

function BoundAlerts({ chatId }: { chatId: number }) {
  const { data: alerts, isLoading } = useGetAlertsQuery(undefined, {
    // No push channel to the UI — a fired alert only reflects on refetch.
    pollingInterval: 30000,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5 py-1">
            <MessageSquare className="size-3.5 text-primary" />
            Telegram chat {chatId}
          </Badge>
        </div>
        <CreateAlertDialog />
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          <Skeleton className="h-[78px] w-full rounded-xl" />
          <Skeleton className="h-[78px] w-full rounded-xl" />
        </div>
      ) : !alerts || alerts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Bell className="size-6" />
            </div>
            <div>
              <p className="font-semibold">No alerts yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first alert to get pinged when a coin hits your target.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <AlertList alerts={alerts} />
      )}
    </div>
  )
}
