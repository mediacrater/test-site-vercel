import { ArrowUpRight, Ban, Eye, ShieldAlert } from "lucide-react"

const EXTENSION_URL = "https://chromewebstore.google.com/detail/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=website_ad_account_insurance"

const points = [
  {
    icon: ShieldAlert,
    title: "Pre-publish risk assessment",
    body: "Review potential policy issues before a creative reaches a live campaign.",
  },
  {
    icon: Eye,
    title: "Locate the finding",
    body: "Timestamped findings give your team a specific portion of the creative to inspect.",
  },
  {
    icon: Ban,
    title: "Reduce preventable rework",
    body: "Catch issues earlier, when changing the creative is cheaper than rebuilding a live campaign.",
  },
]

export function AdAccountInsurance() {
  return (
    <section className="overflow-hidden border-b border-border bg-foreground py-24 text-background md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-background/50">Risk management</p>
            <h2 className="mt-5 max-w-xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl">
              Reduce preventable policy risk before launch.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-background/65">
              Ad platforms make the final enforcement decision. Mediacrater gives your team a review layer before you spend budget, submit the creative, or discover the issue through a rejection.
            </p>

            <a
              href={EXTENSION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center border border-background/25 px-5 py-3 text-xs font-semibold text-background transition-colors hover:bg-background hover:text-foreground"
            >
              Run a free scan
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>

            <p className="mt-3 text-[10px] text-background/40">No credit card required · 3 free scans every month</p>
          </div>

          <div className="grid gap-px border border-background/15 bg-background/15 sm:grid-cols-3">
            {points.map(({ icon: Icon, title, body }, index) => (
              <div key={title} className="bg-foreground p-6">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-background/70" />
                  <span className="font-mono text-[10px] text-background/30">0{index + 1}</span>
                </div>
                <h3 className="mt-12 text-sm font-bold text-background">{title}</h3>
                <p className="mt-3 text-xs leading-5 text-background/55">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-background/15 pt-5 text-[10px] leading-5 text-background/40">
          Mediacrater is an assessment layer, not an approval guarantee. Platform review and enforcement remain outside Mediacrater's control.
        </div>
      </div>
    </section>
  )
}
