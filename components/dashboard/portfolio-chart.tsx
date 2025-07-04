"use client"

import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

interface PortfolioChartProps {
  timeframe: string
  data: {
    balance: number,
    date: string
  }[]
}

export function PortfolioChart({ timeframe, data }: PortfolioChartProps) {
  const [chartData, setChartData] = useState<any>(null)

  const today = new Date();
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const getLastNDays = (n: number) => {
    const labels: string[] = [];
    const dateStrings: string[] = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      labels.push(d.toLocaleDateString("en-US", { weekday: "short" }));
      dateStrings.push(formatDate(d));
    }
    return { labels, dateStrings };
  };

  const getLastNDaysForMonth = (n: number) => {
    const labels: string[] = [];
    const dateStrings: string[] = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      labels.push(d.toLocaleDateString("en-US", { day: "numeric", month: "short" }));
      dateStrings.push(formatDate(d));
    }
    return { labels, dateStrings };
  };

  // Helper: aggregate daily balances
  const aggregateDaily = (dateStrings: string[]) => {
    const map = new Map<string, number>();
    data.forEach(item => {
      const d = formatDate(new Date(item.date));
      map.set(d, item.balance);
    });
    return dateStrings.map(ds => map.get(ds) || 0);
  };

  // Helper: get last N months' labels and keys
  const getLastNMonths = (n: number) => {
    const labels: string[] = [];
    const keys: string[] = [];
    const d = new Date(today);
    d.setDate(1); // Start at first of this month
    for (let i = n - 1; i >= 0; i--) {
      const month = new Date(d.getFullYear(), d.getMonth() - i, 1);
      labels.push(month.toLocaleDateString("en-US", { month: "short", year: "2-digit" }));
      keys.push(`${month.getFullYear()}-${month.getMonth()}`);
    }
    return { labels, keys };
  };

  // Helper: aggregate monthly averages
  const aggregateMonthly = (keys: string[]) => {
    const stats: Record<string, { sum: number; count: number }> = {};
    data.forEach(item => {
      const d = new Date(item.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!stats[key]) stats[key] = { sum: 0, count: 0 };
      stats[key].sum += item.balance;
      stats[key].count++;
    });
    return keys.map(key => {
      const s = stats[key];
      return s && s.count > 0 ? s.sum / s.count : 0;
    });
  };

  // Helper: aggregate yearly averages
  const getYearLabels = () => {
    const years = Array.from(new Set(data.map(item => new Date(item.date).getFullYear()))).sort();
    return years.map(y => y.toString());
  };
  const aggregateYearly = (years: string[]) => {
    const stats: Record<string, { sum: number; count: number }> = {};
    data.forEach(item => {
      const year = new Date(item.date).getFullYear().toString();
      if (!stats[year]) stats[year] = { sum: 0, count: 0 };
      stats[year].sum += item.balance;
      stats[year].count++;
    });
    return years.map(y => stats[y] ? stats[y].sum / stats[y].count : 0);
  };

  useEffect(() => {
    let labels: string[] = [];
    let dataPoints: number[] = [];

    switch (timeframe) {
      case "1w": {
        const { labels: l, dateStrings } = getLastNDays(7);
        labels = l;
        dataPoints = aggregateDaily(dateStrings);
        break;
      }
      case "1m": {
        const { labels: l, dateStrings } = getLastNDaysForMonth(30);
        labels = l
        dataPoints = aggregateDaily(dateStrings);
        break;
      }
      case "1y": {
        const { labels: l, keys } = getLastNMonths(12);
        labels = l;
        dataPoints = aggregateMonthly(keys);
        break;
      }
      // case "all": {
      //   labels = getYearLabels();
      //   dataPoints = aggregateYearly(labels);
      //   break;
      // }
      default: {
        const { labels: l, dateStrings } = getLastNDays(7);
        labels = l;
        dataPoints = aggregateDaily(dateStrings);
      }
    }

    setChartData({
      labels,
      datasets: [
        {
          fill: true,
          label: "Portfolio Value",
          data: dataPoints,
          borderColor: "rgb(124, 93, 250)",
          backgroundColor: "rgba(124, 93, 250, 0.1)",
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    });
  }, [timeframe, data])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: (context: any) => `$${context.parsed.y.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: (value: any) => {
            if (value >= 1000) {
              return "$" + value / 1000 + "k"
            }
            return "$" + value
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  }

  if (!chartData) return <div className="h-full w-full flex items-center justify-center">Loading chart...</div>

  return <Line data={chartData} options={options} />
}
