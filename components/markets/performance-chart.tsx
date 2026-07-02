"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { TrendingUp } from "lucide-react";
import { useGetPerformanceQuery } from "@/lib/store/services/market-api";
import { useChartTheme } from "@/hooks/use-chart-theme";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const COLORS: Record<string, string> = {
  bitcoin: "rgb(247, 147, 26)",
  gold: "rgb(212, 175, 55)",
  sp500: "rgb(59, 130, 246)",
  vnindex: "rgb(16, 185, 129)",
  vn30: "rgb(168, 85, 247)",
};

export function PerformanceChart({ range }: { range: string }) {
  const { data, isLoading } = useGetPerformanceQuery(range);
  const chartTheme = useChartTheme();

  const chartData = useMemo(() => {
    if (!data?.series?.length) return null;

    const allDates = Array.from(
      new Set(data.series.flatMap((s) => s.points.map((p) => p.date)))
    ).sort();

    const datasets = data.series.map((s) => {
      const byDate = new Map(s.points.map((p) => [p.date, p.value]));
      return {
        label: s.label,
        data: allDates.map((d) => byDate.get(d) ?? null),
        borderColor: COLORS[s.key] ?? "rgb(124, 93, 250)",
        backgroundColor: COLORS[s.key] ?? "rgb(124, 93, 250)",
        spanGaps: true,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      };
    });

    return { labels: allDates, datasets };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 }, color: chartTheme.tick },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: (ctx: any) => {
            const y = ctx.parsed.y;
            if (y == null) return `${ctx.dataset.label}: —`;
            const pct = y - 100;
            return `${ctx.dataset.label}: ${y.toFixed(2)} (${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8, color: chartTheme.tick },
      },
      y: {
        grid: { color: chartTheme.grid },
        ticks: { callback: (v: any) => `${v}`, color: chartTheme.tick },
      },
    },
    interaction: { intersect: false, mode: "index" as const },
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-pulse h-64 w-full bg-muted rounded" />
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <TrendingUp className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No Comparison Data</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Market performance data is currently unavailable.
        </p>
      </div>
    );
  }

  return <Line data={chartData} options={options} />;
}
