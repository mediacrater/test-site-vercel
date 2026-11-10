//lib/mediacrater/useTrialState.ts
'use client';

// One source of truth for "where is this account in the free trial?".
// Display only. The server (rateLimiter.js) enforces the trial on every scan.
//
// phase:
//   'loading'  profile not read yet
//   'none'     free account with no trial yet (before the cutover)
//   'trial'    trial running
//   'ended'    trial over (14 days passed, scans used up, or a linked account
//              already used the trial)
//   'paid'     any paid plan
//
// - module-level cache: moving between pages keeps the right state
// - one shared in-flight request, refreshed when the tab regains focus
// - markTrialEnded(): a scan error updates every screen at once
// - endedAtLoad: true only if the trial was already over when the page first
//   loaded. The "trial ended" dialog uses it, so the dialog never pops up in
//   the middle of a session (for example right after the last scan finishes
//   and its results are on screen).

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/mediacrater/supabaseClient';

export type TrialPhase = 'loading' | 'none' | 'trial' | 'ended' | 'paid';

export interface TrialState {
  phase: TrialPhase;
  endsAt: Date | null;
  daysLeft: number | null;
  endReason: string | null;
  endedAtLoad: boolean;
}

interface TrialRow {
  plan: string | null;
  trial_ends_at: string | null;
  trial_end_reason: string | null;
}

const DAY_MS = 24 * 60 * 60 * 1000;

let cachedRow: TrialRow | null = null;
let cachedUserId: string | null = null;
let endedAtLoad = false;
let inflight: Promise<void> | null = null;
const listeners = new Set<(row: TrialRow | null) => void>();

function publish(row: TrialRow | null) {
  cachedRow = row;
  listeners.forEach((listener) => listener(row));
}

function computeState(
  row: TrialRow | null,
  scansRemaining?: number | null
): Omit<TrialState, 'endedAtLoad'> {
  if (!row) {
    return { phase: 'loading', endsAt: null, daysLeft: null, endReason: null };
  }
  if (row.plan && row.plan !== 'free') {
    return { phase: 'paid', endsAt: null, daysLeft: null, endReason: null };
  }
  if (!row.trial_ends_at) {
    return { phase: 'none', endsAt: null, daysLeft: null, endReason: null };
  }

  const endsAt = new Date(row.trial_ends_at);
  const msLeft = endsAt.getTime() - Date.now();
  const outOfScans = typeof scansRemaining === 'number' && scansRemaining <= 0;

  if (row.trial_end_reason || msLeft <= 0 || outOfScans) {
    return {
      phase: 'ended',
      endsAt,
      daysLeft: 0,
      endReason: row.trial_end_reason ?? (outOfScans && msLeft > 0 ? 'exhausted' : 'expired'),
    };
  }

  return {
    phase: 'trial',
    endsAt,
    daysLeft: Math.max(1, Math.ceil(msLeft / DAY_MS)),
    endReason: null,
  };
}

export function markTrialEnded() {
  publish({
    plan: cachedRow?.plan ?? 'free',
    trial_ends_at: cachedRow?.trial_ends_at ?? new Date().toISOString(),
    trial_end_reason: cachedRow?.trial_end_reason ?? 'expired',
  });
}

export function refreshTrialState(): Promise<void> {
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        cachedUserId = null;
        endedAtLoad = false;
        publish(null);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('plan, trial_ends_at, trial_end_reason')
        .eq('id', session.user.id)
        .single();

      // On an error keep the last known state instead of flipping it.
      if (error || !data) return;

      const row = data as TrialRow;

      // A different account signed in without a page reload: start over.
      if (cachedUserId !== session.user.id) {
        cachedUserId = session.user.id;
        endedAtLoad = computeState(row).phase === 'ended';
      }

      publish(row);
    } catch {
      // keep the last known state
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

export function useTrialState(scansRemaining?: number | null): TrialState {
  const [row, setRow] = useState<TrialRow | null>(cachedRow);
  const [, setTick] = useState(0);

  useEffect(() => {
    listeners.add(setRow);
    setRow(cachedRow);
    refreshTrialState();

    // Re-check when the user comes back to the tab.
    const onFocus = () => {
      refreshTrialState();
    };
    window.addEventListener('focus', onFocus);

    // Re-render every minute so "N days left" and the end of the trial are
    // noticed while the page stays open.
    const timer = window.setInterval(() => setTick((n) => n + 1), 60 * 1000);

    return () => {
      listeners.delete(setRow);
      window.removeEventListener('focus', onFocus);
      window.clearInterval(timer);
    };
  }, []);

  return { ...computeState(row, scansRemaining), endedAtLoad };
}
