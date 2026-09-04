'use client'

import { Check, Minus } from 'lucide-react'

const SITE_SIGNUP = process.env.NEXT_PUBLIC_SITE_SIGNUP ?? '#'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    scans: '3 scans / mo',
    campaigns: '1 campaign / mo',
    description: 'Get started with no commitment',
    cta: 'Get started',
    popular: false,
  },
  {
    name: 'Startup',
    price: '$10',
    period: '/mo',
    scans: '20 scans / mo',
    campaigns: '3–6 campaigns / mo',
    description: 'For solo dropshippers testing creatives',
    cta: 'Get Startup',
    popular: false,
  },
  {
    name: 'Established',
    price: '$40',
    period: '/mo',
    scans: '100 scans / mo',
    campaigns: '20 to 30+ campaigns / mo',
    description: 'For brands running consistent paid campaigns',
    cta: 'Get Established',
    popular: false,
  },
  {
    name: 'Scaler',
    price: '$80',
    period: '/mo',
    scans: '250 scans / mo',
    campaigns: '50 to 80+ campaigns / mo',
    description: 'For media buyers scaling across multiple offers',
    cta: 'Get Scaler',
    popular: false,
  },
  {
    name: 'Agency',
    price: '$200',
    period: '/mo',
    scans: '1000 scans / mo',
    campaigns: '200 to 300+ campaigns / mo',
    description: 'For agencies managing multiple client accounts',
    cta: 'Get Agency',
    popular: false,
  },
]

type CellValue = boolean | string

const featureRows: { label: string; sub?: string; values: CellValue[] }[] = [
  { label: 'Video & image scanning', values: [true, true, true, true, true] },
  { label: 'All platforms supported', values: [true, true, true, true, true] },
  { label: 'Violation timestamps & fixes', values: [true, true, true, true, true] },
  { label: 'Scan type', values: ['Regular', 'Regular + Deep', 'Regular + Deep', 'Regular + Deep', 'Regular + Deep'] },
  { label: 'Monthly scans', values: ['3', '20', '100', '250', '1000'] },
  { label: 'Campaigns / month', values: ['1', '3–6', '20–33', '50–83', '200-300+'] },
  { label: 'Priority processing', values: [false, true, true, true, true] },
  { label: 'Scan history', values: [false, true, true, true, true] },
  { label: 'Audio analysis', values: [false, true, true, true, true] },
]

function Cell({ value }: { value: CellValue }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-4 h-4 mx-auto text-foreground" strokeWidth={3} />
    ) : (
      <Minus className="w-4 h-4 mx-auto text-muted-foreground/30" strokeWidth={2} />
    )
  }
  return <span className="font-mono text-xs font-bold text-foreground">{value}</span>
}

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-secondary/20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4">
            Document 04: Retainer
          </p>
          <h2 className="text-4xl font-bold text-foreground font-[family-name:var(--font-display)] uppercase tracking-tight">
            Fee Schedule
          </h2>
          <p className="mt-4 font-mono text-sm text-muted-foreground text-pretty">
            Assess your campaign volume and select the appropriate tier. 
            Extension users: Upgrades managed via the{' '}
            <a href={SITE_SIGNUP} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              Chrome extension
            </a>.
          </p>
        </div>

        <div className="relative pt-5">
          {/* Table */}
          <div className="border-2 border-foreground bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse">
                
                {/* Headers */}
                <thead>
                  <tr>
                    <th className="w-[220px] bg-muted/50 px-6 pt-8 pb-5 text-left align-bottom border-r-2 border-b-2 border-foreground">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground">
                        Parameters
                      </span>
                    </th>
                    {plans.map((plan) => (
                      <th key={plan.name} className={`px-4 pt-8 pb-5 text-center align-bottom border-r-2 border-b-2 border-foreground last:border-r-0 ${plan.popular ? 'bg-foreground' : 'bg-background'}`}>
                        {plan.popular && (
                          <span className="block mb-4 text-[10px] font-mono font-bold uppercase tracking-widest text-background border border-background mx-auto w-max px-2 py-1">
                            Standard Issue
                          </span>
                        )}
                        <div className={`font-mono text-xs font-bold uppercase tracking-widest mb-2 ${plan.popular ? 'text-background' : 'text-foreground'}`}>
                          {plan.name}
                        </div>
                        <div className="flex items-baseline justify-center gap-1 mb-4">
                          <span className={`text-3xl font-[family-name:var(--font-display)] font-bold ${plan.popular ? 'text-background' : 'text-foreground'}`}>
                            {plan.price}
                          </span>
                          <span className={`font-mono text-[10px] ${plan.popular ? 'text-background/70' : 'text-muted-foreground'}`}>
                            {plan.period}
                          </span>
                        </div>
                        <p className={`text-[10px] font-mono uppercase mb-4 h-10 ${plan.popular ? 'text-background/70' : 'text-muted-foreground'}`}>
                          {plan.description}
                        </p>
                        <a
                          href={SITE_SIGNUP}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block w-full text-center py-3 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors ${
                            plan.popular
                              ? 'bg-background text-foreground hover:bg-background/90'
                              : 'border-2 border-foreground text-foreground hover:bg-foreground hover:text-background'
                          }`}
                        >
                          {plan.cta}
                        </a>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Rows */}
                <tbody>
                  {featureRows.map((row) => (
                    <tr key={row.label} className="border-b-2 border-border last:border-b-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-5 border-r-2 border-border">
                        <span className="font-mono text-xs text-foreground uppercase">{row.label}</span>
                      </td>
                      {plans.map((plan, planIdx) => (
                        <td key={plan.name} className={`px-4 py-5 text-center border-r-2 border-border last:border-r-0 ${plan.popular ? 'bg-foreground/5' : ''}`}>
                          <Cell value={row.values[planIdx]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
