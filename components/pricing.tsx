import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const EXTENSION_LINK = "https://forms.gle/Di7xxvUSKebeAUDd6"

const pricingTiers = [
  {
    name: "Starter",
    price: "$19",
    period: "one-time",
    tokens: "10 tokens",
    scans: "~5-10 scans",
    perToken: "$1.90/token",
    features: [
      "All scan depths available",
      "All platforms supported",
      "Audio transcription",
      "Frame-by-frame analysis",
      "Fix recommendations",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "$90",
    period: "one-time",
    tokens: "60 tokens",
    scans: "~40-60 scans",
    perToken: "$1.50/token",
    features: [
      "Everything in Starter",
      "Priority processing",
      "Scan history saved",
      "Export reports as PDF",
      "Email support",
    ],
    popular: true,
  },
  {
    name: "Agency",
    price: "$600",
    period: "one-time",
    tokens: "500 tokens",
    scans: "~250-500 scans",
    perToken: "$1.20/token",
    savings: "Save 37%",
    features: [
      "Everything in Pro",
      "Bulk scanning",
      "Team management",
      "API access",
      "Dedicated support",
    ],
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-display)] text-balance">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            As low as $0.85 per scan. Pay only for what you use.
          </p>

          {/* Token Explanation */}
          <div className="mt-8 p-6 rounded-xl bg-card border border-border max-w-2xl mx-auto">
            <h3 className="font-semibold text-foreground mb-3">How Tokens Work</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <span className="font-medium text-foreground">Base Scan = 1 Token:</span> Videos under 50s, Basic scan, 1 platform
              </p>
              <p className="text-left">
                <span className="font-medium text-foreground">Add tokens for:</span> Longer videos (+1-5), Deep scan (+2), Multi-platform (+2), Audio (+1)
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-8 ${
                tier.popular
                  ? "bg-primary text-primary-foreground ring-2 ring-primary"
                  : "bg-card border border-border"
              }`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                  Most Popular
                </Badge>
              )}

              {tier.savings && (
                <Badge
                  variant="secondary"
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 ${
                    tier.popular ? "bg-accent text-accent-foreground" : ""
                  }`}
                >
                  {tier.savings}
                </Badge>
              )}

              <div className="text-center mb-6">
                <h3
                  className={`text-xl font-bold mb-2 font-[family-name:var(--font-display)] ${
                    tier.popular ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {tier.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span
                    className={`text-4xl font-bold ${
                      tier.popular ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    {tier.price}
                  </span>
                  <span
                    className={`text-sm ${
                      tier.popular ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {tier.period}
                  </span>
                </div>
                <p
                  className={`mt-2 text-sm ${
                    tier.popular ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {tier.tokens} ({tier.scans})
                </p>
                <p
                  className={`text-xs ${
                    tier.popular ? "text-primary-foreground/60" : "text-muted-foreground"
                  }`}
                >
                  {tier.perToken}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        tier.popular ? "text-accent" : "text-accent"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        tier.popular ? "text-primary-foreground/90" : "text-muted-foreground"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full ${
                  tier.popular
                    ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                <a href={EXTENSION_LINK} target="_blank" rel="noopener noreferrer">
                  Get Started
                </a>
              </Button>
            </div>
          ))}
        </div>

        {/* Annual Savings Note */}
        <p className="text-center mt-8 text-sm text-muted-foreground">
          Need more? Annual plans available with up to 55% savings.{" "}
          <a href="#faq" className="text-primary hover:underline">
            Learn more
          </a>
        </p>
      </div>
    </section>
  )
}
