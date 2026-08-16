'use client';

// components/app-sidebar.tsx
//
// Pure navigation now — account actions (email, extension link, sign
// out) moved entirely to app-topbar.tsx to avoid having two places that
// do the same thing. Logo links to '/' (actual homepage) — it was
// linking to /dashboard before, which is what caused "no way back to
// the homepage."

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, History, Settings as SettingsIcon } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/scan-history', label: 'Scan History', icon: History },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-border bg-card">
      <Link href="/" className="flex items-center gap-2 px-6 h-16 border-b border-border">
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
    </aside>
  );
}
