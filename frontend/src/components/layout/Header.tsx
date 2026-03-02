'use client';

import { useAuth } from '@/lib/AuthContext';
import styles from './Header.module.scss';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <span className={styles.title}>Payment Orchestrator</span>
      <div className={styles.actions}>
        {/* <span className={styles.status}>Live</span> */}
        {user && (
          <>
            <span className={styles.userInfo}>
              {user.email}
              <span className={styles.roleBadge}>{user.role}</span>
            </span>
            <button onClick={logout} className={styles.logoutBtn}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
