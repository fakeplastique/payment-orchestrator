'use client';

import { integrationsApi } from '@/lib/api';
import { Integration } from '@/lib/types';
import { useFetch } from '@/lib/useFetch';
import { Badge } from '@/components/ui/Badge';

export default function IntegrationsPage() {
  const integrations: Integration[] = useFetch('integrations', () => integrationsApi.getAll());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Integrations</h1>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Company</th>
              <th>Provider</th>
              <th>Enabled</th>
            </tr>
          </thead>
          <tbody>
            {integrations.map((i) => (
              <tr key={i.id}>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{i.id.slice(0, 8)}...</td>
                <td>{i.company?.name ?? '\u2014'}</td>
                <td>{i.provider?.name ?? '\u2014'}</td>
                <td><Badge status={i.isEnabled ? 'success' : 'failed'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
