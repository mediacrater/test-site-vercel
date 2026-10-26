//components/cta.tsx
import { SIGNUP_URL } from "@/lib/site-links"

export function CTA() {
  return (
    <section aria-labelledby="cta-title" className="border-t border-border py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="cta-title" className="display-xl max-w-[14ch] text-[clamp(2.6rem,7.2vw,6rem)]">
          Stop guessing. Start knowing.
        </h2>
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[44ch] text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Put your creative through a policy-focused review before you put budget behind it.
          </p>
          <div className="flex flex-col gap-3 md:items-end">
            <a
              href={SIGNUP_URL}
              className="inline-flex h-12 items-center rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
            >
              Try Mediacrater free
            </a>
            <p className="text-sm text-muted-foreground">3 free scans every month. No credit card required.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
