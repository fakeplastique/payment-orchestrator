'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.scss';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/companies', label: 'Companies' },
  { href: '/users', label: 'Users' },
  { href: '/integrations', label: 'Integrations' },
  { href: '/fraud-checks', label: 'Fraud Checks' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoText}>Orchestrator</span>
      </div>
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ href, label }) => (
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
