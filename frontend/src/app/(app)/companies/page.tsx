'use client';

import { companiesApi } from '@/lib/api';
import { Company } from '@/lib/types';
import { useFetch } from '@/lib/useFetch';

export default function CompanyPage() {
  const company: Company & { users?: any[]; integrations?: any[] } = useFetch(
    'company-mine',
    () => companiesApi.getMine(),
  );

  if (!company) return <p>No company found.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>My Company</h1>
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: 24,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>{company.name}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 14 }}>
          <div>
            <span style={{ color: 'var(--text-muted, #94a3b8)' }}>Company ID</span>
            <p style={{ fontFamily: 'monospace', fontSize: 12 }}>{company.id}</p>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted, #94a3b8)' }}>Created</span>
            <p>{new Date(company.createdDate).toLocaleDateString()}</p>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted, #94a3b8)' }}>Users</span>
            <p>{company.users?.length ?? 0}</p>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted, #94a3b8)' }}>Integrations</span>
            <p>{company.integrations?.length ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
