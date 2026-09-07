const insurancePoints = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="square" strokeLinejoin="miter" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
    title: 'Platforms never explain',
    body: "Meta, TikTok, and YouTube reject ads or ban accounts with zero details. Mediacrater flags exact policy issues in advance.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="square" strokeLinejoin="miter" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    title: 'Whales get away with it',
    body: "Big brands survive violations that kill small accounts. Mediacrater levels the field by outlining enforcement boundaries.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="square" strokeLinejoin="miter" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Build algorithm trust',
    body: "Compliant ads strengthen account standing. One flagged upload can reset months of account reputation build-up.",
  },
]

const EXTENSION_URL = 'https://chromewebstore.google.com/detail/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=website_ad_account_insurance'

export function AdAccountInsurance() {
  return (
    <section className="py-16 bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 font-mono text-xs text-muted-foreground uppercase tracking-widest border-l-2 border-primary pl-3">
          Risk Mitigation
        </div>

        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl font-bold uppercase tracking-tight text-foreground font-[family-name:var(--font-display)]">
            Account protection through pre-submission auditing.
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-normal">
            Account suspensions hit without notice. Unseen policy triggers halt campaign delivery instantly. Scan creative files prior to publication.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-0 border border-border bg-card mb-12 divide-y md:divide-y-0 md:divide-x divide-border">
          {insurancePoints.map((point) => (
            <div key={point.title} className="p-6 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 border border-border bg-secondary text-foreground flex items-center justify-center shrink-0 mb-4 rounded-none">
                  {point.icon}
                </div>
                <h3 className="font-bold uppercase text-sm text-foreground mb-2 font-mono">{point.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{point.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-border p-6 bg-secondary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-none">
          <div>
            <p className="text-sm font-mono font-bold uppercase text-foreground">
              Maintain account trust history.
            </p>
            <p className="text-xs text-muted-foreground">
              3 free scans per month included · No credit card required
            </p>
          </div>
          <a
            href={EXTENSION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground px-6 py-2.5 font-mono text-xs uppercase font-bold hover:bg-primary/90 transition-none shrink-0"
          >
            Try Mediacrater Free
          </a>
        </div>
      </div>
    </section>
  )
}
