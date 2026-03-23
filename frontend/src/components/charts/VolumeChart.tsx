'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
);

interface Props {
  data: { day: string; count: number; total: string }[];
}

export function VolumeChart({ data }: Props) {
  const labels = data.map((d) =>
    new Date(d.day).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
  );

  const makeGradient = (
    ctx: CanvasRenderingContext2D,
    top: number,
    bottom: number,
    colorA: string,
    colorB: string,
  ) => {
    const g = ctx.createLinearGradient(0, top, 0, bottom);
    g.addColorStop(0, colorA);
    g.addColorStop(1, colorB);
    return g;
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Transactions',
        data: data.map((d) => d.count),
        borderColor: '#818cf8',
        backgroundColor: (context: any) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return 'rgba(129,140,248,0.3)';
          return makeGradient(
            ctx,
            chartArea.top,
            chartArea.bottom,
            'rgba(129,140,248,0.4)',
            'rgba(129,140,248,0.0)',
          );
        },
        fill: true,
        tension: 0.45,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#818cf8',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        yAxisID: 'y',
      },
      {
        label: 'Revenue',
        data: data.map((d) => Number(d.total)),
        borderColor: '#34d399',
        backgroundColor: (context: any) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return 'rgba(52,211,153,0.2)';
          return makeGradient(
            ctx,
            chartArea.top,
            chartArea.bottom,
            'rgba(52,211,153,0.3)',
            'rgba(52,211,153,0.0)',
          );
        },
        fill: true,
        tension: 0.45,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#34d399',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: '#8892a8',
          font: { size: 12, family: 'Geist, system-ui, sans-serif' },
          boxWidth: 28,
          boxHeight: 2,
          padding: 20,
          usePointStyle: false,
        },
      },
      tooltip: {
        backgroundColor: '#1a1e2e',
        borderColor: '#232738',
        borderWidth: 1,
        titleColor: '#e2e8f0',
        titleFont: { size: 12, weight: '600' as const },
        bodyColor: '#8892a8',
        bodyFont: { size: 12 },
        padding: 14,
        callbacks: {
          label: (ctx: any) => {
            if (ctx.datasetIndex === 1) {
              return `  Revenue: $${Number(ctx.parsed.y).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`;
            }
            return `  Transactions: ${ctx.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(35,39,56,0.7)' },
        ticks: {
          color: '#8892a8',
          font: { size: 11 },
          maxRotation: 0,
          maxTicksLimit: 9,
        },
        border: { display: false },
      },
      y: {
        position: 'left' as const,
        grid: { color: 'rgba(35,39,56,0.7)' },
        ticks: { color: '#8892a8', font: { size: 11 } },
        border: { display: false },
      },
      y1: {
        position: 'right' as const,
        grid: { drawOnChartArea: false },
        ticks: {
          color: '#34d399',
          font: { size: 11 },
          callback: (v: any) =>
            v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`,
        },
        border: { display: false },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
