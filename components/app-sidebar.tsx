'use client';

// components/app-sidebar.tsx
//
// CHANGES (onboarding):
//   - "Onboarding questions" appears under "Video tutorial" for accounts that
//     have not completed onboarding (skipped it, left half-way, or never saw
//     it), and disappears once it is completed. Hidden while the state is
//     loading or cannot be read, and when onboarding is switched off.
//   - data-tour on the Scan History and Settings links, so the interactive
//     tour can point at them. No visual change.
//   - the Video tutorial link's address had "&t?utm_source=dashboard", which
//     is not a valid parameter. Now "&utm_source=dashboard".

import Link from 'next/link';
import Image from 'next/image';
import {
  usePathname,
} from 'next/navigation';
import {
  useTheme,
} from 'next-themes';
import {
  useEffect,
  useState,
} from 'react';

import {
  CheckCircle2,
  ClipboardList,
  History,
  LayoutDashboard,
  Loader2,
  Pause,
  Settings as SettingsIcon,
  Play,
  XCircle,
  type LucideIcon,
} from 'lucide-react';

import {
  shouldShowOnboardingNavItem,
  useOnboardingRow,
} from '@/lib/onboarding/useOnboardingRow';

import {
  useBackgroundScanState,
  type BackgroundScanState,
} from '@/lib/mediacrater/backgroundScanStore';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Opens in a new tab. */
  external?: boolean;
  /** Name the interactive tour uses to find this link (lib/onboarding/tour.ts). */
  tour?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/scan-history',
    label: 'Scan History',
    icon: History,
    tour: 'nav-history',
  },
  {
    href: 'https://www.youtube.com/watch?v=t8k6-XgiBig&utm_source=dashboard',
    label: 'Video tutorial',
    icon: Play,
    external: true,
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: SettingsIcon,
    tour: 'nav-settings',
  },
];

// Shown only until onboarding is completed. Sits right after "Video tutorial".
const ONBOARDING_NAV_ITEM: NavItem = {
  href: '/onboarding',
  label: 'Onboarding',
  icon: ClipboardList,
};

function DashboardScanStatus({
  scan,
}: {
  scan: BackgroundScanState;
}) {
  if ((scan.batchItems?.length ?? 0) > 1) {
    return (
      <span
        className="ml-auto inline-flex items-center gap-1.5"
        aria-label="Batch scan status"
      >
        {(scan.batchItems ?? []).map((item) => {
          if (item.status === 'processing') {
            return (
              <Loader2
                key={item.creativeId}
                className="w-3.5 h-3.5 animate-spin text-primary"
                aria-label={`Batch position ${item.batchPosition} processing`}
              />
            );
          }

          if (item.status === 'success') {
            return (
              <CheckCircle2
                key={item.creativeId}
                className="w-3.5 h-3.5 text-green-600 dark:text-green-400"
                aria-label={`Batch position ${item.batchPosition} complete`}
              />
            );
          }

          if (item.status === 'error') {
            return (
              <XCircle
                key={item.creativeId}
                className="w-3.5 h-3.5 text-red-600 dark:text-red-400"
                aria-label={`Batch position ${item.batchPosition} failed`}
              />
            );
          }

          return (
            <Pause
              key={item.creativeId}
              className={
                item.status === 'cooldown'
                  ? 'w-3.5 h-3.5 text-amber-500'
                  : 'w-3.5 h-3.5 text-muted-foreground/50'
              }
              aria-label={
                item.status === 'cooldown'
                  ? `Batch position ${item.batchPosition} waiting for cooldown`
                  : `Batch position ${item.batchPosition} queued`
              }
            />
          );
        })}
      </span>
    );
  }

  if (
    scan.status === 'preparing' ||
    scan.status === 'running'
  ) {
    return (
      <span
        className="ml-auto inline-flex items-center text-primary"
        title="Scan in progress"
        aria-label="Scan in progress"
      >
        <Loader2
          className="w-4 h-4 animate-spin"
          aria-hidden="true"
        />
      </span>
    );
  }

  if (scan.status === 'completed') {
    return (
      <span
        className="ml-auto inline-flex items-center text-green-600 dark:text-green-400"
        title="Scan complete"
        aria-label="Scan complete"
      >
        <CheckCircle2
          className="w-4 h-4"
          aria-hidden="true"
        />
      </span>
    );
  }

  if (scan.status === 'error') {
    return (
      <span
        className="ml-auto inline-flex items-center text-red-600 dark:text-red-400"
        title="Scan failed"
        aria-label="Scan failed"
      >
        <XCircle
          className="w-4 h-4"
          aria-hidden="true"
        />
      </span>
    );
  }

  return null;
}

export function AppSidebar() {
  const pathname =
    usePathname();

  const {
    resolvedTheme,
  } =
    useTheme();

  const [
    mounted,
    setMounted,
  ] =
    useState(false);

  const backgroundScan =
    useBackgroundScanState();

  const onboarding =
    useOnboardingRow();

  const navItems: NavItem[] =
    shouldShowOnboardingNavItem(onboarding)
      ? NAV_ITEMS.flatMap((item) =>
          item.label === 'Video tutorial'
            ? [item, ONBOARDING_NAV_ITEM]
            : [item]
        )
      : NAV_ITEMS;

  useEffect(
    () => setMounted(true),
    []
  );

  const logoSrc =
    mounted &&
    resolvedTheme === 'dark'
      ? '/images/header-logo-dark.png'
      : '/images/header-logo.png';

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-border bg-card">
      <Link
        href="/"
        className="flex items-center gap-2 px-6 h-16 border-b border-border"
      >
        <Image
          src={logoSrc}
          alt="Mediacrater"
          width={32}
          height={32}
          className="h-8 w-8"
        />

        <span className="text-lg font-bold text-foreground">
          Mediacrater
        </span>
      </Link>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(
          (item) => {
            const active =
              !item.external &&
              pathname ===
              item.href;

            const Icon =
              item.icon;

            const className = `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`;

            if (item.external) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  <Icon
                    className="w-4 h-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    {item.label}
                  </span>
                </a>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={className}
                data-tour={item.tour}
              >
                <Icon
                  className="w-4 h-4 shrink-0"
                  aria-hidden="true"
                />

                <span>
                  {item.label}
                </span>

                {item.href ===
                  '/dashboard' && (
                  <DashboardScanStatus
                    scan={backgroundScan}
                  />
                )}
              </Link>
            );
          }
        )}
      </nav>
    </aside>
  );
}
