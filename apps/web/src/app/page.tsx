"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Users, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [updateData, setUpdateData] = useState({ quotaPercent: 100, resetEstimate: '', note: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [accRes, recRes] = await Promise.all([
        fetch('/api/accounts'),
        fetch('/api/recommendation')
      ]);
      const accData = await accRes.json();
      const recData = await recRes.json();
      
      setAccounts(Array.isArray(accData) ? accData : []);
      setRecommendation(recData.recommendation || null);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;
    
    try {
      await fetch('/api/quota/manual-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: selectedAccount.id,
          quotaPercent: Number(updateData.quotaPercent),
          resetEstimate: updateData.resetEstimate,
          note: updateData.note
        })
      });
      setIsUpdateModalOpen(false);
      fetchData(); // Refresh list after update
    } catch (error) {
      console.error('Failed to update quota', error);
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

  const getFreshnessInfo = (lastCheckedAt?: Date) => {
    if (!lastCheckedAt) return { label: 'Very stale', color: 'var(--danger)' };
    const diffMins = (new Date().getTime() - new Date(lastCheckedAt).getTime()) / 1000 / 60;
    if (diffMins < 10) return { label: 'Fresh', color: 'var(--success)' };
    if (diffMins < 30) return { label: 'Maybe old', color: 'var(--warning)' };
    if (diffMins < 120) return { label: 'Stale', color: '#f97316' }; // orange
    return { label: 'Very stale', color: 'var(--danger)' };
  };

  if (loading) {
    return <div className="animate-pulse">Loading dashboard data...</div>;
  }

  const lowQuotaCount = accounts.filter(a => ['Red', 'Yellow'].includes(a.quotaStatus?.status)).length;
  const sharedCount = accounts.filter(a => a.isShared).length;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Overview of all your accounts and quota limits.</p>
      </div>

      <div className="grid-stats">
        <Card glass>
          <CardContent className="flex items-center gap-4 pt-4">
            <div className="p-3 bg-[var(--primary-glass)] rounded-lg text-[var(--primary)]">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total Accounts</p>
              <p className="text-2xl font-bold">{accounts.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card glass>
          <CardContent className="flex items-center gap-4 pt-4">
            <div className="p-3 bg-[var(--success-bg)] rounded-lg text-[var(--success)]">
              <Zap size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Recommended</p>
              <p className="text-lg font-bold truncate max-w-[150px]">
                {recommendation ? recommendation.nickname : 'None'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card glass>
          <CardContent className="flex items-center gap-4 pt-4">
            <div className="p-3 bg-[var(--danger-bg)] rounded-lg text-[var(--danger)]">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Low Quota</p>
              <p className="text-2xl font-bold">{lowQuotaCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card glass>
          <CardContent className="flex items-center gap-4 pt-4">
            <div className="p-3 bg-[var(--surface)] rounded-lg text-[var(--text-muted)] border border-[var(--border)]">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Shared Accounts</p>
              <p className="text-2xl font-bold">{sharedCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nickname</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Shared</TableHead>
                <TableHead>Quota %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Freshness</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map(acc => (
                <TableRow key={acc.id}>
                  <TableCell className="font-medium">{acc.nickname}</TableCell>
                  <TableCell>
                    <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {acc.plan}
                    </span>
                  </TableCell>
                  <TableCell>{acc.isShared ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{acc.quotaStatus?.quotaPercent ?? 100}%</TableCell>
                  <TableCell>{getStatusBadge(acc.quotaStatus?.status)}</TableCell>
                  <TableCell>
                    {(() => {
                      const freshness = getFreshnessInfo(acc.quotaStatus?.lastCheckedAt);
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: freshness.color }} />
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{freshness.label}</span>
                        </div>
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => {
                        setSelectedAccount(acc);
                        setUpdateData({ 
                          quotaPercent: acc.quotaStatus?.quotaPercent ?? 100, 
                          resetEstimate: acc.quotaStatus?.resetEstimate ?? '', 
                          note: '' 
                        });
                        setIsUpdateModalOpen(true);
                      }}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {accounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                    No accounts found. Go to Accounts tab to add one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)} 
        title={`Update Quota: ${selectedAccount?.nickname}`}
      >
        <form onSubmit={handleUpdateQuota} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Remaining Quota (%)</label>
            <input 
              type="number"
              min="0"
              max="100"
              required
              value={updateData.quotaPercent}
              onChange={(e) => setUpdateData({...updateData, quotaPercent: Number(e.target.value)})}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface-glass)', color: 'white' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Reset Estimate (Optional)</label>
            <input 
              type="datetime-local"
              value={updateData.resetEstimate ? new Date(updateData.resetEstimate).toISOString().slice(0, 16) : ''}
              onChange={(e) => setUpdateData({...updateData, resetEstimate: e.target.value ? new Date(e.target.value).toISOString() : ''})}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface-glass)', color: 'white' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Note (Optional)</label>
            <input 
              value={updateData.note}
              onChange={(e) => setUpdateData({...updateData, note: e.target.value})}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface-glass)', color: 'white' }} 
              placeholder="E.g. Used for heavy task"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button type="button" variant="ghost" onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Update</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
