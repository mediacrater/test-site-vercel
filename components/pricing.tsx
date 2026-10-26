//components/pricing.tsx
import { Check, Minus } from "lucide-react"
import { PRICING_SIGNUP_URL } from "@/lib/site-links"

const plans = [
  { name: "Free", price: "$0", period: "/mo", description: "Get started with no commitment", cta: "Get started", popular: false },
  { name: "Startup", price: "$10", period: "/mo", description: "For solo dropshippers testing creatives", cta: "Get Startup", popular: false },
  { name: "Established", price: "$40", period: "/mo", description: "For brands running consistent paid campaigns", cta: "Get Established", popular: false },
  { name: "Scaler", price: "$80", period: "/mo", description: "For media buyers scaling across multiple offers", cta: "Get Scaler", popular: false },
  { name: "Agency", price: "$200", period: "/mo", description: "For agencies managing multiple client accounts", cta: "Get Agency", popular: false },
]

type CellValue = boolean | string

const scanFeatureRows: { label: string; sub?: string; values: CellValue[] }[] = [
  { label: "Video & image scanning", values: [true, true, true, true, true] },
  { label: "All platforms supported", values: [true, true, true, true, true] },
  { label: "Violation timestamps & fixes", values: [true, true, true, true, true] },
  { label: "Scan type", values: ["Regular", "Regular + Deep", "Regular + Deep", "Regular + Deep", "Regular + Deep"] },
  { label: "Monthly scans", values: ["3", "20", "100", "250", "1000"] },
  { label: "Campaigns / month", values: ["1", "3–6", "20–33", "50–83", "200–300+"] },
  { label: "Priority processing", values: [false, true, true, true, true] },
  { label: "Scan history", values: [false, true, true, true, true] },
  { label: "Audio analysis", values: [false, true, true, true, true] },
]

const extensionFeatureRows: { label: string; sub?: string; values: CellValue[] }[] = [
  { label: "Unlimited individual downloads", values: [true, true, true, true, true] },
  { label: "Batch ZIP downloads", values: [true, true, true, true, true] },
  { label: "Local creative library storage", values: [true, true, true, true, true] },
]

function Cell({ value }: { value: CellValue }) {
  if (typeof value === "boolean") {
    return value ? (
      <>
        <Check className="mx-auto h-[1.15rem] w-[1.15rem] text-sev-low" strokeWidth={2.5} aria-hidden="true" />
        <span className="sr-only">Included</span>
      </>
    ) : (
      <>
        <Minus className="mx-auto h-4 w-4 text-muted-foreground/50" aria-hidden="true" />
        <span className="sr-only">Not included</span>
      </>
    )
  }
  return <span className="text-[0.95rem] font-semibold text-foreground">{value}</span>
}

function Rows({ rows }: { rows: { label: string; sub?: string; values: CellValue[] }[] }) {
  return (
    <>
      {rows.map((row) => (
        <tr key={row.label} className="border-t border-border">
          <th scope="row" className="sticky left-0 z-10 bg-card px-5 py-4 text-left text-[0.975rem] font-medium text-foreground">
            {row.label}
            {row.sub && <span className="mt-0.5 block text-sm font-normal text-muted-foreground">{row.sub}</span>}
          </th>
          {plans.map((plan, i) => (
            <td key={plan.name} className={`px-4 py-4 text-center ${plan.popular ? "bg-primary/[0.06]" : ""}`}>
              <Cell value={row.values[i]} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-verse="Matthew 6:33" className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 id="pricing-title" className="display-lg text-[clamp(2.1rem,4.4vw,3.4rem)]">
              Simple, transparent pricing
            </h2>
            <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-muted-foreground">
              Pick a plan based on how many campaigns you run per month. Cancel or change anytime.
            </p>
          </div>
          <p className="text-[0.95rem] text-muted-foreground">Prices are listed in USD.</p>
        </div>

        <div className="mt-14 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse">
              <caption className="sr-only">Mediacrater plans and what each includes</caption>
              <thead>
                <tr>
                  <th scope="col" className="sticky left-0 z-10 w-[220px] bg-card px-5 pb-6 pt-7 text-left align-bottom">
                    <span className="text-[0.95rem] font-semibold text-muted-foreground">Compare plans</span>
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.name}
                      scope="col"
                      className={`px-4 pb-6 pt-7 text-left align-bottom font-normal ${plan.popular ? "bg-primary/[0.06]" : ""}`}
                    >
                      {plan.popular && <span className="mb-2 block text-sm font-bold text-primary">Most popular</span>}
                      <span className="block text-[1.0625rem] font-bold text-foreground">{plan.name}</span>
                      <span className="mt-2 flex items-baseline gap-1">
                        <span className="font-display text-[2rem] font-extrabold leading-none text-foreground">{plan.price}</span>
                        <span className="text-sm text-muted-foreground">{plan.period}</span>
                      </span>
                      <span className="mt-3 block min-h-[3.2rem] text-sm leading-snug text-muted-foreground">{plan.description}</span>
                      <a
                        href={PRICING_SIGNUP_URL}
                        className={`mt-4 inline-flex h-10 w-full items-center justify-center rounded-full text-sm font-semibold transition-[filter,background-color] ${
                          plan.popular
                            ? "bg-primary text-primary-foreground hover:brightness-110"
                            : "border border-primary/40 text-primary hover:bg-primary/[0.08]"
                        }`}
                      >
                        {plan.cta}
                      </a>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <Rows rows={scanFeatureRows} />
                <tr className="border-t border-border bg-muted/60">
                  <th colSpan={plans.length + 1} scope="colgroup" className="px-5 py-4 text-left">
                    <span className="block text-[1rem] font-bold text-foreground">Chrome extension</span>
                    <span className="mt-0.5 block text-sm font-normal text-muted-foreground">
                      Included with the free Chrome extension on every plan.
                    </span>
                  </th>
                </tr>
                <Rows rows={extensionFeatureRows} />
              </tbody>
            </table>
          </div>
        </div>

        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-[0.95rem] text-muted-foreground">
          <li>Secure checkout with Stripe</li>
          <li>Cancel anytime</li>
          <li>No hidden fees</li>
        </ul>
      </div>
    </section>
  )
}
