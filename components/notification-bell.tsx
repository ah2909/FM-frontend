"use client"

import { useEffect } from "react"
import { Bell, Plus, RefreshCw, Trash2, TrendingUp, Calendar, CheckCheck, ArrowDownToLine, ArrowUpFromLine } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import {
  setNotifications,
  markRead,
  markAllRead,
  type Notification,
} from "@/lib/store/features/notifications-slice"
import {
  useGetRecentActivityQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "@/lib/store/services/portfolio-api"

type ActivityType = "Add asset" | "Remove asset" | "Sync asset transactions" | "Update asset" | "Deposit" | "Withdrawn"

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case "Add asset":
      return <Plus className="h-3 w-3 text-green-600" />
    case "Remove asset":
      return <Trash2 className="h-3 w-3 text-red-600" />
    case "Sync asset transactions":
      return <RefreshCw className="h-3 w-3 text-blue-600" />
    case "Update asset":
      return <TrendingUp className="h-3 w-3 text-orange-600" />
    case "Deposit":
      return <ArrowDownToLine className="h-3 w-3 text-green-600" />
    case "Withdrawn":
      return <ArrowUpFromLine className="h-3 w-3 text-red-600" />
    default:
      return <Calendar className="h-3 w-3 text-gray-600" />
  }
}

function getDescription(n: Notification) {
  switch (n.type) {
    case "Add asset":
      return "Added to portfolio"
    case "Remove asset":
      return "Removed from portfolio"
    case "Sync asset transactions":
      return `Synced ${n.transaction_count ?? 0} transactions`
    case "Update asset":
      return `Updated ${n.transaction_count ?? 0} transactions`
    case "Deposit":
      return `+${n.amount} ${n.symbol?.toUpperCase()} deposited`
    case "Withdrawn":
      return `-${n.amount} ${n.symbol?.toUpperCase()} withdrawn`
    default:
      return "Activity recorded"
  }
}

function formatTime(dateString: string) {
  const now = new Date()
  const date = new Date(dateString)
  const diffMin = Math.floor((now.getTime() - date.getTime()) / 60000)
  if (diffMin < 1) return "Just now"
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}h ago`
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay === 1) return "Yesterday"
  if (diffDay < 7) return `${diffDay}d ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function NotificationBell() {
  const dispatch = useAppDispatch()
  const notifications = useAppSelector((state) => state.notifications.notifications)
  const unreadCount = useAppSelector((state) => state.notifications.unreadCount)
  const { data } = useGetRecentActivityQuery()
  const [markNotificationRead] = useMarkNotificationReadMutation()
  const [markAllNotificationsRead] = useMarkAllNotificationsReadMutation()

  // Seed Redux slice from API response (single source of truth)
  useEffect(() => {
    if (data?.data) {
      dispatch(
        setNotifications({
          notifications: data.data.notifications,
          unread_count: data.data.unread_count,
        })
      )
    }
  }, [data, dispatch])

  const handleMarkRead = (id: number, isRead: boolean) => {
    if (isRead) return
    dispatch(markRead(id))
    markNotificationRead(id)
  }

  const handleMarkAllRead = () => {
    dispatch(markAllRead())
    markAllNotificationsRead()
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative transition-all duration-300 hover:bg-muted"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute top-0 right-0 translate-x-1 -translate-y-1 h-4 min-w-4 px-0.5 rounded-full bg-blue-500 hover:bg-blue-500 text-[9px] font-bold text-white flex items-center justify-center leading-none">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="p-0 w-[calc(100vw-1rem)] sm:w-96 shadow-xl"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <Badge className="h-5 px-1.5 text-[10px] bg-blue-500 hover:bg-blue-500 text-white rounded-full">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={handleMarkAllRead}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>
        <Separator />

        {/* Notification list */}
        <ScrollArea className="h-[420px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-muted-foreground">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Bell className="h-5 w-5 opacity-40" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs opacity-60 mt-0.5">No notifications yet</p>
              </div>
            </div>
          ) : (
            <div>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkRead(n.id, n.is_read)}
                  className={`flex items-start gap-3 pr-4 py-3 cursor-pointer transition-colors border-b border-border/40 last:border-0
                    ${n.is_read
                      ? "hover:bg-muted/40"
                      : "bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50/80 dark:hover:bg-blue-950/30"
                    }`}
                >
                  {/* Unread dot */}
                  <div className="mt-2 w-2 flex-shrink-0">
                    {!n.is_read && (
                      <span className="block h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </div>

                  {/* Avatar + activity icon overlay */}
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={n.img_url} alt={n.symbol} />
                      <AvatarFallback className="text-xs font-semibold">
                        {n.symbol?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border shadow-sm">
                      <div className="h-3.5 w-3.5 flex items-center justify-center">
                        {getActivityIcon(n.type as ActivityType)}
                      </div>
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-xs leading-snug truncate ${!n.is_read ? "font-semibold" : "font-medium"}`}>
                        {n.name}{" "}
                        <span className="text-muted-foreground font-normal">
                          ({n.symbol?.toUpperCase()})
                        </span>
                      </p>
                      <span className="text-[10px] text-muted-foreground/70 flex-shrink-0 mt-0.5 tabular-nums">
                        {formatTime(n.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getDescription(n)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
