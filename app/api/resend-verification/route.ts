// app/api/resend-verification/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkAndLogRateLimit, clientIpFrom, verifyTurnstileToken } from '@/lib/rate-limit';

const RESEND_MAX_ATTEMPTS = 1;
const RESEND_WINDOW_SECONDS = 100;

export async function POST(request: Request) {
  try {
    const { email, turnstileToken } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase env vars in resend-verification route');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const ip = clientIpFrom(request as any);

    // Verify Turnstile before touching the rate limiter or doing any lookup.
    const isHuman = await verifyTurnstileToken(turnstileToken, ip);
    if (!isHuman) {
      return NextResponse.json(
        { error: 'Verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // ── Per-IP resend rate limit (shared rate_limits table) ──
    const rateLimit = await checkAndLogRateLimit(
      'resend_verification',
      ip,
      RESEND_MAX_ATTEMPTS,
      RESEND_WINDOW_SECONDS
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Please wait before requesting another email.',
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
        }
      );
    }
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (profile?.id) {
      const { data: userData, error: userLookupError } = await supabaseAdmin.auth.admin.getUserById(profile.id);

      if (!userLookupError && userData?.user?.email_confirmed_at) {
        return NextResponse.json(
          { error: 'This email is already verified. Please sign in.' },
          { status: 400 }
        );
      }
    }

    const { error } = await supabaseAdmin.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      }
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, retryAfterSeconds: RESEND_WINDOW_SECONDS });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to resend verification email' },
      { status: 500 }
    );
  }
}
