'use client';

import { companiesApi } from '@/lib/api';
import { Company } from '@/lib/types';
import { useFetch } from '@/lib/useFetch';

export default function CompaniesPage() {
  const companies: Company[] = useFetch('companies', () => companiesApi.getAll());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Companies</h1>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id}>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{c.id.slice(0, 8)}...</td>
                <td>{c.name}</td>
                <td>{new Date(c.createdDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
