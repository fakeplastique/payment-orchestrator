'use client';

import { fraudChecksApi } from '@/lib/api';
import { FraudCheck } from '@/lib/types';
import { useFetch } from '@/lib/useFetch';
import { Badge } from '@/components/ui/Badge';

export default function FraudChecksPage() {
  const checks: FraudCheck[] = useFetch('fraud-checks', () => fraudChecksApi.getAll());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Fraud Checks</h1>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Rule</th>
              <th>Score</th>
              <th>Flagged</th>
              <th>Checked</th>
            </tr>
          </thead>
          <tbody>
            {checks.map((fc) => (
              <tr key={fc.id}>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                  {fc.transaction?.id.slice(0, 8) ?? '\u2014'}...
                </td>
                <td>{fc.rule?.name ?? '\u2014'}</td>
                <td>{fc.score.toFixed(2)}</td>
                <td><Badge status={fc.isFlagged ? 'failed' : 'success'} /></td>
                <td>{new Date(fc.checkDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
