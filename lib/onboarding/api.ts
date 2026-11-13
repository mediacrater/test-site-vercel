//lib/onboarding/api.ts
//
// Everything the web app reads from or writes to public.onboarding_responses.
//
// Reads go straight to the table: row level security only ever returns the
// signed-in person's own row. Writes go through the onboarding_* database
// functions (sql/onboarding_migration.sql); the browser has no permission to
// change the table directly, and each function works out who is calling from
// the session, never from an argument.
//
// 'PAID' is deliberately missing from OnboardingDecision: the browser cannot
// send it. Only the Stripe webhook records a payment.

import { supabase } from '@/lib/mediacrater/supabaseClient';
import type { Interval, PlanId } from '@/lib/mediacrater/plans';

export type OnboardingStatus = 'in_progress' | 'skipped' | 'completed';
export type IdealPlanOption = 'FREE' | 'CHECKOUT_STARTED' | 'PAID';
export type OnboardingDecision = 'FREE' | 'CHECKOUT_STARTED';
export type TutorialStatus = 'in_progress' | 'skipped' | 'completed';
export type TutorialEvent = 'video_played' | 'exploring' | 'tour_started' | 'tour_skipped' | 'tour_completed';

export interface OnboardingRow {
  user_id: string;
  flow_version: number;
  order_variant: string;
  onboarding_status: OnboardingStatus;
  onboarding_date: string | null;
  onboarding_skipped_at: string | null;
  onboarding_completed_at: string | null;
  current_step: string | null;
  answers: Record<string, string>;
  recommended_plan: PlanId | null;
  selected_interval: Interval | null;
  estimated_monthly_ads: number | null;
  ideal_plan_option: IdealPlanOption | null;
  ideal_plan_decided_at: string | null;
  tutorial_prompt_choice: 'tour' | 'exploring' | null;
  tutorial_video_played_at: string | null;
  interactive_tutorial_status: TutorialStatus | null;
  interactive_tutorial_date: string | null;
  interactive_tutorial_skipped_at: string | null;
  interactive_tutorial_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Makes sure what came back really is a row before the app relies on it. */
function asRow(data: unknown): OnboardingRow {
  const row = data as Partial<OnboardingRow> | null;
  if (!row || typeof row !== 'object' || typeof row.user_id !== 'string' || typeof row.onboarding_status !== 'string') {
    throw new Error('Unexpected reply from the server.');
  }
  return {
    ...(row as OnboardingRow),
    answers: row.answers && typeof row.answers === 'object' ? (row.answers as Record<string, string>) : {},
  };
}

async function call(name: string, args: Record<string, unknown>): Promise<OnboardingRow> {
  const { data, error } = await supabase.rpc(name, args);
  if (error) throw new Error(error.message || 'The request failed.');
  return asRow(data);
}

/**
 * The signed-in person's row, or null if onboarding was never shown to them.
 * Throws when the row cannot be read (signed out, network, table missing), so
 * callers can tell "no row" apart from "could not check".
 */
export async function fetchOnboardingRow(userId: string): Promise<OnboardingRow | null> {
  const { data, error } = await supabase
    .from('onboarding_responses')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error(error.message || 'Could not read onboarding state.');
  return data ? asRow(data) : null;
}

/** Creates the row the first time; later calls return the existing row unchanged. */
export function startOnboarding(flowVersion: number, orderVariant: string): Promise<OnboardingRow> {
  return call('onboarding_start', { p_flow_version: flowVersion, p_order_variant: orderVariant });
}

export function saveOnboardingAnswer(question: string, value: string, nextStep: string | null): Promise<OnboardingRow> {
  return call('onboarding_answer', { p_question: question, p_value: value, p_next_step: nextStep });
}

export function skipOnboarding(step: string | null): Promise<OnboardingRow> {
  return call('onboarding_skip', { p_step: step });
}

export function finishOnboarding(input: {
  plan: PlanId | null;
  interval: Interval | null;
  decision: OnboardingDecision | null;
  estimatedMonthlyAds: number | null;
}): Promise<OnboardingRow> {
  return call('onboarding_finish', {
    p_plan: input.plan,
    p_interval: input.interval,
    p_decision: input.decision,
    p_estimated_monthly_ads: input.estimatedMonthlyAds,
  });
}

export function recordTutorialEvent(event: TutorialEvent): Promise<OnboardingRow> {
  return call('onboarding_tutorial_event', { p_event: event });
}
