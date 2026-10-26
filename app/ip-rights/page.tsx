//app/ip-rights/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { PolicyShell } from "@/components/legal/policy-shell"
import { CONTACT_EMAIL } from "@/lib/legal/policies"

export const metadata: Metadata = {
  title: "IP Rights Policy | Mediacrater",
  description:
    "You own the ads you scan. Mediacrater takes a temporary license to analyze your media for policy issues, and it ends when your results are returned.",
  alternates: { canonical: "/ip-rights" },
  robots: { index: true, follow: true },
}

export default function IpRightsPolicy() {
  return (
    <PolicyShell
      title="IP Rights Policy"
      updated="Last updated October 26, 2026"
      summary={
        <p>
          You own your content. Mediacrater does not claim ownership of anything you upload. To scan it, you give us a
          temporary license that ends when your results are returned, with the few exceptions explained below.
        </p>
      }
    >
      <section>
        <h2>What this policy covers</h2>
        <p>
          This policy explains who owns the videos, images, audio, text and links you submit to Mediacrater
          (&ldquo;your content&rdquo;), and what you allow us to do with them. It is part of our{" "}
          <Link href="/terms">Terms of Service</Link>.
        </p>
      </section>

      <section>
        <h2>You keep ownership</h2>
        <p>
          Mediacrater does not claim ownership of your content. All rights in it, including copyright and trademarks,
          stay with you or with whoever licensed it to you. Submitting content for a scan does not transfer any rights
          to us beyond the temporary license described below.
        </p>
      </section>

      <section>
        <h2>The temporary license you give us</h2>
        <p>
          When you submit content for a scan, you give Mediacrater a limited, non-exclusive, non-transferable,
          royalty-free, worldwide license to receive, temporarily store, copy, transmit and analyze it for one purpose
          only: checking it for potential policy violations on the platform or platforms you selected, and returning
          your results to you.
        </p>
        <p>
          The license also covers the service providers that host our systems and run the analysis for us, under the
          same limits. They are described in our <Link href="/privacy">Privacy Policy</Link>. We do not use your
          content for any other purpose under this license.
        </p>
      </section>

      <section>
        <h2>When the license ends</h2>
        <p>
          The license ends as soon as your results are returned to you, and the original file is deleted from our
          storage at that point. If a scan fails or is cancelled, the license ends when processing stops.
        </p>
        <p>A few things continue after a scan, each for one stated reason:</p>
        <ul>
          <li>
            <strong>Your results.</strong> Scan results can quote short parts of your content, such as on-screen text
            or a line of the voiceover. You allow us to keep those quotes with your account, only to show your results
            to you, until you delete the scan or your account.
          </li>
          <li>
            <strong>Scan History thumbnails (paid plans).</strong> If your plan includes Scan History, you allow us to
            keep a small, low resolution thumbnail of your image or of your video&rsquo;s first frame, and the file
            name, only to show your scan history to you. This continues until you delete the scan or your account. We
            do not create thumbnails or keep file names for scans made without Scan History.
          </li>
          <li>
            <strong>Our AI provider.</strong> The provider that runs the analysis may keep the content it receives
            under its own terms, for periods we do not control. Our <Link href="/privacy">Privacy Policy</Link> explains
            this in more detail.
          </li>
        </ul>
      </section>

      <section>
        <h2>Content you don&rsquo;t own</h2>
        <p>
          You are responsible for having the rights needed to submit your content, including any music, footage, logos
          or people&rsquo;s likeness in it. If you submit a link to media you do not own, such as an ad in a public ad
          library, we process it under the same limits and only to return your results. You are responsible for how you
          use those results.
        </p>
      </section>

      <section>
        <h2>What belongs to Mediacrater</h2>
        <p>
          The Mediacrater software, website and brand belong to Mediacrater. Your scan results are for your own
          advertising work. Our <Link href="/terms">Terms of Service</Link> do not allow reselling or redistributing
          them without our permission.
        </p>
      </section>

      <section>
        <h2>Reporting infringement</h2>
        <p>
          If you believe something on mediacrater.com infringes your copyright or trademark, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with a description of your work, where it appears on
          our site, your contact details, and a statement that you believe the use is not authorized. We will review it
          and reply.
        </p>
      </section>

      <section>
        <h2>Changes to this policy</h2>
        <p>
          If we change this policy, we will update the date at the top of this page. Changes that reduce your rights
          apply only to content submitted after the change.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about this policy? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </PolicyShell>
  )
}
