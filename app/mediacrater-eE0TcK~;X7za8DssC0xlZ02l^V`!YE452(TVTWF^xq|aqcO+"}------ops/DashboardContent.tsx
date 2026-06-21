// app/dash-x9k2mfp7/DashboardContent.tsx
'use client';

export default function DashboardContent() {
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

      <p style={{ color: '#888' }}>
        Auth gate is working. This is the skeleton — real data sections (revenue, users, scans, queue activity) get added next.
      </p>
    </div>
  );
}
