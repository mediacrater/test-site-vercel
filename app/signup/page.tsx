'use client';

// app/signup/page.tsx
//
// Same minimal-chrome reasoning as signin/page.tsx. Note the marked TODO
// below — referral attribution (reading the mc_referrer cookie) is Phase
// C, not built yet. Leaving the hook point marked now so Phase C doesn't
// require re-reading this file to figure out where it plugs in.

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { supabase } from '@/lib/mediacrater/supabaseClient';
import { AuthShowcasePanel } from '@/components/auth-showcase-panel';

export default function SignUpPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);

  useEffect(() => setMounted(true), []);

  const logoSrc = mounted && resolvedTheme === 'dark' ? '/images/header-logo-dark.png' : '/images/header-logo.png';

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError(null);

  if (password !== confirmPassword) {
    setError('Passwords do not match.');
    return;
  }
  if (password.length < 6) {
    setError('Password must be at least 6 characters.');
    return;
  }
  if (!consentAccepted) {
    setError('Please confirm you are 18+ and accept the Terms, Refund Policy, and Privacy Policy to continue.');
    return;
  }

  setLoading(true);
  try {
    const res = await fetch('/api/signup', {          // ← change to your actual route path if different
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        acceptedTerms: true,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || 'Failed to create account.');
    }

    // The API route already created the user.
    // If your project requires email confirmation, the API should return
    // a flag; otherwise just redirect.
    router.push('/dashboard');
    // or setCheckEmail(true) if the API indicates confirmation is required
  } catch (err: any) {
    setError(err.message || 'Failed to create account. Please try again.');
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="min-h-screen flex">
      <AuthShowcasePanel variant="signup" />

      <div className="w-full lg:w-1/2 flex flex-col min-h-screen bg-background">
        <div className="flex items-center justify-between px-6 py-5 lg:hidden">
          <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
            <img src={logoSrc} alt="Mediacrater" className="h-8 w-8" />
            Mediacrater
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            {checkEmail ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Check your email</h2>
                <p className="text-sm text-muted-foreground">
                  We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-1">Create your account</h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Already have one?{' '}
                  <Link href="/signin" className="text-primary font-medium hover:underline">
                    Sign in
                  </Link>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-card border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="you@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-card border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="At least 6 characters"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-card border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="••••••••"
                    />
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed pt-1">
                    <input
                      type="checkbox"
                      required
                      checked={consentAccepted}
                      onChange={(e) => setConsentAccepted(e.target.checked)}
                      className="mt-0.5 shrink-0"
                    />
                    <span>
                      I represent that I am at least 18 years old. I accept the{' '}
                      <Link href="/terms" className="underline hover:text-foreground" target="_blank">
                        Terms of Service
                      </Link>
                      ,{' '}
                      <Link href="/refund" className="underline hover:text-foreground" target="_blank">
                        Refund Policy
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="underline hover:text-foreground" target="_blank">
                        Privacy Policy
                      </Link>
                      . I consent to receiving a one time verification link to confirm my email address.
                    </span>
                  </label>

                  {error && (
                    <div className="p-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-sm text-red-800 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
