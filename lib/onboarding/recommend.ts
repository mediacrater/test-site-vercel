//lib/onboarding/recommend.ts
//
// Turns the onboarding answers into one recommended plan.
//
// The rule, in full: estimate how many new ads the person runs per month, then
// recommend the SMALLEST plan whose monthly scans cover that number. It never
// recommends a bigger plan than the answers support, and the screen shows the
// reasoning so the person can check it.
//
// A regular scan checks one ad against one platform and uses 1 scan, so
// "ads per month" and "scans per month" are compared one to one. Someone who
// scans every ad for several platforms, or uses deep scans (2 scans each),
// needs more; the plan screen says so.

import { PLANS, type Plan, type PlanId } from '@/lib/mediacrater/plans';
import { isRole, type Role } from './flow';
import { getOptionLabel } from './questions';

export type Answers = Partial<Record<string, string>>;

// Media buyer and business: the top of the chosen range, because the plan has
// to cover the whole range the person picked.
const MONTHLY_ADS_UPPER: Record<string, number> = {
  up_to_20: 20,
  '21_100': 100,
  '101_250': 250,
  '251_1000': 1000,
  over_1000: 1001,
};

// Agency: two ranges are multiplied, so tops would overshoot badly (25 clients
// x 100 ads when the truth may be 6 x 21). Midpoints are used instead and the
// result is presented as an estimate.
const CLIENT_COUNT_MIDPOINT: Record<string, number> = {
  '1_5': 3,
  '6_25': 15,
  '26_50': 38,
  over_50: 50, // "at least 50"
};

const ADS_PER_CLIENT_MIDPOINT: Record<string, number> = {
  up_to_20: 10,
  '21_100': 60,
  '101_250': 175,
  '251_1000': 625,
};

export interface Recommendation {
  plan: Plan;
  /** New ads per month the recommendation is based on. */
  estimatedMonthlyAds: number;
  /** True when the estimate is higher than the largest plan covers. */
  overCapacity: boolean;
  /** One or two plain sentences shown on the plan screen. */
  reason: string;
}

const LARGEST_PLAN = PLANS[PLANS.length - 1];

/** The smallest plan that covers `ads` scans a month, or the largest plan if none does. */
export function planForMonthlyAds(ads: number): { plan: Plan; overCapacity: boolean } {
  const plan = PLANS.find((candidate) => candidate.scans >= ads);
  return plan ? { plan, overCapacity: false } : { plan: LARGEST_PLAN, overCapacity: true };
}

const formatNumber = (value: number) => value.toLocaleString('en-US');

function coverSentence(plan: Plan): string {
  return `${plan.name} covers ${formatNumber(plan.scans)} scans a month.`;
}

const OVER_CAPACITY_SENTENCE = `That is more than our largest plan covers. ${LARGEST_PLAN.name} includes ${formatNumber(
  LARGEST_PLAN.scans
)} scans a month.`;

/**
 * Returns null when the answers needed for a recommendation are missing
 * (for example a role was picked but its volume question was not answered).
 */
export function recommendPlan(answers: Answers): Recommendation | null {
  const role: Role | null = isRole(answers.role) ? answers.role : null;
  if (!role) return null;

  if (role === 'agency') {
    const clients = CLIENT_COUNT_MIDPOINT[answers.client_count ?? ''];
    const adsEach = ADS_PER_CLIENT_MIDPOINT[answers.ads_per_client ?? ''];
    if (!clients || !adsEach) return null;

    const estimate = clients * adsEach;
    const { plan, overCapacity } = planForMonthlyAds(estimate);
    const sum = `About ${formatNumber(clients)} clients at about ${formatNumber(adsEach)} new ads each is roughly ${formatNumber(
      estimate
    )} new ads a month.`;

    return {
      plan,
      estimatedMonthlyAds: estimate,
      overCapacity,
      reason: `${sum} ${overCapacity ? OVER_CAPACITY_SENTENCE : coverSentence(plan)}`,
    };
  }

  const upper = MONTHLY_ADS_UPPER[answers.monthly_ads ?? ''];
  if (!upper) return null;

  const { plan, overCapacity } = planForMonthlyAds(upper);
  const label = getOptionLabel('monthly_ads', answers.monthly_ads) ?? '';
  // "Up to 20" / "More than 1,000" read naturally mid-sentence in lower case.
  const range = label.charAt(0).toLowerCase() + label.slice(1);

  return {
    plan,
    estimatedMonthlyAds: upper,
    overCapacity,
    reason: `You run ${range} new ads a month. ${overCapacity ? OVER_CAPACITY_SENTENCE : coverSentence(plan)}`,
  };
}

export type { PlanId };
