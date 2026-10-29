// lib/utm-links.ts
// Server-only. Short-link lookups for app/l/[slug] (mediacrater.com/<slug>).
//
// How a short link reaches this code: next.config.mjs has a *fallback*
// rewrite (/:slug -> /l/:slug). Fallback rewrites run only after every real
// page, public file, redirect and normal rewrite has been checked, so a real
// page ALWAYS wins over a short link with the same name.
//
// Links are created in the tools app (tools subdomain), never here.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Same rule as the utm_links_slug_format constraint in Supabase.
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,30}[a-z0-9]$/;

export function isValidSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && SLUG_RE.test(slug);
}

let admin: SupabaseClient | null = null;

/** Service-role client, created on first use so a missing env var fails one request, not the build. */
export function getSupabaseAdmin(): SupabaseClient {
  if (!admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Supabase URL or service role key is not configured');
    admin = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return admin;
}

/** True when an ACTIVE link exists for this slug. Read-only, logs nothing. */
export async function activeShortLinkExists(slug: string): Promise<boolean> {
  const { data, error } = await getSupabaseAdmin()
    .from('utm_links')
    .select('id')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return Boolean(data);
}

export type ResolvedShortLink = {
  link_id: string;
  destination: string;
  utm_source: string;
  utm_medium: string | null;
  utm_campaign: string | null;
};

/** Looks up an active link and (when log = true) records one click. Null if no active link. */
export async function resolveShortLink(
  slug: string,
  log: boolean,
  country: string | null,
  device: Device | null
): Promise<ResolvedShortLink | null> {
  const { data, error } = await getSupabaseAdmin().rpc('resolve_utm_click', {
    p_slug: slug,
    p_log: log,
    p_country: country,
    p_device: device,
  });
  if (error) throw new Error(error.message);
  const row = Array.isArray(data) ? data[0] : null;
  return row ? (row as ResolvedShortLink) : null;
}

// ---------------------------------------------------------------------------
// Request classification (no IP is ever stored)
// ---------------------------------------------------------------------------

// Link-preview crawlers and scripts. They still get redirected (so previews
// work), but they are not counted as clicks and get no attribution cookie.
// Careful: in-app browsers of real people (Instagram, Facebook "FBAN",
// Pinterest, TikTok) must NOT match, so app names alone are not listed;
// their crawlers are caught by the "...bot/" pattern (Pinterestbot/, etc.).
const BOT_UA_RE =
  /\bbot\b|[a-z]bot[\/-]|crawl|spider|slurp|facebookexternalhit|facebookcatalog|meta-externalagent|meta-externalfetcher|whatsapp\/|skypeuripreview|embedly|vkshare|quora link preview|iframely|bingpreview|google-inspectiontool|googleother|headlesschrome|phantomjs|lighthouse|curl\/|wget\/|python-requests|python-urllib|aiohttp|go-http-client|okhttp|node-fetch|axios\/|undici|java\/|libwww|httpclient|postmanruntime|insomnia|mediacratertools/i;

export function isBot(userAgent: string | null): boolean {
  if (!userAgent || userAgent.trim().length < 10) return true; // real browsers always send a full UA
  return BOT_UA_RE.test(userAgent);
}

export type Device = 'mobile' | 'tablet' | 'desktop';

export function deviceFrom(userAgent: string | null, chMobile: string | null): Device | null {
  if (!userAgent) return null;
  if (/iPad|Tablet|PlayBook|Silk|Kindle/i.test(userAgent)) return 'tablet';
  if (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent)) return 'tablet';
  if (chMobile === '?1') return 'mobile';
  if (/Mobi|iPhone|iPod|Android|Windows Phone|IEMobile|Opera Mini/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

/** Country code from CF-IPCountry (Cloudflare overwrites any value the visitor sends) or x-vercel-ip-country. */
export function countryFrom(header: string | null): string | null {
  const c = header?.trim().toUpperCase() ?? '';
  return /^[A-Z][A-Z0-9]$/.test(c) && c !== 'XX' ? c : null;
}

/**
 * Builds the absolute redirect target on THIS site and adds the UTM params.
 * Falls back to "/" if the stored destination would leave the site or loop
 * back into the short link (the database also blocks both).
 */
export function buildDestination(requestUrl: string, link: ResolvedShortLink, slug: string): URL {
  const origin = new URL(requestUrl).origin;
  let target: URL;
  try {
    target = new URL(link.destination, origin);
  } catch {
    target = new URL('/', origin);
  }
  if (
    target.origin !== origin ||
    target.pathname === `/${slug}` ||
    target.pathname.startsWith('/l/')
  ) {
    target = new URL('/', origin);
  }

  target.searchParams.set('utm_source', link.utm_source);
  if (link.utm_medium) target.searchParams.set('utm_medium', link.utm_medium);
  else target.searchParams.delete('utm_medium');
  if (link.utm_campaign) target.searchParams.set('utm_campaign', link.utm_campaign);
  else target.searchParams.delete('utm_campaign');
  return target;
}
