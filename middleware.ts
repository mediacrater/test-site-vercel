//middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { attachDeviceCookie, readOrMintDeviceId } from '@/lib/account-device';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|vendor).*)',
  ],
};

// ---------------------------------------------------------------------------
// Password protection (HTTP Basic Auth) for the TEST site only.
// Active ONLY when both BASIC_AUTH_USER and BASIC_AUTH_PASSWORD are set.
// Never set these on the live project, or visitors and Google get locked out.
// ---------------------------------------------------------------------------

/** Compares two strings in constant time, so response timing can't leak the password. */
function safeEqual(a: string, b: string): boolean {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

function hasValidCredentials(req: NextRequest, user: string, password: string): boolean {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Basic ')) return false;
  try {
    const decoded = atob(header.slice(6));
    const split = decoded.indexOf(':');
    if (split < 0) return false;
    // Check both, always, so timing doesn't reveal which one was wrong.
    const userOk = safeEqual(decoded.slice(0, split), user);
    const passwordOk = safeEqual(decoded.slice(split + 1), password);
    return userOk && passwordOk;
  } catch {
    return false; // malformed header
  }
}

export function middleware(req: NextRequest) {
  const authUser = process.env.BASIC_AUTH_USER;
  const authPassword = process.env.BASIC_AUTH_PASSWORD;
  const { pathname } = req.nextUrl;

  // Browsers send CSP violation reports without the login, so that one endpoint
  // stays open. It's still protected by the proxy-secret check below.
  if (authUser && authPassword && pathname !== '/api/csp-report') {
    if (!hasValidCredentials(req, authUser, authPassword)) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Mediacrater test", charset="UTF-8"',
          'X-Robots-Tag': 'noindex, nofollow',
          'Cache-Control': 'no-store',
        },
      });
    }
  }

  const secret = process.env.CLOUDFLARE_PROXY_SECRET;

  if (pathname.startsWith('/api/')) {
    const misconfigured = !secret && process.env.VERCEL_ENV === 'production';
    if (misconfigured || (secret && req.headers.get('x-mediacrater-proxy-secret') !== secret)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const { deviceId, minted } = readOrMintDeviceId(req);
  const res = NextResponse.next();
  if (minted) attachDeviceCookie(res, deviceId);
  return res;
}
