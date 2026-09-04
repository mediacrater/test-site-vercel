const insurancePoints = [
  {
    id: "risk_factor_alpha",
    title: 'Platforms never explain',
    body: "Meta, TikTok, and YouTube reject ads or ban accounts with zero details. You’re left guessing what went wrong. Mediacrater flags the exact issues in advance.",
    note: "High incidence rate. Preventative scan required.",
  },
  {
    id: "risk_factor_beta",
    title: 'Whales get away with it',
    body: "Big brands survive violations that kill small accounts. Mediacrater levels the field by teaching you the real rules faster.",
    note: "Algorithmic bias detected. Compliance history is critical.",
  },
  {
    id: "risk_factor_gamma",
    title: 'Build algorithm trust',
    body: "Every compliant ad strengthens your account history. Faster approvals, better delivery, more leniency. One bad upload can undo months of progress.",
    note: "Trust score optimization recommended.",
  },
]

const EXTENSION_URL = 'https://chromewebstore.google.com/detail/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=website_ad_account_insurance'

export function AdAccountInsurance() {
  return (
    <section className="py-20 md:py-28 bg-secondary/20 border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Document Header */}
        <div className="mb-16 border-b border-border/60 pb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3">
            // Section: Asset Protection
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-display)] max-w-2xl">
            Everyone hates insurance... <br/>
            <span className="font-mono text-xl md:text-2xl text-muted-foreground bg-amber-500/10 px-2 mt-2 inline-block border border-amber-500/20">
              until something goes wrong.
            </span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl text-pretty leading-relaxed">
            Ad account bans hit without warning or explanation. One hidden violation and your campaigns go dark, revenue stops, and you’re rebuilding from scratch. <ins className="no-underline font-mono text-amber-500">Mediacrater shows you the risks before you upload.</ins>
          </p>
        </div>

        {/* Audit Trail Layout */}
        <div className="relative pl-6 sm:pl-10 border-l-2 border-border/60 space-y-16">
          {insurancePoints.map((point, index) => (
            <div key={point.id} className="relative grid lg:grid-cols-[1fr_300px] gap-8 lg:gap-16">
              
              {/* Audit Node Marker */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 flex items-center justify-center bg-background py-2">
                <div className="h-3 w-3 border-2 border-amber-500 rounded-sm bg-background" />
              </div>

              {/* Main Content */}
              <div>
                <h3 className="font-bold text-xl text-foreground mb-3 font-[family-name:var(--font-display)]">
                  {point.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {point.body}
                </p>
              </div>

              {/* Margin Note */}
              <aside className="border-l border-amber-500/30 pl-4 py-1">
                <p className="font-mono text-[10px] text-amber-600/70 dark:text-amber-400/70 uppercase tracking-widest mb-1">
                  [{point.id}]
                </p>
                <p className="font-mono text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
                  {point.note}
                </p>
              </aside>

            </div>
          ))}

          {/* Closing Summary Node */}
          <div className="relative grid lg:grid-cols-[1fr_300px] gap-8 lg:gap-16 pt-8 border-t border-border/60">
            <div className="absolute -left-[29px] sm:-left-[45px] top-9 h-2 w-2 rounded-full bg-primary ring-4 ring-background" />
            
            <div>
              <p className="text-foreground font-medium text-base mb-6 max-w-xl text-pretty">
                This isn’t just about protecting one ad. It’s about building the account history that platforms reward. The kind most of your competitors don’t have.
              </p>
              <a
                href={EXTENSION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 font-mono text-sm hover:opacity-90 transition-opacity uppercase tracking-wider"
              >
                Execute Analysis
              </a>
              <p className="font-mono text-xs text-muted-foreground mt-4">
                * No credit card required. 3 manual overrides / mo.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
