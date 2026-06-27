"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
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
