'use client';

import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { authApi, usersApi } from '@/lib/api';
import { User } from '@/lib/types';
import { useFetch } from '@/lib/useFetch';
import styles from './users.module.scss';

interface ImportRow {
  email: string;
  password: string;
  role: string;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

async function downloadTemplate() {
  const { utils, writeFile } = await import('xlsx');
  const ws = utils.aoa_to_sheet([
    ['email', 'password', 'role'],
    ['alice@example.com', 'StrongPass1!', 'viewer'],
    ['bob@example.com', 'StrongPass2!', 'manager'],
  ]);
  ws['!cols'] = [{ wch: 28 }, { wch: 18 }, { wch: 12 }];
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Users');
  writeFile(wb, 'users-import-template.xlsx');
}

function RoleBadge({ role }: { role: string }) {
  const cls = role === 'admin' ? styles.admin : role === 'manager' ? styles.manager : styles.user;
  return <span className={`${styles.roleBadge} ${cls}`}>{role}</span>;
}

export default function UsersPage() {
  const users: User[] = useFetch('users', () => usersApi.getAll());

  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [importing, setImporting] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { read, utils } = await import('xlsx');
    const buf = await file.arrayBuffer();
    const wb = read(buf);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = utils.sheet_to_json<Record<string, any>>(ws);
    setRows(
      data.map((row) => ({
        email: String(row.email ?? row.Email ?? '').trim(),
        password: String(row.password ?? row.Password ?? '').trim(),
        role: String(row.role ?? row.Role).trim().toLowerCase(),
        status: 'pending',
      })),
    );
    e.target.value = '';
  };

  const handleImport = async () => {
    setImporting(true);
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].status !== 'pending') continue;
      try {
        await authApi.inviteUser({
          email: rows[i].email,
          password: rows[i].password,
          role: rows[i].role,
        });
        setRows((prev) =>
          prev.map((r, idx) => (idx === i ? { ...r, status: 'success' } : r)),
        );
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ?? err?.message ?? 'Failed';
        setRows((prev) =>
          prev.map((r, idx) => (idx === i ? { ...r, status: 'error', error: String(msg) } : r)),
        );
      }
    }
    setImporting(false);
  };

  const allDone = rows.length > 0 && rows.every((r) => r.status !== 'pending');
  const successCount = rows.filter((r) => r.status === 'success').length;
  const errorCount = rows.filter((r) => r.status === 'error').length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Users</h1>
        <div className={styles.actions}>
          <button className={styles.templateBtn} onClick={downloadTemplate}>
            <Download size={13} />
            Download Template
          </button>
          <button className={styles.importBtn} onClick={() => fileRef.current?.click()}>
            <Upload size={13} />
            Import Excel
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            onChange={handleFile}
          />
        </div>
      </div>

      {rows.length > 0 && (
        <div className={styles.importCard}>
          <div className={styles.importHeader}>
            <span className={styles.importTitle}>
              {rows.length} users ready to import
              {allDone && (
                <span className={styles.importMeta}>
                  — {successCount} imported
                  {errorCount > 0 && `, ${errorCount} failed`}
                </span>
              )}
            </span>
            <div className={styles.importActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setRows([])}
                disabled={importing}
              >
                {allDone ? 'Close' : 'Cancel'}
              </button>
              <button
                className={styles.confirmBtn}
                onClick={handleImport}
                disabled={importing || allDone}
              >
                {importing
                  ? 'Importing…'
                  : allDone
                    ? `Done (${successCount}/${rows.length})`
                    : `Import ${rows.length} users`}
              </button>
            </div>
          </div>

          <div className={styles.previewWrap}>
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Password</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    <td>{row.email}</td>
                    <td>
                      <RoleBadge role={row.role} />
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', letterSpacing: 2 }}>
                      {'•'.repeat(Math.min(row.password.length, 10))}
                    </td>
                    <td>
                      {row.status === 'pending' && (
                        <span className={styles.statusPending}>Pending</span>
                      )}
                      {row.status === 'success' && (
                        <span className={styles.statusSuccess}>Imported</span>
                      )}
                      {row.status === 'error' && (
                        <span className={styles.statusError}>{row.error}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className={styles.tableCard}>
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
                <td>
                  <RoleBadge role={u.role} />
                </td>
                <td>{u.company?.name ?? '—'}</td>
                <td>
                  {u.lastLoginDate ? new Date(u.lastLoginDate).toLocaleString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
