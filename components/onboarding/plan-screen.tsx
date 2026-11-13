//components/onboarding/plan-screen.tsx
'use client';

// The screen after the last onboarding question: one recommended plan, the
// reason for it, and three ways on:
//   - buy it now (monthly or yearly)        -> Stripe Checkout
//   - "I'll stick with the free trial first" -> the dashboard
//   - "Compare all plans"                    -> /buy-scans
//
// Honesty rules this screen follows:
//   - the plan comes from lib/onboarding/recommend.ts (the smallest plan that
//     covers what the person said they run) and the reasoning is shown
//   - prices, scans and the yearly maths are read from lib/mediacrater/plans.ts,
//     the same numbers the buy page shows
//   - the decline button is as easy to reach as the buy button
//
// This component only shows things and reports clicks. Saving the decision
// and opening Stripe happen in onboarding-flow.tsx.

import { useState } from 'react';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import {
  CURRENCY,
  DEEP_SCAN_COST,
  deepScans,
  intervalFor,
  yearlyPerMonth,
  yearlyPrice,
  type Interval,
} from '@/lib/mediacrater/plans';
import type { Recommendation } from '@/lib/onboarding/recommend';
import type { TrialPhase } from '@/lib/mediacrater/useTrialState';

export type PlanScreenAction = 'buy' | 'decline' | 'compare';

interface PlanScreenProps {
  recommendation: Recommendation;
  trialPhase: TrialPhase;
  /** Which button is working right now, if any. All buttons are locked meanwhile. */
  busy: PlanScreenAction | null;
  error: string | null;
  /** The person came back from Stripe without paying. */
  returnedFromCheckout: boolean;
  onBuy: (interval: Interval) => void;
  onDecline: (interval: Interval) => void;
  onCompare: (interval: Interval) => void;
  /** Absent when going back to the questions is not possible. */
  onBack?: () => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}

// The decline button says what will actually happen to this account.
function declineLabel(phase: TrialPhase): string {
  if (phase === 'trial') return "I'll stick with the free trial first";
  if (phase === 'none') return "I'll stay on the free plan for now";
  return 'Not now';
}

export function PlanScreen({
  recommendation,
  trialPhase,
  busy,
  error,
  returnedFromCheckout,
  onBuy,
  onDecline,
  onCompare,
  onBack,
  headingRef,
}: PlanScreenProps) {
  const { plan, reason, overCapacity } = recommendation;
  const [wanted, setWanted] = useState<Interval>('month');
  const interval = intervalFor(plan, wanted);
  const yearly = interval === 'year';
  const locked = busy !== null;

  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-wide text-primary">Recommended for you</p>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground focus:outline-none sm:text-4xl"
      >
        The {plan.name} plan
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{reason}</p>

      {returnedFromCheckout && (
        <p
          role="status"
          className="mt-5 rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground"
        >
          Your checkout was not completed, so nothing was charged. You can try again or carry on without a plan.
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-primary bg-card p-5 shadow-sm ring-1 ring-primary/30 sm:p-6">
        {!plan.monthlyOnly && (
          <div
            role="group"
            aria-label="Billing period"
            className="mb-5 inline-flex rounded-full border border-border bg-background p-1"
          >
            {(['month', 'year'] as Interval[]).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={wanted === option}
                disabled={locked}
                onClick={() => setWanted(option)}
                className={`min-h-[40px] rounded-full px-4 text-sm font-semibold transition-colors disabled:opacity-60 motion-reduce:transition-none ${
                  wanted === option
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {option === 'month' ? 'Monthly' : 'Yearly'}
                {option === 'year' && (
                  <span className="ml-2 text-[11px] font-bold uppercase tracking-wide opacity-90">2 months free</span>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-display text-4xl font-extrabold text-foreground">
            ${yearly ? yearlyPrice(plan) : plan.price}
          </span>
          <span className="text-sm text-muted-foreground">
            {yearly ? '/yr' : '/mo'} {CURRENCY}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {yearly
            ? `$${yearlyPerMonth(plan)}/mo, billed once a year`
            : plan.monthlyOnly
              ? 'Billed monthly. This plan has no yearly option.'
              : 'Billed monthly'}
        </p>

        <ul className="mt-5 space-y-2.5 text-sm text-foreground">
          <li className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-sev-low" strokeWidth={2.5} aria-hidden="true" />
            <span>
              {yearly ? (
                <>
                  <span className="font-semibold">{plan.scans.toLocaleString('en-US')} scans added every month</span>.
                  Unused scans carry over until your year ends.
                </>
              ) : (
                <span className="font-semibold">{plan.scans.toLocaleString('en-US')} scans a month</span>
              )}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-sev-low" strokeWidth={2.5} aria-hidden="true" />
            <span>
              Regular and deep scans (up to {deepScans(plan).toLocaleString('en-US')} deep scans, {DEEP_SCAN_COST} scans
              each)
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-sev-low" strokeWidth={2.5} aria-hidden="true" />
            <span>Scan history, audio analysis and priority processing</span>
          </li>
        </ul>

        {overCapacity && (
          <p className="mt-5 rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground">
            Need more than {plan.scans.toLocaleString('en-US')} scans a month?{' '}
            <a
              href="/solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline underline-offset-2"
            >
              Talk to us about higher volume
            </a>
            .
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => onBuy(interval)}
            disabled={locked}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
          >
            {busy === 'buy' && <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
            {busy === 'buy' ? 'Opening secure checkout…' : `Get ${plan.name}${yearly ? ' yearly' : ''}`}
          </button>

          <button
            type="button"
            onClick={() => onDecline(interval)}
            disabled={locked}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-base font-semibold text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
          >
            {busy === 'decline' && (
              <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            )}
            {declineLabel(trialPhase)}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Secure checkout via Stripe. Taxes, if any, are shown before you pay. Cancel anytime.
        </p>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
        A regular scan checks one ad against one platform and uses 1 scan. Checking the same ad for several platforms,
        or using deep scans, uses more.
      </p>

      <div className="mt-6 flex items-center justify-between gap-4">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            disabled={locked}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60 motion-reduce:transition-none"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={() => onCompare(interval)}
          disabled={locked}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-2 text-sm font-semibold text-primary underline underline-offset-2 transition-opacity hover:opacity-80 disabled:opacity-60 motion-reduce:transition-none"
        >
          {busy === 'compare' && (
            <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          )}
          Compare all plans
        </button>
      </div>
    </div>
  );
}
