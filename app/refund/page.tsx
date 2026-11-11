//app/refund/page.tsx
import type { Metadata } from 'next'
import { PolicyShell } from '@/components/legal/policy-shell'

export const metadata: Metadata = {
  title: 'Refund Policy | Mediacrater',
  description: 'Mediacrater refund policy. Unused scans are refundable within 3 days of purchase, minus a 10% processing fee. Used scans are non-refundable.',
  alternates: { canonical: '/refund' },
  robots: { index: true, follow: true },
}

export default function RefundPolicy() {
  return (
    <PolicyShell title="Refund Policy" updated="Effective date: November 30, 2026">
    <section>
      <h2>Our Policy, Simply Put</h2>
      <p>
        Used scans are non-refundable. If you have unused scans and haven't gotten the value you
        expected, we'll refund you, minus a flat 10% processing fee to cover unrecoverable
        payment transaction costs.
      </p>
      <p>
        The free trial costs nothing and has nothing to refund. We do not ask for a card during the trial,
        so you are never charged automatically when it ends.
      </p>
    </section>

    <section>
      <h2>Eligibility</h2>
      <p>To qualify for a refund, all of the following must be true:</p>
      <ul>
        <li>Your refund request is submitted within <strong>3 days of your purchase date</strong></li>
        <li>Your account has <strong>unused scans remaining</strong></li>
        <li>You are requesting a refund of <strong>all remaining unused scans</strong>. We do not issue partial refunds on individual scans</li>
      </ul>
    </section>

    <section>
      <h2>Yearly Plans</h2>
      <p>
        The same rules apply to a yearly plan, with the unused value worked out over the whole year of scans
        (the scans for each month are added monthly, but they are counted from the day you pay). A refund is
        available within <strong>3 days of your purchase date</strong> only. After that, a yearly plan is not
        refundable: you can cancel at any time to stop it renewing, and it stays active until the end of the year
        you paid for.
      </p>
      <div className="callout">
        <p><strong>Example</strong></p>
        <p>
          You buy the Startup yearly plan for $100, which covers 240 scans over the year (20 a month). In the first
          3 days you use 5 scans. Your unused value is $100 × 235/240 = $97.92. The 10% fee ($9.79) is deducted, so
          you receive $88.13. When a refund is issued, the plan ends and the remaining scans are removed.
        </p>
      </div>
    </section>

    <section>
      <h2>What Gets Deducted</h2>
      <p>
        A flat <strong>10% processing fee</strong> is deducted from the refund amount to cover
        unrecoverable payment processing costs charged by our payment provider. This fee applies
        regardless of how many scans remain.
      </p>
      <div className="callout">
        <p><strong>Example</strong></p>
        <p>
          You buy the Startup plan for $10, which includes 20 scans. You use 5 and have
            15 left. Your unused value is $10 × 15/20 = $7.50. The 10% fee ($0.75) is
            deducted, so you receive $6.75.
        </p>
      </div>
    </section>

    <section>
      <h2>Non-Refundable</h2>
      <ul>
        <li>Scans that have already been used</li>
        <li>Time already credited to you when you upgraded (the credit for unused time on your old plan is applied automatically at the upgrade, so it is not refunded a second time)</li>
        <li>Purchases where the 3-day window has passed, including the remaining months of a yearly plan you cancel</li>
        <li>Individual scans (refunds apply to the full unused balance only)</li>
      </ul>
    </section>

    <section>
      <h2>How to Request a Refund</h2>
      <p>
        Email us at{' '}
        <a href="mailto:hello.mediacrater@gmail.com">
          hello.mediacrater@gmail.com
        </a>{' '}
        with the subject line <strong>"Refund Request"</strong> and include the email address
        associated with your account and your reason for requesting a refund. We aim to respond
        within 2 business days.
      </p>
    </section>

    <section>
      <h2>Questions?</h2>
      <p>
        Email us at{' '}
        <a href="mailto:hello.mediacrater@gmail.com">
          hello.mediacrater@gmail.com
        </a>{' '}
        and we'll sort it out.
      </p>
    </section>
    
    </PolicyShell>
  )
}
