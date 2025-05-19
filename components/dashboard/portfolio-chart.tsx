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
}

export function PortfolioChart({ timeframe }: PortfolioChartProps) {
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    // Generate random data based on timeframe
    const generateData = () => {
      let labels: string[] = []
      let dataPoints: number[] = []

      // Generate different data points based on timeframe
      switch (timeframe) {
        case "1h":
          labels = Array.from({ length: 60 }, (_, i) => `${i}m`)
          break
        case "1d":
          labels = Array.from({ length: 24 }, (_, i) => `${i}h`)
          break
        case "1w":
          labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          break
        case "1m":
          labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`)
          break
        case "1y":
          labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          break
        case "all":
          labels = ["2019", "2020", "2021", "2022", "2023"]
          break
        default:
          labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      }

      // Generate random data points with a trend
      let value = 30000 + Math.random() * 10000
      dataPoints = labels.map(() => {
        value = value + (Math.random() - 0.5) * 5000
        return value
      })

      return {
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
      }
    }

    setChartData(generateData())
  }, [timeframe])

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
