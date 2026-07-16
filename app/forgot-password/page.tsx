'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Pre-fill the email address if it was passed from the browser extension
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Calls the secure Next.js API route which enforces the rate limit
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessage({
        type: 'success',
        text: 'Password reset instructions have been sent to your email address.',
      });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '10px' }}>Reset your password</h2>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
        Enter your email address and we will send you a link to reset your password.
      </p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px',
            fontSize: '16px',
            backgroundColor: '#000000',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: '20px',
          padding: '12px',
          borderRadius: '6px',
          fontSize: '14px',
          lineHeight: '1.4',
          backgroundColor: message.type === 'success' ? '#e6f4ea' : '#fce8e6',
          color: message.type === 'success' ? '#137333' : '#c5221f',
          border: `1px solid ${message.type === 'success' ? '#a3cfbb' : '#f5c2c7'}`
        }}>
          {message.text}
        </div>
      )}
    </div>
  );
}

// Suspense boundary is required in Next.js when using useSearchParams() 
// to prevent client-side de-optimization during static generation
export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '80px' }}>Loading...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
