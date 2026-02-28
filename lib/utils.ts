import { type ClassValue, clsx } from "clsx"
import { format } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return format(new Date(date), 'dd-MM-yyyy hh:mm:ss a');
}

export interface MetricOptions {
  price?: number
  amount: number
  avgPrice?: number
  totalPortfolioValue: number
}

export function calculateAssetMetrics({ price = 0, amount, avgPrice = 0, totalPortfolioValue }: MetricOptions) {
  const currentValue = price * amount
  const costBasis = avgPrice * amount
  const unrealizedPnL = currentValue - costBasis
  const allocation = totalPortfolioValue > 0 ? (currentValue / totalPortfolioValue) * 100 : 0
  
  return {
    currentValue,
    unrealizedPnL,
    allocation: Number(allocation.toFixed(0)),
    isPnLPositive: unrealizedPnL >= 0
  }
}

