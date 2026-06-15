'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex items-center justify-center min-h-screen px-4 pt-16">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-card-foreground mb-2 text-center">
              Sign In
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              Please use the Mediacrater Chrome extension to sign in
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
              <p className="text-sm text-blue-900 dark:text-blue-300 font-semibold mb-3">
                📌 How to Sign In:
              </p>
              <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-2 ml-4">
                <li>1. Click the Mediacrater extension icon in your browser</li>
                <li>2. Enter your email and password</li>
                <li>3. Click "Sign In"</li>
              </ol>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Don't have the extension yet?
              </p>
              <a
                href="https://forms.gle/Di7xxvUSKebeAUDd6"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Join the Waitlist
              </a>
            </div>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary hover:underline font-semibold">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
