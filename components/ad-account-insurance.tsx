const EXTENSION_URL =
  "https://chromewebstore.google.com/detail/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=website_ad_account_insurance"

export function AdAccountInsurance() {
  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-20">
          {/* Main statement */}
          <div className="lg:col-span-7">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              The problem
            </p>

            <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Everyone hates insurance...
              <br />
              <span className="text-accent">
                Until something goes wrong.
              </span>
            </h2>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Ad rejections and account restrictions often happen after the
              money has already been spent. Mediacrater moves that check to the
              beginning of the workflow.
            </p>
          </div>

          {/* Editorial list */}
          <div className="lg:col-span-5">
            <div className="border-t border-border">
              <div className="grid grid-cols-[42px_1fr] gap-4 border-b border-border py-5">
                <span className="font-mono text-xs text-primary">01</span>

                <div>
                  <h3 className="font-semibold text-foreground">
                    Platforms don't always explain the problem.
                  </h3>

                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    Find potential policy issues before the platform becomes
                    the place where you discover them.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[42px_1fr] gap-4 border-b border-border py-5">
                <span className="font-mono text-xs text-primary">02</span>

                <div>
                  <h3 className="font-semibold text-foreground">
                    Guessing is expensive.
                  </h3>

                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    Review risk zones and timestamps before putting budget
                    behind a creative.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[42px_1fr] gap-4 border-b border-border py-5">
                <span className="font-mono text-xs text-primary">03</span>

                <div>
                  <h3 className="font-semibold text-foreground">
                    Fix the creative, not the aftermath.
                  </h3>

                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    Get actionable guidance on what to review before the ad
                    goes live.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href={EXTENSION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Try Mediacrater free
              </a>

              <p className="mt-3 text-xs text-muted-foreground">
                No credit card required · 3 free scans every month
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
