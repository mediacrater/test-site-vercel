'use client';

// components/app-sidebar.tsx
//
// Replaces the marketing <Header/> inside the authenticated app. A
// logged-in dashboard showing Features/Pricing/FAQ nav never made sense —
// this is app-specific navigation instead: Dashboard, Scan History,
// Settings, plus a compact account block at the bottom.
//
// Deliberately does NOT include "Go to dashboard" (meaningless once
// you're already inside the app) but keeps "Get extension" and "Sign
// out" immediately visible rather than nested — same reasoning as the
// marketing header's dropdown.

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, History, Settings as SettingsIcon } from 'lucide-react';
import { supabase } from '@/lib/mediacrater/supabaseClient';

const EXTENSION_LINK =
  'https://chromewebstore.google.com/detail/mediacrater-ad-compliance/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=app_sidebar';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/scan-history', label: 'Scan History', icon: History },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
];

export function AppSidebar({ userEmail }: { userEmail: string | null }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/signin');
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-border bg-card">
      <Link href="/dashboard" className="flex items-center gap-2 px-6 h-16 border-b border-border">
        <span className="text-lg font-bold text-foreground">Mediacrater</span>
      </Link>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border space-y-0.5">
        {userEmail && <p className="px-3 py-1 text-xs text-muted-foreground truncate">{userEmail}</p>}
        <a
          href={EXTENSION_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          Get the Chrome extension ↗
        </a>
        <button
          type="button"
          onClick={handleSignOut}
          className="block w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-secondary transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
