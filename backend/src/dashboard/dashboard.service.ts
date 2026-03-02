import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getStats(days: number) {
    const [volumeOverTime, statusDistribution, revenueByCurrency, fraudStats, kpi] =
      await Promise.all([
        this.getVolumeOverTime(days),
        this.getStatusDistribution(days),
        this.getRevenueByCurrency(days),
        this.getFraudStats(days),
        this.getKpi(days),
      ]);

    return { volumeOverTime, statusDistribution, revenueByCurrency, fraudStats, kpi };
  }

  private getVolumeOverTime(days: number) {
    return this.dataSource.query(
      `SELECT DATE_TRUNC('day', created_date) AS day,
              COUNT(*)::int AS count,
              SUM(amount) AS total
       FROM transactions
       WHERE created_date >= NOW() - $1::int * INTERVAL '1 day'
       GROUP BY day
       ORDER BY day ASC`,
      [days],
    );
  }

  private getStatusDistribution(days: number) {
    return this.dataSource.query(
      `SELECT status, COUNT(*)::int AS count
       FROM transactions
       WHERE created_date >= NOW() - $1::int * INTERVAL '1 day'
       GROUP BY status`,
      [days],
    );
  }

  private getRevenueByCurrency(days: number) {
    return this.dataSource.query(
      `SELECT currency, SUM(amount) AS total, COUNT(*)::int AS count
       FROM transactions
       WHERE created_date >= NOW() - $1::int * INTERVAL '1 day'
         AND status = 'success'
       GROUP BY currency
       ORDER BY total DESC`,
      [days],
    );
  }

  private getFraudStats(days: number) {
    return this.dataSource.query(
      `SELECT
         COUNT(*) FILTER (WHERE fc.is_flagged = true)::int AS flagged,
         COUNT(*) FILTER (WHERE fc.is_flagged = false)::int AS clean
       FROM fraud_checks fc
       JOIN transactions t ON t.id = fc.transaction_id
       WHERE t.created_date >= NOW() - $1::int * INTERVAL '1 day'`,
      [days],
    );
  }

  private getKpi(days: number) {
    return this.dataSource.query(
      `SELECT
         COUNT(*)::int AS total_transactions,
         COUNT(*) FILTER (WHERE status = 'success')::int AS successful,
         COUNT(*) FILTER (WHERE status = 'failed')::int AS failed,
         COALESCE(SUM(amount) FILTER (WHERE status = 'success'), 0) AS total_revenue
       FROM transactions
       WHERE created_date >= NOW() - $1::int * INTERVAL '1 day'`,
      [days],
    );
  }
}
