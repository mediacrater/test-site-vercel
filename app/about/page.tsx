//app/about/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "About Mediacrater: Built by a Former Dropshipper Who Got Burned",
  description:
    "I lost thousands to unexplained Facebook ad bans. So I built Mediacrater: a simple, privacy-first tool to scan creatives for policy issues before upload. Just real help for media buyers.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Mediacrater: From Bans to Better Ads",
    description:
      "A former dropshipper turned builder. Tired of losing money to opaque ad rejections, I built a tool that helps catch policy issues on Meta, TikTok, YouTube and more before upload.",
    images: ["/images/og-image.png"],
  },
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pb-24 pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="display-xl max-w-[12ch] text-[clamp(2.75rem,8vw,6rem)]">I got banned. A lot.</h1>
          <p className="mt-8 max-w-[52ch] text-xl leading-relaxed text-muted-foreground">
            I used to run dropshipping ads. I lost thousands to sudden bans with no clear explanation. So I built
            something that helps media buyers avoid the same pain.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-7xl gap-12 px-4 sm:px-6 md:mt-24 lg:grid-cols-12 lg:gap-10 lg:px-8">
          <aside className="lg:col-span-4">
            <div className="rounded-2xl bg-ink p-7 text-ink-text lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
              <p className="display-md text-[1.4rem] leading-snug">
                If you&rsquo;ve ever stared at an &ldquo;Ad rejected&rdquo; notice with no idea why, this tool was built
                for you.
              </p>
              <Link
                href="/signup"
                className="mt-7 inline-flex h-11 items-center rounded-full bg-lime px-6 text-[0.95rem] font-bold text-[#0b1628] transition-[filter] hover:brightness-105"
              >
                Start free with 3 scans a month
              </Link>
            </div>
          </aside>

          <article className="legal lg:col-span-7 lg:col-start-6">
            <section>
              <h2>My story</h2>
              <p>
                A few years ago I was deep in dropshipping. Like many, I spent hours testing products, writing copy, and
                burning ad budgets, only to wake up to account restrictions or outright bans with no real feedback from
                Meta or TikTok.
              </p>
              <p>
                I never found out what triggered the violations because I never got feedback. I learned the hard way
                which words, images, and claims were red flags. You don&rsquo;t have to follow in my footsteps. One wrong
                creative can cost hundreds or thousands in lost revenue and wasted spend.
              </p>
              <p>
                Eventually I got tired of the guessing game. I wanted a tool that could scan an ad creative{" "}
                <em>before</em> I hit submit, something that would tell me which policies I was likely breaking and why,
                so I could fix it and move on.
              </p>
              <p>Nothing like that existed at the price or simplicity I needed. So I built it myself.</p>
            </section>

            <section>
              <h2>What Mediacrater actually is</h2>
              <p>
                Mediacrater is a web app, with a free companion Chrome extension, that lets media buyers, freelancers,
                and small agencies:
              </p>
              <ul>
                <li>Upload video or image creatives, or paste a link to them</li>
                <li>Select the platform: Meta, TikTok, YouTube, Pinterest or X</li>
                <li>Get a list of likely policy issues with timestamps and suggested fixes</li>
                <li>Fix issues before wasting budget on rejected ads</li>
              </ul>
              <p>Clear, actionable feedback so you stop guessing and start scaling.</p>
            </section>

            <section>
              <h2>Why privacy matters to me</h2>
              <p>
                I hated how much data ad platforms already collect, and I didn&rsquo;t want to build something that made
                the problem worse. Your original file is deleted from our storage when your scan finishes. The details
                are in our <Link href="/privacy">Privacy Policy</Link> and <Link href="/ip-rights">IP Rights Policy</Link>.
              </p>
            </section>

            <section>
              <h2>Who this is for</h2>
              <p>Freelance media buyers, small agencies, DTC brands, and anyone running paid ads who&rsquo;s tired of:</p>
              <ul>
                <li>Sudden account restrictions with no explanation</li>
                <li>Wasting hours appealing vague violations</li>
                <li>Losing money on ads that never get approved</li>
              </ul>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}
