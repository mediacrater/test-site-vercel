//lib/ads-conversion.ts
// Google Ads "Purchase" conversion, using the event name Google Ads gave us
// (ads_conversion_purchase). The Google tag itself is loaded by
// components/google-tag.tsx. If the tag isn't there (flag off, ad blocker),
// this does nothing and returns false.

// Monthly list prices, read from lib/mediacrater/plans.ts (the one place they
// are written down). Keys are the lowercase profile.plan values.
// Limit: this reports the monthly list price, not what Stripe actually charged
// (a promo code like MCDEAL25 lowers the real first payment, and a yearly plan
// charges ten times this).
import { PLANS } from "@/lib/mediacrater/plans"

const PLAN_VALUES: Record<string, number> = Object.fromEntries(PLANS.map((plan) => [plan.id, plan.price]))

type Gtag = (command: "event", eventName: string, params?: Record<string, unknown>) => void

/** Returns true only if the event was actually handed to the Google tag. */
export function trackPurchaseConversion(plan: string | null | undefined): boolean {
  if (typeof window === "undefined") return false

  const value = PLAN_VALUES[(plan ?? "").toLowerCase()]
  if (value === undefined) return false

  const gtag = (window as unknown as { gtag?: Gtag }).gtag
  if (typeof gtag !== "function") return false

  gtag("event", "ads_conversion_purchase", { value, currency: "USD" })
  return true
}
