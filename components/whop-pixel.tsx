//components/whop-pixel.tsx
import Script from "next/script"

// Whop Pixel (ad attribution). The string below is Whop's snippet for
// biz_vA9rrReKRX6hRu, character for character, without the <script> tags
// (next/script adds those).
//
// Only rendered when NEXT_PUBLIC_WHOP_PIXEL === "on". Set that on the LIVE
// Vercel project only, so test-site traffic never reaches your Whop data.
// Google tag (Google Ads, AW-16650524214): origins from Google's CSP guidance
// for gtag.js and Ads. Narrow these once CSP reports show what is really used.
const GOOGLE_TAG_SCRIPT = 'https://www.googletagmanager.com';
const GOOGLE_TAG_CONNECT = [
  'https://www.googletagmanager.com',
  'https://*.google-analytics.com',
  'https://*.analytics.google.com',
  'https://*.g.doubleclick.net',
  'https://*.google.com',
];
const GOOGLE_TAG_FRAME = 'https://td.doubleclick.net';

export function WhopPixel() {
  if (process.env.NEXT_PUBLIC_WHOP_PIXEL !== "on") return null

  return <Script id="whop-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: WHOP_SNIPPET }} />
}


