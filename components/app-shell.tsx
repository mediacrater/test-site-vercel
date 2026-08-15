'use client';

// components/app-shell.tsx
//
// Wraps every authenticated app page. Sidebar handles desktop nav; below
// the lg breakpoint (where the sidebar is hidden) a slim top bar with a
// dropdown covers the same ground so mobile isn't left without navigation.
// Content area has a real max-width (not full-bleed) — full-bleed on an
// ultra-wide monitor was the original "too wide" problem, not a lack of
// horizontal fill.

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LayoutDashboard, History, Settings as SettingsIcon } from 'lucide-react';
import { AppSidebar } from '@/components/app-sidebar';
import { supabase } from '@/lib/mediacrater/supabaseClient';

const EXTENSION_LINK =
  'https://chromewebstore.google.com/detail/mediacrater-ad-compliance/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=app_mobile_nav';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/scan-history', label: 'Scan History', icon: History },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
];

export function AppShell({ userEmail, children }: { userEmail: string | null; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/signin');
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <AppSidebar userEmail={userEmail} />

      <div className="flex-1 min-w-0">
        {/* Mobile top bar — only shown below the lg breakpoint where the sidebar is hidden */}
        <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 border-b border-border bg-background/95 backdrop-blur-sm">
          <Link href="/dashboard" className="font-bold text-sm">
            Mediacrater
          </Link>
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 text-muted-foreground hover:text-foreground"
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileNavOpen && (
          <div className="lg:hidden border-b border-border bg-background px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2 mt-2 border-t border-border space-y-1">
              {userEmail && <p className="px-3 py-1 text-xs text-muted-foreground truncate">{userEmail}</p>}
              <a
                href={EXTENSION_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary"
              >
                Get the Chrome extension ↗
              </a>
              <button
                type="button"
                onClick={handleSignOut}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-secondary"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        <main className="max-w-[1200px] mx-auto px-6 lg:px-10 py-10">{children}</main>
      </div>
    </div>
  );
}
