'use client';

import { usersApi } from '@/lib/api';
import { User } from '@/lib/types';
import { useFetch } from '@/lib/useFetch';

export default function UsersPage() {
  const users: User[] = useFetch('users', () => usersApi.getAll());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Users</h1>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Company</th>
              <th>Last Login</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.company?.name ?? '\u2014'}</td>
                <td>{u.lastLoginDate ? new Date(u.lastLoginDate).toLocaleString() : '\u2014'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
