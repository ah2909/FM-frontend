"use client"

import { BaseHeader } from "@/components/base-header"
import { BaseShell } from "@/components/base-shell"
import { AIChatWidget } from "@/components/analyze/ai-chat-widget"
import { AIInsightsDashboard } from "@/components/analyze/ai-insights-dashboard"
import { AIPortfolioOptimizer } from "@/components/analyze/ai-portfolio-optimizer"
import { AIPricePredictor } from "@/components/analyze/ai-price-predictor"
import { AIRiskAnalyzer } from "@/components/analyze/ai-risk-analyzer"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function AIPage() {
  return (
    <ProtectedRoute>
      <BaseShell>
        <BaseHeader
          heading="AI Assistant"
          text="Leverage artificial intelligence to optimize your crypto portfolio and make informed decisions"
        />

        <div className="space-y-6 sm:space-y-8">
          {/* AI Insights Dashboard */}
          <AIInsightsDashboard />

          {/* Two Column Layout for Desktop */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <AIPortfolioOptimizer />
            <AIPricePredictor />
          </div>

          {/* Risk Analyzer */}
          <AIRiskAnalyzer />
        </div>

        {/* Floating Chat Widget */}
        <AIChatWidget />
      </BaseShell>
    </ProtectedRoute>
  )
}
