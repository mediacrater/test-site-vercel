// lib/attribution.ts
// Server-only. UTM short-link attribution cookie.
//
// Set by app/l/[slug]/go/route.ts when a person clicks a short link
// (mediacrater.com/ig). Read once, at account creation, by:
//   - app/api/signup/route.ts            (email + password sign-up, Vercel)
//   - routes/api/oauth/complete.js       (Google sign-up / sign-in that creates an account, VPS)
//
// Cookie: __Host-mc_attr = <base64url(JSON)>.<base64url(HMAC-SHA256)>
//   JSON = { v: 1, l: <utm_links.id>, iat: <unix seconds> }
// Same format and secret (UTM_COOKIE_SECRET) as routes/_shared/attribution.js
// on the VPS, so either server can verify what the other signed.
//
// It holds only the link ID: never free text from the URL, so nobody can
// inject their own "utm_source" values into profiles. The link's labels are
// copied from utm_links by apply_utm_attribution() in the database.
//
// Last click wins: every short-link click overwrites the cookie and restarts
// the 30-day window. Attribution never blocks a sign-up: any problem is
// logged and skipped.

import { createHmac, timingSafeEqual } from 'node:crypto';
import type { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';

export const ATTRIBUTION_COOKIE = '__Host-mc_attr';
export const ATTRIBUTION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days
const MIN_SECRET_LENGTH = 32;
const MAX_COOKIE_LENGTH = 512;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getSecret(): string | null {
  const secret = process.env.UTM_COOKIE_SECRET || '';
  return secret.length >= MIN_SECRET_LENGTH ? secret : null;
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

const cookieOptions = {
  httpOnly: true,
  secure: true, // required by the __Host- prefix
  sameSite: 'lax' as const, // still sent when Google redirects back to /auth/callback
  path: '/', // required by the __Host- prefix (and no Domain attribute)
};

/** Signs and sets the attribution cookie. Returns false (and sets nothing) if the secret is missing. */
export function setAttributionCookie(res: NextResponse, linkId: string): boolean {
  const secret = getSecret();
  if (!secret) {
    console.error('[UTM] UTM_COOKIE_SECRET is missing or shorter than 32 characters; click not attributed');
    return false;
  }
  if (!UUID_RE.test(linkId)) return false;

  const payload = Buffer.from(
    JSON.stringify({ v: 1, l: linkId.toLowerCase(), iat: Math.floor(Date.now() / 1000) })
  ).toString('base64url');

  res.cookies.set(ATTRIBUTION_COOKIE, `${payload}.${sign(payload, secret)}`, {
    ...cookieOptions,
    maxAge: ATTRIBUTION_TTL_SECONDS,
  });
  return true;
}

/** Deletes the attribution cookie (attributes must match the ones it was set with). */
export function clearAttributionCookie(res: NextResponse): void {
  res.cookies.set(ATTRIBUTION_COOKIE, '', { ...cookieOptions, maxAge: 0 });
}

export type AttributionRead =
  | { present: false }
  | { present: true; linkId: string | null };

/** Reads and verifies the cookie. linkId is null when the cookie is present but invalid or expired. */
export function readAttribution(req: NextRequest): AttributionRead {
  const raw = req.cookies.get(ATTRIBUTION_COOKIE)?.value;
  if (!raw) return { present: false };

  const secret = getSecret();
  if (!secret || raw.length > MAX_COOKIE_LENGTH) return { present: true, linkId: null };

  const parts = raw.split('.');
  if (parts.length !== 2) return { present: true, linkId: null };
  const [payload, mac] = parts;

  const expected = Buffer.from(sign(payload, secret));
  const given = Buffer.from(mac);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return { present: true, linkId: null };
  }

  let data: unknown;
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return { present: true, linkId: null };
  }

  const d = data as { v?: unknown; l?: unknown; iat?: unknown };
  if (d?.v !== 1 || typeof d.l !== 'string' || !UUID_RE.test(d.l) || !Number.isInteger(d.iat)) {
    return { present: true, linkId: null };
  }

  const age = Math.floor(Date.now() / 1000) - (d.iat as number);
  // Small negative allowance for clock differences between Vercel and the VPS.
  if (age < -300 || age > ATTRIBUTION_TTL_SECONDS) return { present: true, linkId: null };

  return { present: true, linkId: d.l.toLowerCase() };
}

/**
 * Copies the clicked link onto a NEW profile (write-once, enforced in the
 * database). Never throws. `present` tells the caller to clear the cookie.
 */
export async function applyAttribution(
  supabaseAdmin: SupabaseClient,
  req: NextRequest,
  userId: string
): Promise<{ present: boolean; applied: boolean }> {
  try {
    const read = readAttribution(req);
    if (!read.present) return { present: false, applied: false };
    if (!read.linkId) {
      console.warn('[UTM] attribution cookie invalid or expired; skipped for user', userId);
      return { present: true, applied: false };
    }

    const { data, error } = await supabaseAdmin.rpc('apply_utm_attribution', {
      p_user_id: userId,
      p_link_id: read.linkId,
    });
    if (error) {
      console.error('[UTM] apply_utm_attribution failed:', error.message);
      return { present: true, applied: false };
    }
    return { present: true, applied: data === true };
  } catch (err) {
    console.error('[UTM] attribution failed:', err instanceof Error ? err.message : String(err));
    return { present: true, applied: false };
  }
}
