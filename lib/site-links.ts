//lib/site-links.ts
// Signup / signin links in one place. If NEXT_PUBLIC_APP_URL is not set, the links
// fall back to same-site paths instead of turning into "undefined/signup".
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/+$/, "")

export const SIGNUP_URL = `${APP_URL}/signup`
export const SIGNIN_URL = `${APP_URL}/signin`

/** Pricing table buttons keep their own override, as before. */
export const PRICING_SIGNUP_URL = process.env.NEXT_PUBLIC_SITE_SIGNUP || SIGNUP_URL

export const YOUTUBE_DEMO_URL = "https://www.youtube.com/watch?v=t8k6-XgiBig&utm_medium=website_how-it-works"

export const EXTENSION_URL = (medium: string) =>
  `https://chromewebstore.google.com/detail/mediacrater-ad-compliance/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=${encodeURIComponent(medium)}`
