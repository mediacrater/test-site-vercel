// app/dash-x9k2mfp7/LoginForm.tsx
'use client';

import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Reload so the server component re-checks the cookie and
      // renders the dashboard instead of the login form.
      window.location.reload();

    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#161616',
          padding: '40px',
          borderRadius: '12px',
          width: '320px',
          border: '1px solid #2a2a2a',
        }}
      >
        <h1 style={{ color: '#fff', fontSize: '18px', marginBottom: '24px', textAlign: 'center' }}>
          Restricted Access
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          style={{
            width: '100%',
            padding: '10px 12px',
            marginBottom: '12px',
            background: '#0a0a0a',
            border: '1px solid #2a2a2a',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          style={{
            width: '100%',
            padding: '10px 12px',
            marginBottom: '16px',
            background: '#0a0a0a',
            border: '1px solid #2a2a2a',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />

        {error && (
          <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            background: loading ? '#1e3a8a' : '#2563eb',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Checking...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
