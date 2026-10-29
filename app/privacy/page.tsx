//app/privacy/page.tsx
import type { Metadata } from 'next'
import { PolicyShell } from '@/components/legal/policy-shell'

export const metadata: Metadata = {
  title: 'Privacy Policy | Mediacrater',
  description: 'How Mediacrater handles your data. We scan your ads for policy violations and permanently delete the original files after.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
}

export default function PrivacyPolicy() {
  return (
    <PolicyShell title="Privacy Policy" updated="Effective date: October 2026">
    <section>
      <h2>Who We Are</h2>
      <p>
        Mediacrater scans video and image ads for policy violations across platforms including
        Meta, TikTok, YouTube, Pinterest, and X, via our Chrome extension or web app. We are
        operated as Mediacrater and can be reached at{' '}
        <a href="mailto:hello.mediacrater@gmail.com">
          hello.mediacrater@gmail.com
        </a>.
      </p>
    </section>
    <section>
      <h2>What Data We Collect</h2>
      <p>
        We collect only what is necessary to operate the service. Below is a complete list of
        the data we collect, why we collect it, and how it is stored.
      </p>
      <h3>Account Data</h3>
      <ul>
        <li>
          <strong>Email address</strong>: collected at registration to identify your account
          and communicate with you about your service. Stored securely via Supabase.
        </li>
        <li>
          <strong>Token balance</strong>: the number of scan tokens available on your account.
          Updated after each scan and each purchase. Deep scan costs 2 tokens. Stored via Supabase.
        </li>
        <li>
          <strong>Purchase records</strong>: when you make a purchase, we store the session ID,
          number of tokens purchased, and purchase amount. This is used to credit your account
          correctly and to support refund requests. Stored via Supabase.
        </li>
        <li>
          <strong>Scan metadata</strong>: when you run a scan, we log the timestamp, tokens
          consumed, platform selected, content type (video or image), and analysis duration.
          We store a low resolution first frame of video files and images for paying users' 
          Scan History interface. We deliberately compress this media so we cannot use it while
          the user can still identify their respective scan data. This data
          is used solely to diagnose technical issues and to evaluate refund requests. Stored
          via Supabase.
        </li>
        <li>
          <strong>File name</strong>: if your plan includes Scan History, we also store the
          original file name of your upload (e.g. "summer_sale_ad.mp4") so you can identify it
          in your History page. Not stored if your plan does not include Scan History.
        </li>
        <li>
          <strong>Queue metadata</strong>: Our queuing system is designed to allocate our limited
          server resources appropriately so everyone gets a chance to scan their ads. When you run
          a scan and you're placed in our queuing system, we generate a queue ID and your scan
          metadata is logged with it. This includes your plan, user ID, scan type, content type, status,
          timestamps, how long you waited in queue and payload size.
        </li>
        <li>
          <strong>Password</strong>: your password is encrypted using Supabase's authentication
          system. We cannot view, access, or modify your password at any time.
        </li>
        <li>
          <strong>Authentication tokens</strong>: session tokens used to keep you logged in are
          stored locally on your device (via Chrome's secure storage API in the extension, or your
          browser's local storage on the web app). They are never transmitted to or stored on our
          servers beyond what Supabase requires for session management.
        </li>
      </ul>
      <h3>Google Sign-In</h3>
      <p>
        If you choose "Sign up with Google" or "Sign in with Google", Google shares the following with us, only after you approve it on Google's consent screen:
      </p>
      <ul>
        <li>
          <strong>Email address</strong>: used as your account email, exactly like an email/password account. Stored via Supabase.
        </li>
        <li>
          <strong>Name and profile picture</strong>: included by Google with every sign-in. They are stored by our authentication provider (Supabase) as part of your login record. We do not display, use, or share them.
        </li>
        <li>
          <strong>Google account identifier</strong>: a unique ID that lets us recognise your Google account when you sign in again. Stored by Supabase.
        </li>
      </ul>
        <p>
          We only request the basic sign-in permissions (openid, email, profile). We do not access your Gmail, Google Drive, contacts, calendar, or any other Google service, and we cannot post or act on your behalf. 
          Google user data is used only to create your account and sign you in. It is never sold, never used for advertising, and never sent to AI model providers or used to train or improve any AI model. It is not shared with anyone except Supabase, which provides our sign-in system.
          Mediacrater's use of information received from Google APIs adheres to the Google API Services User Data Policy (https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.
          You can remove Mediacrater's access at any time in your Google Account under Security → Your connections to third-party apps & services. To delete the data we hold, email us to delete your account (see Your Rights below).
        </p>
      <h3>Device and abuse-prevention data</h3>
      <p>
        We collect the following when you create an account on mediacrater.com, so we can keep
        the free plan fair. We do not use this data for advertising, and we do not track you on
        other websites. The Chrome extension does not collect this data.
      </p>
      <ul>
        <li>
          <strong>IP address and approximate location</strong>: IP address, country, city, and
          network provider, collected at account creation. Used only to prevent abuse of the free
          plan. Approximate location is derived from the IP address; it is not a street address.
        </li>
        <li>
          <strong>Device cookie</strong>: a first-party identifier stored in your browser so we
          can tell when several free accounts are created from the same device. It is not your
          login session and is not cleared when you sign out. See our{' '}
          <a href="/cookies">
            Cookie Policy
          </a>.
        </li>
        <li>
          <strong>Browser and device information</strong>: browser name and version, operating
          system, timezone, and a technical identifier derived from those details. Used only to
          enforce the free plan across accounts.
        </li>
      </ul>
      <h3>Campaign link data</h3>
      <p>
        We share short links to mediacrater.com in our own posts and videos (for example{' '}
        <code>mediacrater.com/ig</code>). When you open one of these links:
      </p>
      <ul>
        <li>
          <strong>Click record</strong>: we record which link was opened, when, your country
          (provided by Cloudflare), and whether you were on a phone, tablet or computer. We do
          not store your IP address with clicks, and a click record is not linked to you or to
          an account.
        </li>
        <li>
          <strong>Campaign link cookie</strong>: a first-party cookie remembers the last of our
          short links you opened, for 30 days. If you create an account during that time, we
          save that link&apos;s campaign labels (for example &quot;instagram&quot;) on your
          account and then delete the cookie. If you never create an account, the cookie simply
          expires. See our{' '}
          <a href="/cookies">
            Cookie Policy
          </a>.
        </li>
      </ul>
      <p>
        We use this only to learn which of our own posts and channels bring people to
        Mediacrater. It is not used for advertising, not shared with ad networks, and not used
        to track you on other websites.
      </p>
      <h3>Payment Data</h3>
      <ul>
        <li>
          <strong>Credit card and billing information</strong>: all payment processing is handled
          exclusively by Stripe. We never receive, store, or have access to your card details.
          Stripe is PCI-DSS compliant and maintains its own security standards.
        </li>
        <li>
          <strong>Purchase and transaction records</strong>: retained for 6 years
          from the end of the tax year in which the transaction occurred, as required
          by the Canada Revenue Agency for tax and accounting compliance. This applies
          even if you delete your account.
        </li>
      </ul>
      <h3>Creative Assets (video and image files)</h3>
      <ul>
        <li>
          <strong>Video and image files</strong>: files you submit for scanning are transmitted
          to our servers solely for policy analysis. The full file is permanently and
          automatically deleted the moment your scan results are returned. We do not retain
          your original video or image.
        </li>
        <li>
          <strong>Scan History thumbnails (paid plans only)</strong>: if your plan includes
          Scan History, we additionally generate and retain a small, heavily compressed,
          low-resolution thumbnail, derived from your uploaded image or the first frame of
          your video, solely so you can visually identify past scans in your History page.
          This thumbnail is intentionally too low-quality for any practical reuse of your
          creative. It is stored via Supabase Storage, deleted if you delete the associated
          scan, and is not generated or retained at all if your plan does not include Scan
          History. We do not use your creative assets, or any thumbnail derived from them, for
          any purpose beyond what is outlined in this Privacy Policy.
        </li>
        <li>
          <strong>Results page video player and frames</strong>: the video player and the
          frame images shown beside each violation on your results page are built from the
          file on your own device, inside your browser. They are not stored on our servers.
          The frame images are kept only in your browser&apos;s memory and temporary session
          storage, and are removed when you click &quot;New Scan&quot;, start another scan, or
          close the tab. Refreshing the page ends video playback, because the file is no
          longer held in your browser. For video URLs, the player plays the video straight
          from its source link in your browser.
        </li>
      </ul>
    </section>
      <section>
      <h2>Cloudflare usage</h2>
      <p>
        We use Cloudflare services (including Bot Fight Mode and related challenge mechanisms) 
        to protect our infrastructure against automated abuse and malicious traffic. These 
        services may process limited technical signals such as IP address, TLS fingerprint, and 
        User-Agent. For details on how Cloudflare handles this data, see Cloudflare’s Turnstile 
        Privacy Addendum:
      </p>
      <p>
            <a
              href="https://www.cloudflare.com/en-gb/turnstile-privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.cloudflare.com/en-gb/turnstile-privacy-policy
            </a>
      </p>
      </section>
    <section>
      <h2>AI model providers</h2>
      <p>
        To analyze your ad, we send the image, or the frames and audio extracted from your video
        (including media we fetch from a link you provide), along with text instructions, to
        third-party AI model providers. We delete the original file from our systems once your
        results are returned. We keep your analysis results with your account and, on paid plans,
        a low-resolution thumbnail for Scan History. According to our providers' current terms,
        they do not use this content to train their models. They may retain it for periods we do
        not control, process it in countries outside Canada and outside your own, and disclose it
        where required by law.
      </p>
    </section>
    <section>
      <h2>How We Use Your Data</h2>
      <ul>
        <li>To let you sign up and sign in with your Google account</li>
        <li>To authenticate you and maintain your account session</li>
        <li>To scan your ad content and return a policy compliance report</li>
        <li>To manage your token balance accurately across purchases and scans</li>
        <li>To process payments and evaluate refund requests</li>
        <li>To diagnose technical issues using anonymised scan metadata</li>
        <li>To improve Mediacrater's accuracy and features over time</li>
        <li>To respond to support requests sent to our email</li>
        <li>To display scan history accurately for paying users</li>
        <li>To prevent abuse of the free plan and keep it available for people who need it</li>
        <li>To learn which of our own short links and channels bring new users</li>
      </ul>
    </section>
    <section>
      <h2>Data Sharing</h2>
      <p>
        We do not sell, rent, or share your personal data with third parties for marketing
        or advertising purposes. Data is shared only with the third-party service providers
        listed below, and only to the extent necessary to operate the service.
      </p>
    </section>
    <section>
      <h2>Third-Party Services</h2>
      <p>We use the following third-party services to operate Mediacrater:</p>
      <ul>
        <li>
          <strong>Supabase</strong>: user authentication, account data storage, database
          management, and (for paid plans with Scan History enabled) storage of compressed
          scan thumbnails as described above.
        </li>
        <li>
          <strong>Stripe</strong>: payment processing. Stripe handles all credit card and
          billing data. We do not store payment details.
        </li>
        <li>
          <strong>Cloud infrastructure provider</strong>: server hosting and processing infrastructure.
        </li>
        <li>
          <strong>Vercel</strong>: website hosting and infrastructure for mediacrater.com.
        </li>
        <li>
          <strong>Vercel Analytics</strong>: anonymous usage analytics for our website.
          No personally identifiable information is collected.
        </li>
        <li>
          <strong>Network intelligence provider</strong>: we may send an IP address to a
          network intelligence service to derive approximate location (country and city) and
          connection type (for example, residential or data center). Used only for free-plan
          enforcement. We do not receive a street address.
        </li>
        <li>
          <strong>Google tag</strong>: tracks user events site wide coming from displayed ads on Google.
        </li>
        <li>
          <strong>Cloudflare</strong>: anonymous data collected for analytics.
        </li>
        <li>
          <strong>Google authentication</strong>: optional sign-in with your Google account.
        </li>
      </ul>
      <p>
        Each provider maintains their own privacy policies and security standards.
      </p>
    </section>
    <section>
      <h2>Data Retention</h2>
      <ul>
        <li>
          <strong>Creative assets (full files)</strong>: deleted immediately and automatically
          after scan results are delivered.
        </li>
        <li>
          <strong>Scan History thumbnails</strong>: retained only for accounts on a plan that
          includes Scan History, for as long as the associated scan record exists. Not generated
          or retained on plans without Scan History.
        </li>
        <li>
          <strong>Account data</strong>: retained for as long as your account is active.
        </li>
        <li>
          <strong>Scan metadata</strong>: retained for as long as your account is active and
          used solely for diagnostics and refund evaluation.
        </li>
        <li>
          <strong>Purchase records</strong>: retained for as long as your account is active
          for billing and refund purposes.
        </li>
        <li>
          <strong>Device and abuse-prevention data</strong>: retained for as long as your
          account is active, and deleted when you delete your account.
        </li>
        <li>
          <strong>Campaign link data</strong>: the campaign labels saved on your account are
          kept while your account is active and deleted with it. Click records don&apos;t
          identify anyone and are kept for campaign reporting. The campaign link cookie expires
          after 30 days, or is deleted as soon as you create an account.
        </li>
      </ul>
      <p>
        You may request deletion of your account and all associated data at any time by
        emailing us.
      </p>
    </section>
    <section>
      <h2>Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Request a copy of the personal data we hold about you</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion of your account and associated data</li>
        <li>Withdraw consent at any time by closing your account</li>
        <li>Lodge a complaint with your local data protection authority</li>
      </ul>
      <p>
        To exercise any of these rights, email us at{' '}
        <a href="mailto:hello.mediacrater@gmail.com">
          hello.mediacrater@gmail.com
        </a>.
      </p>
      <p>
        We will action all valid deletion requests within a reasonable timeframe.
        We reserve the right to decline requests that are manifestly unfounded,
        repetitive, or made in bad faith, in accordance with applicable data
        protection law.
      </p>
    </section>
    <section>
      <h2>Cookies and Local Storage</h2>
      <p>
        Our Chrome extension uses only essential local storage required for authentication and
        session management, via Chrome's secure storage API. No advertising, tracking, or
        analytical cookies. Our web app uses a small number of cookies described in our{' '}
        <a href="/cookies">
          Cookie Policy
        </a>
        , including a required device cookie used to enforce the free plan, a campaign link
        cookie that is only set when you open one of our short links, and one optional
        affiliate-tracking cookie that only activates if you accept it.
      </p>
    </section>
    <section>
      <h2>Changes to This Policy</h2>
      <p>
        If we make material changes to this policy, we will update the effective date above
        and, where appropriate, notify you by email. Continued use of Mediacrater after
        changes constitutes acceptance of the updated policy.
      </p>
    </section>
    <section>
      <h2>Contact</h2>
      <p>
        Questions about this policy? Email us at{' '}
        <a href="mailto:hello.mediacrater@gmail.com">
          hello.mediacrater@gmail.com
        </a>.
      </p>
    </section>
    
    </PolicyShell>
  )
}
