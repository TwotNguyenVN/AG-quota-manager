import React from 'react';
import styles from './Table.module.css';

export function Table({ children, className = '', ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className={styles.tableContainer}>
      <table className={`${styles.table} ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={styles.header} {...props}>{children}</thead>;
}

export function TableBody({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={styles.body} {...props}>{children}</tbody>;
}

export function TableRow({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={`${styles.row} ${className}`} {...props}>{children}</tr>;
}

export function TableHead({ children, className = '', ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={`${styles.head} ${className}`} {...props}>{children}</th>;
}

export function TableCell({ children, className = '', ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`${styles.cell} ${className}`} {...props}>{children}</td>;
}
