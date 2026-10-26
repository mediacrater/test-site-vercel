//components/ad-account-insurance.tsx
import Link from "next/link"

const SIGNUP_URL = "/signup?src=home-insurance&utm_source=website&utm_medium=cta&utm_campaign=home-insurance"

const points = [
  {
    title: "Platforms rarely explain",
    body: "Meta, TikTok and YouTube reject ads and restrict accounts with little detail. You are left guessing what went wrong. Mediacrater flags likely issues before you upload.",
  },
  {
    title: "Whales get away with it",
    body: "Big brands survive violations that end small accounts. Mediacrater levels the field by teaching you the real rules faster.",
  },
  {
    title: "Your record follows you",
    body: "Rejections and restrictions stay on your account's record. Catching problems before upload means fewer of them. One bad upload can undo months of progress.",
  },
]

export function AdAccountInsurance() {
  return (
    <section aria-labelledby="insurance-title" className="py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <h2 id="insurance-title" className="display-lg text-[clamp(2.1rem,4.4vw,3.4rem)]">
              Everyone hates insurance until something goes wrong.
            </h2>
            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted-foreground">
              Ad account bans hit without warning. One hidden violation and your campaigns go dark, revenue stops,
              and you are rebuilding from scratch. Mediacrater shows you the risks before you upload.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <ul>
            {points.map((p, i) => (
              <li key={p.title} className={i === 0 ? "" : "mt-10 border-t border-border pt-10"}>
                <h3 className="display-md text-[1.6rem]">{p.title}</h3>
                <p className="mt-3 max-w-[52ch] text-[1.0625rem] leading-relaxed text-muted-foreground">{p.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-14 rounded-2xl bg-ink p-7 text-ink-text sm:p-8">
            <p className="max-w-[46ch] text-lg leading-relaxed">
              This isn&rsquo;t just about protecting one ad. It&rsquo;s about the account history you build over months.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href={SIGNUP_URL}
                className="inline-flex h-11 items-center rounded-full bg-lime px-6 text-[0.95rem] font-bold text-[#0b1628] transition-[filter] hover:brightness-105"
              >
                Try Mediacrater free
              </Link>
              <span className="text-sm text-ink-muted">No credit card required. 3 free scans every month.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
