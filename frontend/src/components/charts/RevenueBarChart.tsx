'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const PALETTE = [
  { from: '#818cf8', to: 'rgba(129,140,248,0.35)' },
  { from: '#34d399', to: 'rgba(52,211,153,0.35)' },
  { from: '#f472b6', to: 'rgba(244,114,182,0.35)' },
  { from: '#fbbf24', to: 'rgba(251,191,36,0.35)' },
  { from: '#60a5fa', to: 'rgba(96,165,250,0.35)' },
  { from: '#a78bfa', to: 'rgba(167,139,250,0.35)' },
];

interface Props {
  data: { currency: string; total: string }[];
}

export function RevenueBarChart({ data }: Props) {
  const chartData = {
    labels: data.map((d) => d.currency),
    datasets: [
      {
        label: 'Revenue',
        data: data.map((d) => Number(d.total)),
        backgroundColor: (context: any) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return PALETTE[context.dataIndex % PALETTE.length].from;
          const { from, to } = PALETTE[context.dataIndex % PALETTE.length];
          const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, from);
          g.addColorStop(1, to);
          return g;
        },
        hoverBackgroundColor: (context: any) =>
          PALETTE[context.dataIndex % PALETTE.length].from,
        borderRadius: { topLeft: 7, topRight: 7 } as any,
        borderSkipped: false,
        barPercentage: 0.55,
        categoryPercentage: 0.75,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1e2e',
        borderColor: '#232738',
        borderWidth: 1,
        titleColor: '#e2e8f0',
        titleFont: { size: 13, weight: '700' as const },
        bodyColor: '#8892a8',
        bodyFont: { size: 12 },
        padding: 14,
        callbacks: {
          label: (ctx: any) =>
            `  $${Number(ctx.parsed.y).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#e2e8f0',
          font: { size: 13, weight: '600' as const },
        },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(35,39,56,0.7)' },
        ticks: {
          color: '#8892a8',
          font: { size: 11 },
          callback: (v: any) =>
            v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`,
        },
        border: { display: false },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
