import styles from './Badge.module.scss';

const COLOR_MAP: Record<string, string> = {
  success: 'success',
  failed: 'danger',
  pending: 'warning',
  refunded: 'info',
};

export function Badge({ status }: { status: string }) {
  const color = COLOR_MAP[status] ?? 'neutral';
  return <span className={`${styles.badge} ${styles[color]}`}>{status}</span>;
}
