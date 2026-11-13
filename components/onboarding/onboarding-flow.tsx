//components/onboarding/onboarding-flow.tsx
'use client';

// The onboarding page: one question per screen, then the recommended plan.
//
// How it fits together:
//   - lib/onboarding/flow.ts        which questions, in which order
//   - lib/onboarding/questions.ts   wording, answers, icons
//   - lib/onboarding/recommend.ts   answers -> one plan
//   - lib/onboarding/api.ts         saving (database functions)
//
// The step on screen is in the address bar (/onboarding?step=monthly_ads), so
// the browser's Back and Forward buttons work and a reload stays put. The
// address is never trusted on its own: a step is only shown if every question
// before it has been answered, otherwise the first unanswered one is shown.
//
// Every answer is saved the moment it is picked. Closing the tab loses
// nothing, and opening the page again (any device) resumes at the first
// unanswered question.
//
// Leaving:
//   - "Skip for now" (every screen)  -> status 'skipped', back to the dashboard
//   - a choice on the plan screen    -> status 'completed'
//   - paid accounts are never shown a plan to buy; they finish after the
//     last question

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { supabase } from '@/lib/mediacrater/supabaseClient';
import { useTrialState } from '@/lib/mediacrater/useTrialState';
import type { Interval } from '@/lib/mediacrater/plans';
import {
  finishOnboarding,
  saveOnboardingAnswer,
  skipOnboarding,
  startOnboarding,
  type OnboardingDecision,
  type OnboardingRow,
} from '@/lib/onboarding/api';
import { ONBOARDING_ENABLED, markOnboardingUnavailable } from '@/lib/onboarding/config';
import {
  FLOW_VERSION,
  PLAN_STEP,
  getOrder,
  isRole,
  minimumTotal,
  pickOrderKey,
  resolveSteps,
  type QuestionId,
  type StepId,
} from '@/lib/onboarding/flow';
import { QUESTIONS, isValidAnswer } from '@/lib/onboarding/questions';
import { recommendPlan, type Answers } from '@/lib/onboarding/recommend';
import { publishOnboardingRow } from '@/lib/onboarding/useOnboardingRow';
import { OptionCard } from '@/components/onboarding/option-card';
import { PlanScreen, type PlanScreenAction } from '@/components/onboarding/plan-screen';

interface ProfileSummary {
  plan: string;
  scansRemaining: number | null;
}

const SAVE_ERROR = 'We could not save that. Check your connection and try again.';

// ---------------------------------------------------------------------------
// Page frame: logo, "Skip for now", and the content column
// ---------------------------------------------------------------------------

function Frame({
  children,
  onSkip,
  skipping = false,
}: {
  children: React.ReactNode;
  onSkip?: () => void;
  skipping?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border px-4 sm:px-8">
        {/* Not a link: leaving half-way should be a decision (Skip), not a slip. */}
        <div className="inline-flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-mark-96.png" alt="" width={32} height={32} className="h-8 w-8 dark:hidden" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-mark-dark-96.png" alt="" width={32} height={32} className="hidden h-8 w-8 dark:block" />
          <span className="font-display text-[1.1rem] font-extrabold tracking-[-0.01em]">Mediacrater</span>
        </div>

        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            disabled={skipping}
            className="inline-flex min-h-[44px] items-center rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-60 motion-reduce:transition-none"
          >
            {skipping ? 'Skipping…' : 'Skip for now'}
          </button>
        )}
      </header>

      <main id="main-content" className="flex-1 px-4 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto w-full max-w-xl">{children}</div>
      </main>
    </div>
  );
}

/** Shown while the page works out who is signed in and where they left off. */
export function OnboardingLoading() {
  return (
    <Frame>
      <p role="status" className="text-sm text-muted-foreground">
        Loading…
      </p>
    </Frame>
  );
}

// ---------------------------------------------------------------------------
// Progress: "Question 2 of 3" and a bar with one segment per question
// ---------------------------------------------------------------------------

