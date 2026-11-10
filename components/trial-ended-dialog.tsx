//components/trial-ended-dialog.tsx
'use client';

// Shown once per browser tab when someone opens the app and their trial is
// already over. It never appears in the middle of a session (see endedAtLoad
// in useTrialState.ts) and it can be closed, so people can still look at the
// results on screen, change settings or sign out. Scanning itself is blocked
// by the server.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTrialState } from '@/lib/mediacrater/useTrialState';

const DISMISS_KEY = 'mc_trial_ended_dialog_dismissed';
const QUIET_PATHS = ['/buy-scans', '/settings'];

function wasDismissed(): boolean {
  try {
    return window.sessionStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

function rememberDismissed() {
  try {
    window.sessionStorage.setItem(DISMISS_KEY, '1');
  } catch {
    // storage unavailable: the dialog may show again on the next page, that is fine
  }
}

export function TrialEndedDialog() {
  const trial = useTrialState();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const eligible =
    trial.phase === 'ended' && trial.endedAtLoad && !QUIET_PATHS.includes(pathname || '');

  useEffect(() => {
    if (eligible && !wasDismissed()) setOpen(true);
  }, [eligible]);

  function close() {
    rememberDismissed();
    setOpen(false);
  }

  const linked = trial.endReason === 'linked';

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {linked ? 'A free trial was already used here' : 'Your free trial has ended'}
          </DialogTitle>
          <DialogDescription>
            {linked
              ? 'Free trials are limited to one per person. Our automated systems found that this device or network has already used one. Subscribe to continue, or contact support from Settings if you think this is a mistake.'
              : 'Subscribe to keep scanning your ads against platform policies.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={close}
            className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-secondary transition-colors"
          >
            Not now
          </button>
          <Link
            href="/buy-scans"
            onClick={rememberDismissed}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold text-center hover:opacity-90 transition-opacity"
          >
            See plans
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
