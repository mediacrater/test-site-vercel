//lib/mediacrater/plans.ts
//
// The one place the plans, their prices and their scan amounts are written
// down for the web app. Read by:
//   - app/buy-scans/page.tsx            (the buy page)
//   - components/pricing.tsx            (the pricing table on the home page)
//   - lib/ads-conversion.ts             (the value sent with a purchase conversion)
//   - components/onboarding/plan-screen.tsx and lib/onboarding/recommend.ts
//
// Still kept by hand in two other places, because they run outside this repo:
//   - PLAN_DEFINITIONS in supabase/functions/create-checkout-webapp/index.ts
//   - PLAN_SCANS in supabase/functions/stripe-webhook/index.ts
// and the prices themselves live in Stripe. Change all of them together.

export type PlanId = 'startup' | 'established' | 'scaler' | 'agency';

export type Interval = 'month' | 'year';

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // per month
  scans: number; // per month
  description: string;
  monthlyOnly?: boolean; // no yearly plan (Agency)
}

// Smallest to largest. Code that picks "the smallest plan that covers N scans"
// relies on this order.
export const PLANS: Plan[] = [
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

export const CURRENCY = 'USD';

// What the server charges for a deep scan (see scanCost in scanVideo.js).
export const DEEP_SCAN_COST = 2;

export function getPlan(id: string | null | undefined): Plan | null {
  return PLANS.find((plan) => plan.id === id) ?? null;
}

// The interval a plan is actually sold at when the visitor has picked `wanted`.
// Agency is monthly only, so it stays monthly even on the Yearly toggle.
export const intervalFor = (plan: Plan, wanted: Interval): Interval => (plan.monthlyOnly ? 'month' : wanted);

// A yearly plan costs 10 monthly payments: two months free. Keep in sync with
// the yearly prices in Stripe.
export const YEARLY_MONTHS_PAID = 10;
export const yearlyPrice = (plan: Plan) => plan.price * YEARLY_MONTHS_PAID;
export const yearlyPerMonth = (plan: Plan) => (yearlyPrice(plan) / 12).toFixed(2);
export const yearlyPerScan = (plan: Plan) => (yearlyPrice(plan) / (plan.scans * 12)).toFixed(2);

export const perScan = (plan: Plan) => (plan.price / plan.scans).toFixed(2);
export const deepScans = (plan: Plan) => Math.floor(plan.scans / DEEP_SCAN_COST);
