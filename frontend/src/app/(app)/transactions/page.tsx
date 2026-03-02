'use client';

import { transactionsApi } from '@/lib/api';
import { Transaction } from '@/lib/types';
import { useFetch } from '@/lib/useFetch';
import { Badge } from '@/components/ui/Badge';
import styles from './transactions.module.scss';

export default function TransactionsPage() {
  const { data: transactions, total }: { data: Transaction[]; total: number } = useFetch('transactions', () => transactionsApi.getAll({ limit: 50 }));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Transactions</h1>
        <span className={styles.count}>{total} total</span>
      </div>
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>External ID</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className={styles.mono}>{tx.id.slice(0, 8)}...</td>
                <td>{tx.externalId ?? '\u2014'}</td>
                <td>{Number(tx.amount).toLocaleString()}</td>
                <td>{tx.currency}</td>
                <td><Badge status={tx.status} /></td>
                <td>{new Date(tx.createdDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
