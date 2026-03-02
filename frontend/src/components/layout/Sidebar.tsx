'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import styles from './Sidebar.module.scss';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', roles: null },
  { href: '/transactions', label: 'Transactions', roles: null },
  { href: '/integrations', label: 'Integrations', roles: null },
  { href: '/fraud-checks', label: 'Fraud Checks', roles: null },
  { href: '/users', label: 'Users', roles: ['admin', 'manager'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoText}>Orchestrator</span>
      </div>
      <nav className={styles.nav}>
        {visibleItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navItem} ${pathname.startsWith(href) ? styles.active : ''}`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
