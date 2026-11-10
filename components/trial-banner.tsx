//components/trial-banner.tsx
'use client';

// Slim bar under the top bar:
//   - trial running:   "Free trial: 12 days left · 4 scans left"
//   - trial over:      "Your free trial has ended. Subscribe to keep scanning."
//   - before cutover:  the announcement of the change, shown to free accounts
//                      from the day you set NEXT_PUBLIC_TRIAL_CUTOVER_ISO
//
// Env (set in Vercel, then redeploy):
//   NEXT_PUBLIC_TRIAL_CUTOVER_ISO  e.g. 2026-11-30T09:00:00-05:00  (announcement day onward)
//   NEXT_PUBLIC_TRIAL_DAYS         default 14
//   NEXT_PUBLIC_TRIAL_SCANS        default 5
// These only change the wording. The real values live in the trial_config
// table; keep them the same.

import Link from 'next/link';
import { useTrialState } from '@/lib/mediacrater/useTrialState';

const TRIAL_DAYS = Number(process.env.NEXT_PUBLIC_TRIAL_DAYS) || 14;
const TRIAL_SCANS = Number(process.env.NEXT_PUBLIC_TRIAL_SCANS) || 5;
const CUTOVER_ISO = process.env.NEXT_PUBLIC_TRIAL_CUTOVER_ISO || '';

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

const AMBER =
  'bg-amber-100 dark:bg-transparent text-amber-700 dark:text-[#fbbf24] border-b border-[#fde68a] dark:border-[#4d2900]';
const NEUTRAL = 'bg-primary/10 text-primary border-b border-border';

function Bar({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <div
      className={`${className} flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 px-5 text-xs font-semibold tracking-[0.2px] text-center`}
    >
      {children}
    </div>
  );
}

export function TrialBanner({ scansRemaining }: { scansRemaining?: number | null }) {
  const trial = useTrialState(scansRemaining);

  if (trial.phase === 'trial') {
    return (
      <Bar className={NEUTRAL}>
        <span>
          Free trial: {plural(trial.daysLeft ?? 0, 'day')} left
          {typeof scansRemaining === 'number' ? ` · ${plural(scansRemaining, 'scan')} left` : ''}
        </span>
        <Link href="/buy-scans" className="underline underline-offset-2">
          See plans
        </Link>
      </Bar>
    );
  }

  if (trial.phase === 'ended') {
    return (
      <Bar className={AMBER}>
        <span>
          {trial.endReason === 'linked'
            ? 'A free trial has already been used on this device or network.'
            : 'Your free trial has ended.'}{' '}
          Subscribe to keep scanning.
        </span>
        <Link href="/buy-scans" className="underline underline-offset-2">
          See plans
        </Link>
      </Bar>
    );
  }

  if (trial.phase === 'none' && CUTOVER_ISO) {
    const cutover = new Date(CUTOVER_ISO);
    if (!Number.isNaN(cutover.getTime()) && cutover.getTime() > Date.now()) {
      const date = cutover.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      return (
        <Bar className={NEUTRAL}>
          <span>
            Starting {date}, the free plan becomes a {TRIAL_DAYS}-day free trial with {TRIAL_SCANS}{' '}
            scans. Your free plan works as usual until then.
          </span>
          <Link href="/buy-scans" className="underline underline-offset-2">
            See plans
          </Link>
        </Bar>
      );
    }
  }

  return null;
}
