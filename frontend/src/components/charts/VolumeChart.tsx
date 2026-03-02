'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface Props {
  data: { day: string; count: number; total: string }[];
}

export function VolumeChart({ data }: Props) {
  const labels = data.map((d) =>
    new Date(d.day).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Transaction Count',
        data: data.map((d) => d.count),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.1)',
        fill: true,
        tension: 0.4,
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

  return <Line data={chartData} options={options} />;
}
