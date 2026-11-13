//lib/onboarding/useOnboardingRow.ts
'use client';

// One shared copy of the signed-in person's onboarding row, for the sidebar
// item, the dashboard redirect and the tutorial popup. Same pattern as
// lib/mediacrater/useTrialState.ts:
//   - module-level cache, so moving between pages keeps the answer
//   - one request in flight at a time, however many components ask
//   - publishOnboardingRow(): after a write, every screen updates at once
//
// status:
//   'off'      onboarding is switched off (lib/onboarding/config.ts)
//   'loading'  not read yet
//   'ready'    read; row is the row, or null if onboarding was never shown
//   'error'    could not be read (signed out, network, migration not run).
//              Everything that depends on onboarding stays hidden in that case
//              and the rest of the app carries on as before.
//
// Display only. What a person may write is decided by the database functions.

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/mediacrater/supabaseClient';
import { fetchOnboardingRow, type OnboardingRow } from './api';
import { ONBOARDING_ENABLED } from './config';

export type OnboardingRowStatus = 'off' | 'loading' | 'ready' | 'error';

export interface OnboardingRowState {
  status: OnboardingRowStatus;
  row: OnboardingRow | null;
}

const OFF: OnboardingRowState = { status: 'off', row: null };

let cached: OnboardingRowState = ONBOARDING_ENABLED ? { status: 'loading', row: null } : OFF;
let cachedUserId: string | null = null;
let inflight: Promise<OnboardingRowState> | null = null;
const listeners = new Set<(state: OnboardingRowState) => void>();

function publish(state: OnboardingRowState) {
  cached = state;
  listeners.forEach((listener) => listener(state));
}

/** Call with the row a write returned, so the sidebar and popup follow at once. */
export function publishOnboardingRow(row: OnboardingRow) {
  if (!ONBOARDING_ENABLED) return;
  cachedUserId = row.user_id;
  publish({ status: 'ready', row });
}

/** Reads the row again. Never throws: a failure becomes status 'error'. */
export function refreshOnboardingRow(): Promise<OnboardingRowState> {
  if (!ONBOARDING_ENABLED) return Promise.resolve(OFF);
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        cachedUserId = null;
        publish({ status: 'error', row: null });
        return cached;
      }

      // A different account signed in without a page reload: forget the old row.
      if (cachedUserId !== session.user.id) {
        cachedUserId = session.user.id;
        cached = { status: 'loading', row: null };
      }

      const row = await fetchOnboardingRow(session.user.id);
      publish({ status: 'ready', row });
    } catch {
      // Keep a row that was already read; only an unread state becomes 'error'.
      if (cached.status !== 'ready') publish({ status: 'error', row: null });
    } finally {
      inflight = null;
    }
    return cached;
  })();

  return inflight;
}

export function useOnboardingRow(): OnboardingRowState {
  const [state, setState] = useState<OnboardingRowState>(cached);

  useEffect(() => {
    if (!ONBOARDING_ENABLED) return;

    listeners.add(setState);
    setState(cached);
    if (cached.status !== 'ready') refreshOnboardingRow();

    return () => {
      listeners.delete(setState);
    };
  }, []);

  return state;
}

/**
 * Should the dashboard send this person to /onboarding?
 * Yes when they have never seen it, or started and did not finish or skip.
 * Never after a skip or a completion: from then on the sidebar item is the
 * only way in.
 */
export function shouldAutoOpenOnboarding(state: OnboardingRowState): boolean {
  if (state.status !== 'ready') return false;
  return state.row === null || state.row.onboarding_status === 'in_progress';
}

/** Should the sidebar show "Onboarding questions"? Until it is completed. */
export function shouldShowOnboardingNavItem(state: OnboardingRowState): boolean {
  if (state.status !== 'ready') return false;
  return state.row === null || state.row.onboarding_status !== 'completed';
}

/**
 * Should the "Watch the tutorial" popup open? Once, after onboarding ended
 * (finished or skipped), until the person answers it or plays the video.
 */
export function shouldShowTutorialPrompt(state: OnboardingRowState): boolean {
  if (state.status !== 'ready' || !state.row) return false;
  const row = state.row;
  if (row.onboarding_status === 'in_progress') return false;
  return row.tutorial_prompt_choice === null && row.tutorial_video_played_at === null;
}