function Progress({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8">
      <p className="text-sm font-semibold text-muted-foreground" aria-live="polite">
        Question {current} of {total}
      </p>
      <div className="mt-2 flex gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-colors motion-reduce:transition-none ${
              index < current ? 'bg-primary' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The flow
// ---------------------------------------------------------------------------

export function OnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get('step');

  const [phase, setPhase] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const [row, setRow] = useState<OnboardingRow | null>(null);
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [savingValue, setSavingValue] = useState<string | null>(null);
  const [skipping, setSkipping] = useState(false);
  const [planBusy, setPlanBusy] = useState<PlanScreenAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  // True only when the page was opened by someone who had already been to
  // Stripe from the plan screen and had not paid.
  const [returnedFromCheckout, setReturnedFromCheckout] = useState(false);

  const trial = useTrialState(profile?.scansRemaining ?? null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const startedRef = useRef(false);
  const finishingRef = useRef(false);

  const isPaid = Boolean(profile?.plan && profile.plan !== 'free');

  // -- Start: who is this, and where did they leave off? ---------------------
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (!ONBOARDING_ENABLED) {
      router.replace('/dashboard');
      return;
    }

    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/signin');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('plan, scans_remaining')
        .eq('id', session.user.id)
        .single();

      const summary: ProfileSummary = {
        plan: typeof profileData?.plan === 'string' ? profileData.plan : 'free',
        scansRemaining: typeof profileData?.scans_remaining === 'number' ? profileData.scans_remaining : null,
      };

      let started: OnboardingRow;
      try {
        started = await startOnboarding(FLOW_VERSION, pickOrderKey(session.user.id));
      } catch (err) {
        console.error('Onboarding could not start:', err);
        markOnboardingUnavailable();
        setPhase('unavailable');
        return;
      }

      publishOnboardingRow(started);

      // Already finished. The one case that stays here: they opened Stripe from
      // the plan screen, did not pay, and came back to choose again.
      const cameBackFromCheckout =
        started.ideal_plan_option === 'CHECKOUT_STARTED' && summary.plan === 'free';
      if (started.onboarding_status === 'completed' && !cameBackFromCheckout) {
        router.replace('/dashboard');
        return;
      }

      setProfile(summary);
      setRow(started);
      setAnswers(started.answers);
      setReturnedFromCheckout(started.onboarding_status === 'completed');
      setPhase('ready');
    })();
  }, [router]);

  // -- Which screen? ---------------------------------------------------------
  const order = useMemo(() => getOrder(row?.order_variant), [row?.order_variant]);
  const role = isRole(answers.role) ? answers.role : null;
  const steps = useMemo(() => resolveSteps(order, role), [order, role]);
  const total = role ? steps.length : minimumTotal(order);

  const firstUnanswered: QuestionId | null = useMemo(
    () => steps.find((id) => !isValidAnswer(id, answers[id])) ?? null,
    [steps, answers]
  );

  // Once a choice on the plan screen is saved the answers are final, so the
  // plan screen is the only screen left (to retry the checkout or decline).
  const decided = Boolean(row && row.onboarding_status === 'completed');

  const activeStep: StepId = useMemo(() => {
    if (decided) return PLAN_STEP;
    const furthest: StepId = firstUnanswered ?? PLAN_STEP;
    if (!stepParam) return furthest;
    if (stepParam === PLAN_STEP) return furthest;

    const wantedIndex = steps.indexOf(stepParam as QuestionId);
    if (wantedIndex === -1) return furthest;

    // Going back to an earlier question is always fine; jumping ahead is not.
    const furthestIndex = firstUnanswered ? steps.indexOf(firstUnanswered) : steps.length;
    return wantedIndex <= furthestIndex ? (stepParam as QuestionId) : furthest;
  }, [decided, firstUnanswered, stepParam, steps]);

  // Keep the address bar in step with what is on screen.
  useEffect(() => {
    if (phase !== 'ready') return;
    if (stepParam !== activeStep) router.replace(`/onboarding?step=${activeStep}`);
  }, [phase, stepParam, activeStep, router]);

  // Move keyboard and screen-reader focus to the new screen's heading.
  useEffect(() => {
    if (phase !== 'ready') return;
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [phase, activeStep]);

  const goToStep = useCallback(
    (step: StepId) => {
      setError(null);
      router.push(`/onboarding?step=${step}`);
    },
    [router]
  );

  const recommendation = useMemo(() => recommendPlan(answers), [answers]);

  // -- Finishing -------------------------------------------------------------
  const finish = useCallback(
    async (decision: OnboardingDecision | null, interval: Interval | null) => {
      const saved = await finishOnboarding({
        plan: decision && recommendation ? recommendation.plan.id : null,
        interval: decision ? interval : null,
        decision: decision && recommendation ? decision : null,
        estimatedMonthlyAds: recommendation ? recommendation.estimatedMonthlyAds : null,
      });
      setRow(saved);
      publishOnboardingRow(saved);
      return saved;
    },
    [recommendation]
  );

  // Paid accounts, and anyone whose answers cannot produce a recommendation,
  // have nothing to decide on the plan screen: finish and go to the dashboard.
  const skipPlanScreen = phase === 'ready' && activeStep === PLAN_STEP && (isPaid || !recommendation);

  useEffect(() => {
    if (!skipPlanScreen || finishingRef.current) return;
    finishingRef.current = true;

    (async () => {
      try {
        await finish(null, null);
        router.replace('/dashboard');
      } catch (err) {
        console.error('Onboarding could not be finished:', err);
        finishingRef.current = false;
        setError(SAVE_ERROR);
      }
    })();
  }, [skipPlanScreen, finish, router]);

  // -- Actions ---------------------------------------------------------------
  async function handleSkip() {
    if (skipping) return;
    setSkipping(true);
    setError(null);
    try {
      const saved = await skipOnboarding(activeStep);
      publishOnboardingRow(saved);
      router.replace('/dashboard');
    } catch (err) {
      // Stay here: going to the dashboard with the skip unsaved would send
      // them straight back to this page.
      console.error('Onboarding skip was not saved:', err);
      setError(SAVE_ERROR);
      setSkipping(false);
    }
  }

  async function handleAnswer(questionId: QuestionId, value: string) {
    if (savingValue !== null || skipping) return;
    setError(null);

    const previousAnswers = answers;
    // A different role starts a different branch: its old answers no longer apply.
    const nextAnswers: Answers =
      questionId === 'role' && answers.role !== value ? { role: value } : { ...answers, [questionId]: value };
    const nextRole = isRole(nextAnswers.role) ? nextAnswers.role : null;
    const nextSteps = resolveSteps(order, nextRole);
    const nextStep: StepId = nextSteps[nextSteps.indexOf(questionId) + 1] ?? PLAN_STEP;

    setAnswers(nextAnswers);
    setSavingValue(value);

    try {
      const saved = await saveOnboardingAnswer(questionId, value, nextStep);
      setRow(saved);
      setAnswers(saved.answers);
      publishOnboardingRow(saved);
      router.push(`/onboarding?step=${nextStep}`);
    } catch (err) {
      console.error('Onboarding answer was not saved:', err);
      setAnswers(previousAnswers);
      setError(SAVE_ERROR);
    } finally {
      setSavingValue(null);
    }
  }

  async function handleDecline(interval: Interval) {
    if (planBusy) return;
    setPlanBusy('decline');
    setError(null);
    try {
      await finish('FREE', interval);
      router.replace('/dashboard');
    } catch (err) {
      console.error('Onboarding decision was not saved:', err);
      setError(SAVE_ERROR);
      setPlanBusy(null);
    }
  }

  // "Compare all plans" is recorded as not buying the recommended plan here.
  // If they then buy on /buy-scans, the purchases table has that purchase.
  async function handleCompare(interval: Interval) {
    if (planBusy) return;
    setPlanBusy('compare');
    setError(null);
    try {
      await finish('FREE', interval);
      router.push('/buy-scans');
    } catch (err) {
      console.error('Onboarding decision was not saved:', err);
      setError(SAVE_ERROR);
      setPlanBusy(null);
    }
  }

  async function handleBuy(interval: Interval) {
    if (planBusy || !recommendation) return;
    setPlanBusy('buy');
    setError(null);

    // Record that checkout was opened. If this write fails the purchase still
    // goes ahead: losing a statistic is better than losing a sale. The webhook
    // marks the row PAID either way once Stripe confirms the payment.
    try {
      await finish('CHECKOUT_STARTED', interval);
    } catch (err) {
      console.error('Onboarding checkout start was not recorded:', err);
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/signin');
        return;
      }

      // Same function the buy page uses. `entry` tells it which screen this
      // is; the function, not this page, decides where Stripe returns to.
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-checkout-webapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plan: recommendation.plan.id, interval, entry: 'onboarding' }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Failed to start checkout');
      }

      // Only ever follow a secure web address handed back by the server.
      let target: URL;
      try {
        target = new URL(String(data.url));
      } catch {
        throw new Error('Failed to start checkout');
      }
      if (target.protocol !== 'https:') throw new Error('Failed to start checkout');

      window.location.href = target.toString();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setPlanBusy(null);
    }
  }

  // -- Rendering -------------------------------------------------------------
  if (phase === 'unavailable') {
    return (
      <Frame>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">These questions are not available right now</h1>
        <p className="mt-3 text-muted-foreground">
          Nothing is wrong with your account. You can go straight to your dashboard and scan your ads.
        </p>
        <button
          type="button"
          onClick={() => router.replace('/dashboard')}
          className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go to dashboard
        </button>
      </Frame>
    );
  }

  if (phase === 'loading' || !row) return <OnboardingLoading />;

  if (skipPlanScreen) {
    return (
      <Frame>
        {error ? (
          <>
            <p role="alert" className="text-sm text-red-700 dark:text-red-400">
              {error}
            </p>
            <button
              type="button"
              onClick={() => router.replace('/dashboard')}
              className="mt-5 inline-flex min-h-[44px] items-center rounded-lg border border-border px-4 text-sm font-semibold hover:bg-secondary"
            >
              Go to dashboard
            </button>
          </>
        ) : (
          <p role="status" className="text-sm text-muted-foreground">
            Saving your answers…
          </p>
        )}
      </Frame>
    );
  }

  if (activeStep === PLAN_STEP && recommendation) {
    const lastQuestion = steps[steps.length - 1];
    return (
      // No "Skip for now" here: the decline button is this screen's way out,
      // and it records a decision instead of a skip.
      <Frame>
        <PlanScreen
          recommendation={recommendation}
          trialPhase={trial.phase}
          busy={planBusy}
          error={error}
          returnedFromCheckout={returnedFromCheckout}
          onBuy={handleBuy}
          onDecline={handleDecline}
          onCompare={handleCompare}
          onBack={decided ? undefined : () => goToStep(lastQuestion)}
          headingRef={headingRef}
        />
      </Frame>
    );
  }

  const questionId = activeStep as QuestionId;
  const question = QUESTIONS[questionId];
  const stepIndex = steps.indexOf(questionId);
  const selectedValue = answers[questionId];
  const hasAnswer = isValidAnswer(questionId, selectedValue);
  const previousStep = stepIndex > 0 ? steps[stepIndex - 1] : null;
  const nextStep: StepId = steps[stepIndex + 1] ?? PLAN_STEP;
  const busy = savingValue !== null || skipping;
  const hasExamples = question.options.some((option) => option.example);
  const titleId = `onboarding-question-${question.id}`;
  // The one card reachable with Tab: the chosen answer, or the first card.
  const tabbableIndex = Math.max(
    0,
    question.options.findIndex((option) => option.value === selectedValue)
  );

  // Arrow keys move between the cards. Unlike a plain radio group they do not
  // pick the card they land on, because picking an answer moves to the next
  // screen. Enter or Space picks.
  function handleOptionKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const count = question.options.length;
    let target: number | null = null;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') target = (index + 1) % count;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') target = (index - 1 + count) % count;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = count - 1;

    if (target === null) return;
    event.preventDefault();
    optionRefs.current[target]?.focus();
  }

  return (
    <Frame onSkip={handleSkip} skipping={skipping}>
        <Frame onSkip={handleSkip} skipping={skipping}>
      {/* Intro line above the progress counter. Hidden for paid accounts:
          they are never shown a plan to pick, so the promise would be untrue. */}
      {!isPaid && (
        <p className="mb-4 text-base font-semibold text-foreground">
          Tell us about yourself and we&apos;ll help you pick the right plan
        </p>
      )}

      <Progress current={stepIndex + 1} total={total} />

      <h1
        id={titleId}
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-2xl font-extrabold leading-tight tracking-tight text-foreground focus:outline-none sm:text-3xl"
      >
        {question.title}
      </h1>
      {question.helper && <p className="mt-2 text-base text-muted-foreground">{question.helper}</p>}

      <div
        role="radiogroup"
        aria-labelledby={titleId}
        className={`mt-6 grid gap-3 ${hasExamples ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}
      >
        {question.options.map((option, index) => (
          <OptionCard
            key={option.value}
            ref={(element) => {
              optionRefs.current[index] = element;
            }}
            option={option}
            selected={selectedValue === option.value}
            saving={savingValue === option.value}
            disabled={busy && savingValue !== option.value}
            tabbable={index === tabbableIndex}
            onSelect={() => handleAnswer(questionId, option.value)}
            onKeyDown={(event) => handleOptionKeyDown(event, index)}
          />
        ))}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
        >
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-4">
        {previousStep ? (
          <button
            type="button"
            onClick={() => goToStep(previousStep)}
            disabled={busy}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60 motion-reduce:transition-none"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
        ) : (
          <span />
        )}

        {/* Only after coming back to an answered question: carry on without picking again. */}
        {hasAnswer && (
          <button
            type="button"
            onClick={() => goToStep(nextStep)}
            disabled={busy}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-60 motion-reduce:transition-none"
          >
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </Frame>
  );
}
