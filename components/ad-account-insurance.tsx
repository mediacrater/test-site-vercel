import { ShieldAlert } from "lucide-react"

const insurancePoints = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
    title: 'Platforms never explain',
    body: "Meta, TikTok, and YouTube reject ads or ban accounts with zero details. You’re left guessing what went wrong. Mediacrater flags the exact issues in advance.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    title: 'Whales get away with it',
    body: "Big brands survive violations that kill small accounts. Mediacrater levels the field by teaching you the real rules faster.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Build algorithm trust',
    body: "Every compliant ad strengthens your account history. Faster approvals, better delivery, more leniency. One bad upload can undo months of progress.",
  },
]

const EXTENSION_URL = 'https://chromewebstore.google.com/detail/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=website_ad_account_insurance'

export function AdAccountInsurance() {
  return (
    <section className="py-20 md:py-28 bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Dossier Header */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="w-5 h-5 text-accent" />
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                File 00: Risk Assessment
              </p>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground font-[family-name:var(--font-display)] text-balance leading-tight tracking-tight">
              Everyone hates insurance...
            </h2>
            <h2 className="text-4xl sm:text-5xl font-bold text-accent font-[family-name:var(--font-display)] text-balance leading-tight tracking-tight mt-2">
              until something goes wrong.
            </h2>

            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Ad account bans hit without warning or explanation. One hidden violation and your campaigns go dark, revenue stops, and you’re rebuilding from scratch. Mediacrater shows you the risks before you upload.
            </p>

            <div className="mt-10 border-t border-border pt-8">
              <a
                href={EXTENSION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 font-mono font-semibold text-xs tracking-wider uppercase hover:bg-foreground/90 transition-colors"
              >
                Initiate Free Scan
              </a>
              <p className="font-mono text-[10px] text-muted-foreground mt-4 uppercase tracking-wider">
                No credit card required // 3 free scans per month
              </p>
            </div>
          </div>

          {/* Right Column: Stacked Documents */}
          <div className="lg:col-span-7 space-y-6">
            <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest border-b border-border pb-2 mb-6">
              Exhibit A: Systemic Risks
            </div>
            
            {insurancePoints.map((point, i) => (
              <div
                key={point.title}
                className="bg-card border-2 border-border p-6 flex flex-col sm:flex-row gap-6 hover:border-foreground/20 transition-colors relative"
              >
                <div className="absolute top-0 right-0 bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground border-b-2 border-l-2 border-border">
                  ITEM 0{i + 1}
                </div>
                <div className="w-12 h-12 bg-secondary text-foreground flex items-center justify-center shrink-0 border border-border mt-2">
                  {point.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2 font-mono uppercase tracking-tight">{point.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{point.body}</p>
                </div>
              </div>
            ))}

            <div className="bg-secondary/30 border border-border p-6 mt-8">
              <p className="text-foreground text-sm font-medium text-pretty leading-relaxed">
                This isn’t just about protecting one ad. It’s about building the account history that platforms reward. The kind most of your competitors don’t have.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
