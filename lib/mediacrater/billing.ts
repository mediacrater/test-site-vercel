// lib/mediacrater/billing.ts
//
// Mirrors the extension's getBillingPortalUrl() in utils/supabase.js —
// same Edge Function (billing-portal), same auth model. No backend
// changes required; this is purely "point the web app at what already
// exists."

import { supabase } from './supabaseClient';

export async function getBillingPortalUrl(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/billing-portal`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to open billing portal');
  }

  const data = await response.json();
  return data.url as string;
}

/**
 * Builds the same /buy-tokens URL the extension's handleBuyTokens() opens,
 * just with source=webapp instead of source=extension so it's
 * distinguishable in analytics the same way abuse-email upgrades already
 * are (source=abuse_email). Same destination page, same query param
 * contract — nothing new on the pricing-page side needed.
 */
export function buildUpgradeUrl({
  userId,
  email,
  currentPlan,
}: {
  userId: string;
  email: string;
  currentPlan: string;
}): string {
  const params = new URLSearchParams({
    source: 'webapp',
    userId,
    email,
    currentPlan,
  });
  return `/buy-tokens?${params.toString()}`;
}
