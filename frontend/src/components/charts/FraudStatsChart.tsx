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
  data: { flagged: number; clean: number }[];
}

export function FraudStatsChart({ data }: Props) {
  const stats = data[0] ?? { flagged: 0, clean: 0 };

  const chartData = {
    labels: ['Flagged', 'Clean'],
    datasets: [
      {
        label: 'Fraud Checks',
        data: [stats.flagged, stats.clean],
        backgroundColor: ['#ef4444', '#22c55e'],
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
