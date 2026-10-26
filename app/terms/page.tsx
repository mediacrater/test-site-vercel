//app/terms/page.tsx
import type { Metadata } from 'next'
import { PolicyShell } from '@/components/legal/policy-shell'

export const metadata: Metadata = {
  title: 'Terms of Service | Mediacrater',
  description: 'Terms of Service for Mediacrater. Understand your rights and responsibilities when using our ad policy scanning tool.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true },
}

export default function TermsOfService() {
  return (
    <PolicyShell title="Terms of Service" updated="Effective date: August 2026">
    <section>
      <h2>1. Acceptance of Terms</h2>
      <p>
        By installing or using Mediacrater, you agree to these Terms of Service. If you do not
        agree, do not use the service. Questions can be directed to{' '}
        <a href="mailto:hello.mediacrater@gmail.com">
          hello.mediacrater@gmail.com
        </a>.
      </p>
    </section>
    <section>
      <h2>2. What Mediacrater Does</h2>
      <p>
        Mediacrater analyzes video and image ad creatives against publicly available advertising
        policies from platforms including Meta, TikTok, YouTube, Pinterest, and X, via our Chrome
        extension or web app. It returns risk levels and actionable recommendations. It
        does not guarantee ad approval and is not affiliated with any of these platforms.
      </p>
    </section>
    <section>
      <h2>3. No Guarantees</h2>
      <p>
        Mediacrater provides a general risk assessment based on publicly accessible ad policies.
        We do not guarantee that a scanned ad will be approved by any platform. Platform
        enforcement decisions are made by their own proprietary algorithms, which we do not
        replicate, mirror, or bypass. Results are for informational purposes only.
      </p>
    </section>
    <section>
      <h2>4. Token System</h2>
      <p>
        Access to scans is granted through a token system. Tokens are purchased in subscription tiers and
        consumed once per scan. Key rules:
      </p>
      <ul>
        <li>Tokens reset at the end of the billing period</li>
        <li>Tokens are non-transferable and tied to your account</li>
        <li>Used tokens are non-refundable under any circumstances</li>
        <li>Unused tokens may be refundable, see our Refund Policy for details</li>
      </ul>
    </section>
    <section>
      <h2>5. Acceptable Use</h2>
      <p>By creating an account and verifying your email, you automatically agree <strong>not</strong> to:</p>
      <ul>
        <li>Use Mediacrater to reverse-engineer, mimic or duplicate our business model</li>
        <li>Use Mediacrater to attempt to reverse-engineer or bypass platform ad detection systems</li>
        <li>Submit content that is illegal, harmful, or violates third-party rights</li>
        <li>Attempt to manipulate, scrape, or abuse the scanning infrastructure</li>
        <li>Resell or redistribute scan results without permission</li>
        <li>Attempts to bypass the free-plan allowance</li>
      </ul>
    </section>

    <section>
      <h2>6. Abuse</h2>
      <p>
        We want to keep our free plan for those who truly need it. Whether it's for the small dropshipper
        just starting out or a new media buyer running their first campaign of creatives, the free plan is for you.
      </p>
      <p>
        The free allowance is per person and per device, not per account. Extra accounts are allowed.
        If several free accounts appear to belong to the same person, they share that allowance until
        one of them is on a paid plan. Paid accounts are not limited this way: agencies and buyers
        who need a separate account per client are welcome to do that on a paid plan.
      </p>
      <p>
        To enforce this, we collect your IP address, a device cookie, and basic browser and device
        information when you sign up. We do not block VPNs. Using a VPN, including a different
        profile per client, is allowed. Details are in our{' '}
        <a href="https://mediacrater.com/privacy">
          Privacy Policy
        </a>.
      </p>
      <p>
        If you believe your account was limited in error, contact us at{' '}
        <a href="mailto:hello.mediacrater@gmail.com">
          hello.mediacrater@gmail.com
        </a>.
      </p>
    </section>
    <section>
      <h2>7. Your Content</h2>
      <p>
        You retain full ownership of any video or image files you submit. By submitting a file, you
        grant Mediacrater a limited, temporary license to process it for the purpose of delivering
        your scan results. The full file you upload is permanently deleted after results are
        returned. We do not retain your original video or image. We claim no ownership over your
        creative assets.
       See our <a href="/ip-rights">IP Rights Policy</a>.</p>
      <p>
        <strong>Scan History (paid plans):</strong> if your plan includes Scan History, we retain a
        small, heavily compressed, low-resolution thumbnail from the first frame of your
        video, or your image so you can visually identify past scans in your history list. This
        thumbnail is intentionally too low-quality for any practical reuse of your creative. It
        exists solely for your own reference. It is not collected for scans not made as a paying client. 
        Full scan results (the text analysis, not the creative itself) are retained as part of your 
        Scan History for as long as your plan includes that feature.
      </p>
    </section>
    <section>
      <h2>8. Intellectual Property</h2>
      <p>
        All Mediacrater software, branding, and content is owned by Mediacrater. You may not
        copy, modify, or distribute any part of the service without written permission.
        Platform logos are displayed solely for user experience and remain the property
        of their respective owners.
      </p>
    </section>
    <section>
      <h2>9. Limitation of Liability</h2>
      <p>
        Mediacrater is provided "as is." We are not liable for ad rejections, account bans,
        revenue loss, or any other damages arising from your use of the service or reliance
        on scan results. Our total liability to you shall not exceed the amount you paid for
        your current token bundle.
      </p>
    </section>
    <section>
      <h2>10. Changes to the Service</h2>
      <p>
        We reserve the right to modify or discontinue the service at any time. We will make
        reasonable efforts to notify users of significant changes. Continued use after changes
        constitutes acceptance of the updated terms.
      </p>
    </section>
    <section>
      <h2>11. Contact</h2>
      <p>
        For questions about these terms, email{' '}
        <a href="mailto:hello.mediacrater@gmail.com">
          hello.mediacrater@gmail.com
        </a>.
      </p>
    </section>
    
    </PolicyShell>
  )
}
