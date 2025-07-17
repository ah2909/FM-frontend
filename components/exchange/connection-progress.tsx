"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  X,
  Minimize2,
  Maximize2,
  Database,
  GitCompare,
  Download,
} from "lucide-react"
import { useWebSocketEvent } from "@/hooks/useWebSocketEvent"
import { toast } from "sonner"

export type ConnectionStatus =
  | "connecting"
  | "fetching_data"
  | "comparing_assets"
  | "updating_portfolio"
  | "completed"
  | "failed"

export interface ConnectionProgress {
  id: string
  exchange_name: string
  exchange_logo?: string
  status: ConnectionStatus
  progress: number
  current_step: string
  total_assets?: number
  processed_assets?: number
  updated_assets?: number
  new_assets?: number
  errors?: string[]
  started_at: string
  completed_at?: string
  estimated_time?: number
}

interface ConnectionProgressProps {
  onComplete?: (result: ConnectionProgress) => void
  onError?: (error: string) => void
}

export function ConnectionProgress({ onComplete, onError }: ConnectionProgressProps) {
  const [activeConnections, setActiveConnections] = useState<ConnectionProgress[]>([])
  const [isMinimized, setIsMinimized] = useState(false)
  const [completedConnections, setCompletedConnections] = useState<ConnectionProgress[]>([])

  // WebSocket event handler for connection progress updates
  useWebSocketEvent("exchange-connection-progress", "", (data: ConnectionProgress) => {
    setActiveConnections((prev) => {
      const existing = prev.find((conn) => conn.id === data.id)
      if (existing) {
        // Update existing connection
        return prev.map((conn) => (conn.id === data.id ? { ...conn, ...data } : conn))
      } else {
        // Add new connection
        return [...prev, data]
      }
    })

    // Handle completion
    if (data.status === "completed") {
      setTimeout(() => {
        setActiveConnections((prev) => prev.filter((conn) => conn.id !== data.id))
        setCompletedConnections((prev) => [data, ...prev.slice(0, 4)]) // Keep last 5
        onComplete?.(data)
        toast.success(`${data.exchange_name} connected successfully! Updated ${data.updated_assets || 0} assets.`)
      }, 2000) // Show completed state for 2 seconds
    }

    // Handle errors
    if (data.status === "failed") {
      setTimeout(() => {
        setActiveConnections((prev) => prev.filter((conn) => conn.id !== data.id))
        onError?.(data.errors?.[0] || "Connection failed")
        toast.error(`Failed to connect ${data.exchange_name}`)
      }, 3000) // Show error state for 3 seconds
    }
  })

  const getStatusIcon = (status: ConnectionStatus) => {
    switch (status) {
      case "connecting":
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
      case "fetching_data":
        return <Download className="h-4 w-4 animate-pulse text-blue-500" />
      case "comparing_assets":
        return <GitCompare className="h-4 w-4 animate-pulse text-orange-500" />
      case "updating_portfolio":
        return <Database className="h-4 w-4 animate-pulse text-purple-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: ConnectionStatus) => {
    switch (status) {
      case "connecting":
      case "fetching_data":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "comparing_assets":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "updating_portfolio":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "completed":
        return "bg-green-100 text-green-700 border-green-200"
      case "failed":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStepDescription = (status: ConnectionStatus, data: ConnectionProgress) => {
    switch (status) {
      case "connecting":
        return "Establishing secure connection..."
      case "fetching_data":
        return "Downloading portfolio data from exchange..."
      case "comparing_assets":
        return `Comparing ${data.processed_assets || 0}/${data.total_assets || 0} assets...`
      case "updating_portfolio":
        return "Updating your portfolio with new data..."
      case "completed":
        return `Successfully updated ${data.updated_assets || 0} assets, added ${data.new_assets || 0} new assets`
      case "failed":
        return data.errors?.[0] || "Connection failed"
      default:
        return data.current_step
    }
  }

  const formatTimeRemaining = (seconds: number) => {
    if (seconds < 60) return `${seconds}s remaining`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s remaining`
  }

  const dismissConnection = (id: string) => {
    setActiveConnections((prev) => prev.filter((conn) => conn.id !== id))
  }

  // Don't render if no active connections
  if (activeConnections.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Exchange Connections ({activeConnections.length})
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsMinimized(!isMinimized)}>
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {activeConnections.map((connection) => (
              <div key={connection.id} className="space-y-3 p-3 border rounded-lg bg-muted/20">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {connection.exchange_logo && (
                      <img
                        src={connection.exchange_logo || "/placeholder.svg"}
                        alt={connection.exchange_name}
                        className="w-6 h-6 rounded"
                      />
                    )}
                    <span className="font-medium text-sm">{connection.exchange_name}</span>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(connection.status)}`}>
                      {connection.status.replace("_", " ")}
                    </Badge>
                  </div>
                  {(connection.status === "completed" || connection.status === "failed") && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => dismissConnection(connection.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{connection.progress}%</span>
                  </div>
                  <Progress value={connection.progress} className="h-2" />
                </div>

                {/* Status Description */}
                <div className="flex items-start gap-2">
                  {getStatusIcon(connection.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{getStepDescription(connection.status, connection)}</p>
                    {connection.estimated_time &&
                      connection.status !== "completed" &&
                      connection.status !== "failed" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimeRemaining(connection.estimated_time)}
                        </p>
                      )}
                  </div>
                </div>

                {/* Asset Statistics */}
                {(connection.total_assets || connection.processed_assets) && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {connection.total_assets && (
                      <div className="text-center p-2 bg-background rounded">
                        <div className="font-medium">{connection.total_assets}</div>
                        <div className="text-muted-foreground">Total Assets</div>
                      </div>
                    )}
                    {connection.processed_assets !== undefined && (
                      <div className="text-center p-2 bg-background rounded">
                        <div className="font-medium">{connection.processed_assets}</div>
                        <div className="text-muted-foreground">Processed</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Completion Statistics */}
                {connection.status === "completed" && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-green-50 rounded border border-green-200">
                      <div className="font-medium text-green-700">{connection.updated_assets || 0}</div>
                      <div className="text-green-600">Updated</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
                      <div className="font-medium text-blue-700">{connection.new_assets || 0}</div>
                      <div className="text-blue-600">New Assets</div>
                    </div>
                  </div>
                )}

                {/* Error Messages */}
                {connection.status === "failed" && connection.errors && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded">
                    <div className="text-xs text-red-700">
                      {connection.errors.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Recent Completions */}
            {completedConnections.length > 0 && (
              <div className="border-t pt-3">
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Recent Connections</h4>
                <div className="space-y-2">
                  {completedConnections.slice(0, 2).map((connection) => (
                    <div
                      key={connection.id}
                      className="flex items-center justify-between text-xs p-2 bg-muted/10 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{connection.exchange_name}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {new Date(connection.completed_at!).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
