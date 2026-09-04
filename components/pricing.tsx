'use client'

const SITE_SIGNUP = process.env.NEXT_PUBLIC_SITE_SIGNUP ?? '#'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    scans: '3 scans / mo',
    campaigns: '1 campaign / mo',
    description: 'Get started with no commitment',
    cta: '[ RUN_FREE ]',
    popular: false,
  },
  {
    name: 'Startup',
    price: '$10',
    period: '/mo',
    scans: '20 scans / mo',
    campaigns: '3–6 campaigns / mo',
    description: 'For solo dropshippers testing creatives',
    cta: '[ INIT_STARTUP ]',
    popular: false,
  },
  {
    name: 'Established',
    price: '$40',
    period: '/mo',
    scans: '100 scans / mo',
    campaigns: '20 to 30+ campaigns / mo',
    description: 'For brands running consistent paid campaigns',
    cta: '[ INIT_ESTABLISHED ]',
    popular: false,
  },
  {
    name: 'Scaler',
    price: '$80',
    period: '/mo',
    scans: '250 scans / mo',
    campaigns: '50 to 80+ campaigns / mo',
    description: 'For media buyers scaling across multiple offers',
    cta: '[ INIT_SCALER ]',
    popular: true,
  },
  {
    name: 'Agency',
    price: '$200',
    period: '/mo',
    scans: '1000 scans / mo',
    campaigns: '200 to 300+ campaigns / mo',
    description: 'For agencies managing multiple client accounts',
    cta: '[ INIT_AGENCY ]',
    popular: false,
  },
]

type CellValue = boolean | string

const featureRows: { label: string; sub?: string; values: CellValue[] }[] = [
  {
    label: 'Video & image scanning',
    values: [true, true, true, true, true],
  },
  {
    label: 'All platforms supported',
    values: [true, true, true, true, true],
  },
  {
    label: 'Violation timestamps & fixes',
    values: [true, true, true, true, true],
  },
  {
    label: 'Scan type',
    values: ['Regular', 'Reg+Deep', 'Reg+Deep', 'Reg+Deep', 'Reg+Deep'],
  },
  {
    label: 'Monthly scans',
    values: ['3', '20', '100', '250', '1000'],
  },
  {
    label: 'Campaigns / month',
    values: ['1', '3–6', '20–33', '50–83', '200-300+'],
  },
  {
    label: 'Priority processing',
    values: [false, true, true, true, true],
  },
  {
    label: 'Scan history',
    values: [false, true, true, true, true],
  },
  {
    label: 'Audio analysis',
    values: [false, true, true, true, true],
  },
]

function Cell({ value }: { value: CellValue }) {
  if (typeof value === 'boolean') {
    return value ? (
      <span className="text-emerald-500 font-bold">[Y]</span>
    ) : (
      <span className="text-muted-foreground/30">[-]</span>
    )
  }
  return (
    <span className="text-[10px] font-bold text-foreground uppercase tracking-tight">
      {value}
    </span>
  )
}

export function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-background border-b border-border font-mono">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
            [SYS: RESOURCE_ALLOCATION]
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-tight">
            Data Matrix & Pricing
          </h2>
          <p className="mt-3 text-xs text-muted-foreground border-l-2 border-border pl-3">
            &gt; Extension users: Subscriptions are upgradable and managed through the{' '}
            <a
              href={SITE_SIGNUP}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              Chrome extension
            </a>
          </p>
        </div>

        <div className="relative border border-border bg-card overflow-hidden">
          <div className="bg-muted/50 border-b border-border px-3 py-2 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <span>/db_tables/pricing_tiers.sql</span>
            <span>READ_ONLY</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left">
              <thead>
                <tr>
                  <th className="w-[180px] p-3 align-bottom border-b-2 border-r border-border text-[10px] font-bold uppercase text-muted-foreground">
                    Parameter
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.name}
                      className={`p-3 align-bottom border-b-2 border-r last:border-r-0 border-border ${
                        plan.popular ? 'bg-primary/5' : ''
                      }`}
                    >
                      {plan.popular && (
                        <div className="text-[9px] font-bold text-primary mb-2 uppercase tracking-widest">
                          * OPTIMIZED_ALLOC
                        </div>
                      )}
                      <div className="text-[11px] font-bold uppercase text-foreground mb-1">
                        {plan.name}
                      </div>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-lg font-bold text-foreground">
                          {plan.price}
                        </span>
                        <span className="text-[9px] text-muted-foreground">
                          {plan.period}
                        </span>
                      </div>
                      <p className="text-[9px] leading-relaxed text-muted-foreground mb-3 h-8">
                        {plan.description}
                      </p>
                      <a
                        href={SITE_SIGNUP}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block w-full text-center py-2 text-[10px] font-bold uppercase transition-colors border ${
                          plan.popular
                            ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                            : 'bg-card text-foreground border-border hover:bg-secondary'
                        }`}
                      >
                        {plan.cta}
                      </a>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[10px]">
                {featureRows.map((row) => (
                  <tr key={row.label} className="border-b last:border-b-0 border-dashed border-border hover:bg-secondary/30">
                    <td className="p-3 border-r border-border font-bold uppercase text-muted-foreground">
                      {row.label}
                    </td>
                    {plans.map((plan, planIdx) => (
                      <td
                        key={plan.name}
                        className={`p-3 text-center border-r last:border-r-0 border-border ${
                          plan.popular ? 'bg-primary/5' : ''
                        }`}
                      >
                        <Cell value={row.values[planIdx]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trust line */}
        <p className="text-xs text-muted-foreground mt-6 flex flex-wrap gap-4 uppercase font-bold tracking-widest">
          <span>[SECURE_CHECKOUT: STRIPE]</span>
          <span>[TERM: CANCEL_ANYTIME]</span>
          <span>[FEES: NO_HIDDEN]</span>
        </p>

      </div>
    </section>
  )
}
