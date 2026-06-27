"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Plus, Trash2 } from 'lucide-react';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nickname: '', plan: 'free', isShared: false, priority: 0 });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts');
      const data = await res.json();
      setAccounts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      setFormData({ nickname: '', plan: 'free', isShared: false, priority: 0 });
      fetchAccounts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return;
    try {
      await fetch(`/api/accounts/${id}`, { method: 'DELETE' });
      fetchAccounts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Accounts</h1>
          <p className="page-description">Manage your Google accounts and their settings.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Account
        </Button>
      </div>

      <Card>
        <CardContent style={{ padding: '0' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nickname</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Shared</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead style={{ width: '80px' }}></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map(acc => (
                <TableRow key={acc.id}>
                  <TableCell style={{ fontWeight: 500 }}>{acc.nickname}</TableCell>
                  <TableCell style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{acc.plan}</TableCell>
                  <TableCell>{acc.isShared ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{acc.priority}</TableCell>
                  <TableCell>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(acc.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {accounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                    No accounts yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Account">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Nickname</label>
            <input 
              required
              value={formData.nickname}
              onChange={(e) => setFormData({...formData, nickname: e.target.value})}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface-glass)', color: 'white' }} 
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Plan</label>
            <select 
              value={formData.plan}
              onChange={(e) => setFormData({...formData, plan: e.target.value})}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface-glass)', color: 'white' }}
            >
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              checked={formData.isShared}
              onChange={(e) => setFormData({...formData, isShared: e.target.checked})}
            />
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Is Shared Account?</label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
