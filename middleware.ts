// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { attachDeviceCookie, readOrMintDeviceId } from '@/lib/account-device';

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - images (public images)
     */
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
};

export function middleware(req: NextRequest) {
  // 1. Origin-secret check (blocks direct *.vercel.app access)
  const secret = process.env.CF_ORIGIN_SECRET;
  if (secret && req.headers.get('x-origin-secret') !== secret) {
    // Only enforce on API routes so static pages still work during setup
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  // 2. Device cookie (existing logic)
  const { deviceId, minted } = readOrMintDeviceId(req);
  const res = NextResponse.next();
  if (minted) {
    attachDeviceCookie(res, deviceId);
  }
  return res;
}
