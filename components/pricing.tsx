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
    values: ['Regular', 'Regular + Deep', 'Regular + Deep', 'Regular + Deep', 'Regular + Deep'],
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
      <Check className="w-4 h-4 mx-auto text-foreground" strokeWidth={2.5} />
    ) : (
      <Minus className="w-4 h-4 mx-auto text-muted-foreground/30" strokeWidth={2} />
    )
  }
  return (
    <span className="text-xs font-mono font-medium text-foreground">
      {value}
    </span>
  )
}

export function Pricing() {
  return (
    <section id="pricing" className="py-16 bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 font-mono text-xs text-muted-foreground uppercase tracking-widest border-l-2 border-primary pl-3">
          Pricing Matrix
        </div>

        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl font-bold uppercase tracking-tight text-foreground font-[family-name:var(--font-display)]">
            Subscription Options
          </h2>
          <p className="mt-2 text-xs font-mono text-muted-foreground">
            Select tier based on monthly scan volumes. Upgrade or cancel within Chrome Extension settings.
          </p>
        </div>

        <div className="border border-border bg-card rounded-none overflow-x-auto font-mono">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="w-[200px] p-4 text-xs font-bold uppercase text-muted-foreground border-r border-border">
                  Feature Parameters
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.name}
                    className="p-4 text-center border-r last:border-r-0 border-border"
                  >
                    <div className="text-xs font-bold uppercase text-foreground mb-1">
                      {plan.name}
                    </div>
                    <div className="text-xl font-bold text-foreground">
                      {plan.price}<span className="text-xs text-muted-foreground font-normal">{plan.period}</span>
                    </div>
                    <a
                      href={SITE_SIGNUP}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 block w-full bg-primary text-primary-foreground py-1.5 text-[11px] font-bold uppercase hover:bg-primary/90 rounded-none"
                    >
                      {plan.cta}
                    </a>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {featureRows.map((row, rowIdx) => (
                <tr
                  key={row.label}
                  className={rowIdx % 2 === 0 ? 'bg-background' : 'bg-secondary/20'}
                >
                  <td className="p-4 text-xs font-bold text-foreground border-r border-border uppercase">
                    {row.label}
                  </td>
                  {plans.map((plan, planIdx) => (
                    <td
                      key={plan.name}
                      className="p-4 text-center border-r last:border-r-0 border-border"
                    >
                      <Cell value={row.values[planIdx]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 border border-border p-3 bg-secondary/10 font-mono text-xs text-muted-foreground text-center uppercase">
          [ Stripe Payment Gateway · Cancellation Available Anytime · Instant Token Credit ]
        </div>
      </div>
    </section>
  )
}
