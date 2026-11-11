//app/terms/page.tsx
import type { Metadata } from 'next'
import { PolicyShell } from '@/components/legal/policy-shell'

// Set this to the cutover date (the day the free trial replaces the old free plan).
// Keep it identical to NEXT_PUBLIC_TRIAL_CUTOVER_ISO and to the date in the notice email.
const TRIAL_START_DATE = 'November 30, 2026'

export const metadata: Metadata = {
  title: 'Terms of Service | Mediacrater',
  description: 'Terms of Service for Mediacrater. Understand your rights and responsibilities when using our ad policy scanning tool, including the free trial, plans and billing.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true },
}

export default function TermsOfService() {
  return (
    <PolicyShell
      title="Terms of Service"
      updated={`Effective date: ${TRIAL_START_DATE}`}
      summary={
        <>
          The short version: you get a 14-day free trial with 5 scans and no credit card. After that you
          need a paid plan to keep scanning. Plans renew until you cancel, monthly or yearly (two months free). Results
          are guidance, not a guarantee that a platform will approve your ad.
        </>
      }
    >
    <section>
      <h2>1. Acceptance of Terms</h2>
      <p>
        By installing or using Mediacrater, you agree to these Terms of Service. If you do not
        agree, do not use the service. You must be at least 18 years old, or the age of majority
        where you live, and if you use Mediacrater for a business you confirm you are allowed to
        accept these Terms for it. Questions can be directed to{' '}
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
      <h2>4. Free Trial</h2>
      <p>
        Every new account gets one free trial, with no credit card. The trial lasts{' '}
        <strong>14 days and includes 5 scans</strong>. It ends as soon as the first of these happens:
      </p>
      <ul>
        <li>14 days have passed since it started</li>
        <li>You have used your 5 scans</li>
        <li>
          A linked account (see section 7) has already used the free scans that your accounts share
        </li>
      </ul>
      <p>
        When the trial ends, you need a paid plan to keep scanning. Nothing is charged automatically,
        because we do not ask for a payment method during the trial. Your account stays open and you can
        still sign in, but scans are unavailable until you subscribe.
      </p>
      <ul>
        <li>The trial includes regular scans of one creative at a time. Deep scans, audio analysis, batch scans, priority processing and Scan History are part of paid plans.</li>
        <li>The trial cannot be paused, extended, restarted or transferred.</li>
        <li>Only scans that finish successfully count toward the 5 scans.</li>
        <li>
          Accounts that were on our previous free plan before {TRIAL_START_DATE} receive one free trial
          that starts on {TRIAL_START_DATE}. Scans left on the previous free plan do not carry over.
        </li>
        <li>We may change, pause or end the free trial offer for new sign-ups at any time. A trial that has already started keeps the days and scans it was given.</li>
      </ul>
    </section>

    <section>
      <h2>5. Plans, Scans and Billing</h2>
      <p>
        Paid access is sold as monthly or yearly subscriptions. Each plan includes a number of scans per
        month, shown on our pricing page, and prices are listed in USD. A yearly plan costs ten times the
        monthly price (two months free) and is billed once a year. Payments are processed by Stripe. Key rules:
      </p>
      <ul>
        <li><strong>Renewal:</strong> your subscription renews automatically each month (or each year, for a yearly plan) until you cancel, and your card on file is charged the plan price plus any taxes that apply.</li>
        <li><strong>Scans:</strong> a regular scan uses 1 scan and a deep scan uses 2. A scan is only counted when it finishes successfully.</li>
        <li><strong>Monthly plans:</strong> your scans reset to the full amount of your plan when a billing period renews. Unused scans do not carry over.</li>
        <li><strong>Yearly plans:</strong> you receive the plan&apos;s monthly scans on the day you subscribe and the same amount on the same day of each following month. Unused scans carry over from month to month until your yearly term ends. When the yearly plan renews, a new term starts and scans left over from the previous term are not kept.</li>
        <li>Scans are non-transferable and tied to your account.</li>
        <li><strong>Upgrading:</strong> moving to a larger plan, or from a monthly plan to a yearly plan, takes effect immediately. You are charged the new plan&apos;s price minus a credit for the unused time on your current plan, a new billing period starts that day, and your scan balance is set to what the new plan gives for its first month (it is replaced, not added to). A yearly plan can be upgraded to a larger yearly plan.</li>
        <li><strong>Downgrading:</strong> moving from a monthly plan to a smaller plan is completed at checkout. It starts a new billing period that day, your scan balance is set to the new plan&apos;s amount, and unused time on the old plan is not credited. A yearly plan is prepaid, so during the term it cannot be moved to a smaller plan or to a monthly plan; such changes take effect when the term ends.</li>
        <li><strong>Cancelling:</strong> you can cancel at any time from the billing page. You keep your plan and remaining scans until the end of the billing period you paid for. After that you have no scans until you subscribe again. The free trial is not offered again. If you cancel a yearly plan, it stays active until the end of the year you paid for and the monthly scans keep arriving, but the remaining months are not refunded.</li>
        <li><strong>Price changes:</strong> if we change the price or the scans in your plan, we will email you at least 30 days before the change reaches you, and you can cancel before it takes effect. A change never alters a term you have already paid for; it applies from your next renewal.</li>
        <li><strong>Failed payments:</strong> if a renewal payment fails, we may pause your access until it is resolved.</li>
        <li>Used scans are non-refundable under any circumstances. Unused scans may be refundable, see our <a href="/refund">Refund Policy</a> for details.</li>
      </ul>
    </section>

    <section>
      <h2>6. Acceptable Use</h2>
      <p>By creating an account and verifying your email, you agree <strong>not</strong> to:</p>
      <ul>
        <li>Use Mediacrater to reverse-engineer, mimic or duplicate our business model</li>
        <li>Use Mediacrater to attempt to reverse-engineer or bypass platform ad detection systems</li>
        <li>Submit content that is illegal, harmful, or violates third-party rights</li>
        <li>Attempt to manipulate, scrape, or abuse the scanning infrastructure</li>
        <li>Resell or redistribute scan results without permission</li>
        <li>Create or use extra accounts to get more than one free trial</li>
      </ul>
    </section>

    <section>
      <h2>7. One Free Trial Per Person</h2>
      <p>
        The free trial is meant to let each person try Mediacrater once. The 5 free scans are per person
        and per device, not per account. Extra accounts are allowed, but accounts that appear to belong
        to the same person share one set of 5 free scans. They do not each get their own, and the shared
        scans are not renewed.
      </p>
      <p>
        If you try to start a second trial with a linked account, you will see a message in the app
        and the trial will not start. We do not send warning emails and we do not close accounts for
        this. Paid accounts are not limited this way: agencies and buyers who need a separate account
        per client are welcome to have one on a paid plan.
      </p>
      <p>
        To enforce this, we collect your IP address, a device cookie, and basic browser and device
        information when you sign up. We do not block VPNs. Using a VPN, including a different
        profile per client, is allowed. Details are in our{' '}
        <a href="/privacy">
          Privacy Policy
        </a>.
      </p>
      <p>
        If you deliberately create accounts to get more free trials after we have told you the limit, we may
        end free-trial access for those accounts. If you believe your trial was ended or limited in error, for
        example because you share a device or network with someone else, contact us at{' '}
        <a href="mailto:hello.mediacrater@gmail.com">
          hello.mediacrater@gmail.com
        </a>{' '}
        and we will review it.
      </p>
    </section>

    <section>
      <h2>8. Your Content</h2>
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
      <h2>9. Intellectual Property</h2>
      <p>
        All Mediacrater software, branding, and content is owned by Mediacrater. You may not
        copy, modify, or distribute any part of the service without written permission.
        Platform logos are displayed solely for user experience and remain the property
        of their respective owners.
      </p>
    </section>
    <section>
      <h2>10. Limitation of Liability</h2>
      <p>
        Mediacrater is provided "as is." We are not liable for ad rejections, account bans,
        revenue loss, or any other damages arising from your use of the service or reliance
        on scan results. Our total liability to you shall not exceed the amount you paid for
        your current billing period.
      </p>
      <p>
        Nothing in these Terms limits any right you have under consumer protection or other laws that
        cannot be waived, or our liability where the law does not allow it to be limited.
      </p>
    </section>
    <section>
      <h2>11. Changes to the Service and to These Terms</h2>
      <p>
        We may modify or discontinue the service at any time. We will make reasonable efforts to
        notify users of significant changes. If we change these Terms in a way that affects your paid plan,
        we will email you at least 30 days before the change reaches you, and you may cancel before then.
        For other changes we will update the effective date at the top of this page, and continuing to
        use Mediacrater after that date means you accept the updated Terms.
      </p>
    </section>
    <section>
      <h2>12. Ending Your Account</h2>
      <p>
        You can stop using Mediacrater at any time, and you can ask us to delete your account by emailing
        us. We may suspend or close an account that breaks these Terms, and where possible we will tell you
        why first. If we close a paid account for a reason other than a breach of these Terms, we will refund
        the unused part of the current billing period.
      </p>
    </section>
    <section>
      <h2>13. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the Province of Quebec and the federal laws of Canada that
        apply there. Disputes will be brought before the courts of the judicial district of Montreal. If you
        are a consumer, you may also bring a dispute before the courts of the place where you live, and
        nothing in this section removes protections the law gives you.
      </p>
    </section>
    <section>
      <h2>14. Contact</h2>
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
