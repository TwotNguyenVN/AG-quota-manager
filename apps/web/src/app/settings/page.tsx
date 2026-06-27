"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);

  useEffect(() => {
    // In Phase 3, we don't strictly have a settings API specified in the requirements
    // but we can prepare the UI.
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved (Mock)!');
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-description">Configure global application settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Quota Limits</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Low Quota Threshold (%)</label>
              <input 
                type="number"
                defaultValue={50}
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface-glass)', color: 'white' }} 
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accounts below this threshold will be marked as Yellow.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Critical Quota Threshold (%)</label>
              <input 
                type="number"
                defaultValue={20}
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface-glass)', color: 'white' }} 
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accounts below this threshold will be marked as Red.</p>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
