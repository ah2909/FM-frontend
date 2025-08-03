"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  suggestions?: string[]
  charts?: any[]
  insights?: {
    type: "bullish" | "bearish" | "neutral" | "warning"
    title: string
    description: string
  }[]
}

interface AIChatWidgetProps {
  className?: string
}

export function AIChatWidget({ className }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hi! I'm your AI portfolio assistant. I can help you analyze your investments, suggest optimizations, and answer questions about crypto markets. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "Analyze my portfolio performance",
        "What's the market sentiment for Bitcoin?",
        "Suggest portfolio rebalancing",
        "Show me trending cryptocurrencies",
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputValue.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageText)
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("portfolio") && lowerMessage.includes("analyz")) {
      return {
        id: Date.now().toString(),
        type: "ai",
        content: "Based on your current portfolio, here's my analysis:",
        timestamp: new Date(),
        insights: [
          {
            type: "bullish",
            title: "Strong Diversification",
            description: "Your portfolio shows good diversification across different crypto sectors.",
          },
          {
            type: "warning",
            title: "High Volatility Exposure",
            description: "65% of your holdings are in high-volatility assets. Consider adding some stablecoins.",
          },
          {
            type: "neutral",
            title: "Market Correlation",
            description: "Your assets have 0.78 correlation with Bitcoin. This is typical for most crypto portfolios.",
          },
        ],
        suggestions: ["Show detailed risk analysis", "Suggest rebalancing strategy", "Compare with market indices"],
      }
    }

    if (lowerMessage.includes("bitcoin") || lowerMessage.includes("btc")) {
      return {
        id: Date.now().toString(),
        type: "ai",
        content: "Here's the current Bitcoin market analysis:",
        timestamp: new Date(),
        insights: [
          {
            type: "bullish",
            title: "Technical Indicators",
            description: "RSI shows oversold conditions, potential for upward movement.",
          },
          {
            type: "neutral",
            title: "Market Sentiment",
            description: "Fear & Greed Index at 45 (Neutral). Market is in wait-and-see mode.",
          },
        ],
        suggestions: ["Show BTC price prediction", "Compare with altcoins", "Set price alerts"],
      }
    }

    return {
      id: Date.now().toString(),
      type: "ai",
      content:
        "I understand you're asking about crypto markets. Let me help you with that. Could you be more specific about what you'd like to know?",
      timestamp: new Date(),
      suggestions: [
        "Analyze specific cryptocurrency",
        "Portfolio optimization tips",
        "Market trend analysis",
        "Risk assessment",
      ],
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "bullish":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "bearish":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Lightbulb className="h-4 w-4 text-blue-500" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "bullish":
        return "border-green-200 bg-green-50 dark:bg-green-950/20"
      case "bearish":
        return "border-red-200 bg-red-50 dark:bg-red-950/20"
      case "warning":
        return "border-orange-200 bg-orange-50 dark:bg-orange-950/20"
      default:
        return "border-blue-200 bg-blue-50 dark:bg-blue-950/20"
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
          "md:h-14 md:w-14",
          className,
        )}
        size="icon"
      >
        <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
        <span className="sr-only">Open AI Assistant</span>
      </Button>
    )
  }

  return (
    <Card
      className={cn(
        "fixed bottom-4 right-4 z-50 shadow-2xl transition-all duration-300",
        "w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]", // Mobile: full screen minus margins
        "md:w-96 md:h-[600px]", // Desktop: fixed size
        isMinimized && "md:h-14", // Minimized state
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-sm font-medium">AI Portfolio Assistant</CardTitle>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hidden md:flex"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(100%-4rem)]">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-3", message.type === "user" ? "justify-end" : "justify-start")}
                >
                  {message.type === "ai" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={cn("max-w-[80%] space-y-2", message.type === "user" && "order-first")}>
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm",
                        message.type === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {message.content}
                    </div>

                    {/* AI Insights */}
                    {message.insights && (
                      <div className="space-y-2">
                        {message.insights.map((insight, index) => (
                          <div
                            key={index}
                            className={cn("rounded-lg border p-3 text-xs", getInsightColor(insight.type))}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {getInsightIcon(insight.type)}
                              <span className="font-medium">{insight.title}</span>
                            </div>
                            <p className="text-muted-foreground">{insight.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs bg-transparent"
                            onClick={() => handleSendMessage(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {message.type === "user" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-secondary">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your portfolio..."
                className="flex-1 text-sm"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button size="icon" onClick={() => handleSendMessage()} disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
