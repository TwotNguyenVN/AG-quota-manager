"use client";

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    greenThreshold: '50',
    redThreshold: '20',
    staleDataThreshold: '120',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings.');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleExport = () => {
    window.location.href = '/api/data/export';
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmImport = confirm("Cảnh báo: Thao tác này sẽ ghi đè toàn bộ dữ liệu hiện có bằng dữ liệu từ file backup. Bạn có chắc chắn không?");
    if (!confirmImport) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);

      const res = await fetch('/api/data/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      });

      if (res.ok) {
        const result = await res.json();
        alert(`Nhập dữ liệu thành công! (Tài khoản: ${result.stats.accounts}, Lịch sử: ${result.stats.history})`);
        fetchSettings(); // refresh settings after import
      } else {
        const err = await res.json();
        alert(`Lỗi khi nhập dữ liệu: ${err.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('File JSON không hợp lệ hoặc có lỗi xảy ra.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (isLoading) return <div style={{ padding: '2rem' }}>Loading settings...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-description">Configure global application settings and manage your data.</p>
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
                value={settings.greenThreshold || ''}
                onChange={(e) => handleChange('greenThreshold', e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface-glass)', color: 'white' }} 
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accounts below this threshold will be marked as Yellow.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Critical Quota Threshold (%)</label>
              <input 
                type="number"
                value={settings.redThreshold || ''}
                onChange={(e) => handleChange('redThreshold', e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface-glass)', color: 'white' }} 
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accounts below this threshold will be marked as Red.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Stale Data Threshold (minutes)</label>
              <input 
                type="number"
                value={settings.staleDataThreshold || ''}
                onChange={(e) => handleChange('staleDataThreshold', e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface-glass)', color: 'white' }} 
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Data older than this will be marked as Stale.</p>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Export Data</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Download a backup of all accounts, quota history, and settings as a JSON file.
            </p>
            <Button onClick={handleExport} variant="secondary">Export JSON</Button>
          </div>
          
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Import Data</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Restore from a backup. <strong>Warning: This will overwrite all existing data.</strong>
            </p>
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
            <Button onClick={handleImportClick} variant="danger">Import JSON</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
