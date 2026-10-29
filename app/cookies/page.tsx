//app/cookies/page.tsx
import type { Metadata } from 'next'
import { PolicyShell } from '@/components/legal/policy-shell'

export const metadata: Metadata = {
  title: 'Cookie Policy | Mediacrater',
  description: 'Cookie Policy for Mediacrater. Learn about the cookies we use and how to manage your choices.',
  alternates: { canonical: '/cookies' },
  robots: { index: true, follow: true },
}

export default function CookiePolicy() {
  return (
    <PolicyShell title="Cookie Policy" updated="Last updated: October 2026">
    <section>
      <h2>The short version</h2>
      <p>
        Mediacrater uses cookies to keep you signed in, to keep the free plan fair, to remember
        which of our own short links (like <code>mediacrater.com/ig</code>) brought you here,
        and (if you come from one of our affiliates and choose to accept) to credit that
        affiliate. We don&apos;t sell data, and we don&apos;t track you across other websites.
      </p>
    </section>
    <section>
      <h2>Campaign link cookie</h2>
      <p>
        Only set when you open one of our own short links. It tells us which post or channel
        brought you to Mediacrater, nothing else.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>__Host-mc_attr</code>
              </td>
              <td>
                Remembers the last of our short links you opened. If you create an account, that
                link&apos;s campaign label (for example &quot;instagram&quot;) is saved on your
                account and the cookie is deleted. It holds no personal information and is never
                shared with ad networks. First-party only.
              </td>
              <td>30 days, or until you create an account</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <section>
      <h2>Cookies that are always on (required for the site to work)</h2>
      <p>
        These are necessary for core functionality: signing in, staying signed in, keeping
        your account secure, and enforcing the free plan. Because they're required for the
        service to function, they're not subject to the choice below.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Supabase session cookies</td>
              <td>Keep you signed in to your account</td>
              <td>Until you sign out, or session expiry</td>
            </tr>
            <tr>
              <td>Device identifier cookie</td>
              <td>
                Identifies this browser so the free plan cannot be reset by opening extra
                accounts. Not used for ads. Not your login session. It stays after you sign out.
              </td>
              <td>13 months</td>
            </tr>
            <tr>
              <td>
                <code>mc_cookie_consent</code>
              </td>
              <td>
                Remembers your cookie choice so we don't ask on every page
              </td>
              <td>12 months</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <section>
      <h2>Third-party analytics trackers</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Purpose</th>
              <th>Duration</th>
              <th>Third-party?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>Cloudflare</code>
              </td>
              <td>
                Blocks automated scripts and collects analytics anonymously
              </td>
              <td>Until you close your browser</td>
              <td>Yes</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td>
                <code>Google ads tag</code>
              </td>
              <td>
                Google's required tag for ad campaigns
              </td>
              <td>Until you leave our website</td>
              <td>Yes</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td>
                <code>Vercel Analytics</code>
              </td>
              <td>
                Collects analytics anonymously and autonomously
              </td>
              <td>Until you leave our website</td>
              <td>Yes</td>
            </tr>
          </tbody>
        </table>
      </div>
      </section>
    <section>
      <h2>What we don't do</h2>
      <ul>
        <li>We don't sell or share cookie data with third parties.</li>
        <li>We don't track you across other websites.</li>
      </ul>
    </section>
    <section>
      <h2>Your choice</h2>
      <p>
        You'll see a short prompt on your first visit asking whether to accept the affiliate-tracking
        cookie described above. You can change your mind at any time by clearing your browser's
        cookies for this site. Clearing cookies will also reset the device cookie, which may look
        like a new device the next time you visit.
      </p>
    </section>
    <section>
      <h2>Questions</h2>
      <p>
        If you have questions about this policy, contact us at{' '}
        <a href="mailto:hello.mediacrater@gmail.com">
          hello.mediacrater@gmail.com
        </a>.
      </p>
    </section>
    
    </PolicyShell>
  )
}
