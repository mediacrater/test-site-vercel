//components/legal/policy-shell.tsx
import type { ReactNode } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PolicyNav } from "@/components/legal/policy-nav"

interface PolicyShellProps {
  title: string
  /** Shown under the title, for example "Last updated October 26, 2026". */
  updated: string
  /** Optional one or two sentence plain-language summary shown above the policy. */
  summary?: ReactNode
  children: ReactNode
}

/** Shared layout for every policy page: site header, policy nav, readable column, footer. */
export function PolicyShell({ title, updated, summary, children }: PolicyShellProps) {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-[calc(var(--header-h)+3rem)] pb-24 md:pt-[calc(var(--header-h)+4.5rem)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16">
            <div className="lg:row-span-2">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
                <PolicyNav />
              </div>
            </div>

            <header className="mt-10 border-b border-border pb-8 lg:mt-0">
              <h1 className="display-lg text-[2.5rem] sm:text-5xl lg:text-[3.5rem]">{title}</h1>
              <p className="mt-4 text-[0.975rem] text-muted-foreground">{updated}</p>
              {summary ? (
                <div className="mt-6 max-w-[68ch] text-lg leading-relaxed text-foreground">{summary}</div>
              ) : null}
            </header>

            <article className="legal mt-10 max-w-[68ch]">
              {children}
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
