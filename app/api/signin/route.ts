// app/api/signin/route.ts
//
// New route — previously signin/page.tsx called
// supabase.auth.signInWithPassword() directly from the client, which meant
// there was no server-side chokepoint to rate-limit at. This route moves
// that call server-side; the page now calls this endpoint instead. Turnstile
// verification (already present client-side on the sign-in page) is now
// also enforced here, server-side, before the rate limit and before the
// Supabase auth call — a request that isn't a verified human shouldn't
// burn a rate-limit slot or reach Supabase auth at all.
//
// Rate limit: 10 attempts / 60 seconds / IP. user_id is not used — a
// failed sign-in attempt must not be able to burn a real account's rate
// limit budget by an attacker entering someone else's email with wrong
// passwords, so this is IP-only, matching signup/reset-password/
// resend-verification.
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { checkAndLogRateLimit, clientIpFrom, verifyTurnstileToken } from "@/lib/rate-limit"

const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SIGNIN_MAX_ATTEMPTS = 8
const SIGNIN_WINDOW_SECONDS = 120 //seconds

export async function POST(req: NextRequest) {
  const { email, password, turnstileToken } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 })
  }

  const ip = clientIpFrom(req)

  // Verify Turnstile before touching the rate limiter or Supabase auth.
  const isHuman = await verifyTurnstileToken(turnstileToken, ip)
  if (!isHuman) {
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 400 }
    )
  }

  const rateLimit = await checkAndLogRateLimit(
    "signin",
    ip,
    SIGNIN_MAX_ATTEMPTS,
    SIGNIN_WINDOW_SECONDS
  )
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      }
    )
  }

  const { data, error } = await supabaseAnon.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Return the session so the client can set it via supabase.auth.setSession,
  // since the auth call now happens server-side rather than in the browser.
  return NextResponse.json({
    success: true,
    session: data.session,
  })
}
