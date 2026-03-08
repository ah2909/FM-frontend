"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Plus, RefreshCw, Trash2, TrendingUp, Filter } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetRecentActivityQuery } from "@/lib/store/services/portfolio-api"
import { useAppSelector } from "@/lib/store/hooks"
import { type Notification } from "@/lib/store/features/notifications-slice"

type ActivityType = "Add asset" | "Remove asset" | "Sync asset transactions" | "Update asset"

interface RecentActivityProps {
  typeFilter: string
}

export default function RecentActivity({ typeFilter }: RecentActivityProps) {
  const { isLoading } = useGetRecentActivityQuery()
  const notifications = useAppSelector((state) => state.notifications.notifications)

  const filtered = notifications.filter((n: Notification) =>
    typeFilter === "all" || n.type === typeFilter
  )

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "Add asset":
        return <Plus className="h-4 w-4 text-green-600" />
      case "Remove asset":
        return <Trash2 className="h-4 w-4 text-red-600" />
      case "Sync asset transactions":
        return <RefreshCw className="h-4 w-4 text-blue-600" />
      case "Update asset":
        return <TrendingUp className="h-4 w-4 text-orange-600" />
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />
    }
  }

  const getActivityBadgeColor = (type: ActivityType) => {
    switch (type) {
      case "Add asset":
        return "bg-green-100 text-green-700 border-green-200"
      case "Remove asset":
        return "bg-red-100 text-red-700 border-red-200"
      case "Sync asset transactions":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "Update asset":
        return "bg-orange-100 text-orange-700 border-orange-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getActivityDescription = (activity: Notification) => {
    switch (activity.type) {
      case "Add asset":
        return "Added to portfolio"
      case "Remove asset":
        return "Removed from portfolio"
      case "Sync asset transactions":
        return `Synced ${activity.transaction_count || 0} transactions`
      case "Update asset":
        return `Updated ${activity.transaction_count || 0} transactions from new connected exchange`
      default:
        return "Activity recorded"
    }
  }

  const groupByDate = (activities: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {}
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    activities.forEach((activity) => {
      const d = new Date(activity.created_at)
      let key: string
      if (d.toDateString() === today.toDateString()) key = "Today"
      else if (d.toDateString() === yesterday.toDateString()) key = "Yesterday"
      else key = d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
      if (!groups[key]) groups[key] = []
      groups[key].push(activity)
    })

    return Object.entries(groups).sort(([a], [b]) => {
      if (a === "Today") return -1
      if (b === "Today") return 1
      if (a === "Yesterday") return -1
      if (b === "Yesterday") return 1
      return new Date(b).getTime() - new Date(a).getTime()
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full max-h-[500px]">
        <div className="flex-1 overflow-y-auto pt-3 lg:pt-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg">
              <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                  <Skeleton className="h-4 sm:h-5 w-12 sm:w-16" />
                </div>
                <Skeleton className="h-2 sm:h-3 w-32 sm:w-40" />
                <Skeleton className="h-2 sm:h-3 w-16 sm:w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg text-muted-foreground">No Recent Activity</CardTitle>
          <CardDescription>
            Your portfolio activity will appear here as you add assets and sync data.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="flex flex-col h-full max-h-[500px] lg:max-h-[600px]">
      <div className="flex-1 overflow-y-auto space-y-4 lg:space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No activities found for the selected filters.</p>
          </div>
        ) : (
          groupByDate(filtered).map(([dateGroup, activities]) => (
            <div key={dateGroup} className="space-y-3">
              <div className="flex items-center space-x-2 sticky top-0 bg-background py-1.5 lg:py-2 z-10">
                <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground">{dateGroup}</h3>
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {activities.length} {activities.length === 1 ? "activity" : "activities"}
                </span>
              </div>

              <div className="space-y-2 pb-2">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                        <AvatarImage src={activity.img_url} alt={activity.symbol} />
                        <AvatarFallback className="text-xs font-semibold">
                          {activity.symbol?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 bg-background rounded-full p-0.5 sm:p-1 border">
                        <div className="h-3 w-3 sm:h-4 sm:w-4">
                          {getActivityIcon(activity.type as ActivityType)}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1 gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 min-w-0">
                          <span className="font-medium text-xs sm:text-sm truncate">
                            {activity.name} ({activity.symbol?.toUpperCase()})
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs w-fit ${getActivityBadgeColor(activity.type as ActivityType)}`}
                          >
                            <span className="hidden sm:inline">{activity.type}</span>
                            <span className="sm:hidden">
                              {activity.type === "Add asset"
                                ? "Add"
                                : activity.type === "Remove asset"
                                  ? "Remove"
                                  : activity.type === "Sync asset transactions"
                                    ? "Sync"
                                    : "Update"}
                            </span>
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {new Date(activity.created_at).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {getActivityDescription(activity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
