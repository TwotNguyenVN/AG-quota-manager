"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  
  const [filters, setFilters] = useState({
    accountId: '',
    timeRange: '', // today, 7days, 30days
    source: '', // Manual, Mock
    errorOnly: false
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [filters]);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts');
      const data = await res.json();
      setAccounts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchHistory = async () => {
    try {
      const query = new URLSearchParams();
      if (filters.accountId) query.append('accountId', filters.accountId);
      if (filters.timeRange) query.append('timeRange', filters.timeRange);
      if (filters.source) query.append('source', filters.source);
      if (filters.errorOnly) query.append('errorOnly', 'true');

      const res = await fetch(`/api/history?${query.toString()}`);
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Green': return <Badge variant="green">Green</Badge>;
      case 'Yellow': return <Badge variant="yellow">Yellow</Badge>;
      case 'Red': return <Badge variant="red">Red</Badge>;
      case 'Locked': return <Badge variant="locked">Locked</Badge>;
      default: return <Badge variant="unknown">Unknown</Badge>;
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">History</h1>
        <p className="page-description">View all quota update events.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <select 
          value={filters.accountId} 
          onChange={e => setFilters({...filters, accountId: e.target.value})}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface-glass)', color: 'var(--text-primary)' }}
        >
          <option value="">All Accounts</option>
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>{acc.nickname}</option>
          ))}
        </select>

        <select 
          value={filters.timeRange} 
          onChange={e => setFilters({...filters, timeRange: e.target.value})}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface-glass)', color: 'var(--text-primary)' }}
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>

        <select 
          value={filters.source} 
          onChange={e => setFilters({...filters, source: e.target.value})}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface-glass)', color: 'var(--text-primary)' }}
        >
          <option value="">All Sources</option>
          <option value="Manual">Manual</option>
          <option value="Mock">Mock Refresh</option>
        </select>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <input 
            type="checkbox" 
            checked={filters.errorOnly}
            onChange={e => setFilters({...filters, errorOnly: e.target.checked})}
          />
          Errors Only
        </label>
      </div>

      <Card>
        <CardContent style={{ padding: '0' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Quota %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map(item => (
                <TableRow key={item.id}>
                  <TableCell style={{ color: 'var(--text-secondary)' }}>
                    {format(new Date(item.checkedAt), 'MMM dd, yyyy HH:mm:ss')}
                  </TableCell>
                  <TableCell style={{ fontWeight: 500 }}>{item.account?.nickname || 'Unknown'}</TableCell>
                  <TableCell>
                    <span style={{ 
                      padding: '2px 6px', 
                      background: 'var(--surface)', 
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      border: '1px solid var(--border)'
                    }}>
                      {item.source}
                    </span>
                  </TableCell>
                  <TableCell>{item.quotaPercent}%</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell style={{ color: 'var(--text-secondary)' }}>{item.note || '-'}</TableCell>
                </TableRow>
              ))}
              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    No history records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
