import React from 'react';
import styles from './Table.module.css';

export function Table({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={styles.tableContainer}>
      <table className={`${styles.table} ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className={styles.header}>{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className={styles.body}>{children}</tbody>;
}

export function TableRow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <tr className={`${styles.row} ${className}`}>{children}</tr>;
}

export function TableHead({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <th className={`${styles.head} ${className}`}>{children}</th>;
}

export function TableCell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`${styles.cell} ${className}`}>{children}</td>;
}
