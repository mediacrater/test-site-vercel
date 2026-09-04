const insurancePoints = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
    title: 'Platforms never explain',
    body: "Meta, TikTok, and YouTube reject ads or ban accounts with zero details. You’re left guessing what went wrong. Mediacrater flags the exact issues in advance.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    title: 'Whales get away with it',
    body: "Big brands survive violations that kill small accounts. Mediacrater levels the field by teaching you the real rules faster.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
    <section className="py-12 md:py-16 bg-background border-b border-border font-mono">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
            [SYS_LOG: PROTECT_BUSINESS]
          </p>
          <div className="h-px flex-1 bg-border border-dashed border-b" />
        </div>

        {/* Heading */}
        <div className="max-w-3xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-balance leading-tight uppercase tracking-tight">
            Everyone hates insurance...{' '}
            <span className="text-accent">until something goes wrong.</span>
          </h2>
        </div>

        {/* Opening paragraph */}
        <p className="text-sm text-muted-foreground max-w-2xl mb-12 text-pretty leading-relaxed">
          &gt; Ad account bans hit without warning or explanation. One hidden violation and your campaigns go dark, revenue stops, and you’re rebuilding from scratch. Mediacrater shows you the risks before you upload.
        </p>

        {/* Three points */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {insurancePoints.map((point, idx) => (
            <div
              key={point.title}
              className="bg-card border border-border p-5 flex flex-col gap-4 relative"
            >
              <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[9px] px-1.5 py-0.5">
                FLAG_0{idx + 1}
              </div>
              <div className="w-8 h-8 bg-accent/10 text-accent flex items-center justify-center shrink-0 border border-accent/20">
                {point.icon}
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2 text-sm uppercase">{point.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{point.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing CTA */}
        <div className="border-t border-dashed border-border pt-8">
          <p className="text-muted-foreground text-sm mb-6 max-w-xl text-pretty">
            &gt; This isn’t just about protecting one ad. It’s about building the account history that platforms reward. The kind most of your competitors don’t have.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={EXTENSION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity border border-primary"
            >
              [ EXECUTE: Try free ]
            </a>
            <p className="text-[10px] text-muted-foreground uppercase">No credit card required<br/>3 free scans / month</p>
          </div>
        </div>

      </div>
    </section>
  )
}
