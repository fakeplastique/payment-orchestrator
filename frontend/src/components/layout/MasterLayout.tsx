'use client';

import { Suspense, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import styles from './MasterLayout.module.scss';

function LoadingFallback() {
  return (
    <div style={{ padding: 24, color: '#94a3b8', fontSize: 14 }}>
      Loading...
    </div>
  );
}

function ClientGate({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <LoadingFallback />;
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

export function MasterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <main className={styles.content}>
          <ClientGate>{children}</ClientGate>
        </main>
      </div>
    </div>
  );
}
