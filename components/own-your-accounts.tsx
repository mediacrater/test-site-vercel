//components/own-your-accounts.tsx
// Homepage section: renting an agency ad account vs building your own.
// Every row must stay factual and fair. Don't name competitors, and don't claim
// owned accounts are ban-proof or that agency accounts are unsafe.
import Link from "next/link"
import { getPost } from "@/lib/blog/registry"

const SIGNUP_URL =
  "/signup?src=home-own-your-accounts&utm_source=website&utm_medium=cta&utm_campaign=home-own-your-accounts"

const RELATED_POST_SLUG = "how-i-minimized-meta-ad-account-bans"

const rows = [
  {
    topic: "Who owns the account",
    rented: "Usually the provider's business, not yours.",
    owned: "You do.",
  },
  {
    topic: "If you stop working together",
    rented: "Ask the provider what happens to your pixel data, audiences and account history.",
    owned: "There's no one to leave. The account and its history stay with you.",
  },
  {
    topic: "Cost",
    rented: "Provider fees on top of your ad spend. Terms vary by provider.",
    owned: "Your ad spend, plus any tools you choose.",
  },
  {
    topic: "Spend limits at the start",
    rented: "Often higher from day one.",
    owned: "Typically start lower and rise as you build payment history.",
  },
  {
    topic: "Restricted categories",
    rented: "Some providers help with categories that need extra approval.",
    owned: "You apply for any required approvals yourself.",
  },
  {
    topic: "Support",
    rented: "Some providers include a contact at the platform.",
    owned: "Standard platform support.",
  },
]

export function OwnYourAccounts() {
  const post = getPost(RELATED_POST_SLUG)
  const showPostLink = post.status === "live"

  return (
    <section id="own-your-accounts" aria-labelledby="own-title" className="border-t border-border bg-card py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 id="own-title" className="display-lg text-[clamp(2.1rem,4.4vw,3.4rem)] text-foreground">
            Own your ad accounts. Keep your history.
          </h2>
          <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-muted-foreground text-pretty">
            Renting an agency ad account can get you spending fast, but the account usually stays with the provider.
            Building your own takes longer, and what you build on it is yours. Mediacrater helps with one part of
            that: checking each creative before you upload it.
          </p>
        </div>

        <div className="relative mt-14 overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full min-w-[680px] border-collapse text-left text-[0.975rem]">
            <caption className="sr-only">Renting an agency ad account compared with owning your ad account</caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="w-[24%] px-5 py-4 font-semibold text-muted-foreground">
                  <span className="sr-only">Topic</span>
                </th>
                <th scope="col" className="w-[38%] px-5 py-4 font-semibold text-muted-foreground">
                  Rented agency account
                </th>
                <th scope="col" className="w-[38%] border-l-2 border-l-primary bg-primary/[0.06] px-5 py-4 font-bold text-foreground">
                  Your own account
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.topic} className="border-b border-border last:border-b-0 align-top">
                  <th scope="row" className="px-5 py-4 font-semibold text-foreground">
                    {row.topic}
                  </th>
                  <td className="px-5 py-4 leading-relaxed text-muted-foreground">{row.rented}</td>
                  <td className="border-l-2 border-l-primary bg-primary/[0.06] px-5 py-4 leading-relaxed text-foreground">{row.owned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <h3 className="text-lg font-bold text-foreground">When renting makes sense</h3>
            <p className="mt-2 text-[1rem] leading-relaxed text-muted-foreground">
              If you need to spend at scale this week, run in a category that needs extra approval, or want a direct
              platform contact, a reputable agency account provider may suit you better. Vet them carefully and get the
              ownership terms in writing.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">What Mediacrater does, and doesn&apos;t</h3>
            <p className="mt-2 text-[1rem] leading-relaxed text-muted-foreground">
              It scans each video or image for likely Meta, TikTok, YouTube, Pinterest and X policy issues before you upload, with
              timestamps and suggested fixes. It doesn&apos;t guarantee approval, prevent bans, or fix account-level
              issues like billing, verification or landing pages.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href={SIGNUP_URL}
            className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-[0.95rem] font-semibold text-primary-foreground transition-[filter] hover:brightness-110"
          >
            Try Mediacrater free
          </Link>
          {showPostLink && (
            <Link
              href={`/blog/${post.slug}`}
              className="text-[0.95rem] font-semibold text-link underline underline-offset-4 hover:decoration-2"
            >
              Read: {post.headline}
            </Link>
          )}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">No credit card required. 3 free scans every month.</p>
      </div>
    </section>
  )
}
