import styles from './KpiCard.module.scss';

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  color?: 'default' | 'success' | 'danger' | 'warning';
}

export function KpiCard({ label, value, sub, color = 'default' }: Props) {
  return (
    <div className={`${styles.card} ${color !== 'default' ? styles[color] : ''}`}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      {sub && <p className={styles.sub}>{sub}</p>}
    </div>
  );
}
