"use client"

import { useMemo } from "react"
import { useTheme } from "next-themes"

export interface ChartTheme {
  primary: string
  primaryFade: string
  tick: string
  grid: string
  gain: string
  loss: string
}

const FALLBACK: ChartTheme = {
  primary: "hsl(217 91% 60%)",
  primaryFade: "hsl(217 91% 60% / 0.12)",
  tick: "hsl(215 16% 55%)",
  grid: "hsl(224 15% 16% / 0.5)",
  gain: "hsl(142 60% 50%)",
  loss: "hsl(0 70% 55%)",
}

// Canvas can't resolve hsl(var(--x)), so read computed values per theme
export function useChartTheme(): ChartTheme {
  const { resolvedTheme } = useTheme()

  return useMemo(() => {
    if (typeof window === "undefined") return FALLBACK
    const style = getComputedStyle(document.documentElement)
    const raw = (name: string) => style.getPropertyValue(name).trim()
    if (!raw("--primary")) return FALLBACK
    const hsl = (name: string) => `hsl(${raw(name)})`
    const hsla = (name: string, alpha: number) => `hsl(${raw(name)} / ${alpha})`
    return {
      primary: hsl("--primary"),
      primaryFade: hsla("--primary", 0.12),
      tick: hsl("--muted-foreground"),
      grid: hsla("--border", 0.6),
      gain: resolvedTheme === "dark" ? "hsl(142 60% 55%)" : "hsl(142 70% 40%)",
      loss: resolvedTheme === "dark" ? "hsl(0 70% 62%)" : "hsl(0 80% 45%)",
    }
  }, [resolvedTheme])
}
