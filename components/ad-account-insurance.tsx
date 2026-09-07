const EXTENSION_URL = "https://chromewebstore.google.com/detail/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=website_ad_account_insurance"

const insurancePoints = [
  {
    number: "01",
    title: "Find out before the rejection",
    body: "Platforms can give you very little detail when something gets flagged. Mediacrater gives you a place to review potential issues while the creative is still in your hands.",
  },
  {
    number: "02",
    title: "Keep changes cheap",
    body: "A questionable claim is easy to fix in the edit. It becomes much more expensive when you discover it after launch, rejection, or a delayed campaign.",
  },
  {
    number: "03",
    title: "Make the review repeatable",
    body: "Use the same pre-publish check across creatives instead of relying on memory, guesswork, or waiting for the platform to tell you what it disliked.",
  },
]

export function AdAccountInsurance() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              The real reason to scan
            </p>

            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-display)] leading-tight">
              It is easier to fix a questionable ad before it leaves your desk.
            </h2>

            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              You are not buying an approval guarantee. You are buying another
              checkpoint before money, time, and account history are involved.
            </p>

            <div className="mt-7">
              <a
                href={EXTENSION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Try Mediacrater free
              </a>

              <p className="text-xs text-muted-foreground mt-3">
                3 free scans every month · no credit card required
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {insurancePoints.map((point) => (
              <div
                key={point.number}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6"
              >
                <div className="flex gap-4">
                  <span className="font-mono text-xs text-primary pt-1">
                    {point.number}
                  </span>
                  <div>
                    <h3 className="font-bold text-foreground leading-snug">
                      {point.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {point.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
