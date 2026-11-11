//app/buy-scans/page.tsx
'use client';

// The web app's own checkout entry point. It is a different route from
// /buy-tokens (which stays as-is for the extension) so it is obvious in
// analytics and in the URL bar which surface a checkout came from.
//
// This page is authenticated: identity comes from the signed-in Supabase
// session, never from a URL parameter. Being signed in IS the gate, and
// create-checkout-webapp enforces it again on the server.
//
// What this version changes (everything else works as before):
//   - tells the truth about deep scans (2 scans each), rollover, trial and cancelling
//   - shows the person's trial status, so "See plans" lands with context
//   - existing subscribers get a confirmation step that spells out what a
//     plan change does (new billing cycle today, old subscription cancelled
//     after the new payment, no credit for unused time)
//   - price per scan, campaign-size hint, one recommended plan
//   - "Manage billing or cancel" for subscribers (billing portal)
//   - bigger tap targets, aria-expanded FAQ, role="alert" errors, working
//     skip link (id="main-content")

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Check } from 'lucide-react';
import { supabase } from '@/lib/mediacrater/supabaseClient';
import { getBillingPortalUrl } from '@/lib/mediacrater/billing';
import { useTrialState } from '@/lib/mediacrater/useTrialState';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// ---------------------------------------------------------------------------
// Settings you may want to change
// ---------------------------------------------------------------------------

// Shown next to prices. Change it if Stripe charges in another currency.
const CURRENCY = 'USD';

// What the server charges for a deep scan (see scanCost in scanVideo.js).
const DEEP_SCAN_COST = 2;

// Most ad campaigns are tested in batches of 3 to 5 ads. Used for the
// "about N campaigns" hint on each plan.
const ADS_PER_CAMPAIGN = 5;

// One plan gets a "Recommended" badge. Set to null to remove it. This is a
// recommendation, not a claim about what other people buy.
const RECOMMENDED_PLAN_ID: string | null = 'established';

const SUPPORT_EMAIL = 'hello.mediacrater@gmail.com';

// Same variables the trial banner uses (set in Vercel).
const TRIAL_DAYS = Number(process.env.NEXT_PUBLIC_TRIAL_DAYS) || 14;
const TRIAL_SCANS = Number(process.env.NEXT_PUBLIC_TRIAL_SCANS) || 5;
const TRIAL_CUTOVER_ISO = process.env.NEXT_PUBLIC_TRIAL_CUTOVER_ISO || '';

// ---------------------------------------------------------------------------
// Plans
// ---------------------------------------------------------------------------

interface Plan {
  id: string;
  name: string;
  price: number; // per month
  scans: number; // per month
  description: string;
  monthlyOnly?: boolean; // no yearly plan (Agency)
}

const PLANS: Plan[] = [
  {
    id: 'startup',
    name: 'Startup',
    price: 10,
    scans: 20,
    description: 'For solo dropshippers testing new creatives',
  },
  {
    id: 'established',
    name: 'Established',
    price: 40,
    scans: 100,
    description: 'For brands running consistent paid campaigns',
  },
  {
    id: 'scaler',
    name: 'Scaler',
    price: 80,
    scans: 250,
    description: 'For media buyers scaling across multiple offers',
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 200,
    scans: 1000,
    description: 'For agencies managing multiple client accounts',
    monthlyOnly: true,
  },
];

type Interval = 'month' | 'year';

// The interval a plan is actually sold at when the visitor has picked `wanted`.
// Agency is monthly only, so it stays monthly even on the Yearly toggle.
const intervalFor = (plan: Plan, wanted: Interval): Interval => (plan.monthlyOnly ? 'month' : wanted);

// A yearly plan costs 10 monthly payments: two months free. Keep in sync with
// the yearly prices in Stripe.
const YEARLY_MONTHS_PAID = 10;
const yearlyPrice = (plan: Plan) => plan.price * YEARLY_MONTHS_PAID;
const yearlyPerMonth = (plan: Plan) => (yearlyPrice(plan) / 12).toFixed(2);
const yearlyPerScan = (plan: Plan) => (yearlyPrice(plan) / (plan.scans * 12)).toFixed(2);

// How a plan change is done. Must match decideUpgradePath in the
// create-checkout-webapp function:
//   inplace  = changed on the existing subscription, unused time credited
//   checkout = the Stripe checkout page, new billing period, no credit
//   blocked  = not offered (a yearly plan only goes up to a larger yearly plan)
type ChangeKind = 'inplace' | 'checkout' | 'blocked';

