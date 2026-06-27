import Link from 'next/link';
import { LayoutDashboard, Users, Clock, Settings, Zap } from 'lucide-react';
import styles from './Sidebar.module.css';

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Zap className={styles.logoIcon} />
        <span>AG Quota</span>
      </div>
      
      <nav className={styles.nav}>
        <Link href="/" className={styles.navItem}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link href="/accounts" className={styles.navItem}>
          <Users size={20} />
          <span>Accounts</span>
        </Link>
        <Link href="/history" className={styles.navItem}>
          <Clock size={20} />
          <span>History</span>
        </Link>
      </nav>

      <div className={styles.footer}>
        <Link href="/settings" className={styles.navItem}>
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
