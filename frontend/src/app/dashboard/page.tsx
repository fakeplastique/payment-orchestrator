'use client';

import { dashboardApi } from '@/lib/api';
import { DashboardStats } from '@/lib/types';
import { useFetch } from '@/lib/useFetch';
import { KpiCard } from '@/components/ui/KpiCard';
import { VolumeChart } from '@/components/charts/VolumeChart';
import { StatusPieChart } from '@/components/charts/StatusPieChart';
import { RevenueBarChart } from '@/components/charts/RevenueBarChart';
import { FraudStatsChart } from '@/components/charts/FraudStatsChart';
import styles from './dashboard.module.scss';

export default function DashboardPage() {
  const stats: DashboardStats = useFetch('dashboard', () => dashboardApi.getStats(30));

  const kpi = stats.kpi?.[0] ?? {
    total_transactions: 0,
    successful: 0,
    failed: 0,
    total_revenue: '0',
  };
  const successRate =
    kpi.total_transactions > 0
      ? ((kpi.successful / kpi.total_transactions) * 100).toFixed(1)
      : '0';

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Dashboard</h1>

      <div className={styles.kpiGrid}>
        <KpiCard label="Total Transactions" value={kpi.total_transactions} />
        <KpiCard label="Successful" value={kpi.successful} color="success" />
        <KpiCard label="Failed" value={kpi.failed} color="danger" />
        <KpiCard
          label="Total Revenue"
          value={`$${Number(kpi.total_revenue ?? 0).toLocaleString()}`}
          sub="Success only"
          color="success"
        />
        <KpiCard label="Success Rate" value={`${successRate}%`} />
      </div>

      <div className={styles.chartsGrid}>
        <div className={`${styles.chartCard} ${styles.wide}`}>
          <h2 className={styles.chartTitle}>Transaction Volume (30 days)</h2>
          <div className={styles.chartWrap}>
            <VolumeChart data={stats.volumeOverTime ?? []} />
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Status Distribution</h2>
          <div className={styles.chartWrap}>
            <StatusPieChart data={stats.statusDistribution ?? []} />
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Revenue by Currency</h2>
          <div className={styles.chartWrap}>
            <RevenueBarChart data={stats.revenueByCurrency ?? []} />
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Fraud Check Results</h2>
          <div className={styles.chartWrap}>
            <FraudStatsChart data={stats.fraudStats ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}
