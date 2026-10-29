// scripts/check-utm-slugs.mjs
//
// Runs before every build ("prebuild" in package.json, so Vercel runs it too).
//
// A real page always wins over a short link with the same name (see the
// fallback rewrite in next.config.mjs). That keeps pages safe, but it means
// adding a page called /ig would silently stop the ACTIVE short link /ig from
// counting clicks and sign-ups. This check fails the build instead, so you
// choose: rename the page, or deactivate the link in the tools app first.
//
// It only warns (never fails) when it can't check: missing env vars (local
// builds) or Supabase unreachable. A database blip should not block deploys.
//
// Reads: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (read-only use).

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Names that are taken even when no folder shows it (framework paths,
// rewrites, internal routes). Keep in sync with RESERVED in the tools app.
const RESERVED = [
  'api', 'auth', 'db', 'l', 'go', 'images', 'vendor', 'tools', 'admin', 'static',
  'assets', 'favicon', 'robots', 'sitemap', 'manifest', 'login', 'logout',
  'signin', 'signup', 'register', 'dashboard', 'settings', 'account',
  'billing', 'checkout', 'pricing', 'privacy', 'terms', 'cookies', 'refund',
  'legal', 'help', 'support', 'status', 'blog', 'www', 'mail',
];

function warn(message) {
  console.warn(`\n[check-utm-slugs] WARNING: ${message}\n`);
}

/** Top-level URL segments that real routes occupy under app/ (route groups flattened). */
function appSegments(dir = join(ROOT, 'app')) {
  const found = new Set();
  if (!existsSync(dir)) return found;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    if (name.startsWith('(') && name.endsWith(')')) {
      for (const s of appSegments(join(dir, name))) found.add(s); // (group) adds no URL segment
      continue;
    }
    if (name.startsWith('_') || name.startsWith('@') || name.startsWith('[')) continue;
    found.add(name.toLowerCase());
  }
  return found;
}

/** Top-level names in public/ (files and folders). */
function publicSegments() {
  const dir = join(ROOT, 'public');
  if (!existsSync(dir)) return new Set();
  return new Set(readdirSync(dir).map((n) => n.toLowerCase()));
}

/** First path segment of every redirect/rewrite "source" in next.config.mjs. */
function configSegments() {
  const file = join(ROOT, 'next.config.mjs');
  if (!existsSync(file)) return new Set();
  const text = readFileSync(file, 'utf8');
  const found = new Set();
  for (const m of text.matchAll(/source:\s*["'`]\/([^/"'`:*?]+)/g)) found.add(m[1].toLowerCase());
  return found;
}

async function activeSlugs() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    warn('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set; short-link collision check skipped.');
    return null;
  }
  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/utm_links?select=slug&active=eq.true`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      warn(`Supabase answered ${res.status}; short-link collision check skipped.`);
      return null;
    }
    const rows = await res.json();
    return Array.isArray(rows) ? rows.map((r) => String(r.slug)) : null;
  } catch (err) {
    warn(`could not reach Supabase (${err?.message || err}); short-link collision check skipped.`);
    return null;
  }
}

const slugs = await activeSlugs();
if (slugs) {
  const sources = [
    ['a page or folder in app/', appSegments()],
    ['a file or folder in public/', publicSegments()],
    ['a redirect or rewrite in next.config.mjs', configSegments()],
    ['a reserved name', new Set(RESERVED)],
  ];
  const clashes = [];
  for (const slug of slugs) {
    for (const [where, set] of sources) {
      if (set.has(slug)) clashes.push(`  /${slug}  is an active short link AND ${where}`);
    }
  }
  if (clashes.length) {
    console.error(
      '\n[check-utm-slugs] BUILD STOPPED: these short links would stop working after this deploy:\n' +
        clashes.join('\n') +
        '\n\nFix: rename the page, or deactivate the short link in the tools app, then deploy again.\n'
    );
    process.exit(1);
  }
  console.log(`[check-utm-slugs] OK: ${slugs.length} active short link(s), no clashes.`);
}
