import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "node:crypto"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function scriptValue(value: string): string {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g,
    (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`)
}

export async function GET(req: NextRequest) {
  const redirectUri = req.nextUrl.searchParams.get("redirect_uri")
  const state = req.nextUrl.searchParams.get("state")
  const headers = { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" }
  // Only CAPTCHA tokens are returned; no passwords or auth sessions appear in URLs.
  if (!redirectUri || !/^https:\/\/[a-p]{32}\.chromiumapp\.org\/mediacrater-turnstile$/.test(redirectUri) ||
      !state || !/^[0-9a-f]{64}$/.test(state) ||
      req.nextUrl.searchParams.getAll("redirect_uri").length !== 1 ||
      req.nextUrl.searchParams.getAll("state").length !== 1) {
    return NextResponse.json({ error: "Invalid verification request." }, { status: 400, headers })
  }
  const siteKey = process.env.TURNSTILE_SITE_KEY?.trim()
  if (!siteKey || !/^[a-zA-Z0-9_-]{1,200}$/.test(siteKey)) {
    return NextResponse.json({ error: "Sign-in verification is not configured." }, { status: 503, headers })
  }
  const nonce = randomBytes(18).toString("base64")
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mediacrater sign-in verification</title>
<style>body{font:16px system-ui,sans-serif;background:#f8fafc;color:#0f172a;margin:0;padding:32px}main{max-width:420px;margin:40px auto;background:white;padding:28px;border-radius:12px}h1{font-size:22px}p{line-height:1.5}#status{color:#475569}</style></head>
<body><main><h1>Verify to sign in</h1><p>Complete the verification below to continue signing in to the Mediacrater extension.</p>
<div id="challenge"></div><p id="status" role="status">Loading verification…</p></main>
<script nonce="${nonce}">
window.renderMediacraterChallenge = function () {
  const status = document.getElementById('status');
  status.textContent = 'Complete the verification to continue.';
  window.turnstile.render('#challenge', {
    sitekey: ${scriptValue(siteKey)},
    action: 'signin_ext',
    callback: function (token) {
      if (typeof token !== 'string' || !token || token.length > 2048) {
        status.textContent = 'Verification failed. Close this window and try again.';
        return;
      }
      status.textContent = 'Verified. Returning to the extension…';
      const redirect = new URL(${scriptValue(redirectUri)});
      redirect.hash = new URLSearchParams({ state: ${scriptValue(state)}, token: token }).toString();
      window.location.replace(redirect.toString());
    },
    'error-callback': function () {
      status.textContent = 'Verification could not load. Close this window and try again.';
    },
    'expired-callback': function () {
      status.textContent = 'Verification expired. Close this window and try again.';
    }
  });
};
</script>
<script nonce="${nonce}" src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=renderMediacraterChallenge&amp;render=explicit" async defer></script>
</body></html>`
  return new NextResponse(html, {
    headers: {
      ...headers,
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": `default-src 'none'; script-src 'nonce-${nonce}' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`,
    },
  })
}
