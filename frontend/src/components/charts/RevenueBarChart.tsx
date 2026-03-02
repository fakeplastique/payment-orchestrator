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
        backgroundColor: '#6366f1',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: '#2a2d3e' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: '#2a2d3e' }, ticks: { color: '#94a3b8' } },
    },
  };

  return <Bar data={chartData} options={options} />;
}
