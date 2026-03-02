import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getStats(days: number, companyId: string) {
    const [volumeOverTime, statusDistribution, revenueByCurrency, fraudStats, kpi] =
      await Promise.all([
        this.getVolumeOverTime(days, companyId),
        this.getStatusDistribution(days, companyId),
        this.getRevenueByCurrency(days, companyId),
        this.getFraudStats(days, companyId),
        this.getKpi(days, companyId),
      ]);

    return { volumeOverTime, statusDistribution, revenueByCurrency, fraudStats, kpi };
  }

  private getVolumeOverTime(days: number, companyId: string) {
    return this.dataSource.query(
      `SELECT DATE_TRUNC('day', t.created_date) AS day,
              COUNT(*)::int AS count,
              SUM(t.amount) AS total
       FROM transactions t
       JOIN integrations i ON i.id = t.integration_id
       WHERE t.created_date >= NOW() - $1::int * INTERVAL '1 day'
         AND i.company_id = $2
       GROUP BY day
       ORDER BY day ASC`,
      [days, companyId],
    );
  }

  private getStatusDistribution(days: number, companyId: string) {
    return this.dataSource.query(
      `SELECT t.status, COUNT(*)::int AS count
       FROM transactions t
       JOIN integrations i ON i.id = t.integration_id
       WHERE t.created_date >= NOW() - $1::int * INTERVAL '1 day'
         AND i.company_id = $2
       GROUP BY t.status`,
      [days, companyId],
    );
  }

  private getRevenueByCurrency(days: number, companyId: string) {
    return this.dataSource.query(
      `SELECT t.currency, SUM(t.amount) AS total, COUNT(*)::int AS count
       FROM transactions t
       JOIN integrations i ON i.id = t.integration_id
       WHERE t.created_date >= NOW() - $1::int * INTERVAL '1 day'
         AND t.status = 'success'
         AND i.company_id = $2
       GROUP BY t.currency
       ORDER BY total DESC`,
      [days, companyId],
    );
  }

  private getFraudStats(days: number, companyId: string) {
    return this.dataSource.query(
      `SELECT
         COUNT(*) FILTER (WHERE fc.is_flagged = true)::int AS flagged,
         COUNT(*) FILTER (WHERE fc.is_flagged = false)::int AS clean
       FROM fraud_checks fc
       JOIN transactions t ON t.id = fc.transaction_id
       JOIN integrations i ON i.id = t.integration_id
       WHERE t.created_date >= NOW() - $1::int * INTERVAL '1 day'
         AND i.company_id = $2`,
      [days, companyId],
    );
  }

  private getKpi(days: number, companyId: string) {
    return this.dataSource.query(
      `SELECT
         COUNT(*)::int AS total_transactions,
         COUNT(*) FILTER (WHERE t.status = 'success')::int AS successful,
         COUNT(*) FILTER (WHERE t.status = 'failed')::int AS failed,
         COALESCE(SUM(t.amount) FILTER (WHERE t.status = 'success'), 0) AS total_revenue
       FROM transactions t
       JOIN integrations i ON i.id = t.integration_id
       WHERE t.created_date >= NOW() - $1::int * INTERVAL '1 day'
         AND i.company_id = $2`,
      [days, companyId],
    );
  }
}
