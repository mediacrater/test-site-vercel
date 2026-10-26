//components/features.tsx
import Link from "next/link"
import { CircleAlert, Clock3, Layers3, Lock } from "lucide-react"

const extras = [
  {
    icon: Layers3,
    title: "Platform-specific analysis",
    text: "Each creative is checked against the policies of the platforms you choose, because the same ad can pass on one and fail on another.",
  },
  {
    icon: Clock3,
    title: "Timestamped findings",
    text: "Go straight to the moment that needs attention instead of rewatching the whole ad.",
  },
  {
    icon: Lock,
    title: "Privacy-first processing",
    text: "Your original file is used for the scan and then deleted from our storage. Ad creatives are valuable business data.",
  },
]

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="border-y border-border bg-card py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-verse="Colossians 3:23" className="max-w-3xl">
          <h2 id="features-title" className="display-lg text-[clamp(2.1rem,4.4vw,3.4rem)]">
            Your ad is more than a video.
          </h2>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted-foreground">
            Mediacrater examines the creative itself: visuals, on-screen text, spoken audio, claims and each
            platform&rsquo;s requirements. You get the reason and the fix, not just a verdict.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* What a platform usually says */}
          <div className="flex flex-col">
            <h3 className="text-[1.0625rem] font-bold text-muted-foreground">What the platform tells you</h3>
            <div className="mt-4 flex flex-1 flex-col justify-center rounded-2xl border border-dashed border-border bg-background p-6 sm:p-8">
              <div className="mx-auto w-full max-w-sm rounded-xl border border-border bg-card p-5 opacity-80 grayscale">
                <div className="flex items-center gap-2.5">
                  <CircleAlert className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <p className="font-bold">Ad rejected</p>
                </div>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
                  This ad doesn&rsquo;t follow our advertising policies.
                </p>
                <span className="mt-4 inline-flex h-9 items-center rounded-lg border border-border px-3.5 text-sm text-muted-foreground">
                  Request review
                </span>
              </div>
              <p className="mt-6 text-center text-[0.95rem] text-muted-foreground">
                No timestamp. No quote. No fix.
              </p>
            </div>
          </div>

          {/* What Mediacrater says */}
          <div className="flex flex-col">
            <h3 className="text-[1.0625rem] font-bold text-foreground">What Mediacrater tells you</h3>
            <div className="mt-4 flex-1 rounded-2xl border border-border bg-background p-6 sm:p-8">
              <div className="rounded-xl border border-border border-l-4 border-l-sev-high bg-card p-5 shadow-[0_18px_40px_-28px_rgba(11,22,40,0.5)] sm:p-6">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="rounded-full bg-sev-high-soft px-2.5 py-0.5 text-xs font-bold text-sev-high">High risk</span>
                  <span className="timecode text-sm text-muted-foreground">0:07</span>
                  <span className="text-sm text-muted-foreground">On-screen text</span>
                </div>
                <p className="mt-3 display-md text-[1.35rem]">Unrealistic results claim</p>
                <p className="mt-3 border-l-2 border-border pl-3 text-[1.0625rem] font-semibold">
                  &ldquo;Clear skin in 3 days. Guaranteed.&rdquo;
                </p>
                <dl className="mt-5 grid gap-4 text-[0.975rem] leading-relaxed sm:grid-cols-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">Why it was flagged</dt>
                    <dd className="mt-1">Promises a specific outcome within a set time.</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Suggested fix</dt>
                    <dd className="mt-1">Remove the time frame and the guarantee. Describe what the product does.</dd>
                  </div>
                </dl>
              </div>
              <p className="mt-6 text-center text-[0.95rem] text-muted-foreground">
                The moment, the words that triggered it, and what to change.
              </p>
            </div>
          </div>
        </div>

        <ul className="mt-16 grid gap-10 border-t border-border pt-12 md:grid-cols-3 md:gap-8">
          {extras.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-2 max-w-[38ch] text-[1rem] leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-[1rem] text-muted-foreground">
          Running high volume or need an API?{" "}
          <Link href="/solutions" className="font-semibold text-link underline underline-offset-4 hover:decoration-2">
            See custom solutions
          </Link>
        </p>
      </div>
    </section>
  )
}