function changeKind(
  currentIndex: number,
  currentInterval: Interval,
  targetIndex: number,
  targetInterval: Interval
): ChangeKind {
  if (currentInterval === 'year') {
    return targetInterval === 'year' && targetIndex > currentIndex ? 'inplace' : 'blocked';
  }
  if (targetInterval === 'month') return targetIndex > currentIndex ? 'inplace' : 'checkout';
  return targetIndex >= currentIndex ? 'inplace' : 'checkout';
}

const perScan = (plan: Plan) => (plan.price / plan.scans).toFixed(2);
const deepScans = (plan: Plan) => Math.floor(plan.scans / DEEP_SCAN_COST);
const campaigns = (plan: Plan) => Math.floor(plan.scans / ADS_PER_CAMPAIGN);

const INCLUDED_IN_EVERY_PLAN = [
  'Video & image scanning',
  'All platforms supported',
  'Violation timestamps & fixes',
  'Regular and Deep scans',
  'Audio analysis',
  'Priority support',
];

const EXTENSION_FEATURES = [
  'Unlimited individual downloads',
  'Batch ZIP downloads',
  'Local creative library storage',
];

const COMPARISON_ROWS: { label: string; value: (plan: Plan) => string }[] = [
  { label: 'Price per month', value: (p) => `$${p.price}` },
  { label: 'Price per year (2 months free)', value: (p) => (p.monthlyOnly ? 'Monthly only' : `$${yearlyPrice(p)}`) },
  { label: 'Scans per month', value: (p) => String(p.scans) },
  { label: 'Scans per year (yearly plans)', value: (p) => (p.monthlyOnly ? 'n/a' : String(p.scans * 12)) },
  { label: `Deep scans (${DEEP_SCAN_COST} scans each)`, value: (p) => `up to ${deepScans(p)}` },
  { label: 'Price per scan', value: (p) => `$${perScan(p)}` },
  { label: `Campaigns of ${ADS_PER_CAMPAIGN} ads`, value: (p) => `about ${campaigns(p)}` },
];

// ---------------------------------------------------------------------------
// FAQ (some answers depend on whether the free trial is live)
// ---------------------------------------------------------------------------

function buildFaq(trialLive: boolean): { question: string; answer: string }[] {
  const items: { question: string; answer: string }[] = [
    {
      question: 'What counts as one scan?',
      answer:
        `A regular scan checks one ad (a video or an image) against one platform's policies and uses 1 scan, regardless of length or file size. ` +
        `A deep scan is a more thorough analysis and uses ${DEEP_SCAN_COST} scans. ` +
        `So a plan with 20 scans gives you 20 regular scans, or 10 deep scans, or a mix. ` +
        `Videos must be under 2 minutes. If a scan fails, you are not charged.`,
    },
  ];

  if (trialLive) {
    items.push({
      question: 'How does the free trial work?',
      answer:
        `New accounts get ${TRIAL_DAYS} days and ${TRIAL_SCANS} scans, with no credit card. ` +
        `The trial ends when the ${TRIAL_DAYS} days pass or the ${TRIAL_SCANS} scans are used, whichever comes first. ` +
        `Free trials are limited to one per person: our automated systems check for accounts linked by device or network.`,
    });
  }

  items.push(
    {
      question: 'Do unused scans roll over?',
      answer:
        'On monthly plans, no: your scans are refreshed to the full amount of your plan each time your billing period renews, and unused scans do not carry over. ' +
        'On yearly plans, yes within your year: unused scans carry over from month to month until your year ends. When a yearly plan renews, it starts again and leftover scans are not kept.',
    },
    {
      question: 'How do yearly plans work?',
      answer:
        'Startup, Established and Scaler can be paid yearly. A yearly plan costs 10 monthly payments (two months free) and is billed once a year. Agency is monthly only. You get the plan\'s monthly scans right away, then the same amount on the same day of each following month. ' +
        'Unused scans stay on your account until your year ends. If you cancel, the plan stays active until the end of the year you paid for and the monthly scans keep arriving, but the remaining months are not refunded. ' +
        'During the year you can upgrade to a larger yearly plan (the unused time is credited); other changes take effect when the year ends.',
    },
    {
      question: 'What happens if I switch plans?',
      answer:
        "Upgrading to a bigger plan takes effect immediately. Your card on file is charged the new plan's price minus a credit for the unused time on your current plan, " +
        "a new billing period starts today, and you get the new plan's scans right away (your scan count is replaced, not added to). " +
        "Moving from a monthly plan to a yearly one works the same way: the unused monthly time is credited. " +
        "Moving to a smaller plan is done on our secure checkout page: it starts a new billing period today, and unused time on the old plan is not credited, " +
        "so switching close to your renewal date wastes the least. Either way you see a confirmation before anything is charged.",
    },
    {
      question: 'What happens if I cancel?',
      answer: trialLive
        ? 'You keep your plan and your remaining scans until the end of the billing period you paid for. After that your account returns to the free plan with no scans left. The free trial cannot be restarted.'
        : 'You keep your plan and your remaining scans until the end of the billing period you paid for. After that your account returns to the free plan.',
    },
    {
      question: 'How do I cancel or update my card?',
      answer:
        'Use "Manage billing or cancel" on this page, or Manage Plan in Settings. It opens Stripe\'s secure billing portal.',
    },
    {
      question: 'Which currency is used, and are taxes included?',
      answer: `Prices are in ${CURRENCY}, per month on monthly plans and per year on yearly plans. Any applicable taxes are calculated and shown at checkout, before you pay.`,
    },
    {
      question: 'Is my payment secure?',
      answer: 'Yes. All payments are processed by Stripe. We never store or see your card details.',
    },
    {
      question: 'I have another question.',
      answer: `Email ${SUPPORT_EMAIL} and we will get back to you.`,
    }
  );

  return items;
}

