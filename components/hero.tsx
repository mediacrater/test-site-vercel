//components/hero.tsx
"use client"

import { useEffect, useState } from "react"
import { MorphWord } from "@/components/home/morph-word"
import { ScanReel } from "@/components/home/scan-reel"
import { usePrefersReducedMotion } from "@/hooks/use-in-view"
import { SIGNIN_URL, SIGNUP_URL } from "@/lib/site-links"

const PLATFORMS = [
  { name: "Meta", icon: "/images/platform-icons/meta.png" },
  { name: "TikTok", icon: "/images/platform-icons/tiktok.png" },
  { name: "YouTube", icon: "/images/platform-icons/youtube.png" },
  { name: "Pinterest", icon: "/images/platform-icons/pinterest.png" },
  { name: "X", icon: "/images/platform-icons/x.png" },
]

export function Hero() {
  // The headline asks a question until the example scan finishes, then answers it.
  const [known, setKnown] = useState(false)
  const reduced = usePrefersReducedMotion()

  // Safety net in case the scan animation never reports back.
  useEffect(() => {
    const t = window.setTimeout(() => setKnown(true), 5500)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <section
      data-verse="John 14:6 - Jesus answered: I am the way and the truth and the life. No one comes to the Father except through me."
      className="relative pb-20 pt-[calc(var(--header-h)+3rem)] md:pb-28 md:pt-[calc(var(--header-h)+4.5rem)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="display-xl text-[clamp(2.75rem,11.2vw,4rem)] text-foreground sm:text-[clamp(3rem,7.6vw,6.5rem)]">
          <span className="sr-only">Know before you launch.</span>
          <span aria-hidden="true">
            <MorphWord from="Question" to="Know" changed={known} reduced={reduced} />
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>
            before
            <br className="hidden sm:inline" />
            <span className="sm:hidden"> </span>
            <span className="hidden sm:inline"> </span>
            you
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>
            launch
            <MorphWord from="..?" to="." changed={known} reduced={reduced} />
          </span>
        </h1>

        <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-12 lg:items-end lg:gap-10">
          <p className="max-w-[40ch] text-lg leading-relaxed text-muted-foreground sm:text-xl lg:col-span-7">
            Mediacrater scans your video and image ads for likely policy issues, with timestamps and suggested fixes,
            before you spend money promoting them.
          </p>

          <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end">
            <div className="flex flex-wrap gap-3">
              <a
                href={SIGNUP_URL}
                className="inline-flex h-12 items-center rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground shadow-[0_10px_24px_-12px_rgba(18,64,138,0.8)] transition-[filter,transform] hover:brightness-110 active:scale-[0.98] dark:shadow-none"
              >
                Try it free
              </a>
              <a
                href={SIGNIN_URL}
                className="inline-flex h-12 items-center rounded-full border border-border bg-card px-6 text-base font-semibold text-foreground transition-colors hover:border-foreground/40"
              >
                Log in
              </a>
            </div>
            <p className="text-sm text-muted-foreground">3 free scans every month. No credit card required.</p>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <ScanReel onComplete={() => setKnown(true)} />
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <p className="text-[0.95rem] text-muted-foreground">Checks creatives against the ad policies of</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {PLATFORMS.map((p) => (
              <li key={p.name} className="flex items-center gap-2 text-[0.95rem] font-semibold text-foreground">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.icon} alt="" width={20} height={20} className="h-5 w-5 object-contain" loading="lazy" />
                {p.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
