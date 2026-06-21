// app/dash-x9k2mfp7/DashboardContent.tsx
'use client';

import { useEffect, useState } from 'react';

interface DashboardData {
  revenue: {
    total: number;
    last30Days: number;
    totalPurchases: number;
  };
  users: {
    total: number;
    paid: number;
    free: number;
    byPlan: Record<string, number>;
  };
  recentScans: Array<{
    email: string;
    target_platform: string;
    scan_type: string;
    content_type: string;
    violations_found: number;
    analysis_duration_ms: number;
    created_at: string;
  }>;
}

export default function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin-data');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to load dashboard data');
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin-auth', { method: 'DELETE' });
    window.location.reload();
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif',
      padding: '32px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px' }}>Mediacrater Ops Dashboard</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={fetchData}
            style={{
              padding: '8px 16px',
              background: '#1f1f1f',
              border: '1px solid #2a2a2a',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Refresh
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              background: '#1f1f1f',
              border: '1px solid #2a2a2a',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {loading && <p style={{ color: '#888' }}>Loading...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      {data && (
        <>
          {/* ── Stat cards ──────────────────────────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}>
            <StatCard label="Total Revenue" value={`$${data.revenue.total.toFixed(2)}`} />
            <StatCard label="Revenue (30 days)" value={`$${data.revenue.last30Days.toFixed(2)}`} />
            <StatCard label="Total Purchases" value={data.revenue.totalPurchases.toString()} />
            <StatCard label="Total Users" value={data.users.total.toString()} />
            <StatCard label="Paid Users" value={data.users.paid.toString()} accent />
            <StatCard label="Free Users" value={data.users.free.toString()} />
          </div>

          {/* ── Plan breakdown ──────────────────────────────── */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', marginBottom: '12px', color: '#ccc' }}>Plan Breakdown</h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {Object.entries(data.users.byPlan).map(([plan, count]) => (
                <div key={plan} style={{
                  background: '#161616',
                  border: '1px solid #2a2a2a',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '13px',
                }}>
                  <span style={{ color: '#888', textTransform: 'capitalize' }}>{plan}</span>
                  <span style={{ marginLeft: '8px', fontWeight: 600 }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Recent scans ─────────────────────────────────── */}
          <div>
            <h2 style={{ fontSize: '16px', marginBottom: '12px', color: '#ccc' }}>Recent Scans</h2>
            <div style={{
              background: '#161616',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2a2a2a', textAlign: 'left' }}>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Platform</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Content</th>
                    <th style={thStyle}>Violations</th>
                    <th style={thStyle}>Duration</th>
                    <th style={thStyle}>When</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentScans.map((scan, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #1f1f1f' }}>
                      <td style={tdStyle}>{scan.email}</td>
                      <td style={tdStyle}>{scan.target_platform}</td>
                      <td style={tdStyle}>{scan.scan_type}</td>
                      <td style={tdStyle}>{scan.content_type}</td>
                      <td style={tdStyle}>{scan.violations_found}</td>
                      <td style={tdStyle}>{(scan.analysis_duration_ms / 1000).toFixed(1)}s</td>
                      <td style={tdStyle}>{new Date(scan.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{
      background: '#161616',
      border: `1px solid ${accent ? '#2563eb' : '#2a2a2a'}`,
      borderRadius: '8px',
      padding: '16px',
    }}>
      <div style={{ color: '#888', fontSize: '12px', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: 700 }}>{value}</div>
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: '10px 12px', color: '#888', fontWeight: 500 };
const tdStyle: React.CSSProperties = { padding: '10px 12px', color: '#ddd' };