function FAQItem({ id, question, answer }: { id: string; question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const panelId = `${id}-panel`;
  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full flex justify-between items-center py-4 text-left gap-4 min-h-[44px]"
      >
        <span className="font-medium text-sm">{question}</span>
        <span aria-hidden="true" className="text-muted-foreground text-lg flex-shrink-0">
          {open ? '−' : '+'}
        </span>
      </button>
      <div id={panelId} hidden={!open}>
        <p className="text-sm text-muted-foreground pb-4 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Trial notice: shown above the plans, only when it helps
// ---------------------------------------------------------------------------

function TrialNotice({
  phase,
  daysLeft,
  endReason,
  scansRemaining,
}: {
  phase: string;
  daysLeft: number | null;
  endReason: string | null;
  scansRemaining: number | null;
}) {
  if (phase === 'trial') {
    const days = daysLeft ?? 0;
    return (
      <div
        role="status"
        className="max-w-2xl mx-auto rounded-lg border border-border bg-primary/10 px-4 py-3 text-center text-sm text-primary"
      >
        Your free trial: {days} day{days === 1 ? '' : 's'} left
        {typeof scansRemaining === 'number'
          ? `, ${scansRemaining} scan${scansRemaining === 1 ? '' : 's'} left`
          : ''}
        . Subscribe any time and your plan starts right away.
      </div>
    );
  }

  if (phase === 'ended') {
    return (
      <div
        role="status"
        className="max-w-2xl mx-auto rounded-lg border border-[#fde68a] dark:border-[#4d2900] bg-amber-100 dark:bg-transparent px-4 py-3 text-center text-sm text-amber-700 dark:text-[#fbbf24]"
      >
        {endReason === 'linked'
          ? 'A free trial has already been used on this device or network. Free trials are limited to one per person. Pick a plan to keep scanning.'
          : 'Your free trial has ended. Pick a plan to keep scanning.'}
      </div>
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BuyScansPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [scansRemaining, setScansRemaining] = useState<number | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<Plan | null>(null);
  const [pendingInterval, setPendingInterval] = useState<Interval>('month');
  // What the visitor is looking at, and (for subscribers) what they are on now.
  const [selectedInterval, setSelectedInterval] = useState<Interval>('month');
  const [currentInterval, setCurrentInterval] = useState<Interval>('month');
  const [error, setError] = useState<string | null>(null);
  // Set when a bank needs 3D Secure and an in-place upgrade is not possible.
  const [fallbackCheckoutUrl, setFallbackCheckoutUrl] = useState<string | null>(null);
  const trial = useTrialState(scansRemaining);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/signin');
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan, scans_remaining, billing_interval')
        .eq('id', session.user.id)
        .single();
      setCurrentPlan(profile?.plan || 'free');
      if (profile?.billing_interval === 'year') {
        setCurrentInterval('year');
        setSelectedInterval('year');
      }
      setScansRemaining(typeof profile?.scans_remaining === 'number' ? profile.scans_remaining : null);
      setLoading(false);
    };
    init();
  }, [router]);

  const isSubscriber = currentPlan !== 'free';
  const currentIndex = PLANS.findIndex((p) => p.id === currentPlan);

  // Evaluated on render (not at build time): the cancel answer changes after the cutover.
  const cutoverTime = Date.parse(TRIAL_CUTOVER_ISO);
  const trialLive = Number.isFinite(cutoverTime) && Date.now() >= cutoverTime;
  const faqItems = buildFaq(trialLive);

  // Bigger plan = upgraded in place (credit for unused time). Smaller plan = checkout page, no credit.
  const pendingIndex = pendingPlan ? PLANS.findIndex((p) => p.id === pendingPlan.id) : -1;
  const pendingKind: ChangeKind =
    pendingPlan !== null && currentIndex >= 0
      ? changeKind(currentIndex, currentInterval, pendingIndex, pendingInterval)
      : 'checkout';
  const pendingIsUpgrade = pendingKind === 'inplace';
  const pendingYearly = pendingInterval === 'year';
  let pendingTitle = 'Switch plan?';
  if (pendingPlan) {
    const suffix = pendingYearly ? ' (yearly)' : '';
    pendingTitle =
      pendingIsUpgrade && pendingIndex === currentIndex
        ? `Switch ${pendingPlan.name} to yearly?`
        : `${pendingIsUpgrade ? 'Upgrade' : 'Switch'} to ${pendingPlan.name}${suffix}?`;
  }

  const handleSubscribe = async (planId: string, planInterval: Interval) => {
    setError(null);
    setFallbackCheckoutUrl(null);
    setLoadingPlan(planId);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/signin');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-checkout-webapp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ plan: planId, interval: planInterval }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        // The bank wants extra confirmation, which an in-place upgrade cannot
        // collect. The server hands back a ready checkout link to offer.
        if (data.code === 'needs_authentication' && typeof data.checkoutUrl === 'string') {
          setFallbackCheckoutUrl(data.checkoutUrl);
        }
        throw new Error(data.error || 'Failed to start checkout');
      }
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoadingPlan(null);
      setPendingPlan(null);
    }
  };

  // Free accounts go straight to checkout. Subscribers see what a switch does first.
  const handlePlanClick = (plan: Plan) => {
    if (isSubscriber) {
      setError(null);
      setFallbackCheckoutUrl(null);
      setPendingInterval(intervalFor(plan, selectedInterval));
      setPendingPlan(plan);
    } else {
      handleSubscribe(plan.id, intervalFor(plan, selectedInterval));
    }
  };

  const handleManageBilling = async () => {
    setError(null);
    setPortalLoading(true);
    try {
      const url = await getBillingPortalUrl();
      window.location.href = url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not open the billing portal. Please try again.');
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p role="status" className="text-muted-foreground font-medium">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="max-w-6xl mx-auto px-4 pt-32 pb-16 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold">Choose your plan</h1>
          {/* data-verse: Romans 8:28 */}
          <p data-verse="Romans 8:28" className="text-muted-foreground text-sm">
            Pick a plan based on how many ad campaigns you run per month. Pay yearly and get 2 months free. Cancel anytime from this page.
          </p>
        </div>

        <TrialNotice
          phase={trial.phase}
          daysLeft={trial.daysLeft}
          endReason={trial.endReason}
          scansRemaining={scansRemaining}
        />

        {error && (
          <div
            role="alert"
            className="max-w-md mx-auto p-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-sm text-red-800 dark:text-red-400 text-center"
          >
            {error}
            {fallbackCheckoutUrl && (
              <div className="pt-2">
                <a
                  href={fallbackCheckoutUrl}
                  className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Continue to secure checkout
                </a>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center">
          <div
            role="group"
            aria-label="Billing period"
            className="inline-flex rounded-full border border-border bg-card p-1"
          >
            {(['month', 'year'] as Interval[]).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={selectedInterval === option}
                onClick={() => setSelectedInterval(option)}
                className={`min-h-[44px] px-5 rounded-full text-sm font-semibold transition-colors ${
                  selectedInterval === option
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {option === 'month' ? 'Monthly' : 'Yearly'}
                {option === 'year' && (
                  <span className="ml-2 text-[11px] font-bold uppercase tracking-wide opacity-90">
                    2 months free
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {isSubscriber && currentInterval === 'year' && (
          <div
            role="status"
            className="max-w-2xl mx-auto rounded-lg border border-border bg-primary/10 px-4 py-3 text-center text-sm text-primary"
          >
            You are on a yearly plan. You can upgrade to a larger yearly plan at any time and get a credit for the
            unused time. Other changes, including Agency (monthly only), take effect when your year ends: use Manage billing, or email {SUPPORT_EMAIL}.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan, index) => {
            const planInterval = intervalFor(plan, selectedInterval);
            const isCurrent = isSubscriber && plan.id === currentPlan && planInterval === currentInterval;
            const isRecommended = plan.id === RECOMMENDED_PLAN_ID && !isCurrent;
            const kind: ChangeKind =
              isSubscriber && currentIndex >= 0
                ? changeKind(currentIndex, currentInterval, index, planInterval)
                : 'checkout';
            const isBlocked = isSubscriber && kind === 'blocked' && !isCurrent;

            let label = `Get ${plan.name}${planInterval === 'year' ? ' yearly' : plan.monthlyOnly && selectedInterval === 'year' ? ' monthly' : ''}`;
            if (isSubscriber) {
              if (kind === 'inplace') {
                label = index === currentIndex ? 'Switch to yearly' : `Upgrade to ${plan.name}`;
              } else {
                label = `Switch to ${plan.name}`;
              }
            }
            if (isBlocked) label = 'At the end of your year';
            if (loadingPlan === plan.id) label = 'Redirecting…';
            if (isCurrent) label = 'Current plan';

            return (
              <div
                key={plan.id}
                className={`relative rounded-xl border p-5 flex flex-col ${
                  isCurrent
                    ? 'border-primary bg-primary/5'
                    : isRecommended
                      ? 'border-primary bg-card shadow-md ring-1 ring-primary/30'
                      : 'border-border bg-card'
                }`}
              >
                {isRecommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
                    Recommended
                  </span>
                )}
                <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">{plan.name}</h2>
                {planInterval === 'year' ? (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">${yearlyPrice(plan)}</span>
                      <span className="text-xs text-muted-foreground">/yr {CURRENCY}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      ${yearlyPerMonth(plan)}/mo, billed once a year
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">${yearlyPerScan(plan)} per scan</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-xs text-muted-foreground">/mo {CURRENCY}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">${perScan(plan)} per scan</p>
                  </>
                )}
                {plan.monthlyOnly && selectedInterval === 'year' && (
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Monthly billing only</p>
                )}
                <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
                <ul className="space-y-1.5 mb-5 text-xs">
                  {planInterval === 'year' ? (
                    <>
                      <li className="font-semibold">{plan.scans} scans added every month</li>
                      <li className="text-muted-foreground">
                        {plan.scans * 12} scans a year. Unused scans carry over until your year ends.
                      </li>
                    </>
                  ) : (
                    <li className="font-semibold">{plan.scans} scans / month</li>
                  )}
                  <li className="text-muted-foreground">
                    Up to {deepScans(plan)} deep scans ({DEEP_SCAN_COST} scans each)
                  </li>
                  <li className="text-muted-foreground">
                    About {campaigns(plan)} campaigns of {ADS_PER_CAMPAIGN} ads
                  </li>
                </ul>
                <button
                  type="button"
                  onClick={() => handlePlanClick(plan)}
                  disabled={isCurrent || isBlocked || loadingPlan !== null || portalLoading}
                  className={`mt-auto w-full min-h-[44px] py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isCurrent
                      ? 'bg-muted text-muted-foreground border border-border'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {label}
                </button>
              </div>
            );
          })}
        </div>

        {isSubscriber && (
          <div className="text-center">
            <button
              type="button"
              onClick={handleManageBilling}
              disabled={portalLoading || loadingPlan !== null}
              className="min-h-[44px] px-4 text-sm font-medium text-primary underline underline-offset-2 hover:opacity-80 disabled:opacity-50"
            >
              {portalLoading ? 'Opening…' : 'Manage billing or cancel'}
            </button>
          </div>
        )}

        <section aria-labelledby="compare-heading" className="space-y-4">
          <h2 id="compare-heading" className="text-xl font-bold text-center">
            Compare plans
          </h2>
          <div className="rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-sm">
                <thead>
                  <tr className="bg-card">
                    <th scope="col" className="px-6 py-3 text-left border-r border-b border-border">
                      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Plan
                      </span>
                    </th>
                    {PLANS.map((plan) => (
                      <th
                        key={plan.id}
                        scope="col"
                        className="px-4 py-3 text-center border-r last:border-r-0 border-b border-border"
                      >
                        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          {plan.name}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, rowIdx) => (
                    <tr key={row.label} className={rowIdx % 2 === 0 ? 'bg-card' : 'bg-secondary/40'}>
                      <th scope="row" className="px-6 py-3 text-left border-r border-border font-medium text-foreground/80">
                        {row.label}
                      </th>
                      {PLANS.map((plan) => (
                        <td
                          key={plan.id}
                          className="px-4 py-3 text-center border-r last:border-r-0 border-border font-medium text-foreground"
                        >
                          {row.value(plan)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section aria-labelledby="included-heading" className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 id="included-heading" className="text-xl font-bold text-center mb-6">
            Included in every plan
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Scanning</h3>
              <ul className="space-y-2">
                {INCLUDED_IN_EVERY_PLAN.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" strokeWidth={2.5} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Extension features</h3>
              <p className="text-xs text-muted-foreground mb-3">Included with every paid Mediacrater plan</p>
              <ul className="space-y-2">
                {EXTENSION_FEATURES.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" strokeWidth={2.5} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
            aria-hidden="true"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Secure checkout via Stripe
          <span aria-hidden="true" className="text-border">·</span>
          Cancel anytime
          <span aria-hidden="true" className="text-border">·</span>
          Prices in {CURRENCY}
        </p>

        <section aria-labelledby="faq-heading" className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8">
          <h2 id="faq-heading" className="text-xl font-bold mb-2">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            {faqItems.map((item, i) => (
              <FAQItem key={item.question} id={`faq-${i}`} question={item.question} answer={item.answer} />
            ))}
          </div>
        </section>
      </main>

      <Dialog
        open={pendingPlan !== null}
        onOpenChange={(next) => {
          if (!next && loadingPlan === null) setPendingPlan(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{pendingTitle}</DialogTitle>
            <DialogDescription>
              {pendingIsUpgrade
                ? 'Please read this before you continue. Your card on file is charged as soon as you confirm below.'
                : 'Please read this before you continue. You will not be charged until you confirm on the next page.'}
            </DialogDescription>
          </DialogHeader>
          {pendingPlan && (
            <ul className="list-disc pl-5 space-y-2 text-sm text-foreground">
              <li>
                {pendingYearly
                  ? `${pendingPlan.name} is $${yearlyPrice(pendingPlan)} ${CURRENCY} once a year ($${yearlyPerMonth(pendingPlan)} a month, 2 months free), with ${pendingPlan.scans} scans added every month.`
                  : `${pendingPlan.name} is $${pendingPlan.price} ${CURRENCY} per month, with ${pendingPlan.scans} scans.`}
              </li>
              <li>It starts today, with a new billing period{pendingYearly ? ' that lasts a year' : ''}.</li>
              {pendingYearly ? (
                <li>
                  You get {pendingPlan.scans} scans now and {pendingPlan.scans} more on the same day of each following
                  month. Unused scans carry over until your year ends; when the year renews, leftovers are not kept.
                </li>
              ) : (
                <li>You get all {pendingPlan.scans} scans right away.</li>
              )}
              <li>Your scan count is replaced. Scans left on your current plan do not carry over.</li>
              {pendingIsUpgrade ? (
                <>
                  <li>
                    You pay {pendingPlan.name}&apos;s price minus a credit for the unused time on your current plan.
                    The exact amount, plus any taxes, is on your receipt.
                  </li>
                  <li>Your current plan is replaced; you are not charged twice.</li>
                  <li>If your bank asks for extra confirmation, we will send you to our secure checkout page instead.</li>
                </>
              ) : (
                <>
                  <li>Your current subscription is cancelled automatically once the new payment succeeds.</li>
                  <li>Unused time on your current plan is not credited.</li>
                </>
              )}
            </ul>
          )}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPendingPlan(null)}
              disabled={loadingPlan !== null}
              className="min-h-[44px] px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-secondary transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => pendingPlan && handleSubscribe(pendingPlan.id, pendingInterval)}
              disabled={loadingPlan !== null}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loadingPlan !== null
                ? pendingIsUpgrade ? 'Upgrading…' : 'Redirecting…'
                : pendingIsUpgrade ? 'Upgrade and pay now' : 'Continue to checkout'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
