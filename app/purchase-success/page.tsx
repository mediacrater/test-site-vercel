'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wwnpgzgvwsbdipysvobb.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_RXUvCIUAVJyJ4H586tnweA_SWXvFFuJ';

function PurchaseSuccessContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [scanAmount, setScanAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyPurchase = async () => {
      const sessionId = searchParams.get('session_id');

      if (!sessionId) {
        setErrorMessage('No session ID found in the URL. If you completed a purchase, please contact support.');
        setStatus('error');
        return;
      }

      try {
        const response = await fetch(
          `${SUPABASE_URL}/functions/v1/verify-session?session_id=${sessionId}`,
          {
            headers: {
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            }
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setScanAmount(data.tokens);
          setStatus('success');
        } else {
          setErrorMessage(data.error || `Verification failed (${response.status}). If you were charged, please contact support.`);
          setStatus('error');
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        setErrorMessage('A network error occurred while verifying your purchase. Please check your connection and try again, or contact support if you were charged.');
        setStatus('error');
      }
    };

    verifyPurchase();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-foreground">
              Mediacrater
            </Link>
            <div className="flex gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg shadow-lg p-8 text-center">

            {status === 'loading' && (
              <>
                <div className="mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
                </div>
                <h1 className="text-2xl font-bold text-card-foreground mb-2">
                  Verifying Your Purchase
                </h1>
                <p className="text-muted-foreground">Please wait...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-card-foreground mb-4">
                  You're all set!
                </h1>

                <div className="bg-primary/10 border-l-4 border-primary rounded p-4 mb-6">
                  <p className="text-lg font-semibold text-card-foreground">
                    {scanAmount} scans per month added to your account
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your plan renews monthly. Cancel anytime from the extension settings.
                  </p>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  It is safe to close this tab and return to the Mediacrater extension to start scanning.
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-card-foreground mb-4">
                  Verification Failed
                </h1>

                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
                    What went wrong:
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    {errorMessage}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground mb-6">
                  If your card was charged and this error persists, please contact support with your session ID from the URL.
                </p>

                <div className="space-y-3">
                  <Link
                    href="/"
                    className="block w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Go to Homepage
                  </Link>
                  <Link                  
                    href="mailto:hello.mediacrater@gmail.com"
                    className="block w-full bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
                  > 
                    Contact Support
                  </Link>    
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      </div>
    }>
      <PurchaseSuccessContent />
    </Suspense>
  );
}
