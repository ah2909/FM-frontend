"use client"

import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const dataValues = [
  Math.floor(Math.random() * 5000) + 1000,
  Math.floor(Math.random() * 5000) + 1000,
  Math.floor(Math.random() * 5000) + 1000,
  Math.floor(Math.random() * 5000) + 1000,
  Math.floor(Math.random() * 5000) + 1000,
  Math.floor(Math.random() * 5000) + 1000,
  Math.floor(Math.random() * 5000) + 1000,
  Math.floor(Math.random() * 5000) + 1000,
  Math.floor(Math.random() * 5000) + 1000,
  Math.floor(Math.random() * 5000) + 1000,
  Math.floor(Math.random() * 5000) + 1000,
  Math.floor(Math.random() * 5000) + 1000,
]

const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function Overview() {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Total",
        data: dataValues,
        backgroundColor: "hsl(var(--primary))",
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `$${context.parsed.y}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#888888",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#888888",
          font: {
            size: 12,
          },
          callback: (value: any) => {
            return `$${value}`
          },
        },
      },
    },
  }

  return (
    <div style={{ width: "100%", height: "350px" }}>
      <Bar data={chartData} options={options as any} />
    </div>
  )
}
