// app/l/[slug]/go/route.ts
// Second hop of a short link: mediacrater.com/ig -> /l/ig (page) -> /l/ig/go (here).
//
// For a real person: logs one click (link, time, country, device; no IP),
// sets the signed 30-day attribution cookie (last click wins) and redirects
// to the link's destination with utm_* added.
// For link-preview bots and HEAD requests: redirects only. No click, no cookie.
//
// A broken database never breaks the link: it falls back to the home page.

import { NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation';
import { setAttributionCookie } from '@/lib/attribution';
import {
  buildDestination,
  countryFrom,
  deviceFrom,
  isBot,
  isValidSlug,
  resolveShortLink,
} from '@/lib/utm-links';

export const dynamic = 'force-dynamic';

function redirectTo(url: URL): NextResponse {
  const res = NextResponse.redirect(url, 302); // 302, never 301: browsers cache 301s forever
  res.headers.set('Cache-Control', 'private, no-store, max-age=0');
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

async function handle(req: NextRequest, slugParam: string, countable: boolean) {
  const slug = slugParam.toLowerCase();
  if (!isValidSlug(slug)) notFound();

  const ua = req.headers.get('user-agent');
  const human = countable && !isBot(ua);

  let link;
  try {
    link = await resolveShortLink(
      slug,
      human,
      // Cloudflare's header when proxied; Vercel's when not (e.g. a *.vercel.app test URL).
      human ? countryFrom(req.headers.get('cf-ipcountry') ?? req.headers.get('x-vercel-ip-country')) : null,
      human ? deviceFrom(ua, req.headers.get('sec-ch-ua-mobile')) : null
    );
  } catch (err) {
    console.error('[UTM] resolve failed for', slug, '-', err instanceof Error ? err.message : String(err));
    return redirectTo(new URL('/', req.url));
  }

  if (!link) notFound();

  const res = redirectTo(buildDestination(req.url, link, slug));
  if (human) setAttributionCookie(res, link.link_id);
  return res;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return handle(req, slug, true);
}

export async function HEAD(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return handle(req, slug, false);
}
