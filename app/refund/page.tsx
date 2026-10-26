//app/refund/page.tsx
import type { Metadata } from 'next'
import { PolicyShell } from '@/components/legal/policy-shell'

export const metadata: Metadata = {
  title: 'Refund Policy | Mediacrater',
  description: 'Mediacrater refund policy. Unused tokens are refundable within 3 days of purchase, minus a 10% processing fee. Used tokens are non-refundable.',
  alternates: { canonical: '/refund' },
  robots: { index: true, follow: true },
}

export default function RefundPolicy() {
  return (
    <PolicyShell title="Refund Policy" updated="Effective date: April 2026">
    <section>
      <h2>Our Policy, Simply Put</h2>
      <p>
        Used tokens are non-refundable. If you have unused tokens and haven't gotten the value you
        expected, we'll refund you, minus a flat 10% processing fee to cover unrecoverable
        payment transaction costs.
      </p>
    </section>

    <section>
      <h2>Eligibility</h2>
      <p>To qualify for a refund, all of the following must be true:</p>
      <ul>
        <li>Your refund request is submitted within <strong>3 days of your purchase date</strong></li>
        <li>Your account has <strong>unused tokens remaining</strong></li>
        <li>You are requesting a refund of <strong>all remaining unused tokens</strong>. We do not issue partial refunds on individual tokens</li>
      </ul>
    </section>

    <section>
      <h2>What Gets Deducted</h2>
      <p>
        A flat <strong>10% processing fee</strong> is deducted from the refund amount to cover
        unrecoverable payment processing costs charged by our payment provider. This fee applies
        regardless of how many tokens remain.
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
        <li>Tokens that have already been used for scans</li>
        <li>Purchases where the 3-day window has passed</li>
        <li>Individual tokens (refunds apply to the full unused balance only)</li>
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
