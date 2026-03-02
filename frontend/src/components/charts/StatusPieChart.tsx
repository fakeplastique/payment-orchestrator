'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const STATUS_COLORS: Record<string, string> = {
  success: '#22c55e',
  failed: '#ef4444',
  pending: '#f59e0b',
  refunded: '#6366f1',
};

interface Props {
  data: { status: string; count: number }[];
}

export function StatusPieChart({ data }: Props) {
  const chartData = {
    labels: data.map((d) => d.status),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: data.map((d) => STATUS_COLORS[d.status] ?? '#94a3b8'),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const, labels: { color: '#94a3b8' } },
    },
  };

  return <Doughnut data={chartData} options={options} />;
}
