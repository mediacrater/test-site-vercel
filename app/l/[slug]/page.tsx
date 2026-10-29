// app/l/[slug]/page.tsx
// First hop of a short link. Visitors arrive here through the fallback
// rewrite in next.config.mjs (mediacrater.com/ig -> /l/ig), which only runs
// when no real page, file or redirect matches, so real pages always win.
//
// Unknown or inactive slug: the site's normal 404 page (real 404 status).
// Active slug: hand off to /l/<slug>/go, which counts the click and sets the
// attribution cookie (a page can't set cookies; a route handler can).

import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { activeShortLinkExists, isValidSlug } from '@/lib/utm-links';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ShortLinkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: raw } = await params;
  const slug = raw.toLowerCase();
  if (!isValidSlug(slug)) notFound();

  let exists = false;
  try {
    exists = await activeShortLinkExists(slug);
  } catch (err) {
    // Database trouble: let /go decide (it falls back to the home page),
    // so a short link in an ad never shows a 404 because of an outage.
    console.error('[UTM] lookup failed for', slug, '-', err instanceof Error ? err.message : String(err));
    exists = true;
  }

  if (!exists) notFound();
  redirect(`/l/${slug}/go`);
}
